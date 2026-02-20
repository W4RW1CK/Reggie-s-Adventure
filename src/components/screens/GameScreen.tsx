'use client';

import WorldBackground from '@/components/world/WorldBackground';
import FractureOverlay from '@/components/world/FractureOverlay';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';
import { getEvolutionStage } from '@/lib/evolution';
import NameEditor from '../ui/NameEditor';
import TutorialModal from '../ui/TutorialModal';
import SettingsPanel from '../settings/SettingsPanel';
import UserIdentity from '../ui/UserIdentity';
import DiarioPanel from '../panels/DiarioPanel';
import { addActivity, loadHistory, ActivityEntry } from '@/lib/activityHistory';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { RegenmonData } from '@/lib/types';
import { PURIFY_SPIRIT_COST, PURIFY_SPIRIT_GAIN, PURIFY_ESSENCE_COST, PURIFY_ESSENCE_GAIN } from '@/lib/constants';
import { ChatBox } from '../chat/ChatBox';
import { useChat } from '@/hooks/useChat';
import { useChiptuneAudio } from '@/hooks/useChiptuneAudio';
import { useMissions } from '@/hooks/useMissions';
import MissionPopup from '../missions/MissionPopup';
import { ErrorBoundary } from '../ErrorBoundary';
import PhotoFlow from '../photo/PhotoFlow';

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
    const [showPhoto, setShowPhoto] = useState(false);
    const [showDiario, setShowDiario] = useState(false);
    const [showMissionPopup, setShowMissionPopup] = useState(false);
    const [missionCelebration, setMissionCelebration] = useState(false);
    const [showSpriteInfo, setShowSpriteInfo] = useState(false);
    const [toast, setToast] = useState<{ text: string; type: 'loading' | 'success' | 'error' } | null>(null);
    const [floatingDelta, setFloatingDelta] = useState<string | null>(null);
    const [spriteAnimClass, setSpriteAnimClass] = useState('');

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

    // Track window size
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const regenmonSize = useMemo(() => {
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 480;
        const minDim = Math.min(vw, vh);
        return Math.max(100, Math.min(200, Math.round(minDim * 0.3)));
    }, [windowWidth]);

    // Tutorial check
    useEffect(() => {
        if (!regenmon.tutorialDismissed) {
            const timer = setTimeout(() => setShowTutorial(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [regenmon.tutorialDismissed]);

    const daysAlive = Math.floor(
        (Date.now() - new Date(regenmon.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

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

    // Sprite tap — show purify buttons + stats
    const handleSpriteTap = () => {
        setShowSpriteInfo(prev => !prev);
    };

    // Auto-hide sprite info after 5 seconds
    useEffect(() => {
        if (showSpriteInfo) {
            const timer = setTimeout(() => setShowSpriteInfo(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showSpriteInfo]);

    // Close sprite info when tapping elsewhere
    const handleWorldTap = (e: React.MouseEvent) => {
        if (showSpriteInfo && !(e.target as HTMLElement).closest('.sprite-tap-zone')) {
            setShowSpriteInfo(false);
        }
    };

    const handlePurifySpirit = () => {
        if (regenmon.stats.fragmentos < PURIFY_SPIRIT_COST) {
            showToast('❌ No tienes suficientes fragmentos', 'error');
            return;
        }
        if (regenmon.stats.espiritu >= 100) {
            showToast('✨ ¡Espíritu al máximo!', 'error');
            return;
        }
        showToast('❤️ Recargando…', 'loading');
        setTimeout(() => {
            onUpdateStats({ fragmentos: -PURIFY_SPIRIT_COST, espiritu: PURIFY_SPIRIT_GAIN });
            addActivity('purify', -PURIFY_SPIRIT_COST);
            showToast('✨ ¡Espíritu restaurado!', 'success');
            showFloatingDelta(`-${PURIFY_SPIRIT_COST} 🔮`);
            triggerSpriteAnim('sprite-purify-bounce');
        }, 600);
    };

    const handlePurifyEssence = () => {
        if (regenmon.stats.fragmentos < PURIFY_ESSENCE_COST) {
            showToast('❌ No tienes suficientes fragmentos', 'error');
            return;
        }
        if (regenmon.stats.esencia >= 100) {
            showToast('✨ ¡Esencia al máximo!', 'error');
            return;
        }
        showToast('💧 Nutriendo…', 'loading');
        setTimeout(() => {
            onUpdateStats({ fragmentos: -PURIFY_ESSENCE_COST, esencia: PURIFY_ESSENCE_GAIN });
            addActivity('purify', -PURIFY_ESSENCE_COST);
            showToast('✨ ¡Esencia nutrida!', 'success');
            showFloatingDelta(`-${PURIFY_ESSENCE_COST} 🔮`);
            triggerSpriteAnim('sprite-purify-bounce');
        }, 600);
    };

    const handleTutorialDismiss = (dontShowAgain: boolean) => {
        setShowTutorial(false);
        if (dontShowAgain) {
            onDismissTutorial();
        }
    };

    // Chat
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
            }
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

    // Audio
    useChiptuneAudio({
        enabled: musicEnabled,
        type: regenmon.type,
        volume: isChatOpen ? 0.6 : 1.0
    });

    const isDesktop = windowWidth >= 1025;

    return (
        <div
            className={`game-screen w-full h-screen relative overflow-hidden flex ${isDesktop && isChatOpen ? 'game-screen--chat-open' : ''}`}
            onClick={handleWorldTap}
        >
            {/* === WORLD AREA === */}
            <div className="game-screen__world-area flex-1 relative flex flex-col h-full">
                {/* Background Layer */}
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

                {/* Main Content */}
                <div className="game-screen__content relative z-10 w-full h-full flex flex-col">

                    {/* === COMPACT HUD TOP BAR === */}
                    <div className="hud-compact">
                        <div className="hud-compact__left">
                            <span className="hud-compact__fragments">🔮 {regenmon.stats.fragmentos}</span>
                            <button
                                className="hud-compact__diario-btn"
                                onClick={() => setShowDiario(true)}
                                aria-label="Abrir diario"
                            >
                                📖 Diario
                            </button>
                        </div>
                        <div className="hud-compact__right">
                            <button
                                className={`hud-compact__icon-btn ${activeMission && !activeMission.completed && !isExpired ? 'hud-compact__icon-btn--pulse' : ''}`}
                                onClick={() => setShowMissionPopup(true)}
                                aria-label={activeMission && !activeMission.completed ? 'Misión activa' : 'Sin misión'}
                            >
                                🎯
                            </button>
                            <button
                                className="hud-compact__icon-btn"
                                onClick={() => setShowSettings(true)}
                                aria-label="Configuración"
                            >
                                ⚙️
                            </button>
                        </div>
                    </div>

                    {/* === TOAST FEEDBACK === */}
                    {toast && (
                        <div className={`hud-toast ${toast.type === 'loading' ? 'hud-toast--loading' : toast.type === 'success' ? 'hud-toast--success' : 'hud-toast--error'}`}>
                            {toast.text}
                        </div>
                    )}

                    {/* === CENTER: Sprite === */}
                    <div className="hud-sprite-area flex-1 flex flex-col items-center justify-center">
                        <div
                            className={`sprite-tap-zone relative game-screen__regenmon-wrapper sprite-evolution sprite-evolution--stage-${getEvolutionStage(progress)} ${isEvolutionFrozen ? 'sprite-evolution--frozen' : ''} ${spriteAnimClass}`}
                            onClick={handleSpriteTap}
                            role="button"
                            tabIndex={0}
                            aria-label={`${regenmon.name} — toca para ver stats`}
                        >
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

                        {/* Hint text (only when sprite info is NOT showing) */}
                        {!showSpriteInfo && (
                            <div className="sprite-hint">Toca → stats / purificar</div>
                        )}

                        {/* === SPRITE TAP OVERLAY: Stats + Purify Buttons === */}
                        {showSpriteInfo && (
                            <div className="sprite-info-overlay sprite-tap-zone">
                                {/* Compact stat summary */}
                                <div className="sprite-info__stats">
                                    <span>🔮 {Math.round(regenmon.stats.espiritu)}</span>
                                    <span>💛 {Math.round(regenmon.stats.pulso)}</span>
                                    <span>✨ {Math.round(regenmon.stats.esencia)}</span>
                                </div>
                                {/* Name + Identity */}
                                <div className="sprite-info__name">
                                    <NameEditor
                                        currentName={regenmon.name}
                                        onSave={onUpdateName}
                                        canRename={!regenmon.nameChangeUsed}
                                    />
                                </div>
                                {isLoggedIn && (
                                    <div className="sprite-info__identity">
                                        <UserIdentity isLoggedIn={isLoggedIn} email={email} playerName={playerName} />
                                    </div>
                                )}
                                {/* Purify buttons */}
                                <div className="sprite-info__purify-btns">
                                    <button
                                        className="purify-btn purify-btn--spirit"
                                        onClick={(e) => { e.stopPropagation(); handlePurifySpirit(); }}
                                        disabled={regenmon.stats.fragmentos < PURIFY_SPIRIT_COST || regenmon.stats.espiritu >= 100}
                                    >
                                        ❤️ Recargar {PURIFY_SPIRIT_COST}🔮
                                    </button>
                                    <button
                                        className="purify-btn purify-btn--essence"
                                        onClick={(e) => { e.stopPropagation(); handlePurifyEssence(); }}
                                        disabled={regenmon.stats.fragmentos < PURIFY_ESSENCE_COST || regenmon.stats.esencia >= 100}
                                    >
                                        💧 Nutrir {PURIFY_ESSENCE_COST}🔮
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* === BOTTOM NAV BAR (Icon-based) === */}
                    <div className="hud-bottom-nav">
                        <button
                            className={`hud-bottom-nav__btn ${isChatOpen ? 'hud-bottom-nav__btn--active' : ''}`}
                            onClick={toggleChat}
                            aria-label="Chat"
                        >
                            <span className="hud-bottom-nav__icon">💬</span>
                            <span className="hud-bottom-nav__label">Chat</span>
                        </button>
                        <button
                            className="hud-bottom-nav__btn"
                            onClick={() => setShowPhoto(true)}
                            aria-label="Foto"
                        >
                            <span className="hud-bottom-nav__icon">📷</span>
                            <span className="hud-bottom-nav__label">Foto</span>
                        </button>
                    </div>
                </div>

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
                    onResetGame={onReset}
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

                {/* Mission Celebration */}
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

                {/* Photo Flow Overlay */}
                {showPhoto && (
                    <div className="photo-flow-overlay" style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
                        <PhotoFlow
                            regenmonType={regenmon.type}
                            regenmonName={regenmon.name}
                            stats={regenmon.stats}
                            memories={regenmon.memories}
                            lastPhotoAt={regenmon.lastPhotoAt ?? null}
                            strikes={regenmon.strikes ?? { count: 0, lastStrikeAt: null }}
                            activeMission={activeMission && !activeMission.completed && !isExpired ? activeMission : null}
                            onAddFragments={onUpdateStats}
                            onAddProgress={(amount) => onUpdateStats({ fragmentos: 0 })}
                            onAddPhotoEntry={() => {}}
                            onAddStrike={() => ({ newCount: 0, message: '' })}
                            onCompleteMission={() => { if (activeMission) { completeMission(); return 5; } return 0; }}
                            onUseMissionBypass={() => false}
                            onGoToChat={() => { setShowPhoto(false); toggleChat(); }}
                            onGoToWorld={() => setShowPhoto(false)}
                            onSetLastPhotoAt={() => {}}
                        />
                    </div>
                )}

                {/* Diario Panel */}
                <DiarioPanel
                    isOpen={showDiario}
                    onClose={() => setShowDiario(false)}
                    diaryEntries={[]}
                    activityLog={[]}
                />
            </div>

            {/* === CHAT AREA (Desktop: 30% right panel / Mobile: overlay) === */}
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
                    isDesktop={isDesktop}
                />
            </ErrorBoundary>
        </div>
    );
}
