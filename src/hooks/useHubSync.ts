'use client';

import { useEffect, useRef, useCallback } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
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

export function useHubSync({ stats, totalProgress }: UseHubSyncOptions) {
  const { sync } = useHub();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doSync = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const hubId = localStorage.getItem(STORAGE_KEYS.HUB_REGENMON_ID);
    const isRegistered = localStorage.getItem(STORAGE_KEYS.IS_REGISTERED_IN_HUB) === 'true';
    if (!isRegistered || !hubId) return;

    const result = await sync(hubId, mapStatsToHub(stats), totalProgress);
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
