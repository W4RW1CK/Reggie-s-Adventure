'use client';

import { RegenmonType, RegenmonStats } from '@/lib/types';

interface GameBackgroundProps {
    type: RegenmonType;
    stats: RegenmonStats;
}

type Mood = 'good' | 'neutral' | 'bad';

export default function GameBackground({ type, stats }: GameBackgroundProps) {
    // Determine overall mood based on stats
    const getMood = (): Mood => {
        const { espiritu, pulso, hambre } = stats;

        // "Bad" conditions
        if (pulso <= 20 || espiritu <= 20 || hambre >= 80) return 'bad';

        // "Good" conditions
        if (pulso >= 80 || espiritu >= 80) return 'good';

        return 'neutral';
    };

    const mood = getMood();

    // Helper to get CSS classes or styles based on type + mood
    const getBackgroundStyle = () => {
        // Base colors for sky gradient
        let topColor = '#000';
        let bottomColor = '#000';

        switch (type) {
            case 'rayo':
                // Electric Sky
                if (mood === 'good') { topColor = '#2a2a40'; bottomColor = '#4a4a60'; } // Clear electric blue-ish
                else if (mood === 'bad') { topColor = '#1a1a2e'; bottomColor = '#222'; } // Dark storm
                else { topColor = '#252535'; bottomColor = '#353545'; } // Neutral
                break;
            case 'flama':
                // Volcanic Sky
                if (mood === 'good') { topColor = '#502000'; bottomColor = '#803000'; } // Bright warm
                else if (mood === 'bad') { topColor = '#200500'; bottomColor = '#3d1f00'; } // Dark ash
                else { topColor = '#3d1f00'; bottomColor = '#602500'; } // Neutral
                break;
            case 'hielo':
                // Icy Sky
                if (mood === 'good') { topColor = '#0a1628'; bottomColor = '#1a2e48'; } // Clear night
                else if (mood === 'bad') { topColor = '#050b14'; bottomColor = '#0f1c2b'; } // Dark blizzard
                else { topColor = '#08101e'; bottomColor = '#15253b'; } // Neutral
                break;
        }

        return {
            background: `linear-gradient(to bottom, ${topColor}, ${bottomColor})`,
        };
    };

    return (
        <div className="game-background" style={{
            ...getBackgroundStyle(),
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            minHeight: '100%',
            zIndex: 0
        }}>
            {/* Scanlines overlay (lighter here maybe) */}
            <div className="game-background__scanlines" />

            {/* Elements based on type */}
            {type === 'rayo' && <BackgroundRayo mood={mood} />}
            {type === 'flama' && <BackgroundFlama mood={mood} />}
            {type === 'hielo' && <BackgroundHielo mood={mood} />}
        </div>
    );
}

// Sub-components for specific landscapes using SVG/CSS art
function BackgroundRayo({ mood }: { mood: Mood }) {
    return (
        <div className="game-background__layer">
            {/* Distant mountains */}
            <div className="game-background__mountain-back" />

            {/* Lightning flashes (only if neutral/bad or specialized) */}
            <div className={`game-background__lightning ${mood === 'bad' ? 'active-storm' : ''}`} />

            {/* Ground */}
            <div className="game-background__ground--rayo" />
        </div>
    );
}

function BackgroundFlama({ mood }: { mood: Mood }) {
    return (
        <div className="game-background__layer">
            {/* Volcano shape */}
            <div className="game-background__volcano" />

            {/* Ash particles */}
            {mood === 'bad' && <div className="game-background__ash" />}

            {/* Ground */}
            <div className="game-background__ground--flama" />
        </div>
    );
}

function BackgroundHielo({ mood }: { mood: Mood }) {
    return (
        <div className="game-background__layer">
            {/* Snowy peaks */}
            <div className="game-background__peaks" />

            {/* Check mood for snow intensity */}
            <div className={`game-background__snow ${mood === 'bad' ? 'heavy' : 'light'}`} />

            {/* Ground */}
            <div className="game-background__ground--hielo" />
        </div>
    );
}
