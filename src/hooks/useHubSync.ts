'use client';

import { useEffect, useRef, useCallback } from 'react';
import { STORAGE_KEYS, PROGRESS_MAX } from '@/lib/constants';
import { useHub } from './useHub';

interface UseHubSyncOptions {
  stats: { espiritu: number; pulso: number; esencia: number };
  totalProgress: number;
}

function mapStatsToHub(stats: { espiritu: number; pulso: number; esencia: number }) {
  return {
    happiness: Math.round(stats.espiritu),
    energy: Math.round(stats.pulso),
    hunger: Math.round(stats.esencia),
  };
}

/**
 * REGGIE ↔ HUB TRANSLATION LAYER
 * 
 * Conversion factor: ×2.5
 *   reggieProgress × 2.5 = hubTotalPoints
 *   hubTotalPoints / 2.5 = reggieEquivalent
 * 
 * Perfect alignment:
 *   Fractura 3 (200 progress) = 500 HUB pts = Stage 2
 *   Fractura 4 (400 progress) = 1000 HUB pts = Stage 3
 * 
 * Fractura mapping:
 *   Fractura 0: 0-49 progress    (0-122 HUB pts)   — Mundo Intacto
 *   Fractura 1: 50-99 progress   (125-247 HUB pts)  — Primera Grieta
 *   Fractura 2: 100-199 progress (250-497 HUB pts)  — Grieta Profunda
 *   Fractura 3: 200-399 progress (500-997 HUB pts)  — Mundo Fragmentado
 *   Fractura 4: 400+ progress    (1000+ HUB pts)    — Mundo Renacido
 */

const HUB_CONVERSION_FACTOR = 2.5;

/** Convert Reggie progress to HUB totalPoints (capped at PROGRESS_MAX) */
export function progressToHubPoints(progress: number): number {
  const capped = Math.min(progress, PROGRESS_MAX);
  return Math.round(capped * HUB_CONVERSION_FACTOR);
}

/** Convert HUB totalPoints back to Reggie-equivalent progress */
export function hubPointsToProgress(hubPoints: number): number {
  return Math.round(hubPoints / HUB_CONVERSION_FACTOR);
}

/** Get Fractura number (0-4) from Reggie progress */
export function progressToFractura(progress: number): number {
  if (progress >= 400) return 4;
  if (progress >= 200) return 3;
  if (progress >= 100) return 2;
  if (progress >= 50) return 1;
  return 0;
}

/** Get Fractura number from HUB points (inverse conversion) */
export function hubPointsToFractura(hubPoints: number): number {
  return progressToFractura(hubPointsToProgress(hubPoints));
}

/** Fractura display name */
export function fracturaName(fractura: number): string {
  switch (fractura) {
    case 0: return '🌍 Mundo Intacto';
    case 1: return '⚡ Primera Grieta';
    case 2: return '🔥 Grieta Profunda';
    case 3: return '💎 Mundo Fragmentado';
    case 4: return '✨ Mundo Renacido';
    default: return '🌍 Mundo Intacto';
  }
}

/** Short fractura label for leaderboard cards */
export function fracturaShort(fractura: number): string {
  return `Fractura ${fractura}/4`;
}

/** HUB stage name (for reference, used internally) */
export function hubStageName(stage: number): string {
  if (stage <= 1) return '🥚 Bebé';
  if (stage === 2) return '🐣 Joven';
  return '🐉 Adulto';
}

export function useHubSync({ stats, totalProgress }: UseHubSyncOptions) {
  const { sync } = useHub();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doSync = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const hubId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID);
    const isRegistered = localStorage.getItem(STORAGE_KEYS.IS_REGISTERED_IN_HUB) === 'true';
    if (!isRegistered || !hubId) return;

    const result = await sync(hubId, mapStatsToHub(stats), progressToHubPoints(totalProgress));
    if (result?.data?.balance !== undefined) {
      localStorage.setItem(STORAGE_KEYS.HUB_BALANCE, String(result.data.balance));
    }
  }, [sync, stats, totalProgress]);

  // Sync every 5 minutes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hubId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID);
    const isRegistered = localStorage.getItem(STORAGE_KEYS.IS_REGISTERED_IN_HUB) === 'true';
    if (!isRegistered || !hubId) return;

    // Initial sync
    doSync();

    intervalRef.current = setInterval(doSync, 5 * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [doSync]);

  return { syncNow: doSync };
}
