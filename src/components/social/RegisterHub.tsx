'use client';

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { useHub, HubActivityItem } from '@/hooks/useHub';
import { useHubSync } from '@/hooks/useHubSync';
import { loadRegenmon } from '@/lib/storage';
import { loadPlayerData } from '@/lib/storage';

interface RegisterHubProps {
  onClose?: () => void;
}

export default function RegisterHub({ onClose }: RegisterHubProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [hubId, setHubId] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<HubActivityItem[]>([]);
  const [hubBalance, setHubBalance] = useState(0);

  const { register, getActivity } = useHub();

  // Load regenmon data for stats/sync
  const regenmon = loadRegenmon();
  const stats = regenmon?.stats ?? { espiritu: 50, pulso: 50, esencia: 50 };
  const totalProgress = (regenmon as any)?.evolution?.totalProgress ?? (regenmon as any)?.progress ?? 0;

  // Auto-sync when registered
  useHubSync({ stats, totalProgress });

  // Check registration state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID);
    const registered = localStorage.getItem(STORAGE_KEYS.IS_REGISTERED_IN_HUB) === 'true';
    const balance = parseInt(localStorage.getItem(STORAGE_KEYS.HUB_BALANCE) ?? '0', 10);
    if (registered && storedId) {
      setIsRegistered(true);
      setHubId(storedId);
      setHubBalance(balance);
    }
  }, []);

  // Fetch activity when registered
  useEffect(() => {
    if (!isRegistered || !hubId) return;
    getActivity(hubId).then(res => {
      if (res?.data?.activity) setActivity(res.data.activity);
    });
  }, [isRegistered, hubId, getActivity]);

  const handleRegister = useCallback(async () => {
    if (!regenmon) return;
    setIsRegistering(true);
    setError(null);

    const playerData = loadPlayerData();
    const ownerName = playerData?.name || 'Aventurero';
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://reggie-s-adventure.vercel.app';
    const spriteUrl = `${appUrl}/sprites/${regenmon.type}-base.webp`;

    const result = await register(regenmon.name, ownerName, appUrl, spriteUrl);

    if (result && (result.success || result.data?.id || (result.data as any)?.alreadyRegistered)) {
      const id = result.data.id;
      localStorage.setItem(STORAGE_KEYS.HUB_REGENMON_ID, id);
      localStorage.setItem(STORAGE_KEYS.IS_REGISTERED_IN_HUB, 'true');
      localStorage.setItem(STORAGE_KEYS.HUB_BALANCE, String(result.data.balance ?? 0));
      setHubId(id);
      setIsRegistered(true);
      setHubBalance(result.data.balance ?? 0);
    } else {
      setError('El HUB está descansando, intenta después 🍎');
    }

    setIsRegistering(false);
  }, [regenmon, register]);

  if (!regenmon) return null;

  // --- REGISTERED VIEW ---
  if (isRegistered) {
    return (
      <div className="social-panel">
        <div className="social-panel__header">
          <h2 className="social-panel__title">🌍 La Red</h2>
          {onClose && (
            <button className="social-panel__close" onClick={onClose} aria-label="Cerrar">✕</button>
          )}
        </div>

        <div className="social-panel__badge">
          <span className="social-badge">🌍 HUB MEMBER</span>
          <span className="social-panel__name">{regenmon.name}</span>
        </div>

        <div className="social-panel__balance">
          🍊 {hubBalance} $FRUTA
        </div>

        <div className="social-panel__actions">
          <a href="/leaderboard" className="social-panel__btn">
            🏆 Regeneración Global
          </a>
          <a href={`/regenmon/${hubId}`} className="social-panel__btn">
            👤 Mi Perfil
          </a>
        </div>

        <div className="social-panel__activity">
          <h3 className="social-panel__subtitle">🔔 Actividad Reciente</h3>
          {activity.length === 0 ? (
            <p className="social-panel__empty">Aún no hay actividad. ¡Comparte tu perfil!</p>
          ) : (
            <ul className="social-panel__activity-list">
              {activity.map((item, i) => (
                <li key={i} className="social-panel__activity-item">
                  <span className="social-panel__activity-icon">
                    {item.type === 'feed_received' ? '🍎' :
                     item.type === 'gift_received' ? '🎁' :
                     item.type === 'message_received' ? '📨' : '📌'}
                  </span>
                  <span className="social-panel__activity-text">{item.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // --- REGISTRATION INVITATION ---
  return (
    <div className="social-panel">
      <div className="social-panel__header">
        <h2 className="social-panel__title">🌍 La Red</h2>
        {onClose && (
          <button className="social-panel__close" onClick={onClose} aria-label="Cerrar">✕</button>
        )}
      </div>

      <div className="social-panel__invite">
        <div className="social-panel__preview">
          <img
            src={`/sprites/${regenmon.type}-base.webp`}
            alt={regenmon.name}
            className="social-panel__sprite"
            width={80}
            height={80}
          />
          <div className="social-panel__preview-info">
            <span className="social-panel__preview-name">{regenmon.name}</span>
            <span className="social-panel__preview-type">
              {regenmon.type === 'rayo' ? '⚡ Rayo' : regenmon.type === 'flama' ? '🔥 Flama' : '❄️ Hielo'}
            </span>
            <span className="social-panel__preview-stats">
              🔮 {Math.round(stats.espiritu)} | 💛 {Math.round(stats.pulso)} | 🌱 {Math.round(stats.esencia)}
            </span>
          </div>
        </div>

        <p className="social-panel__invite-text">
          Tu Regenmon puede ser visible para otros habitantes del mundo digital.
        </p>

        {error && (
          <p className="social-panel__error">{error}</p>
        )}

        <button
          className="social-panel__register-btn"
          onClick={handleRegister}
          disabled={isRegistering}
        >
          {isRegistering ? '🔄 Registrando...' : '🌍 Registrar en La Red'}
        </button>

        <button
          className="social-panel__later-btn"
          onClick={onClose}
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
