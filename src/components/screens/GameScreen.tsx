'use client';

import { useGameState } from '@/hooks/useGameState';
import GameBackground from '@/components/game/GameBackground';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';
import StatBar from '@/components/regenmon/StatBar';
import ActionButtons from '../regenmon/ActionButtons';
import NameEditor from '../ui/NameEditor';
import ResetButton from '../ui/ResetButton';
import TutorialModal from '../ui/TutorialModal';
import { useState, useEffect, useMemo } from 'react';

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
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 480);

    // Track window size for responsive SVG
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const regenmonSize = useMemo(() => {
        if (windowWidth < 480) return 130;
        if (windowWidth < 768) return 160;
        return 180;
    }, [windowWidth]);

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
            <div className="game-screen__content relative z-10 w-full h-full flex flex-col items-center justify-between">

                {/* Top HUD: Info */}
                <div className="game-screen__header w-full px-3 sm:px-4 pt-3 sm:pt-4 flex justify-between items-start text-white">
                    <div className="flex flex-col drop-shadow-md">
                        <span className="game-screen__day-label">Día {daysAlive} de aventura</span>
                    </div>
                </div>

                {/* Center: Regenmon */}
                <div className="game-screen__regenmon-area flex-1 flex flex-col items-center justify-center">
                    <div className="relative animate-float game-screen__regenmon-wrapper">
                        <RegenmonSVG
                            type={regenmon.type}
                            stats={regenmon.stats}
                            size={regenmonSize}
                        />
                    </div>

                    <div className="mt-1 sm:mt-2 text-center">
                        <NameEditor
                            currentName={regenmon.name}
                            onSave={updateRegenmonName}
                            canRename={!regenmon.nameChangeUsed}
                        />
                    </div>
                </div>

                {/* Bottom UI: Stats & Actions */}
                <div className="game-screen__bottom-ui w-full px-3 sm:px-4 flex flex-col gap-2 sm:gap-3">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-0.5 sm:gap-1">
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
                    <div className="mt-1 sm:mt-2">
                        <ActionButtons
                            onAction={handleAction}
                            stats={regenmon.stats}
                        />
                    </div>

                    {/* Footer: Reset */}
                    <div className="flex justify-center mt-1 sm:mt-2 pb-3 sm:pb-4">
                        <ResetButton onReset={handleReset} />
                    </div>
                </div>

            </div>
        </div>
    );
}
