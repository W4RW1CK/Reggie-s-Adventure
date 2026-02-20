'use client';

import { useEffect, useState, useCallback } from 'react';
import { getClosedFractures, getNextFracture } from '@/lib/evolution';
import { FRACTURE_THRESHOLDS } from '@/lib/constants';

interface FractureOverlayProps {
  progress: number;
  newFractureJustClosed: boolean;
  onFractureAnimationComplete: () => void;
  statsAvg?: number; // average of all 3 stats (0-100)
}

// 4 fracture positions — MASSIVE cracks that threaten to shatter the world
const FRACTURE_PATHS = [
  // Top-left: jagged crack tearing from corner deep into the world
  {
    main: 'M0 0 L30 50 L10 80 L55 140 L25 190 L70 260 L40 310 L80 380 L50 420',
    branches: [
      'M30 50 L60 30 L80 60',
      'M55 140 L85 120 L95 155',
      'M25 190 L5 220 L30 250',
      'M70 260 L100 240 L110 280',
    ],
    x: '-1%', y: '-2%',
  },
  // Top-right: violent crack ripping from top-right
  {
    main: 'M300 0 L270 55 L290 90 L245 150 L275 200 L230 270 L260 320 L220 390 L250 420',
    branches: [
      'M270 55 L240 35 L220 65',
      'M245 150 L215 130 L205 165',
      'M275 200 L295 230 L270 255',
      'M230 270 L200 250 L190 285',
    ],
    x: '55%', y: '-2%',
  },
  // Bottom-left: crack erupting from bottom-left
  {
    main: 'M0 420 L35 370 L10 330 L60 270 L30 220 L75 160 L45 110 L85 50 L55 0',
    branches: [
      'M35 370 L65 390 L75 355',
      'M60 270 L90 290 L100 255',
      'M30 220 L5 190 L30 165',
      'M75 160 L105 180 L115 145',
    ],
    x: '-1%', y: '45%',
  },
  // Bottom-right: devastating crack from bottom-right corner
  {
    main: 'M300 420 L265 365 L290 325 L240 260 L270 210 L225 150 L255 100 L215 40 L245 0',
    branches: [
      'M265 365 L235 385 L225 350',
      'M240 260 L210 280 L200 245',
      'M270 210 L295 185 L270 160',
      'M225 150 L195 170 L185 135',
    ],
    x: '55%', y: '45%',
  },
];

export default function FractureOverlay({
  progress,
  newFractureJustClosed,
  onFractureAnimationComplete,
  statsAvg = 50,
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
              viewBox="0 0 300 420"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fracture-svg"
              style={{ width: '45vw', height: '55vh' }}
            >
              {/* Main crack — thick, jagged, threatening */}
              <path
                d={pos.main}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fracture-line__path"
              />
              {/* Inner glow — bright core of the crack */}
              <path
                d={pos.main}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fracture-line__core"
              />
              {/* Outer glow — wide atmospheric effect */}
              <path
                d={pos.main}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fracture-line__glow"
              />
              {/* Branch cracks — spreading destruction */}
              {pos.branches.map((branch, bi) => (
                <g key={bi}>
                  <path
                    d={branch}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fracture-line__branch"
                  />
                  <path
                    d={branch}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fracture-line__branch-glow"
                  />
                </g>
              ))}
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
