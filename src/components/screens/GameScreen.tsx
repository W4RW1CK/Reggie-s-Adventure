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
import RegisterHub from '../social/RegisterHub';

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
    const [showSocial, setShowSocial] = useState(false);
    const [rightPanel, setRightPanel] = useState<'chat' | 'photo' | 'social'>('chat');
    const [showDiario, setShowDiario] = useState(false);
    const [showMissionPopup, setShowMissionPopup] = useState(false);
    const [missionCelebration, setMissionCelebration] = useState(false);
    // showSpriteInfo removed — stats are always visible now
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

    // No-op world tap (stats are always visible now)
    const handleWorldTap = (_e: React.MouseEvent) => {};

    const handlePurifySpirit = () => {
        if (regenmon.stats.fragmentos < PURIFY_SPIRIT_COST) {
            showToast('❌ No tienes suficientes fragmentos', 'error');
            return;
        }
        if (regenmon.stats.pulso >= 100) {
            showToast('✨ ¡Pulso al máximo!', 'error');
            return;
        }
        showToast('❤️ Recargando…', 'loading');
        setTimeout(() => {
            onUpdateStats({ fragmentos: -PURIFY_SPIRIT_COST, pulso: PURIFY_SPIRIT_GAIN });
            addActivity('purify', -PURIFY_SPIRIT_COST);
            showToast('✨ ¡Pulso restaurado!', 'success');
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
            if (sc.esencia && sc.esencia !== 0) parts.push(`${sc.esencia > 0 ? '+' : ''}${sc.esencia} 🌱`);
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

    // Auto-open chat on desktop
    useEffect(() => {
        if (isDesktop && !isChatOpen) {
            toggleChat();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only on mount

    // Radio-button toggle: always one of chat/photo active
    const handleSwitchToChat = () => {
        setShowPhoto(false);
        setShowSocial(false);
        if (!isChatOpen) toggleChat();
        setRightPanel('chat');
    };

    const handleSwitchToPhoto = () => {
        if (isChatOpen) toggleChat();
        setShowPhoto(true);
        setShowSocial(false);
        setRightPanel('photo');
    };

    const handleSwitchToSocial = () => {
        if (isChatOpen) toggleChat();
        setShowPhoto(false);
        setShowSocial(true);
        setRightPanel('social');
    };

    return (
        <div
            className={`game-screen w-full h-screen relative overflow-hidden flex ${isDesktop ? 'game-screen--desktop-split' : ''}`}
            onClick={handleWorldTap}
        >
            {/* === COMPACT HUD TOP BAR (100vw, above everything) === */}
            <div className="hud-compact">
                <div className="hud-compact__left">
                    <span className="hud-compact__fragments">💎 {regenmon.stats.fragmentos}</span>
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

            {/* === WORLD AREA === */}
            <div className="game-screen__world-area relative flex flex-col h-full">
                {/* Background Layer */}
                <WorldBackground type={regenmon.type} stats={regenmon.stats} progress={progress} theme={theme} />

                {/* Fracture Overlay */}
                <div className={newFractureJustClosed ? 'fracture-new-effect' : ''}>
                    <FractureOverlay
                        progress={progress}
                        newFractureJustClosed={newFractureJustClosed}
                        onFractureAnimationComplete={onClearNewFracture || (() => {})}
                        statsAvg={(regenmon.stats.espiritu + regenmon.stats.pulso + regenmon.stats.esencia) / 3}
                    />
                </div>

                {/* Tutorial Modal */}
                {showTutorial && (
                    <TutorialModal onDismiss={handleTutorialDismiss} />
                )}

                {/* Main Content */}
                <div className="game-screen__content relative z-10 w-full h-full flex flex-col">

                    {/* === TOAST FEEDBACK === */}
                    {toast && (
                        <div className={`hud-toast ${toast.type === 'loading' ? 'hud-toast--loading' : toast.type === 'success' ? 'hud-toast--success' : 'hud-toast--error'}`}>
                            {toast.text}
                        </div>
                    )}

                    {/* === CENTER: Sprite === */}
                    <div className="hud-sprite-area flex-1 flex flex-col items-center justify-center">
                        <div
                            className={`relative game-screen__regenmon-wrapper sprite-evolution sprite-evolution--stage-${Math.min(5, Math.max(1, Math.round(1 + ((regenmon.stats.espiritu + regenmon.stats.pulso + regenmon.stats.esencia) / 3) / 25)))} ${isEvolutionFrozen ? 'sprite-evolution--frozen' : ''} ${spriteAnimClass}`}
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

                        {/* === ALWAYS-VISIBLE STATS + PURIFY BUTTONS === */}
                        <div className="sprite-stats-fixed">
                            {/* Compact stat bars */}
                            <div className="sprite-stats-fixed__bars">
                                <div className="sprite-stats-fixed__bar">
                                    <span className="sprite-stats-fixed__label">🔮</span>
                                    <div className="sprite-stats-fixed__track sprite-stats-fixed__track--espiritu">
                                        <div className="sprite-stats-fixed__fill sprite-stats-fixed__fill--espiritu" style={{ width: `${Math.round(regenmon.stats.espiritu)}%` }} />
                                    </div>
                                    <span className="sprite-stats-fixed__val">{Math.round(regenmon.stats.espiritu)}</span>
                                </div>
                                <div className="sprite-stats-fixed__bar">
                                    <span className="sprite-stats-fixed__label">💛</span>
                                    <div className="sprite-stats-fixed__track sprite-stats-fixed__track--pulso">
                                        <div className="sprite-stats-fixed__fill sprite-stats-fixed__fill--pulso" style={{ width: `${Math.round(regenmon.stats.pulso)}%` }} />
                                    </div>
                                    <span className="sprite-stats-fixed__val">{Math.round(regenmon.stats.pulso)}</span>
                                </div>
                                <div className="sprite-stats-fixed__bar">
                                    <span className="sprite-stats-fixed__label">🌱</span>
                                    <div className="sprite-stats-fixed__track sprite-stats-fixed__track--esencia">
                                        <div className="sprite-stats-fixed__fill sprite-stats-fixed__fill--esencia" style={{ width: `${Math.round(regenmon.stats.esencia)}%` }} />
                                    </div>
                                    <span className="sprite-stats-fixed__val">{Math.round(regenmon.stats.esencia)}</span>
                                </div>
                            </div>
                            {/* Purify buttons */}
                            <div className="sprite-stats-fixed__purify-btns">
                                <button
                                    className="purify-btn purify-btn--spirit"
                                    onClick={(e) => { e.stopPropagation(); handlePurifySpirit(); }}
                                    disabled={regenmon.stats.fragmentos < PURIFY_SPIRIT_COST || regenmon.stats.pulso >= 100}
                                >
                                    💛 Recargar {PURIFY_SPIRIT_COST}💎
                                </button>
                                <button
                                    className="purify-btn purify-btn--essence"
                                    onClick={(e) => { e.stopPropagation(); handlePurifyEssence(); }}
                                    disabled={regenmon.stats.fragmentos < PURIFY_ESSENCE_COST || regenmon.stats.esencia >= 100}
                                >
                                    🌱 Nutrir {PURIFY_ESSENCE_COST}💎
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* === BOTTOM NAV BAR (Icon-based) === */}
                    <div className="hud-bottom-nav">
                        <button
                            className={`hud-bottom-nav__btn ${rightPanel === 'chat' ? 'hud-bottom-nav__btn--active' : ''}`}
                            onClick={handleSwitchToChat}
                            aria-label="Chat"
                        >
                            <span className="hud-bottom-nav__icon">💬</span>
                            <span className="hud-bottom-nav__label">Chat</span>
                        </button>
                        <button
                            className={`hud-bottom-nav__btn ${rightPanel === 'photo' ? 'hud-bottom-nav__btn--active' : ''}`}
                            onClick={handleSwitchToPhoto}
                            aria-label="Foto"
                        >
                            <span className="hud-bottom-nav__icon">📷</span>
                            <span className="hud-bottom-nav__label">Foto</span>
                        </button>
                        <button
                            className={`hud-bottom-nav__btn ${rightPanel === 'social' ? 'hud-bottom-nav__btn--active' : ''}`}
                            onClick={handleSwitchToSocial}
                            aria-label="Social"
                        >
                            <span className="hud-bottom-nav__icon">🌍</span>
                            <span className="hud-bottom-nav__label">Social</span>
                        </button>
                    </div>
                </div>

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

                {/* Social Overlay (mobile only) */}
                {showSocial && !isDesktop && (
                    <div className="social-flow-overlay photoflow-enter" style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
                        <RegisterHub onClose={handleSwitchToChat} />
                    </div>
                )}

                {/* Photo Flow Overlay (mobile only) */}
                {showPhoto && !isDesktop && (
                    <div className="photo-flow-overlay photoflow-enter" style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
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
                            onGoToChat={() => handleSwitchToChat()}
                            onGoToWorld={() => handleSwitchToChat()}
                            onSetLastPhotoAt={() => {}}
                        />
                    </div>
                )}

            </div>

            {/* === RIGHT PANEL (Desktop: always 30% / Mobile: overlay for chat) === */}
            {isDesktop && (
                <div className="game-screen__right-panel">
                    {rightPanel === 'chat' && (
                        <ErrorBoundary>
                            <ChatBox
                                isOpen={isChatOpen}
                                onClose={handleSwitchToChat}
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                isLoading={isChatLoading}
                                regenmonType={regenmon.type}
                                regenmonName={regenmon.name}
                                stats={regenmon.stats}
                                isDesktop={isDesktop}
                                onPhotoClick={handleSwitchToPhoto}
                            />
                        </ErrorBoundary>
                    )}
                    {rightPanel === 'social' && showSocial && (
                        <RegisterHub onClose={handleSwitchToChat} />
                    )}
                    {rightPanel === 'photo' && showPhoto && (
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
                            onGoToChat={() => handleSwitchToChat()}
                            onGoToWorld={() => handleSwitchToChat()}
                            onSetLastPhotoAt={() => {}}
                        />
                    )}
                </div>
            )}
            {/* Mobile: chat overlay */}
            {!isDesktop && (
                <ErrorBoundary>
                    <ChatBox
                        isOpen={isChatOpen}
                        onClose={handleSwitchToChat}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isChatLoading}
                        regenmonType={regenmon.type}
                        regenmonName={regenmon.name}
                        stats={regenmon.stats}
                        isDesktop={false}
                        onPhotoClick={handleSwitchToPhoto}
                    />
                </ErrorBoundary>
            )}

            {/* === MODALS (viewport-level, outside world-area) === */}
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
            <MissionPopup
                isOpen={showMissionPopup}
                onClose={() => setShowMissionPopup(false)}
                activeMission={isExpired ? null : activeMission}
                regenmonType={regenmon.type}
                onActivateNew={generateMission}
                onAbandon={abandonMission}
            />
            <DiarioPanel
                isOpen={showDiario}
                onClose={() => setShowDiario(false)}
                diaryEntries={[]}
                activityLog={[]}
            />
        </div>
    );
}
