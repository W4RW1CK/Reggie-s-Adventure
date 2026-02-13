'use client';

import { useGameState } from '@/hooks/useGameState';
import GameBackground from '@/components/game/GameBackground';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';
import StatBar from '@/components/regenmon/StatBar';
import ActionButtons from '../regenmon/ActionButtons';
import NameEditor from '../ui/NameEditor';
import ResetButton from '../ui/ResetButton';
import TutorialModal from '../ui/TutorialModal';
import { useState, useEffect } from 'react';

interface GameScreenProps {
    onReset: () => void;
}

export default function GameScreen({ onReset }: GameScreenProps) {
    const {
        regenmon,
        updateStatAction,
        updateRegenmonName,
        dismissTutorial,
        resetGame
    } = useGameState();

    const [showTutorial, setShowTutorial] = useState(false);

    // Effect to check if tutorial should be shown
    useEffect(() => {
        if (regenmon && !regenmon.tutorialDismissed) {
            // Small delay to let the transition finish
            const timer = setTimeout(() => setShowTutorial(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [regenmon?.tutorialDismissed]); // Only run when dismissal state changes (initially)

    if (!regenmon) return null;

    // Days alive calculation
    const daysAlive = Math.floor(
        (Date.now() - new Date(regenmon.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    const handleAction = (action: 'train' | 'feed' | 'sleep') => {
        switch (action) {
            case 'train':
                // Entrenar: +Espíritu, -Pulso, +Hambre (físico cansa)
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

    const handleTutorialDismiss = (dontShowAgain: boolean) => {
        setShowTutorial(false);
        if (dontShowAgain) {
            dismissTutorial();
        }
    };

    const handleReset = () => {
        resetGame();
        // The parent page.tsx will handle the state change based on regenmon becoming null
        // But we can also call the prop passed down if needed for immediate feedback
        onReset();
    };

    return (
        <div className="game-screen w-full h-screen relative overflow-hidden flex flex-col">
            {/* Background Layer */}
            <GameBackground type={regenmon.type} stats={regenmon.stats} />

            {/* Tutorial Modal */}
            {showTutorial && (
                <TutorialModal onDismiss={handleTutorialDismiss} />
            )}

            {/* Main Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pb-6 pt-4">

                {/* Top HUD: Info */}
                <div className="game-screen__header w-full px-4 flex justify-between items-start text-white">
                    <div className="flex flex-col drop-shadow-md">
                        <span className="text-[10px] opacity-100">Día {daysAlive} de aventura</span>
                    </div>
                </div>

                {/* Center: Regenmon */}
                <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                    <div className="relative animate-float mb-4">
                        <RegenmonSVG
                            type={regenmon.type}
                            stats={regenmon.stats}
                            size={180}
                        />
                    </div>

                    <div className="mt-2 text-center">
                        <NameEditor
                            currentName={regenmon.name}
                            onSave={updateRegenmonName}
                            canRename={!regenmon.nameChangeUsed}
                        />
                    </div>
                </div>

                {/* Bottom UI: Stats & Actions */}
                <div className="w-full max-w-md px-4 flex flex-col gap-4 mb-4">
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

                    {/* Footer: Reset */}
                    <div className="flex justify-center mt-2">
                        <ResetButton onReset={handleReset} />
                    </div>
                </div>

            </div>
        </div>
    );
}
