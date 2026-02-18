'use client';

import { RegenmonType, RegenmonStats } from '@/lib/types';
import { getSpriteState } from '@/components/regenmon/RegenmonSVG';

interface GameBackgroundProps {
    type: RegenmonType;
    stats: RegenmonStats;
    theme?: 'dark' | 'light';
}

type Mood = 'good' | 'neutral' | 'bad';

function getMood(stats: RegenmonStats): Mood {
    const state = getSpriteState(stats);
    if (state === 'euphoric' || state === 'happy') return 'good';
    if (state === 'neutral') return 'neutral';
    return 'bad';
}

// ── Background image paths ──
const BG_IMAGES: Record<RegenmonType, Record<'dark' | 'light', string>> = {
    rayo:  { dark: '/backgrounds/bg-rayo-dark.png',  light: '/backgrounds/bg-rayo-light.png' },
    flama: { dark: '/backgrounds/bg-flama-dark.png', light: '/backgrounds/bg-flama-light.png' },
    hielo: { dark: '/backgrounds/bg-hielo-dark.png', light: '/backgrounds/bg-hielo-light.png' },
};

// ── CSS filter presets per mood ──
// Good = slightly brighter & more saturated
// Neutral = base image as-is
// Bad = dimmed & desaturated (not crushed)
const MOOD_FILTERS: Record<Mood, string> = {
    good:    'brightness(1.1) saturate(1.15)',
    neutral: 'brightness(1) saturate(1)',
    bad:     'brightness(0.75) saturate(0.55)',
};

// ── Subtle overlay tints ──
const MOOD_OVERLAYS: Record<'dark' | 'light', Record<Mood, string>> = {
    dark: {
        good:    'transparent',
        neutral: 'transparent',
        bad:     'rgba(0, 0, 0, 0.15)',
    },
    light: {
        good:    'transparent',
        neutral: 'transparent',
        bad:     'rgba(40, 20, 40, 0.12)',
    },
};

// ── Sparkle particle colors per type ──
const SPARKLE_COLORS: Record<RegenmonType, { bg: string; shadow: string }> = {
    rayo:  { bg: '#f5c542', shadow: '#f5c542' },
    flama: { bg: '#ff8844', shadow: '#ff6622' },
    hielo: { bg: '#a8e6ff', shadow: '#88ccff' },
};

// ── Deterministic sparkle positions ──
const SPARKLE_CONFIGS = [
    { left: '15%', bottom: '20%', dur: 3.0, twink: 1.5, delay: 0,   size: 4 },
    { left: '35%', bottom: '35%', dur: 3.5, twink: 1.2, delay: 0.5, size: 3 },
    { left: '55%', bottom: '15%', dur: 2.8, twink: 1.8, delay: 1.0, size: 5 },
    { left: '75%', bottom: '40%', dur: 3.2, twink: 1.4, delay: 0.3, size: 3 },
    { left: '25%', bottom: '50%', dur: 4.0, twink: 1.6, delay: 1.5, size: 4 },
    { left: '65%', bottom: '25%', dur: 3.8, twink: 1.3, delay: 0.8, size: 3 },
    { left: '85%', bottom: '30%', dur: 3.3, twink: 2.0, delay: 2.0, size: 4 },
    { left: '45%', bottom: '45%', dur: 2.5, twink: 1.1, delay: 1.2, size: 5 },
];

// ── Aria labels ──
const ARIA_LABELS: Record<RegenmonType, string> = {
    rayo:  'Llanura Eléctrica',
    flama: 'Volcán Ardiente',
    hielo: 'Montaña Nevada',
};
const MOOD_ARIA: Record<Mood, string> = {
    good:    'Ambiente brillante y despejado',
    neutral: 'Ambiente neutral',
    bad:     'Tormenta oscura y opresiva',
};

export default function GameBackground({ type, stats, theme = 'dark' }: GameBackgroundProps) {
    const mood = getMood(stats);
    const bgImage = BG_IMAGES[type][theme];
    const filter = MOOD_FILTERS[mood];
    const overlayColor = MOOD_OVERLAYS[theme][mood];
    const sparkle = SPARKLE_COLORS[type];
    const showParticles = mood === 'good';

    return (
        <div
            className="game-background"
            aria-label={`Paisaje: ${ARIA_LABELS[type]} — ${MOOD_ARIA[mood]}`}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                minHeight: '100%',
                zIndex: 0,
                overflow: 'hidden',
            }}
        >
            {/* Pixel art background image */}
            <div
                className="game-background__image"
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated',
                    filter,
                    transition: 'filter 1.5s ease-in-out',
                }}
            />

            {/* Mood atmosphere overlay */}
            {overlayColor !== 'transparent' && (
                <div
                    className="game-background__mood-overlay"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: overlayColor,
                        transition: 'background-color 1.5s ease-in-out',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Colored light streaks — good mood only */}
            {showParticles && (
                <div className="game-background__streaks" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                        {type === 'rayo' && <RayoStreaks />}
                        {type === 'flama' && <FlamaStreaks />}
                        {type === 'hielo' && <HieloStreaks />}
                    </svg>
                </div>
            )}

            {/* Sparkle particles — good mood only */}
            {showParticles && (
                <div className="game-background__particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {SPARKLE_CONFIGS.map((s, i) => (
                        <div
                            key={i}
                            className="game-background__spark"
                            style={{
                                position: 'absolute',
                                left: s.left,
                                bottom: s.bottom,
                                width: s.size,
                                height: s.size,
                                borderRadius: '50%',
                                background: sparkle.bg,
                                boxShadow: `0 0 4px ${sparkle.shadow}`,
                                animation: `sparkle-float ${s.dur}s linear ${s.delay}s infinite, sparkle-twinkle ${s.twink}s ease-in-out ${s.delay}s infinite`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Scanlines (retro CRT effect) */}
            <div className="game-background__scanlines" />
        </div>
    );
}

// ════════════════════════════════════════
// Light streaks — SVG overlays for good mood
// ════════════════════════════════════════

function RayoStreaks() {
    return (
        <g opacity="0.4">
            {/* Electric currents across the sky */}
            <path d="M50 90 L55 95 L48 100 L56 105" stroke="#f5c542" strokeWidth="1.2" fill="none">
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M300 80 L305 88 L298 93 L306 98" stroke="#f5c542" strokeWidth="1.2" fill="none">
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
            </path>
            <path d="M180 60 L186 68 L178 74 L188 80" stroke="#fff7a1" strokeWidth="0.8" fill="none">
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
            </path>
            {/* Horizontal energy waves */}
            <path d="M0 120 Q100 110 200 125 Q300 115 400 120" stroke="#f5c542" strokeWidth="0.6" fill="none" opacity="0.25">
                <animate attributeName="d" values="M0 120 Q100 110 200 125 Q300 115 400 120;M0 125 Q100 120 200 115 Q300 125 400 118;M0 120 Q100 110 200 125 Q300 115 400 120" dur="6s" repeatCount="indefinite" />
            </path>
            <path d="M0 140 Q80 132 180 142 Q280 130 400 138" stroke="#ffe066" strokeWidth="0.5" fill="none" opacity="0.2">
                <animate attributeName="d" values="M0 140 Q80 132 180 142 Q280 130 400 138;M0 136 Q80 142 180 134 Q280 142 400 135;M0 140 Q80 132 180 142 Q280 130 400 138" dur="8s" repeatCount="indefinite" />
            </path>
        </g>
    );
}

function FlamaStreaks() {
    return (
        <g opacity="0.35">
            {/* Heat shimmer waves */}
            <path d="M0 80 Q100 70 200 85 Q300 72 400 80" stroke="#ff8844" strokeWidth="0.8" fill="none" opacity="0.3">
                <animate attributeName="d" values="M0 80 Q100 70 200 85 Q300 72 400 80;M0 85 Q100 80 200 72 Q300 82 400 76;M0 80 Q100 70 200 85 Q300 72 400 80" dur="5s" repeatCount="indefinite" />
            </path>
            <path d="M0 100 Q120 90 240 105 Q340 92 400 100" stroke="#ffaa44" strokeWidth="0.6" fill="none" opacity="0.25">
                <animate attributeName="d" values="M0 100 Q120 90 240 105 Q340 92 400 100;M0 105 Q120 100 240 92 Q340 102 400 96;M0 100 Q120 90 240 105 Q340 92 400 100" dur="7s" repeatCount="indefinite" />
            </path>
            {/* Rising ember trails */}
            <path d="M180 200 Q185 160 190 120 Q192 90 188 60" stroke="#ff6622" strokeWidth="0.8" fill="none" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M220 210 Q225 170 218 130 Q215 100 222 70" stroke="#ffcc44" strokeWidth="0.6" fill="none" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.05;0.2" dur="4s" repeatCount="indefinite" />
            </path>
        </g>
    );
}

function HieloStreaks() {
    return (
        <g opacity="0.35">
            {/* Aurora borealis */}
            <path d="M0 40 Q100 20 200 50 Q300 30 400 45" stroke="#00ff88" strokeWidth="8" fill="none" opacity="0.3">
                <animate attributeName="d" values="M0 40 Q100 20 200 50 Q300 30 400 45;M0 50 Q100 30 200 40 Q300 50 400 35;M0 40 Q100 20 200 50 Q300 30 400 45" dur="8s" repeatCount="indefinite" />
            </path>
            <path d="M0 55 Q120 35 220 60 Q320 40 400 55" stroke="#8844ff" strokeWidth="6" fill="none" opacity="0.25">
                <animate attributeName="d" values="M0 55 Q120 35 220 60 Q320 40 400 55;M0 60 Q120 50 220 45 Q320 60 400 50;M0 55 Q120 35 220 60 Q320 40 400 55" dur="10s" repeatCount="indefinite" />
            </path>
            <path d="M50 30 Q150 50 250 35 Q350 55 400 40" stroke="#00ccff" strokeWidth="4" fill="none" opacity="0.2">
                <animate attributeName="d" values="M50 30 Q150 50 250 35 Q350 55 400 40;M50 45 Q150 30 250 50 Q350 35 400 50;M50 30 Q150 50 250 35 Q350 55 400 40" dur="12s" repeatCount="indefinite" />
            </path>
        </g>
    );
}
