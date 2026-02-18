'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

type TextSize = 'sm' | 'base' | 'lg';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  textSize: TextSize;
  onSetTextSize: (size: TextSize) => void;
  regenmonName: string;
  onUpdateName: (name: string) => void;
  canRename: boolean;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onReset: () => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  musicEnabled,
  onToggleMusic,
  theme,
  onToggleTheme,
  textSize,
  onSetTextSize,
  regenmonName,
  onUpdateName,
  canRename,
  isLoggedIn,
  onLogin,
  onLogout,
  onReset,
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(regenmonName);
  const [nameError, setNameError] = useState('');

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
  }, [isOpen, onClose]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleNameSave = useCallback(() => {
    const trimmed = nameValue.trim();
    if (trimmed.length < 2) { setNameError('Mínimo 2 caracteres'); return; }
    if (trimmed.length > 15) { setNameError('Máximo 15 caracteres'); return; }
    onUpdateName(trimmed);
    setIsEditingName(false);
    setNameError('');
  }, [nameValue, onUpdateName]);

  const handleResetConfirm = useCallback(() => {
    setShowResetConfirm(false);
    onReset();
  }, [onReset]);

  const textSizes: TextSize[] = ['sm', 'base', 'lg'];
  const textSizeIndex = textSizes.indexOf(textSize);

  const cycleTextDown = () => {
    if (textSizeIndex > 0) onSetTextSize(textSizes[textSizeIndex - 1]);
  };
  const cycleTextUp = () => {
    if (textSizeIndex < textSizes.length - 1) onSetTextSize(textSizes[textSizeIndex + 1]);
  };

  if (!isOpen) return null;

  const containerClass = theme === 'dark' ? 'nes-container is-dark with-title' : 'nes-container is-light with-title';

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn" style={{ backgroundColor: 'var(--theme-modal-overlay)', zIndex: 100 }}>
      <div
        ref={panelRef}
        className="settings-panel w-full max-w-xs sm:max-w-sm h-full overflow-y-auto border-l-4 p-0 animate-slideInRight"
        style={{ backgroundColor: 'var(--theme-panel-bg)', borderColor: 'var(--theme-border-subtle)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Configuración"
      >
        <div className={`${containerClass}`} style={{ margin: '0', border: 'none' }}>
          <p className="title">⚙️ Configuración</p>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute text-lg hover:text-red-400 transition-colors z-10"
            aria-label="Cerrar configuración"
            style={{ position: 'absolute', top: '-10px', right: '8px', color: 'var(--theme-text)', fontSize: '18px', padding: '8px' }}
          >
            ✕
          </button>

          <div className="flex flex-col gap-4 mt-2">

            {/* Music */}
            <div className="flex items-center justify-between">
              <span className="text-xs">🎵 Música</span>
              <button
                onClick={onToggleMusic}
                className={`nes-btn ${musicEnabled ? 'is-success' : ''} text-xs py-1 px-3`}
              >
                {musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between">
              <span className="text-xs">{theme === 'dark' ? '🌙' : '☀️'} Tema</span>
              <button
                onClick={onToggleTheme}
                className={`nes-btn ${theme === 'light' ? 'is-warning' : 'is-primary'} text-xs py-1 px-3`}
              >
                {theme === 'dark' ? 'NES (Dark)' : 'GBC (Light)'}
              </button>
            </div>

            {/* Text Size */}
            <div className="flex items-center justify-between">
              <span className="text-xs">🔤 Texto</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={cycleTextDown}
                  className="nes-btn text-xs py-1 px-2"
                  disabled={textSizeIndex === 0}
                >
                  A-
                </button>
                <span className="text-xs w-12 text-center uppercase">{textSize}</span>
                <button
                  onClick={cycleTextUp}
                  className="nes-btn text-xs py-1 px-2"
                  disabled={textSizeIndex === textSizes.length - 1}
                >
                  A+
                </button>
              </div>
            </div>

            {/* Rename */}
            <div className="flex flex-col gap-1">
              <span className="text-xs">📝 Cambiar nombre</span>
              {canRename ? (
                isEditingName ? (
                  <div className="flex flex-col gap-1">
                    <div className="text-[10px] text-yellow-400">⚠ ÚNICA OPORTUNIDAD</div>
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => { setNameValue(e.target.value); setNameError(''); }}
                      className="nes-input is-dark h-8 py-0 px-2 text-sm text-center"
                      maxLength={15}
                      autoFocus
                    />
                    {nameError && <span className="text-[10px] text-red-500">{nameError}</span>}
                    <div className="flex gap-2">
                      <button onClick={() => { setIsEditingName(false); setNameError(''); }} className="nes-btn is-error text-[10px] py-1 px-2 flex-1">❌</button>
                      <button onClick={handleNameSave} className="nes-btn is-success text-[10px] py-1 px-2 flex-1">💾 GUARDAR</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsEditingName(true); setNameValue(regenmonName); }}
                    className="nes-btn text-xs py-1"
                  >
                    ✏️ {regenmonName}
                  </button>
                )
              ) : (
                <span className="text-[10px] text-gray-500">Ya renombraste a {regenmonName}</span>
              )}
            </div>

            {/* Session */}
            <div className="flex items-center justify-between">
              <span className="text-xs">🚪 Sesión</span>
              {isLoggedIn ? (
                <button onClick={onLogout} className="nes-btn is-error text-xs py-1 px-3">
                  Cerrar Sesión
                </button>
              ) : (
                <button onClick={onLogin} className="nes-btn is-primary text-xs py-1 px-3">
                  Iniciar Sesión
                </button>
              )}
            </div>

            {/* Reset */}
            <div className="flex flex-col gap-1 mt-2 pt-2" style={{ borderTop: '1px solid var(--theme-border-faint)' }}>
              <span className="text-xs">🔄 Reiniciar</span>
              {showResetConfirm ? (
                <div className="flex flex-col gap-2 animate-fadeIn">
                  <p className="text-[10px] text-red-400">¿Borrar todo? Esta acción es irreversible.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowResetConfirm(false)} className="nes-btn text-[10px] py-1 flex-1">CANCELAR</button>
                    <button onClick={handleResetConfirm} className="nes-btn is-error text-[10px] py-1 flex-1">BORRAR TODO</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="nes-btn is-error text-xs py-1"
                >
                  REINICIAR AVENTURA
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
