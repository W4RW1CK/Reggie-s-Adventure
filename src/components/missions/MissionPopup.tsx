'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Mission, RegenmonType } from '@/lib/types';
import { MISSION_EXPIRATION_MS } from '@/lib/constants';

interface MissionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activeMission: Mission | null;
  regenmonType: RegenmonType;
  onActivateNew: () => Mission | null;
  onAbandon: () => void;
}

function getTypeLabel(type: RegenmonType): { label: string; emoji: string } {
  switch (type) {
    case 'rayo': return { label: 'Flujo de información', emoji: '⚡' };
    case 'flama': return { label: 'Conexión humana', emoji: '🔥' };
    case 'hielo': return { label: 'Conocimiento', emoji: '❄️' };
  }
}

function formatTimeRemaining(expiresAt: number): string {
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return 'Expirada';
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function MissionPopup({
  isOpen,
  onClose,
  activeMission,
  regenmonType,
  onActivateNew,
  onAbandon,
}: MissionPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  useFocusTrap(backdropRef, isOpen && !isClosing);
  const [isRevealing, setIsRevealing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [confirmAbandon, setConfirmAbandon] = useState(false);

  const typeInfo = getTypeLabel(regenmonType);

  // Update time remaining
  useEffect(() => {
    if (!activeMission || activeMission.completed) return;
    const update = () => setTimeRemaining(formatTimeRemaining(activeMission.expiresAt));
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [activeMission]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setConfirmAbandon(false);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen || isClosing) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
  }, [isOpen, isClosing, handleClose]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  const handleActivateNew = () => {
    setIsRevealing(true);
    onActivateNew();
    setTimeout(() => setIsRevealing(false), 600);
  };

  const handleAbandon = () => {
    if (!confirmAbandon) {
      setConfirmAbandon(true);
      return;
    }
    onAbandon();
    setConfirmAbandon(false);
  };

  if (!isOpen) return null;

  const hasActiveMission = activeMission && !activeMission.completed && Date.now() < activeMission.expiresAt;

  return (
    <div ref={backdropRef} className={`mission-popup-backdrop ${isClosing ? 'mission-popup-backdrop--closing' : ''}`}>
      <div
        ref={popupRef}
        className={`mission-popup ${isClosing ? 'mission-popup--closing' : ''} ${isRevealing ? 'mission-popup--revealing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Misión"
      >
        {/* Close button */}
        <button className="mission-popup__close" onClick={handleClose} aria-label="Cerrar">✕</button>

        {hasActiveMission ? (
          <>
            {/* Active mission */}
            <div className="mission-popup__header">
              <span className="mission-popup__type">{typeInfo.emoji} {typeInfo.label}</span>
              <span className="mission-popup__timer">⏳ {timeRemaining}</span>
            </div>
            <p className="mission-popup__prompt">{activeMission!.prompt}</p>
            <div className="mission-popup__reward">+5 progreso bonus 🎯</div>
            <div className="mission-popup__actions">
              {!confirmAbandon ? (
                <button className="mission-popup__btn mission-popup__btn--abandon" onClick={handleAbandon}>
                  Abandonar
                </button>
              ) : (
                <div className="mission-popup__confirm">
                  <span>¿Seguro?</span>
                  <button className="mission-popup__btn mission-popup__btn--yes" onClick={handleAbandon}>Sí</button>
                  <button className="mission-popup__btn mission-popup__btn--no" onClick={() => setConfirmAbandon(false)}>No</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* No mission */}
            <div className="mission-popup__empty">
              <p className="mission-popup__empty-text">No tienes misión activa</p>
              <p className="mission-popup__empty-desc">
                Las misiones te dan +5 progreso bonus al completarlas con una foto
              </p>
              <button className="mission-popup__btn mission-popup__btn--activate" onClick={handleActivateNew}>
                🎯 Buscar misión
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
