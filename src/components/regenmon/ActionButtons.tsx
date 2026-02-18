'use client';

import React from 'react';
import { RegenmonStats } from '@/lib/types';
import { PURIFY_COST } from '@/lib/constants';

interface ActionButtonsProps {
    onPurify: () => void;
    onSettings: () => void;
    onChat: () => void;
    onSearchFragments: () => void;
    stats: RegenmonStats;
    fragmentos: number;
    showSearchFragments: boolean; // Only when fragmentos === 0
    isChatOpen?: boolean;
}

export default function ActionButtons({ 
    onPurify, 
    onSettings, 
    onChat, 
    onSearchFragments,
    stats, 
    fragmentos,
    showSearchFragments,
    isChatOpen = false 
}: ActionButtonsProps) {
    const allStatsFull = stats.esencia >= 100 && stats.espiritu >= 100 && stats.pulso >= 100;
    const canPurify = fragmentos >= PURIFY_COST && !allStatsFull;
    const purifyTooltip = fragmentos < PURIFY_COST 
        ? `Necesitas ${PURIFY_COST} 💠` 
        : allStatsFull 
        ? 'Todas las stats al máximo' 
        : '';

    return (
        <div className="w-full flex flex-col gap-2">
            {/* Main action buttons row */}
            <div className="action-buttons-row grid grid-cols-3 gap-2">
                {/* Purificar Button */}
                <button
                    type="button"
                    className={`nes-btn w-full flex flex-col items-center justify-center py-2 text-xs leading-tight ${
                        canPurify ? 'is-primary' : ''
                    }`}
                    onClick={onPurify}
                    disabled={!canPurify}
                    title={purifyTooltip}
                    style={{ minHeight: '60px' }}
                >
                    <span className="text-xl mb-1">🌀</span>
                    <span>PURIFICAR</span>
                    <span className="text-xs opacity-75">({PURIFY_COST}💠)</span>
                </button>

                {/* Settings Button */}
                <button
                    type="button"
                    className="nes-btn w-full flex flex-col items-center justify-center py-2 text-xs leading-tight"
                    onClick={onSettings}
                    title="Configuración"
                    style={{ minHeight: '60px' }}
                >
                    <span className="text-xl mb-1" role="img" aria-label="settings">⚙️</span>
                    <span>CONFIG</span>
                </button>

                {/* Chat Button */}
                <button
                    type="button"
                    className={`nes-btn w-full flex flex-col items-center justify-center py-2 text-xs leading-tight ${
                        isChatOpen ? 'is-error' : 'is-success'
                    }`}
                    onClick={onChat}
                    style={{ minHeight: '60px' }}
                >
                    <span className="text-xl mb-1">{isChatOpen ? '✕' : '💬'}</span>
                    <span>{isChatOpen ? 'CERRAR' : 'CONVERSAR'}</span>
                </button>
            </div>

            {/* Search Fragments button (only when fragmentos === 0) */}
            {showSearchFragments && (
                <button
                    type="button"
                    className="nes-btn is-warning w-full flex items-center justify-center gap-2 py-3"
                    onClick={onSearchFragments}
                >
                    <span className="text-lg">🔍</span>
                    <span>Buscar Fragmentos</span>
                    <span className="text-sm opacity-75">(+15💠)</span>
                </button>
            )}
        </div>
    );
}