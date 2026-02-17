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

// ── Color palettes ──
const PALETTES = {
    rayo: {
        dark: {
            good:    { top: '#1a1a3e', mid: '#2a2a55', bottom: '#3a3a60', ground: '#2a3a20', groundEdge: '#1a2a10' },
            neutral: { top: '#151530', mid: '#252540', bottom: '#303050', ground: '#222e18', groundEdge: '#1a2210' },
            bad:     { top: '#0a0a1a', mid: '#151525', bottom: '#1a1a28', ground: '#181e12', groundEdge: '#10150a' },
        },
        light: {
            good:    { top: '#87CEEB', mid: '#a8d8f0', bottom: '#c8e8f5', ground: '#90c870', groundEdge: '#70a850' },
            neutral: { top: '#7ab8d9', mid: '#99c8e0', bottom: '#b8d8ea', ground: '#80b060', groundEdge: '#609840' },
            bad:     { top: '#607088', mid: '#788898', bottom: '#8898a8', ground: '#607050', groundEdge: '#506040' },
        },
    },
    flama: {
        dark: {
            good:    { top: '#3d1500', mid: '#602500', bottom: '#803500', ground: '#4a2000', groundEdge: '#301200' },
            neutral: { top: '#2d1000', mid: '#4a1a00', bottom: '#602200', ground: '#3a1800', groundEdge: '#280e00' },
            bad:     { top: '#1a0500', mid: '#300a00', bottom: '#4a1000', ground: '#2a0a00', groundEdge: '#1a0500' },
        },
        light: {
            good:    { top: '#ffd4a8', mid: '#ffe0c0', bottom: '#ffecda', ground: '#d4a060', groundEdge: '#c08840' },
            neutral: { top: '#e8c090', mid: '#f0d0a8', bottom: '#f5dcc0', ground: '#c09050', groundEdge: '#a87838' },
            bad:     { top: '#b08070', mid: '#c09080', bottom: '#d0a090', ground: '#907060', groundEdge: '#806050' },
        },
    },
    hielo: {
        dark: {
            good:    { top: '#0a1628', mid: '#152540', bottom: '#1e3555', ground: '#1a2e48', groundEdge: '#0e1e30' },
            neutral: { top: '#081020', mid: '#101e35', bottom: '#182a48', ground: '#14253a', groundEdge: '#0c1828' },
            bad:     { top: '#040810', mid: '#0a1018', bottom: '#0e1820', ground: '#0c1420', groundEdge: '#060c14' },
        },
        light: {
            good:    { top: '#c0e8ff', mid: '#d8f0ff', bottom: '#e8f8ff', ground: '#e0f0ff', groundEdge: '#c8e0f0' },
            neutral: { top: '#a8d8f0', mid: '#c0e0f5', bottom: '#d0eaf8', ground: '#c8e0f0', groundEdge: '#b0d0e5' },
            bad:     { top: '#8098a8', mid: '#90a8b8', bottom: '#a0b8c8', ground: '#90a0b0', groundEdge: '#8090a0' },
        },
    },
};

export default function GameBackground({ type, stats, theme = 'dark' }: GameBackgroundProps) {
    const mood = getMood(stats);
    const p = PALETTES[type][theme][mood];

    return (
        <div
            className="game-background"
            aria-label={`Paisaje: ${type === 'rayo' ? 'Llanura Eléctrica' : type === 'flama' ? 'Volcán Ardiente' : 'Montaña Nevada'} — ${mood === 'good' ? 'Ambiente brillante y despejado' : mood === 'bad' ? 'Tormenta oscura y opresiva' : 'Ambiente neutral'}`}
            style={{
                background: `linear-gradient(to bottom, ${p.top} 0%, ${p.mid} 45%, ${p.bottom} 70%, ${p.ground} 85%, ${p.groundEdge} 100%)`,
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                minHeight: '100%',
                zIndex: 0,
                overflow: 'hidden',
            }}
        >
            <div className="game-background__scanlines" />
            {type === 'rayo' && <BackgroundRayo mood={mood} theme={theme} palette={p} />}
            {type === 'flama' && <BackgroundFlama mood={mood} theme={theme} palette={p} />}
            {type === 'hielo' && <BackgroundHielo mood={mood} theme={theme} palette={p} />}
        </div>
    );
}

type Palette = { top: string; mid: string; bottom: string; ground: string; groundEdge: string };
interface BgProps { mood: Mood; theme: 'dark' | 'light'; palette: Palette }

// ════════════════════════════════════════
// RAYO — Llanura Eléctrica
// ════════════════════════════════════════
function BackgroundRayo({ mood, theme, palette }: BgProps) {
    const isDark = theme === 'dark';
    const mountainColor = isDark ? '#1a1a30' : '#6a8a5a';
    const mountainColorFar = isDark ? '#12122a' : '#88aa78';
    const stormOpacity = mood === 'bad' ? 0.6 : 0;
    const currentOpacity = mood === 'good' ? 0.4 : mood === 'neutral' ? 0.15 : 0.05;

    return (
        <div className="game-background__layer" style={{ position: 'absolute', inset: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                {/* Far mountains */}
                <path d="M0 180 L60 120 L120 160 L180 100 L240 150 L300 110 L360 140 L400 130 L400 300 L0 300 Z"
                    fill={mountainColorFar} opacity="0.5" />
                {/* Near mountains */}
                <path d="M0 220 L80 160 L140 200 L200 150 L260 190 L320 155 L400 180 L400 300 L0 300 Z"
                    fill={mountainColor} opacity="0.7" />

                {/* Ground grass lines */}
                <path d="M0 260 Q100 255 200 260 Q300 265 400 258 L400 300 L0 300 Z"
                    fill={palette.groundEdge} opacity="0.5" />

                {/* Electric currents (good weather) */}
                <g opacity={currentOpacity}>
                    <path d="M50 90 L55 95 L48 100 L56 105" stroke="#f5c542" strokeWidth="1" fill="none" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                    </path>
                    <path d="M300 80 L305 88 L298 93 L306 98" stroke="#f5c542" strokeWidth="1" fill="none" opacity="0.5">
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
                    </path>
                    <path d="M180 60 L186 68 L178 74 L188 80" stroke="#fff7a1" strokeWidth="0.8" fill="none" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Storm lightning bolts (bad weather) */}
                <g opacity={stormOpacity}>
                    <path d="M120 30 L130 60 L125 60 L135 90" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8">
                        <animate attributeName="opacity" values="0;0.8;0;0;0" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M280 20 L288 55 L282 55 L292 85" stroke="#fff7a1" strokeWidth="1.5" fill="none">
                        <animate attributeName="opacity" values="0;0;0.7;0;0" dur="4s" repeatCount="indefinite" />
                    </path>
                </g>

                {/* Stars (dark theme, good weather) */}
                {isDark && mood !== 'bad' && (
                    <g opacity="0.6">
                        <circle cx="30" cy="30" r="1" fill="white" />
                        <circle cx="100" cy="15" r="0.8" fill="white" />
                        <circle cx="200" cy="25" r="1.2" fill="white" />
                        <circle cx="320" cy="20" r="0.7" fill="white" />
                        <circle cx="370" cy="40" r="1" fill="white" />
                        <circle cx="150" cy="45" r="0.6" fill="white" />
                    </g>
                )}
            </svg>
        </div>
    );
}

// ════════════════════════════════════════
// FLAMA — Volcán Ardiente
// ════════════════════════════════════════
function BackgroundFlama({ mood, theme, palette }: BgProps) {
    const isDark = theme === 'dark';
    const volcanoColor = isDark ? '#2a0e00' : '#8a6040';
    const volcanoHighlight = isDark ? '#401800' : '#a07050';
    const lavaColor = mood === 'bad' ? '#ff2200' : '#ff6600';
    const lavaOpacity = mood === 'good' ? 0.5 : mood === 'bad' ? 0.9 : 0.3;
    const ashOpacity = mood === 'bad' ? 0.6 : 0;
    const smokeOpacity = mood === 'bad' ? 0.4 : mood === 'neutral' ? 0.15 : 0.05;

    return (
        <div className="game-background__layer" style={{ position: 'absolute', inset: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                {/* Volcano */}
                <path d="M120 280 L180 100 L200 90 L220 100 L280 280 Z" fill={volcanoColor} />
                <path d="M150 280 L185 120 L200 112 L215 120 L250 280 Z" fill={volcanoHighlight} opacity="0.5" />

                {/* Crater glow */}
                <ellipse cx="200" cy="95" rx="15" ry="6" fill={lavaColor} opacity={lavaOpacity}>
                    <animate attributeName="opacity" values={`${lavaOpacity};${lavaOpacity * 0.6};${lavaOpacity}`} dur="2s" repeatCount="indefinite" />
                </ellipse>

                {/* Lava streams */}
                <path d="M195 98 Q190 140 185 200 Q183 240 188 280" stroke={lavaColor} strokeWidth="3" fill="none" opacity={lavaOpacity * 0.6}>
                    <animate attributeName="opacity" values={`${lavaOpacity * 0.6};${lavaOpacity * 0.3};${lavaOpacity * 0.6}`} dur="3s" repeatCount="indefinite" />
                </path>
                <path d="M205 98 Q212 150 218 220 Q220 250 215 280" stroke={lavaColor} strokeWidth="2" fill="none" opacity={lavaOpacity * 0.4} />

                {/* Distant hills */}
                <path d="M0 230 Q50 200 100 220 Q150 210 200 240 L0 300 Z" fill={volcanoColor} opacity="0.3" />
                <path d="M200 240 Q280 200 340 220 Q370 215 400 230 L400 300 L200 300 Z" fill={volcanoColor} opacity="0.3" />

                {/* Ground lava pools */}
                <ellipse cx="80" cy="275" rx="25" ry="5" fill={lavaColor} opacity={lavaOpacity * 0.3}>
                    <animate attributeName="rx" values="25;27;25" dur="4s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="330" cy="270" rx="18" ry="4" fill={lavaColor} opacity={lavaOpacity * 0.2} />

                {/* Smoke from crater */}
                <g opacity={smokeOpacity}>
                    <ellipse cx="195" cy="75" rx="10" ry="6" fill={isDark ? '#444' : '#aaa'} opacity="0.4">
                        <animate attributeName="cy" values="75;50;30" dur="5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0.1;0" dur="5s" repeatCount="indefinite" />
                        <animate attributeName="rx" values="10;18;25" dur="5s" repeatCount="indefinite" />
                    </ellipse>
                    <ellipse cx="208" cy="70" rx="8" ry="5" fill={isDark ? '#555' : '#bbb'} opacity="0.3">
                        <animate attributeName="cy" values="70;40;15" dur="6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.08;0" dur="6s" repeatCount="indefinite" />
                        <animate attributeName="rx" values="8;15;22" dur="6s" repeatCount="indefinite" />
                    </ellipse>
                </g>

                {/* Eruption rocks (bad mood) */}
                <g opacity={ashOpacity}>
                    <circle cx="170" cy="60" r="3" fill="#a33" opacity="0.7">
                        <animate attributeName="cy" values="60;20;60" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="cx" values="170;160;170" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="230" cy="55" r="2" fill="#c44" opacity="0.6">
                        <animate attributeName="cy" values="55;15;55" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="cx" values="230;245;230" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="50" r="2.5" fill="#b33" opacity="0.5">
                        <animate attributeName="cy" values="50;10;50" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Red sky glow (bad) */}
                {mood === 'bad' && (
                    <rect x="0" y="0" width="400" height="150" fill="url(#redglow)" opacity="0.15">
                        <animate attributeName="opacity" values="0.15;0.25;0.15" dur="3s" repeatCount="indefinite" />
                    </rect>
                )}
                <defs>
                    <linearGradient id="redglow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff0000" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// ════════════════════════════════════════
// HIELO — Montaña Nevada
// ════════════════════════════════════════
function BackgroundHielo({ mood, theme, palette }: BgProps) {
    const isDark = theme === 'dark';
    const peakColor = isDark ? '#1a2e48' : '#d0e8ff';
    const peakColorFar = isDark ? '#0e1e30' : '#e0f0ff';
    const snowColor = isDark ? '#c0d8f0' : '#ffffff';
    const blizzardOpacity = mood === 'bad' ? 0.5 : 0;
    const auroraOpacity = mood === 'good' && isDark ? 0.35 : mood === 'good' && !isDark ? 0.15 : 0;

    return (
        <div className="game-background__layer" style={{ position: 'absolute', inset: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
                {/* Aurora borealis */}
                <g opacity={auroraOpacity}>
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

                {/* Far peaks */}
                <path d="M0 200 L50 110 L80 140 L130 80 L170 130 L220 90 L260 120 L310 70 L350 120 L400 100 L400 300 L0 300 Z"
                    fill={peakColorFar} opacity="0.4" />
                {/* Snow caps far */}
                <path d="M125 85 L130 80 L135 88" fill={snowColor} opacity="0.3" />
                <path d="M305 75 L310 70 L315 78" fill={snowColor} opacity="0.3" />

                {/* Near peaks */}
                <path d="M0 240 L70 160 L120 200 L180 140 L230 180 L290 130 L340 170 L400 150 L400 300 L0 300 Z"
                    fill={peakColor} opacity="0.7" />
                {/* Snow caps near */}
                <path d="M175 145 L180 140 L185 148" fill={snowColor} opacity="0.5" />
                <path d="M285 135 L290 130 L295 138" fill={snowColor} opacity="0.5" />
                <path d="M65 165 L70 160 L75 168" fill={snowColor} opacity="0.4" />

                {/* Ice ground texture */}
                <path d="M0 265 Q80 258 160 268 Q240 255 320 265 Q380 260 400 262 L400 300 L0 300 Z"
                    fill={palette.groundEdge} opacity="0.4" />

                {/* Gentle snow particles (always, intensity varies) */}
                <g opacity={mood === 'bad' ? 0.1 : 0.4}>
                    {[20,60,110,150,200,250,300,340,380].map((x, i) => (
                        <circle key={i} cx={x} cy={30 + i * 15} r={0.8 + (i % 3) * 0.4} fill={snowColor} opacity={0.4 + (i % 3) * 0.2}>
                            <animate attributeName="cy" values={`${30 + i * 15};300`} dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
                            <animate attributeName="cx" values={`${x};${x + (i % 2 === 0 ? 15 : -15)}`} dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
                        </circle>
                    ))}
                </g>

                {/* Blizzard overlay (bad weather) */}
                <g opacity={blizzardOpacity}>
                    <rect x="0" y="0" width="400" height="300" fill={isDark ? '#0a1520' : '#c0d0e0'} opacity="0.3" />
                    {[30,80,140,190,250,310,370].map((x, i) => (
                        <line key={i} x1={x} y1={0} x2={x - 40} y2={300} stroke={snowColor} strokeWidth="1" opacity="0.3">
                            <animate attributeName="x1" values={`${x};${x + 400}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                            <animate attributeName="x2" values={`${x - 40};${x + 360}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                        </line>
                    ))}
                </g>

                {/* Stars (dark + good) */}
                {isDark && mood !== 'bad' && (
                    <g opacity="0.5">
                        <circle cx="40" cy="20" r="0.8" fill="white" />
                        <circle cx="120" cy="12" r="1" fill="white" />
                        <circle cx="260" cy="18" r="0.6" fill="white" />
                        <circle cx="350" cy="25" r="0.9" fill="white" />
                    </g>
                )}
            </svg>
        </div>
    );
}
