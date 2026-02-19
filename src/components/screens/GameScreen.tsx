'use client';

import GameBackground from '@/components/game/GameBackground';
import WorldBackground from '@/components/world/WorldBackground';
import FractureOverlay from '@/components/world/FractureOverlay';
import FractureDots from '@/components/world/FractureDots';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';
import { getEvolutionStage } from '@/lib/evolution';
import NameEditor from '../ui/NameEditor';
import TutorialModal from '../ui/TutorialModal';
import SettingsPanel from '../settings/SettingsPanel';
import UserIdentity from '../ui/UserIdentity';
import ActivityHistory from '../ui/ActivityHistory';
import { addActivity, loadHistory, clearHistory, ActivityEntry } from '@/lib/activityHistory';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { RegenmonData } from '@/lib/types';
import { PURIFY_COST, SEARCH_FRAGMENTS_REWARD } from '@/lib/constants';
import { ChatBox } from '../chat/ChatBox';
import { useChat } from '@/hooks/useChat';
import { useChiptuneAudio } from '@/hooks/useChiptuneAudio';
import { useMissions } from '@/hooks/useMissions';
import MissionPopup from '../missions/MissionPopup';
import { ErrorBoundary } from '../ErrorBoundary';

interface GameScreenProps {
    regenmon: RegenmonData;
    musicEnabled: boolean;
    onToggleMusic: () => void;
    onUpdateStats: (deltas: Partial<import('@/lib/types').RegenmonStats>) => void;
    onUpdateName: (newName: string) => void;
    onDismissTutorial: () => void;
    onReset: () => void;
    isLoggedIn?: boolean;
    email?: string;
    playerName?: string;
    progress?: number;
    newFractureJustClosed?: boolean;
    onClearNewFracture?: () => void;
    isEvolutionFrozen?: boolean;
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
    email,
    playerName,
    progress = 0,
    newFractureJustClosed = false,
    onClearNewFracture,
    isEvolutionFrozen = false,
}: GameScreenProps) {
    const [showTutorial, setShowTutorial] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showMissionPopup, setShowMissionPopup] = useState(false);
    const [missionCelebration, setMissionCelebration] = useState(false);
    const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([]);
    const [toast, setToast] = useState<{ text: string; type: 'loading' | 'success' | 'error' } | null>(null);
    const [floatingDelta, setFloatingDelta] = useState<string | null>(null);
    const [spriteAnimClass, setSpriteAnimClass] = useState('');

    // Load activity history on mount
    useEffect(() => {
        setActivityEntries(loadHistory());
    }, []);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 480);
    const { theme, toggleTheme } = useTheme();
    const { login, logout } = useAuth();
    const { isFullscreen, isSupported: isFullscreenSupported, toggleFullscreen } = useFullscreen();
    const [effectsEnabled, setEffectsEnabled] = useState(true);

    // Missions
    const {
        activeMission,
        generateMission,
        completeMission,
        abandonMission,
        isExpired,
    } = useMissions({ regenmonType: regenmon.type, memories: regenmon.memories });

    // Track window size for responsive SVG
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const regenmonSize = useMemo(() => {
        // Use the smaller of width/height to keep sprite square and proportional
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 480;
        const minDim = Math.min(vw, vh);
        // Sprite = ~30% of smaller dimension, clamped between 100-200px
        return Math.max(100, Math.min(200, Math.round(minDim * 0.3)));
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

    const allStatsFull = regenmon.stats.esencia >= 100 && regenmon.stats.espiritu >= 100 && regenmon.stats.pulso >= 100;
    const canPurifyBtn = regenmon.stats.fragmentos >= PURIFY_COST && !allStatsFull;

    const showFloatingDelta = useCallback((text: string) => {
        setFloatingDelta(text);
        setTimeout(() => setFloatingDelta(null), 1500);
    }, []);

    const triggerSpriteAnim = useCallback((cls: string) => {
        setSpriteAnimClass(cls);
        setTimeout(() => setSpriteAnimClass(''), 700);
    }, []);

    const showToast = (text: string, type: 'loading' | 'success' | 'error') => {
        setToast({ text, type });
        if (type !== 'loading') {
            setTimeout(() => setToast(null), 2000);
        }
    };

    const handlePurify = () => {
        if (regenmon.stats.fragmentos < PURIFY_COST) {
            showToast('❌ No tienes suficientes fragmentos', 'error');
            return;
        }
        if (regenmon.stats.esencia >= 100 && regenmon.stats.espiritu >= 100 && regenmon.stats.pulso >= 100) {
            showToast('✨ ¡Ya estás al máximo!', 'error');
            return;
        }
        
        showToast('🔮 Purificando…', 'loading');
        setTimeout(() => {
            onUpdateStats({ 
                fragmentos: -PURIFY_COST,
                esencia: 30,
                espiritu: 5,
                pulso: 10
            });
            addActivity('purify', -PURIFY_COST);
            setActivityEntries(loadHistory());
            showToast('✨ ¡Me siento renovado! Energía restaurada.', 'success');
            showFloatingDelta(`-${PURIFY_COST} 💎`);
            triggerSpriteAnim('sprite-purify-bounce');
        }, 600);
    };

    const handleSearchFragments = () => {
        if (regenmon.stats.fragmentos > 0) {
            return;
        }
        
        showToast('🔍 Buscando fragmentos…', 'loading');
        setTimeout(() => {
            onUpdateStats({ fragmentos: SEARCH_FRAGMENTS_REWARD });
            addActivity('search_fragments', SEARCH_FRAGMENTS_REWARD);
            setActivityEntries(loadHistory());
            showToast(`💎 ¡Encontraste ${SEARCH_FRAGMENTS_REWARD} fragmentos!`, 'success');
            showFloatingDelta(`+${SEARCH_FRAGMENTS_REWARD} 💎`);
        }, 800);
    };

    const handleSettings = () => {
        setShowSettings(true);
    };

    const handleMissionClick = () => {
        setShowMissionPopup(true);
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
        lastStatsChange,
        memoryCount
    } = useChat({
        regenmon,
        updateStatAction: onUpdateStats
    });

    // Log chat activity + show floating delta when stats change from chat
    useEffect(() => {
        if (lastStatsChange && isChatOpen) {
            const sc = lastStatsChange as Record<string, number | undefined>;
            const fragChange = sc.fragmentos ?? 0;
            if (fragChange !== 0) {
                addActivity('chat', fragChange);
                setActivityEntries(loadHistory());
            }
            // Build floating delta text from all changes
            const parts: string[] = [];
            if (sc.espiritu && sc.espiritu !== 0) parts.push(`${sc.espiritu > 0 ? '+' : ''}${sc.espiritu} 🔮`);
            if (sc.pulso && sc.pulso !== 0) parts.push(`${sc.pulso > 0 ? '+' : ''}${sc.pulso} 💛`);
            if (sc.esencia && sc.esencia !== 0) parts.push(`${sc.esencia > 0 ? '+' : ''}${sc.esencia} ✨`);
            if (sc.fragmentos && sc.fragmentos !== 0) parts.push(`${sc.fragmentos > 0 ? '+' : ''}${sc.fragmentos} 💎`);
            if (parts.length > 0) showFloatingDelta(parts.join('  '));
            triggerSpriteAnim('sprite-chat-pulse');
        }
    }, [lastStatsChange, isChatOpen, showFloatingDelta, triggerSpriteAnim]);

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
            {/* Background Layer — evolution-aware */}
            <WorldBackground type={regenmon.type} stats={regenmon.stats} progress={progress} theme={theme} />

            {/* Fracture Overlay */}
            <div className={newFractureJustClosed ? 'fracture-new-effect' : ''}>
                <FractureOverlay
                    progress={progress}
                    newFractureJustClosed={newFractureJustClosed}
                    onFractureAnimationComplete={onClearNewFracture || (() => {})}
                />
            </div>

            {/* Tutorial Modal */}
            {showTutorial && (
                <TutorialModal onDismiss={handleTutorialDismiss} />
            )}

            {/* Main Content Layer */}
            <div className="game-screen__content relative z-10 w-full h-full flex flex-col">

                {/* === TOP BAR (HUD) === */}
                <div className="hud-top-bar">
                    <div className="hud-day-section">Día {daysAlive}</div>
                    <div className="hud-stats-row">
                        <div className="hud-stat">
                            <span className="hud-stat-icon">🔮</span>
                            <div className="hud-stat-bar-bg">
                                <div className="hud-stat-bar" style={{ width: `${Math.min(regenmon.stats.espiritu, 100)}%`, backgroundColor: 'var(--color-stat-espiritu-full)' }} />
                            </div>
                            <span className="hud-stat-val">{Math.round(regenmon.stats.espiritu)}</span>
                        </div>
                        <div className="hud-stat">
                            <span className="hud-stat-icon">💛</span>
                            <div className="hud-stat-bar-bg">
                                <div className="hud-stat-bar" style={{ width: `${Math.min(regenmon.stats.pulso, 100)}%`, backgroundColor: 'var(--color-stat-pulso-full)' }} />
                            </div>
                            <span className="hud-stat-val">{Math.round(regenmon.stats.pulso)}</span>
                        </div>
                        <div className="hud-stat">
                            <span className="hud-stat-icon">✨</span>
                            <div className="hud-stat-bar-bg">
                                <div className="hud-stat-bar" style={{ width: `${Math.min(regenmon.stats.esencia, 100)}%`, backgroundColor: 'var(--color-stat-esencia-full)' }} />
                            </div>
                            <span className="hud-stat-val">{Math.round(regenmon.stats.esencia)}</span>
                        </div>
                        <div className="hud-fragments">💎 {isLoggedIn ? regenmon.stats.fragmentos : '---'}</div>
                        {isLoggedIn && memoryCount > 0 && (
                            <div className="hud-memories">🧠 {memoryCount}</div>
                        )}
                    </div>
                    <button
                        className={`hud-mission-btn ${activeMission && !activeMission.completed && !isExpired ? 'hud-mission-btn--active' : ''}`}
                        onClick={handleMissionClick}
                        aria-label={activeMission && !activeMission.completed ? 'Misión activa' : 'Sin misión'}
                    >
                        🎯
                    </button>
                    <button className="hud-config-btn" onClick={handleSettings}>⚙️</button>
                </div>

                {/* === TOAST FEEDBACK === */}
                {toast && (
                    <div className={`hud-toast ${toast.type === 'loading' ? 'hud-toast--loading' : toast.type === 'success' ? 'hud-toast--success' : 'hud-toast--error'}`}>
                        {toast.text}
                    </div>
                )}

                {/* === CENTER: Sprite === */}
                <div className="hud-sprite-area flex-1 flex flex-col items-center justify-center">
                    <div className={`relative game-screen__regenmon-wrapper sprite-evolution sprite-evolution--stage-${getEvolutionStage(progress)} ${isEvolutionFrozen ? 'sprite-evolution--frozen' : ''} ${spriteAnimClass}`}>
                        <RegenmonSVG
                            type={regenmon.type}
                            stats={regenmon.stats}
                            size={regenmonSize}
                        />
                        {/* Stage particles (stages 3+) */}
                        {!isEvolutionFrozen && getEvolutionStage(progress) >= 3 && (
                            <div className="sprite-evolution__particles">
                                {[...Array(Math.min(getEvolutionStage(progress) - 2, 4))].map((_, i) => (
                                    <span
                                        key={i}
                                        className="sprite-evolution__particle"
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            '--orbit-radius': `${35 + i * 8}px`,
                                            animationDelay: `${i * 0.8}s`,
                                            animationDuration: `${3 + i * 0.5}s`,
                                        } as React.CSSProperties}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Floating stat change delta */}
                    {floatingDelta && (
                        <div className="hud-floating-delta">
                            {floatingDelta}
                        </div>
                    )}

                    <div className="mt-1 sm:mt-2 text-center">
                        <NameEditor
                            currentName={regenmon.name}
                            onSave={onUpdateName}
                            canRename={!regenmon.nameChangeUsed}
                        />
                    </div>

                    {/* User Identity (small, below name) */}
                    <div className="mt-1 opacity-70">
                        <UserIdentity isLoggedIn={isLoggedIn} email={email} playerName={playerName} />
                    </div>
                </div>

                {/* === BOTTOM BAR (HUD) === */}
                <div className="hud-bottom-bar">
                    <button
                        className={`hud-action-btn hud-btn-purificar ${!canPurifyBtn ? 'hud-btn-disabled' : ''}`}
                        onClick={handlePurify}
                        disabled={!canPurifyBtn}
                    >
                        🔮 PURIFICAR ({PURIFY_COST}💎)
                    </button>
                    <button
                        className={`hud-action-btn ${isChatOpen ? 'hud-btn-close' : 'hud-btn-conversar'}`}
                        onClick={toggleChat}
                    >
                        {isChatOpen ? '✕ CERRAR' : '💬 CONVERSAR'}
                    </button>
                    {regenmon.stats.fragmentos === 0 && (
                        <button
                            className="hud-action-btn hud-btn-search"
                            onClick={handleSearchFragments}
                        >
                            🔍 BUSCAR (+15💎)
                        </button>
                    )}
                    {/* History toggle button — right side */}
                    {!isChatOpen && activityEntries.length > 0 && (
                        <button
                            className={`hud-history-btn ${showHistory ? 'hud-history-btn--active' : ''}`}
                            onClick={() => setShowHistory(!showHistory)}
                            title="Historial"
                        >
                            📜
                        </button>
                    )}
                </div>

                {/* Activity History (overlay above bottom bar) */}
                {showHistory && !isChatOpen && activityEntries.length > 0 && (
                    <div className="hud-activity-overlay">
                        <ActivityHistory entries={activityEntries} isVisible={true} defaultExpanded={true} />
                    </div>
                )}

                {/* Settings Panel */}
                <SettingsPanel
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                    isFullscreen={isFullscreen}
                    isFullscreenSupported={isFullscreenSupported}
                    onToggleFullscreen={toggleFullscreen}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    musicEnabled={musicEnabled}
                    onToggleMusic={onToggleMusic}
                    effectsEnabled={effectsEnabled}
                    onToggleEffects={() => setEffectsEnabled(prev => !prev)}
                    onRestartTutorial={() => { setShowSettings(false); setShowTutorial(true); }}
                />

                {/* Mission Popup */}
                <MissionPopup
                    isOpen={showMissionPopup}
                    onClose={() => setShowMissionPopup(false)}
                    activeMission={isExpired ? null : activeMission}
                    regenmonType={regenmon.type}
                    onActivateNew={generateMission}
                    onAbandon={abandonMission}
                />

                {/* Mission Completion Celebration */}
                {missionCelebration && (
                    <div className="mission-celebration" aria-hidden="true">
                        {[...Array(12)].map((_, i) => (
                            <span
                                key={i}
                                className="mission-celebration__sparkle"
                                style={{
                                    left: `${10 + Math.random() * 80}%`,
                                    animationDelay: `${Math.random() * 0.5}s`,
                                    animationDuration: `${0.8 + Math.random() * 0.6}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

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
