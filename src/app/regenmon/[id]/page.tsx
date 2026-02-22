'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useHub, HubMessage } from '@/hooks/useHub';
import { STORAGE_KEYS } from '@/lib/constants';
import Link from 'next/link';

interface ProfileData {
  id: string;
  name: string;
  ownerName: string;
  sprite: string;
  stage: number;
  stats: { happiness: number; energy: number; hunger: number };
  totalPoints: number;
  balance: number;
  totalVisits: number;
  registeredAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

function stageName(stage: number): string {
  if (stage <= 1) return '🥚 Huevo';
  if (stage === 2) return '🐣 Cría';
  if (stage === 3) return '🌟 Joven';
  return '👑 Adulto';
}

export default function RegenmonProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [myBalance, setMyBalance] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Interaction states
  const [greetSent, setGreetSent] = useState(false);
  const [greetLoading, setGreetLoading] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [giftLoading, setGiftLoading] = useState<number | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);

  // Messages
  const [messages, setMessages] = useState<HubMessage[]>([]);
  const [msgText, setMsgText] = useState('');
  const [msgSending, setMsgSending] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const { getProfile, sendMessage, feed, gift, getMessages } = useHub();

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }, []);

  const showCelebration = useCallback((emoji: string) => {
    setCelebration(emoji);
    setTimeout(() => setCelebration(null), 1500);
  }, []);

  // Load registration state + balance
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const myId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID);
    const registered = localStorage.getItem(STORAGE_KEYS.IS_REGISTERED_IN_HUB) === 'true';
    const balance = parseInt(localStorage.getItem(STORAGE_KEYS.HUB_BALANCE) ?? '0', 10);
    setIsMyProfile(myId === id);
    setIsRegistered(registered && !!myId);
    setMyBalance(balance);
  }, [id]);

  // Load profile
  useEffect(() => {
    setLoading(true);
    setError(false);
    getProfile(id).then(res => {
      if (res?.data) {
        setProfile(res.data);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, [id, getProfile]);

  // Load messages
  useEffect(() => {
    if (!id) return;
    getMessages(id, 20).then(res => {
      if (res?.data?.messages) {
        setMessages(res.data.messages);
      }
      setMessagesLoaded(true);
    });
  }, [id, getMessages]);

  // --- Interactions ---

  const handleGreet = useCallback(async () => {
    if (!profile || greetSent || greetLoading) return;
    setGreetLoading(true);
    const myId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID) ?? '';
    const myName = localStorage.getItem('reggie-adventure-player-name') || 'Aventurero';
    const result = await sendMessage(id, myId, myName, `👋 ¡Hola ${profile.name}!`);
    if (result) {
      setGreetSent(true);
      showToast(`¡Saludaste a ${profile.name}! 👋`);
    }
    setGreetLoading(false);
  }, [id, profile, greetSent, greetLoading, sendMessage, showToast]);

  const handleFeed = useCallback(async () => {
    if (!profile || feedLoading || myBalance < 10) return;
    setFeedLoading(true);
    const myId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID) ?? '';
    const result = await feed(id, myId);
    if (result?.data) {
      const newBalance = result.data.senderBalance;
      localStorage.setItem(STORAGE_KEYS.HUB_BALANCE, String(newBalance));
      setMyBalance(newBalance);
      showToast(`¡Le diste de comer a ${profile.name}! 🍎 -10 $FRUTA`);
      showCelebration('🍎');
    } else {
      showToast('No se pudo alimentar. Intenta después 🍎');
    }
    setFeedLoading(false);
  }, [id, profile, feedLoading, myBalance, feed, showToast]);

  const handleGift = useCallback(async (amount: number) => {
    if (!profile || giftLoading !== null || myBalance < amount) return;
    setGiftLoading(amount);
    const myId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID) ?? '';
    const result = await gift(id, myId, amount);
    if (result?.data) {
      const newBalance = result.data.senderBalance;
      localStorage.setItem(STORAGE_KEYS.HUB_BALANCE, String(newBalance));
      setMyBalance(newBalance);
      showToast(`¡Enviaste ${amount} $FRUTA a ${profile.name}! 🎁`);
      showCelebration('🎁');
    } else {
      showToast('No se pudo enviar el regalo. Intenta después 🎁');
    }
    setGiftLoading(null);
  }, [id, profile, giftLoading, myBalance, gift, showToast]);

  const handleSendMessage = useCallback(async () => {
    if (!profile || !msgText.trim() || msgSending) return;
    setMsgSending(true);
    const myId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID) ?? '';
    const myName = localStorage.getItem('reggie-adventure-player-name') || 'Aventurero';
    const result = await sendMessage(id, myId, myName, msgText.trim());
    if (result) {
      // Add optimistically
      setMessages(prev => [{
        id: Date.now().toString(),
        fromName: myName,
        message: msgText.trim(),
        createdAt: new Date().toISOString(),
      }, ...prev]);
      setMsgText('');
      showToast('📨 Mensaje enviado');
    }
    setMsgSending(false);
  }, [id, profile, msgText, msgSending, sendMessage, showToast]);

  // --- Render ---

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__header">
          <Link href="/leaderboard" className="profile-page__back">← Ranking</Link>
        </div>
        <p className="profile-page__loading">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="profile-page__header">
          <Link href="/leaderboard" className="profile-page__back">← Ranking</Link>
        </div>
        <p className="profile-page__error">El HUB está descansando, intenta después 🍎</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {toastMsg && <div className="profile-page__toast">{toastMsg}</div>}

      {/* Celebration particles (Level 4 J) */}
      {celebration && (
        <div className="profile-page__celebration" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="profile-page__confetti" style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 0.4}s`,
              fontSize: `${1.2 + Math.random() * 1}rem`,
            }}>{celebration}</span>
          ))}
        </div>
      )}

      <div className="profile-page__header">
        <Link href="/leaderboard" className="profile-page__back">← Ranking</Link>
        {isMyProfile && <span className="profile-page__my-badge">🏠 Tu Perfil</span>}
        {!isMyProfile && <span className="profile-page__visit-badge">👁️ Modo Visita</span>}
      </div>

      <div className="profile-page__card">
        <img
          src={profile.sprite}
          alt={profile.name}
          className="profile-page__sprite"
          width={120}
          height={120}
          onError={(e) => { (e.target as HTMLImageElement).src = '/sprites/rayo-base.webp'; }}
        />
        <h1 className="profile-page__name">{profile.name}</h1>
        <p className="profile-page__owner">by {profile.ownerName}</p>
        <p className="profile-page__stage">{stageName(profile.stage)}</p>
      </div>

      <div className="profile-page__stats-grid">
        <div className="profile-page__stat">
          <span className="profile-page__stat-label">😊 Felicidad</span>
          <div className="profile-page__stat-bar">
            <div className="profile-page__stat-fill profile-page__stat-fill--happiness" style={{ width: `${profile.stats.happiness}%` }} />
          </div>
          <span className="profile-page__stat-val">{profile.stats.happiness}</span>
        </div>
        <div className="profile-page__stat">
          <span className="profile-page__stat-label">⚡ Energía</span>
          <div className="profile-page__stat-bar">
            <div className="profile-page__stat-fill profile-page__stat-fill--energy" style={{ width: `${profile.stats.energy}%` }} />
          </div>
          <span className="profile-page__stat-val">{profile.stats.energy}</span>
        </div>
        <div className="profile-page__stat">
          <span className="profile-page__stat-label">🍎 Hambre</span>
          <div className="profile-page__stat-bar">
            <div className="profile-page__stat-fill profile-page__stat-fill--hunger" style={{ width: `${profile.stats.hunger}%` }} />
          </div>
          <span className="profile-page__stat-val">{profile.stats.hunger}</span>
        </div>
      </div>

      <div className="profile-page__meta">
        <span>⭐ {profile.totalPoints} pts</span>
        <span>🍊 {profile.balance} $FRUTA</span>
        <span>👀 {profile.totalVisits} visitas</span>
        <span>📅 {timeAgo(profile.registeredAt)}</span>
      </div>

      {/* Social Summary for own profile (Level 4 K) */}
      {isMyProfile && (
        <div className="profile-page__social-summary">
          <h2 className="profile-page__summary-title">📊 Resumen Social</h2>
          <div className="profile-page__summary-grid">
            <div className="profile-page__summary-item">
              <span className="profile-page__summary-val">👀 {profile.totalVisits}</span>
              <span className="profile-page__summary-label">Visitas</span>
            </div>
            <div className="profile-page__summary-item">
              <span className="profile-page__summary-val">🍊 {profile.balance}</span>
              <span className="profile-page__summary-label">$FRUTA</span>
            </div>
            <div className="profile-page__summary-item">
              <span className="profile-page__summary-val">⭐ {profile.totalPoints}</span>
              <span className="profile-page__summary-label">Puntos</span>
            </div>
            <div className="profile-page__summary-item">
              <span className="profile-page__summary-val">💬 {messages.length}</span>
              <span className="profile-page__summary-label">Mensajes</span>
            </div>
          </div>
        </div>
      )}

      {/* === INTERACTIONS (Level 2 + Level 3) === */}
      {!isMyProfile && isRegistered && (
        <div className="profile-page__interactions">
          {/* My balance indicator */}
          <p className="profile-page__my-balance">Tu balance: 🍊 {myBalance} $FRUTA</p>

          {/* Greet (L2) */}
          <button
            className="profile-page__action-btn profile-page__action-btn--greet"
            onClick={handleGreet}
            disabled={greetSent || greetLoading}
          >
            {greetLoading ? '🔄...' : greetSent ? '✅ Saludo enviado' : `👋 Saludar`}
          </button>

          {/* Feed (L3 F) */}
          <button
            className="profile-page__action-btn profile-page__action-btn--feed"
            onClick={handleFeed}
            disabled={feedLoading || myBalance < 10}
            title={myBalance < 10 ? 'Necesitas al menos 10 $FRUTA' : ''}
          >
            {feedLoading ? '🔄...' : '🍎 Alimentar (-10 🍊)'}
          </button>

          {/* Gift (L3 F) */}
          <div className="profile-page__gift-row">
            {[5, 10, 25].map(amt => (
              <button
                key={amt}
                className="profile-page__action-btn profile-page__action-btn--gift"
                onClick={() => handleGift(amt)}
                disabled={giftLoading !== null || myBalance < amt}
                title={myBalance < amt ? `Necesitas al menos ${amt} $FRUTA` : ''}
              >
                {giftLoading === amt ? '🔄' : `🎁 ${amt}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isMyProfile && !isRegistered && (
        <div className="profile-page__register-cta">
          <p>Regístrate en el HUB para interactuar</p>
          <Link href="/" className="profile-page__cta-link">Ir a La Red →</Link>
        </div>
      )}

      {/* === MESSAGES (Level 3) === */}
      <div className="profile-page__messages">
        <h2 className="profile-page__messages-title">💬 Mensajes</h2>

        {/* Send form (only for others, if registered) */}
        {!isMyProfile && isRegistered && (
          <div className="profile-page__msg-form">
            <textarea
              className="profile-page__msg-input"
              value={msgText}
              onChange={(e) => setMsgText(e.target.value.slice(0, 140))}
              placeholder={`Escribe a ${profile.name}...`}
              maxLength={140}
              rows={2}
            />
            <div className="profile-page__msg-form-footer">
              <span className="profile-page__msg-counter">{msgText.length}/140</span>
              <button
                className="profile-page__msg-send"
                onClick={handleSendMessage}
                disabled={!msgText.trim() || msgSending}
              >
                {msgSending ? '🔄' : '📨 Enviar'}
              </button>
            </div>
          </div>
        )}

        {/* Message list */}
        {messagesLoaded && messages.length === 0 && (
          <p className="profile-page__msg-empty">Aún no hay mensajes. ¡Sé el primero!</p>
        )}
        {messages.length > 0 && (
          <ul className="profile-page__msg-list">
            {messages.map(msg => (
              <li key={msg.id} className="profile-page__msg-item">
                <span className="profile-page__msg-from">{msg.fromName}</span>
                <span className="profile-page__msg-text">{msg.message}</span>
                <span className="profile-page__msg-time">{timeAgo(msg.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
