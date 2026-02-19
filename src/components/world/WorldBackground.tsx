'use client';

import { RegenmonType, RegenmonStats } from '@/lib/types';
import { getEvolutionStage } from '@/lib/evolution';
import { getWorldState } from '@/lib/worldState';

interface WorldBackgroundProps {
  type: RegenmonType;
  stats: RegenmonStats;
  progress: number;
  theme?: 'dark' | 'light';
}

// Background images per type and theme
const BG_IMAGES: Record<RegenmonType, Record<'dark' | 'light', string>> = {
  rayo:  { dark: '/backgrounds/bg-rayo-dark.png',  light: '/backgrounds/bg-rayo-light.png' },
  flama: { dark: '/backgrounds/bg-flama-dark.png', light: '/backgrounds/bg-flama-light.png' },
  hielo: { dark: '/backgrounds/bg-hielo-dark.png', light: '/backgrounds/bg-hielo-light.png' },
};

// Evolution-based filter modulation
function getEvolutionFilter(stage: number, theme: 'dark' | 'light'): string {
  // Stage 1: Most corrupted/oppressive
  // Stage 5: Full regeneration/bright
  const worldState = getWorldState(stage);
  const intensity = worldState.backgroundIntensity; // 0.2 → 1.0
  const corruption = worldState.corruptionLevel;    // 1.0 → 0.0

  if (theme === 'dark') {
    // Dark: from very dark/desaturated to brighter/more saturated
    const brightness = 0.5 + intensity * 0.6;  // 0.62 → 1.1
    const saturate = 0.3 + intensity * 0.85;   // 0.47 → 1.15
    const contrast = 0.85 + intensity * 0.2;   // 0.89 → 1.05
    return `brightness(${brightness.toFixed(2)}) saturate(${saturate.toFixed(2)}) contrast(${contrast.toFixed(2)})`;
  } else {
    // Light: from muted/cold to warm/vibrant
    const brightness = 0.7 + intensity * 0.4;  // 0.78 → 1.1
    const saturate = 0.5 + intensity * 0.7;    // 0.64 → 1.2
    return `brightness(${brightness.toFixed(2)}) saturate(${saturate.toFixed(2)})`;
  }
}

// Overlay color based on corruption level
function getCorruptionOverlay(stage: number, theme: 'dark' | 'light'): string {
  const worldState = getWorldState(stage);
  const corruption = worldState.corruptionLevel;

  if (theme === 'dark') {
    // Dark overlay that fades as world heals
    const alpha = corruption * 0.4; // 0.4 → 0
    return `rgba(10, 5, 20, ${alpha.toFixed(2)})`;
  } else {
    const alpha = corruption * 0.25;
    return `rgba(60, 40, 60, ${alpha.toFixed(2)})`;
  }
}

export default function WorldBackground({ type, stats, progress, theme = 'dark' }: WorldBackgroundProps) {
  const stage = getEvolutionStage(progress);
  const worldState = getWorldState(stage);
  const bgImage = BG_IMAGES[type][theme];
  const filter = getEvolutionFilter(stage, theme);
  const overlayColor = getCorruptionOverlay(stage, theme);
  const showParticles = worldState.particleFrequency > 0;

  return (
    <div
      className="world-bg"
      aria-label={`Mundo: ${worldState.health} — ${worldState.description}`}
    >
      {/* Background image with evolution filter */}
      <div
        className="world-bg__image"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter,
        }}
      />

      {/* Corruption overlay */}
      <div
        className="world-bg__corruption"
        style={{ backgroundColor: overlayColor }}
      />

      {/* Ambient particles based on world health */}
      {showParticles && (
        <div className="world-bg__particles">
          {[...Array(Math.round(worldState.particleFrequency * 12))].map((_, i) => (
            <span
              key={i}
              className="world-bg__particle"
              style={{
                left: `${10 + (i * 37) % 80}%`,
                animationDelay: `${(i * 0.7) % 4}s`,
                animationDuration: `${3 + (i % 3)}s`,
                opacity: 0.15 + worldState.particleFrequency * 0.4,
              }}
            />
          ))}
        </div>
      )}

      {/* Scanlines */}
      <div className="game-background__scanlines" />
    </div>
  );
}
