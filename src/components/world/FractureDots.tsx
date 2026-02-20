'use client';

import { getClosedFractures, getNextFracture } from '@/lib/evolution';
import { FRACTURE_THRESHOLDS } from '@/lib/constants';

interface FractureDotsProps {
  progress: number;
}

export default function FractureDots({ progress }: FractureDotsProps) {
  const closedFractures = getClosedFractures(progress);
  const nextFracture = getNextFracture(progress);

  return (
    <div className="fracture-dots" aria-label={`Fracturas cerradas: ${closedFractures.length} de ${FRACTURE_THRESHOLDS.length}`}>
      <span className="fracture-dots__label">Fracturas</span>
      <div className="fracture-dots__row">
        {FRACTURE_THRESHOLDS.map((threshold, i) => {
          const isClosed = progress >= threshold;
          return (
            <span
              key={threshold}
              className={`fracture-dot ${isClosed ? 'fracture-dot--closed' : 'fracture-dot--open'}`}
              title={`${threshold} progreso${isClosed ? ' ✓' : ''}`}
            />
          );
        })}
      </div>
      {/* Subtle progress toward next fracture */}
      {nextFracture && (
        <div className="fracture-dots__progress">
          <div
            className="fracture-dots__progress-fill"
            style={{
              width: `${Math.min(100, ((progress - (closedFractures.length > 0 ? closedFractures[closedFractures.length - 1] : 0)) / (nextFracture.threshold - (closedFractures.length > 0 ? closedFractures[closedFractures.length - 1] : 0))) * 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
