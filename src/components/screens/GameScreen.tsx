'use client';

import { useGameState } from '@/hooks/useGameState';
import GameBackground from '@/components/game/GameBackground';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';
import StatBar from '@/components/regenmon/StatBar';
import { useState } from 'react';
import ActionButtons from '../regenmon/ActionButtons';

interface GameScreenProps {
    onReset: () => void;
}

export default function GameScreen({ onReset }: GameScreenProps) {
    const { regenmon, updateStatAction } = useGameState();

    if (!regenmon) return null;

    // Days alive calculation
    const daysAlive = Math.floor(
        (Date.now() - new Date(regenmon.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    const handleAction = (action: 'train' | 'feed' | 'sleep') => {
        // Simple logic for now, can be expanded
        switch (action) {
            case 'train':
                // Entrenar: +Espíritu, -Pulso, +Hambre (físico cansa)
                // Using the new batched signature (casted to any because we updated the implementation but not the interface type in this file implicitly if TS checks strict)
                // Actually updateStatAction now accepts Partial<RegenmonStats> if we updated the hook return type? 
                // Let's assume the hook return type inference picks up the change.
                // But wait, in the hook return I renamed it `updateStatAction: updateStatsWithDeltas`.
                // So the function name exported is still `updateStatAction` but signature changed.
                // We need to pass an object now.
                (updateStatAction as any)({ espiritu: 10, pulso: -5, hambre: 5 });
                break;
            case 'feed':
                // Comer: -Hambre, +Pulso (energía)
                (updateStatAction as any)({ hambre: -20, pulso: 5 });
                break;
            case 'sleep':
                // Dormir: +Pulso, -Hambre (un poco), +Espíritu (descanso mental)
                (updateStatAction as any)({ pulso: 15, espiritu: 5, hambre: 2 });
                break;
        }
    };

    return (
        <div className="game-screen w-full h-screen relative overflow-hidden flex flex-col">
            {/* Background Layer */}
            <GameBackground type={regenmon.type} stats={regenmon.stats} />

            {/* Main Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pb-4 pt-4">

                {/* Top HUD: Info + Reset */}
                <div className="game-screen__header w-full px-4 flex justify-between items-start text-white">
                    <div className="flex flex-col">
                        <span className="text-[10px] opacity-80">Día {daysAlive} de aventura</span>
                    </div>
                    <button
                        onClick={onReset}
                        className="text-[8px] text-red-400 opacity-50 hover:opacity-100 border border-red-900 px-1"
                    >
                        RESET
                    </button>
                </div>

                {/* Center: Regenmon */}
                <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                    <div className="relative animate-float">
                        <RegenmonSVG
                            type={regenmon.type}
                            stats={regenmon.stats}
                            size={180}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <h2 className="text-xl text-white drop-shadow-md font-bold tracking-widest uppercase">
                            {regenmon.name}
                        </h2>
                    </div>
                </div>

                {/* Bottom UI: Stats & Actions */}
                <div className="w-full max-w-md px-4 flex flex-col gap-4 mb-2">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-1">
                        <StatBar
                            label="Espíritu"
                            value={regenmon.stats.espiritu}
                            color="var(--color-stat-espiritu-full)"
                            icon="🔮"
                        />
                        <StatBar
                            label="Pulso"
                            value={regenmon.stats.pulso}
                            color="var(--color-stat-pulso-full)"
                            icon="💛"
                        />
                        <StatBar
                            label="Hambre"
                            value={regenmon.stats.hambre}
                            color="var(--color-stat-hambre-full)"
                            icon="🍖"
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-2">
                        <ActionButtons
                            onAction={handleAction}
                            stats={regenmon.stats}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
