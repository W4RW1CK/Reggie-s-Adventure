'use client';

import { useGameState } from '@/hooks/useGameState';
import GameBackground from '@/components/game/GameBackground';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';
import { useState } from 'react';

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

    return (
        <div className="game-screen w-full h-screen relative overflow-hidden flex flex-col">
            {/* Background Layer */}
            <GameBackground type={regenmon.type} stats={regenmon.stats} />

            {/* Main Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pb-8 pt-4">

                {/* Header Info */}
                <div className="game-screen__header w-full px-4 flex justify-between items-start text-white">
                    <div className="flex flex-col">
                        <span className="text-[10px] opacity-80">Día {daysAlive} de aventura</span>
                    </div>
                </div>

                {/* Regenmon Display - Centered in remaining space approx */}
                <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                    <div className="relative">
                        <RegenmonSVG
                            type={regenmon.type}
                            stats={regenmon.stats}
                            size={200}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <h2 className="text-xl text-white drop-shadow-md font-bold tracking-widest uppercase">
                            {regenmon.name}
                        </h2>
                    </div>
                </div>

                {/* Temporary Bottom Controls for Phase 10 Check */}
                <div className="bg-black/80 p-4 border-2 border-white/50 w-[90%] max-w-sm mx-auto text-center">
                    <p className="text-xs text-gray-400 mb-2">Phase 10: Background Check</p>
                    <p className="text-[10px] text-gray-500 mb-4">
                        (HUD & Actions coming in Phase 11)
                    </p>
                    <button
                        onClick={onReset}
                        className="text-xs text-red-400 border border-red-900 px-2 py-1 hover:bg-red-900/50"
                    >
                        [DEBUG] RESET
                    </button>

                    {/* Tiny debug controls to test mood changes */}
                    <div className="flex gap-2 justify-center mt-2">
                        <button onClick={() => updateStatAction('pulso', -20)} className="text-[8px] border px-1">-HP</button>
                        <button onClick={() => updateStatAction('pulso', 20)} className="text-[8px] border px-1">+HP</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
