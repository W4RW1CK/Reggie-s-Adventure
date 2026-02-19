'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CooldownStatus, Mission } from '@/lib/types';
import { formatCooldown } from '@/lib/photoCooldown';

const FIRST_TIME_KEY = 'reggie-adventure-photo-first-time';

interface PreCameraProps {
  cooldownStatus: CooldownStatus;
  activeMission: Mission | null;
  onCapture: (base64: string) => void;
  onBack: () => void;
}

export default function PreCamera({ cooldownStatus, activeMission, onCapture, onBack }: PreCameraProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [remainingDisplay, setRemainingDisplay] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem(FIRST_TIME_KEY);
      setIsFirstTime(!seen);
    }
  }, []);

  // Update cooldown timer every second
  useEffect(() => {
    if (cooldownStatus.canTakePhoto) {
      setRemainingDisplay('');
      return;
    }
    const update = () => setRemainingDisplay(formatCooldown(cooldownStatus.remainingMs - (Date.now() - Date.now())));
    setRemainingDisplay(formatCooldown(cooldownStatus.remainingMs));
    const interval = setInterval(() => {
      const remaining = cooldownStatus.remainingMs - 1000;
      if (remaining <= 0) {
        setRemainingDisplay('');
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownStatus]);

  // Live countdown
  const [cooldownEnd] = useState(() => {
    if (!cooldownStatus.canTakePhoto && cooldownStatus.remainingMs > 0) {
      return Date.now() + cooldownStatus.remainingMs;
    }
    return 0;
  });

  useEffect(() => {
    if (!cooldownEnd) return;
    const tick = () => {
      const remaining = cooldownEnd - Date.now();
      if (remaining <= 0) {
        setRemainingDisplay('');
        return;
      }
      setRemainingDisplay(formatCooldown(remaining));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cooldownEnd]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mark first time as done
    if (isFirstTime) {
      localStorage.setItem(FIRST_TIME_KEY, 'true');
      setIsFirstTime(false);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip data URL prefix to get raw base64
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      onCapture(base64);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be re-selected
    e.target.value = '';
  }, [isFirstTime, onCapture]);

  const disabled = !cooldownStatus.canTakePhoto;
  const showCooldown = !cooldownStatus.canTakePhoto && cooldownStatus.remainingMs > 0;

  return (
    <div className="precamera">
      <button className="precamera__back" onClick={onBack} aria-label="Volver">
        ← Volver
      </button>

      <div className="precamera__content">
        <h2 className="precamera__title">Comparte una Memoria</h2>
        <p className="precamera__desc">Tu Regenmon quiere ver el mundo a través de tus ojos</p>

        {isFirstTime && (
          <div className="precamera__first-time">
            <p>📷 Se te pedirá permiso para acceder a la cámara</p>
            <p className="precamera__privacy">🔒 Las fotos NUNCA se almacenan — solo se sienten</p>
          </div>
        )}

        {activeMission && !activeMission.completed && (
          <div className="precamera__mission">
            <div className="precamera__mission-label">🎯 Misión activa</div>
            <p className="precamera__mission-text">{activeMission.prompt}</p>
          </div>
        )}

        {showCooldown && (
          <div className="precamera__cooldown">
            <p>⏳ {cooldownStatus.reason === 'blocked'
              ? 'Memorias bloqueadas'
              : cooldownStatus.reason === 'strike_cooldown'
                ? 'Cooldown por strike'
                : 'Esperando...'
            }</p>
            <p className="precamera__cooldown-timer">{remainingDisplay}</p>
          </div>
        )}

        <div className="precamera__buttons">
          <button
            className="precamera__btn precamera__btn--camera"
            onClick={() => cameraInputRef.current?.click()}
            disabled={disabled}
            aria-label="Tomar foto con cámara"
          >
            📸 Tomar foto
          </button>
          <button
            className="precamera__btn precamera__btn--gallery"
            onClick={() => galleryInputRef.current?.click()}
            disabled={disabled}
            aria-label="Seleccionar de galería"
          >
            🖼️ Galería
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
