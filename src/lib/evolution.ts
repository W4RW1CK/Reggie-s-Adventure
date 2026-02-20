import { FRACTURE_THRESHOLDS } from './constants';

// Get current evolution stage (1-5)
export function getEvolutionStage(progress: number): number {
  // Stage 1: 0-49 (no fractures closed)
  // Stage 2: 50-99 (1st fracture closed)
  // Stage 3: 100-199 (2nd fracture closed)
  // Stage 4: 200-399 (3rd fracture closed)
  // Stage 5: 400+ (all fractures closed)
  let stage = 1;
  for (const threshold of FRACTURE_THRESHOLDS) {
    if (progress >= threshold) stage++;
  }
  return stage;
}

// Get array of closed fracture thresholds
export function getClosedFractures(progress: number): number[] {
  return FRACTURE_THRESHOLDS.filter(t => progress >= t);
}

// Get next fracture info, or null if all closed
export function getNextFracture(progress: number): { threshold: number; remaining: number } | null {
  const next = FRACTURE_THRESHOLDS.find(t => progress < t);
  if (!next) return null;
  return { threshold: next, remaining: next - progress };
}

// Detect if a fracture was just crossed (for animation trigger)
export function isNewFracture(oldProgress: number, newProgress: number): boolean {
  return FRACTURE_THRESHOLDS.some(t => oldProgress < t && newProgress >= t);
}

// Get the specific fracture that was just crossed
export function getNewlyClosedFracture(oldProgress: number, newProgress: number): number | null {
  for (const t of FRACTURE_THRESHOLDS) {
    if (oldProgress < t && newProgress >= t) return t;
  }
  return null;
}
