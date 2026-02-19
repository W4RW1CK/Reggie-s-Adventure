'use client';

import { useEffect, useState, useCallback } from 'react';
import { getClosedFractures, getNextFracture } from '@/lib/evolution';
import { FRACTURE_THRESHOLDS } from '@/lib/constants';

interface FractureOverlayProps {
  progress: number;
  newFractureJustClosed: boolean;
  onFractureAnimationComplete: () => void;
}

// 4 fracture positions around the sprite area (crack-like SVG paths)
const FRACTURE_PATHS = [
  // Top-left diagonal crack
  { d: 'M5 0 L12 18 L8 25 L15 40 L10 48', x: '8%', y: '15%' },
  // Top-right diagonal crack
  { d: 'M45 0 L38 15 L42 28 L35 42 L40 50', x: '82%', y: '12%' },
  // Bottom-left crack
  { d: 'M0 10 L10 22 L5 35 L14 45 L8 55', x: '5%', y: '60%' },
  // Bottom-right crack
  { d: 'M50 8 L40 20 L45 32 L36 44 L42 52', x: '85%', y: '58%' },
];

export default function FractureOverlay({
  progress,
  newFractureJustClosed,
  onFractureAnimationComplete,
}: FractureOverlayProps) {
  const closedFractures = getClosedFractures(progress);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  // When a new fracture closes, animate it
  useEffect(() => {
    if (!newFractureJustClosed) return;

    // The last closed fracture is the one that just closed
    const closedCount = closedFractures.length;
    if (closedCount > 0) {
      setAnimatingIndex(closedCount - 1);
      const timer = setTimeout(() => {
        setAnimatingIndex(null);
        onFractureAnimationComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [newFractureJustClosed, closedFractures.length, onFractureAnimationComplete]);

  return (
    <div className="fracture-overlay" aria-hidden="true">
      {FRACTURE_THRESHOLDS.map((threshold, i) => {
        const isClosed = progress >= threshold;
        const isAnimating = animatingIndex === i;
        const pos = FRACTURE_PATHS[i];

        return (
          <div
            key={threshold}
            className={`fracture-line ${isClosed ? 'fracture-line--closed' : 'fracture-line--active'} ${isAnimating ? 'fracture-line--sealing' : ''}`}
            style={{ left: pos.x, top: pos.y }}
          >
            <svg
              width="50"
              height="60"
              viewBox="0 0 50 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={pos.d}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fracture-line__path"
              />
              {/* Secondary crack detail */}
              <path
                d={pos.d}
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fracture-line__glow"
              />
            </svg>

            {/* Particles on sealing animation */}
            {isAnimating && (
              <div className="fracture-particles">
                {[...Array(8)].map((_, j) => (
                  <span
                    key={j}
                    className="fracture-particle"
                    style={{
                      '--particle-angle': `${j * 45}deg`,
                      '--particle-delay': `${j * 0.08}s`,
                      '--particle-distance': `${20 + (j % 3) * 10}px`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
