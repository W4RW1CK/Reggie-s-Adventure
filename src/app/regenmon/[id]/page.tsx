'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useHub } from '@/hooks/useHub';
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
  const [greetSent, setGreetSent] = useState(false);
  const [greetLoading, setGreetLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { getProfile, sendMessage } = useHub();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const myId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID);
    const registered = localStorage.getItem(STORAGE_KEYS.IS_REGISTERED_IN_HUB) === 'true';
    setIsMyProfile(myId === id);
    setIsRegistered(registered && !!myId);
  }, [id]);

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

  const handleGreet = useCallback(async () => {
    if (!profile || greetSent || greetLoading) return;
    setGreetLoading(true);
    const myId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID) ?? '';
    const myName = localStorage.getItem('reggie-adventure-player-name') || 'Aventurero';
    const result = await sendMessage(id, myId, myName, `👋 ¡Hola ${profile.name}!`);
    if (result) {
      setGreetSent(true);
      setToastMsg(`¡Saludaste a ${profile.name}! 👋`);
      setTimeout(() => setToastMsg(null), 3000);
    }
    setGreetLoading(false);
  }, [id, profile, greetSent, greetLoading, sendMessage]);

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

      {/* Interaction: Greet (Level 2 D) */}
      {!isMyProfile && isRegistered && (
        <div className="profile-page__interactions">
          <button
            className="profile-page__greet-btn"
            onClick={handleGreet}
            disabled={greetSent || greetLoading}
          >
            {greetLoading ? '🔄 Enviando...' : greetSent ? '✅ ¡Saludo enviado!' : `👋 Saludar a ${profile.name}`}
          </button>
        </div>
      )}

      {!isMyProfile && !isRegistered && (
        <div className="profile-page__register-cta">
          <p>Regístrate en el HUB para interactuar</p>
          <Link href="/" className="profile-page__cta-link">Ir a La Red →</Link>
        </div>
      )}
    </div>
  );
}
