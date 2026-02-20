'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // Toggles
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  onToggleFullscreen: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  effectsEnabled: boolean;
  onToggleEffects: () => void;
  // Info
  onRestartTutorial: () => void;
  onResetGame?: () => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  isFullscreen,
  isFullscreenSupported,
  onToggleFullscreen,
  theme,
  onToggleTheme,
  musicEnabled,
  onToggleMusic,
  effectsEnabled,
  onToggleEffects,
  onRestartTutorial,
  onResetGame,
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Smooth close animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  // Click backdrop to close (desktop only)
  useEffect(() => {
    if (!isOpen || isClosing) return;
    const handler = (e: MouseEvent) => {
      // Only on desktop (floating window mode)
      if (window.innerWidth < 1025) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
  }, [isOpen, isClosing, handleClose]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`s4-settings-overlay ${isClosing ? 's4-settings-overlay--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Configuración"
    >
      <div
        ref={panelRef}
        className={`s4-settings-panel ${isClosing ? 's4-settings-panel--closing' : ''}`}
      >
        {/* Header */}
        <div className="s4-settings__header">
          <span className="s4-settings__title">⚙️ Configuración</span>
          <button
            onClick={handleClose}
            className="s4-settings__close"
            aria-label="Cerrar configuración"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="s4-settings__body">
          {/* Fullscreen */}
          {isFullscreenSupported && (
            <div className="s4-settings__row">
              <span className="s4-settings__label">🖥️ Pantalla completa</span>
              <button
                onClick={onToggleFullscreen}
                className={`s4-settings__toggle ${isFullscreen ? 's4-settings__toggle--on' : ''}`}
              >
                {isFullscreen ? 'ON' : 'OFF'}
              </button>
            </div>
          )}

          {/* Theme */}
          <div className="s4-settings__row">
            <span className="s4-settings__label">{theme === 'dark' ? '🌙' : '☀️'} Tema</span>
            <button
              onClick={onToggleTheme}
              className={`s4-settings__toggle ${theme === 'light' ? 's4-settings__toggle--light' : ''}`}
            >
              {theme === 'dark' ? 'Oscuro' : 'Claro'}
            </button>
          </div>

          {/* Music */}
          <div className="s4-settings__row">
            <span className="s4-settings__label">🎵 Música</span>
            <button
              onClick={onToggleMusic}
              className={`s4-settings__toggle ${musicEnabled ? 's4-settings__toggle--on' : ''}`}
            >
              {musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Effects */}
          <div className="s4-settings__row">
            <span className="s4-settings__label">✨ Efectos</span>
            <button
              onClick={onToggleEffects}
              className={`s4-settings__toggle ${effectsEnabled ? 's4-settings__toggle--on' : ''}`}
            >
              {effectsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Divider */}
          <div className="s4-settings__divider" />

          {/* Tutorial restart */}
          <div className="s4-settings__row">
            <span className="s4-settings__label">📖 Tutorial</span>
            <button
              onClick={onRestartTutorial}
              className="s4-settings__action-btn"
            >
              Reiniciar
            </button>
          </div>

          {/* Danger zone */}
          {onResetGame && (
            <>
              <div className="s4-settings__divider" />
              <div className="s4-settings__row s4-settings__row--danger">
                <span className="s4-settings__label">⚠️ Reiniciar Regenmon</span>
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro? Se borrarán todos los datos de tu Regenmon.')) {
                      onResetGame();
                    }
                  }}
                  className="s4-settings__action-btn s4-settings__action-btn--danger"
                >
                  Borrar todo
                </button>
              </div>
            </>
          )}

          {/* Version */}
          <div className="s4-settings__version">
            v0.4.0-S4 — La Evolución
          </div>
        </div>
      </div>
    </div>
  );
}
