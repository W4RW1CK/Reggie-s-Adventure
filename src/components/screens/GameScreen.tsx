'use client';

import GameBackground from '@/components/game/GameBackground';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';
import StatBar from '@/components/regenmon/StatBar';
import ActionButtons from '../regenmon/ActionButtons';
import NameEditor from '../ui/NameEditor';
import ResetButton from '../ui/ResetButton';
import TutorialModal from '../ui/TutorialModal';
import MusicToggle from '../ui/MusicToggle';
import FragmentCounter from '../ui/FragmentCounter';
import { LoginButton } from '../auth/LoginButton';
import { useState, useEffect, useMemo } from 'react';
import { RegenmonData } from '@/lib/types';
import { STAT_MAX, STAT_MIN, PURIFY_COST, SEARCH_FRAGMENTS_REWARD } from '@/lib/constants';
import { ChatBox } from '../chat/ChatBox';
import { useChat } from '@/hooks/useChat';
import { useChiptuneAudio } from '@/hooks/useChiptuneAudio';
import { ErrorBoundary } from '../ErrorBoundary';
import classNames from 'classnames';

interface GameScreenProps {
    regenmon: RegenmonData;
    musicEnabled: boolean;
    onToggleMusic: () => void;
    onUpdateStats: (deltas: Partial<import('@/lib/types').RegenmonStats>) => void;
    onUpdateName: (newName: string) => void;
    onDismissTutorial: () => void;
    onReset: () => void;
    isLoggedIn?: boolean;
}

export default function GameScreen({
    regenmon,
    musicEnabled,
    onToggleMusic,
    onUpdateStats,
    onUpdateName,
    onDismissTutorial,
    onReset,
    isLoggedIn = false,
}: GameScreenProps) {
    const [showTutorial, setShowTutorial] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
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
        if (!regenmon.tutorialDismissed) {
            const timer = setTimeout(() => setShowTutorial(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [regenmon.tutorialDismissed]);

    // Days alive calculation
    const daysAlive = Math.floor(
        (Date.now() - new Date(regenmon.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    const handlePurify = () => {
        if (regenmon.stats.fragmentos < PURIFY_COST || regenmon.stats.esencia >= 100) {
            return;
        }
        
        // Spend 10 fragmentos and give: Esencia +30 (clamp to 100), Espíritu +5, Pulso +10
        onUpdateStats({ 
            fragmentos: -PURIFY_COST,
            esencia: 30,
            espiritu: 5,
            pulso: 10
        });
    };

    const handleSearchFragments = () => {
        if (regenmon.stats.fragmentos > 0) {
            return;
        }
        
        // Give 15 fragmentos
        onUpdateStats({ fragmentos: SEARCH_FRAGMENTS_REWARD });
    };

    const handleSettings = () => {
        setShowSettings(true);
        // Settings modal will be implemented later (placeholder for now)
        alert('⚙️ Configuración (próximamente)');
    };

    const handleTutorialDismiss = (dontShowAgain: boolean) => {
        setShowTutorial(false);
        if (dontShowAgain) {
            onDismissTutorial();
        }
    };

    // Chat Integration
    const {
        isOpen: isChatOpen,
        toggleChat,
        messages,
        sendMessage,
        isLoading: isChatLoading,
        lastStatsChange
    } = useChat({
        regenmon,
        updateStatAction: onUpdateStats
    });

    const handleSendMessage = (text: string) => {
        sendMessage(text);
    };

    // Audio Integration (Fade volume when chat is open)
    useChiptuneAudio({
        enabled: musicEnabled,
        type: regenmon.type,
        volume: isChatOpen ? 0.6 : 1.0
    });

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
                    <div className="flex flex-col gap-2">
                        {/* Fragment Counter */}
                        <FragmentCounter 
                            fragmentos={regenmon.stats.fragmentos} 
                            isLoggedIn={isLoggedIn} 
                        />
                        <span className="game-screen__day-label bg-black/50 px-2 py-1 inline-block">Día {daysAlive} de aventura</span>
                    </div>
                    <div className="flex gap-2 items-start">
                        {isLoggedIn && <LoginButton className="text-xs" />}
                        <MusicToggle musicEnabled={musicEnabled} onToggle={onToggleMusic} />
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

                    {/* Floating stat change feedback */}
                    {lastStatsChange && (() => {
                        const items: string[] = [];
                        const sc = lastStatsChange as Record<string, number | undefined>;
                        if (sc.espiritu && sc.espiritu !== 0) items.push(`${sc.espiritu > 0 ? '+' : ''}${sc.espiritu} 🔮`);
                        if (sc.pulso && sc.pulso !== 0) items.push(`${sc.pulso > 0 ? '+' : ''}${sc.pulso} 💛`);
                        if (sc.esencia && sc.esencia !== 0) items.push(`${sc.esencia > 0 ? '+' : ''}${sc.esencia} 🌱`);
                        if (sc.fragmentos && sc.fragmentos !== 0) items.push(`+${sc.fragmentos} 💠`);
                        return items.length > 0 ? (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce text-white text-sm font-bold bg-black/70 px-3 py-1 rounded whitespace-nowrap z-20">
                                {items.join('  ')}
                            </div>
                        ) : null;
                    })()}

                    <div className="mt-1 sm:mt-2 text-center bg-black/50 border-4 border-white/20 px-4 py-2 inline-block">
                        <NameEditor
                            currentName={regenmon.name}
                            onSave={onUpdateName}
                            canRename={!regenmon.nameChangeUsed}
                        />
                    </div>
                </div>

                {/* Bottom UI: Stats & Actions — inside an NES-style container */}
                <div className="game-screen__bottom-ui w-full px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="bg-black/60 border-4 border-white/25 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-0.5 sm:gap-1">
                            <StatBar
                                label="Espíritu"
                                subtitle="Esperanza"
                                value={regenmon.stats.espiritu}
                                color="var(--color-stat-espiritu-full)"
                                icon="🔮"
                            />
                            <StatBar
                                label="Pulso"
                                subtitle="Energía vital"
                                value={regenmon.stats.pulso}
                                color="var(--color-stat-pulso-full)"
                                icon="💛"
                            />
                            <StatBar
                                label="Esencia"
                                subtitle="Vitalidad"
                                value={regenmon.stats.esencia}
                                color="var(--color-stat-esencia-full)"
                                icon="🌱"
                            />
                        </div>

                        {/* Actions */}
                        <div className="mt-1 sm:mt-2">
                            <ActionButtons
                                onPurify={handlePurify}
                                onSettings={handleSettings}
                                onChat={toggleChat}
                                onSearchFragments={handleSearchFragments}
                                stats={regenmon.stats}
                                fragmentos={regenmon.stats.fragmentos}
                                showSearchFragments={regenmon.stats.fragmentos === 0}
                                isChatOpen={isChatOpen}
                            />
                        </div>


                        {/* Footer: Reset */}
                        <div className="flex justify-center mt-1 sm:mt-2">
                            <ResetButton onReset={onReset} />
                        </div>
                    </div>
                </div>

                {/* Chat Overlay */}
                <ErrorBoundary>
                    <ChatBox
                        isOpen={isChatOpen}
                        onClose={toggleChat}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isChatLoading}
                        regenmonType={regenmon.type}
                        regenmonName={regenmon.name}
                        stats={regenmon.stats}
                    />
                </ErrorBoundary>

            </div>
        </div>
    );
}
