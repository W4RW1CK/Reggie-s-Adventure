import React from 'react';

interface MusicToggleProps {
    musicEnabled: boolean;
    onToggle: () => void;
}

export default function MusicToggle({ musicEnabled, onToggle }: MusicToggleProps) {
    return (
        <button
            onClick={onToggle}
            className="nes-btn is-primary p-2 flex items-center justify-center min-h-0 h-8 w-8 sm:h-10 sm:w-10"
            aria-label={musicEnabled ? "Desactivar música" : "Activar música"}
            aria-pressed={musicEnabled}
        >
            <span className="text-xs sm:text-sm">
                {musicEnabled ? '🎵' : '🔇'}
            </span>
        </button>
    );
}
