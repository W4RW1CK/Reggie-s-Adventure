'use client';

interface HUDProps {
  fragments: number;
  isLoggedIn: boolean;
  missionActive: boolean;
  onSettingsClick: () => void;
}

export default function HUD({ fragments, isLoggedIn, missionActive, onSettingsClick }: HUDProps) {
  return (
    <div className="s4-hud" role="banner" aria-label="HUD del juego">
      {/* Left: Fragments */}
      <div className="s4-hud__left">
        <span className="s4-hud__fragments" aria-label={`Fragmentos: ${isLoggedIn ? fragments : 'no disponible'}`}>
          🔮 {isLoggedIn ? fragments : '---'}
        </span>
      </div>

      {/* Right: Mission + Settings */}
      <div className="s4-hud__right">
        <span
          className={`s4-hud__mission ${missionActive ? 's4-hud__mission--active' : ''}`}
          aria-label={missionActive ? 'Misión activa' : 'Sin misión activa'}
        >
          🎯
        </span>
        <button
          className="s4-hud__settings"
          onClick={onSettingsClick}
          aria-label="Configuración"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}
