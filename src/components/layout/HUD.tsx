'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FragmentDelta {
  id: number;
  amount: number;
}

interface HUDProps {
  fragments: number;
  isLoggedIn: boolean;
  missionActive: boolean;
  missionPrompt?: string;
  onSettingsClick: () => void;
  onMissionClick: () => void;
  isHealthCritical?: boolean;
}

export default function HUD({
  fragments,
  isLoggedIn,
  missionActive,
  missionPrompt,
  onSettingsClick,
  onMissionClick,
  isHealthCritical = false,
}: HUDProps) {
  const [deltas, setDeltas] = useState<FragmentDelta[]>([]);
  const prevFragments = useRef<number>(fragments);
  const deltaIdRef = useRef(0);

  // Detect fragment changes and show floating delta
  useEffect(() => {
    const diff = fragments - prevFragments.current;
    if (diff !== 0 && prevFragments.current !== 0) {
      const id = ++deltaIdRef.current;
      setDeltas(prev => [...prev, { id, amount: diff }]);
      // Auto-remove after animation
      setTimeout(() => {
        setDeltas(prev => prev.filter(d => d.id !== id));
      }, 1500);
    }
    prevFragments.current = fragments;
  }, [fragments]);

  const handleSettingsClick = useCallback(() => {
    onSettingsClick();
  }, [onSettingsClick]);

  return (
    <div className="s4-hud" role="banner" aria-label="HUD del juego">
      {/* Left: Fragments with animated deltas */}
      <div className="s4-hud__left">
        <span
          className={`s4-hud__fragments ${isHealthCritical ? 's4-hud__fragments--critical' : ''}`}
          aria-label={`Fragmentos: ${isLoggedIn ? fragments : 'no disponible'}`}
        >
          🔮 {isLoggedIn ? fragments : '---'}
        </span>
        {/* Floating deltas */}
        {deltas.map(d => (
          <span
            key={d.id}
            className={`s4-hud__delta ${d.amount > 0 ? 's4-hud__delta--positive' : 's4-hud__delta--negative'}`}
            aria-hidden="true"
          >
            {d.amount > 0 ? '+' : ''}{d.amount}
          </span>
        ))}
      </div>

      {/* Right: Mission + Settings */}
      <div className="s4-hud__right">
        <button
          className={`s4-hud__mission ${missionActive ? 's4-hud__mission--active' : ''}`}
          aria-label={missionActive ? `Misión activa: ${missionPrompt || 'Misión en curso'}` : 'Sin misión activa'}
          title={missionActive ? missionPrompt : undefined}
          onClick={onMissionClick}
        >
          🎯
        </button>
        <button
          className="s4-hud__settings"
          onClick={handleSettingsClick}
          aria-label="Configuración"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
