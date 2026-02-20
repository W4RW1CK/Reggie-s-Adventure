'use client';

import { useEffect, useState, useCallback } from 'react';
import { getClosedFractures, getNextFracture } from '@/lib/evolution';
import { FRACTURE_THRESHOLDS } from '@/lib/constants';

interface FractureOverlayProps {
  progress: number;
  newFractureJustClosed: boolean;
  onFractureAnimationComplete: () => void;
}

// 4 fracture positions — BIG dramatic cracks spanning from edges toward center
const FRACTURE_PATHS = [
  // Top-left: large crack from top-left edge inward
  { d: 'M0 0 L25 35 L15 55 L40 90 L30 120 L50 160 L35 180', x: '2%', y: '2%' },
  // Top-right: large crack from top-right edge inward
  { d: 'M150 0 L125 30 L135 60 L110 95 L125 130 L100 165 L115 180', x: '72%', y: '2%' },
  // Bottom-left: large crack from bottom-left edge inward
  { d: 'M0 180 L20 145 L10 110 L35 80 L20 50 L45 20 L30 0', x: '2%', y: '55%' },
  // Bottom-right: large crack from bottom-right edge inward
  { d: 'M150 180 L130 140 L140 105 L115 70 L130 40 L105 10 L120 0', x: '72%', y: '55%' },
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
              width="150"
              height="180"
              viewBox="0 0 150 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={pos.d}
                strokeWidth="4.5"
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
