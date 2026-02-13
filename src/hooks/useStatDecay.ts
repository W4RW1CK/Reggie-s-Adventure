import { useEffect, useCallback } from 'react';
import { RegenmonStats } from '@/lib/types';
import { DECAY_RATE_PER_HOUR, DECAY_INTERVAL_MS, STAT_MIN, STAT_MAX } from '@/lib/constants';

interface UseStatDecayProps {
    stats: RegenmonStats | null;
    lastUpdated: string | null;
    onUpdateStats: (newStats: RegenmonStats) => void;
}

export function useStatDecay({ stats, lastUpdated, onUpdateStats }: UseStatDecayProps) {

    const calculateDecay = useCallback((currentStats: RegenmonStats, lastTime: string) => {
        const now = Date.now();
        const last = new Date(lastTime).getTime();
        const hoursElapsed = (now - last) / 3600000;

        if (hoursElapsed < 0.1) return currentStats; // Ignore if very recently updated

        const decayAmount = Math.floor(hoursElapsed * DECAY_RATE_PER_HOUR);
        if (decayAmount <= 0) return currentStats;

        return {
            espiritu: Math.max(STAT_MIN, Math.min(STAT_MAX, currentStats.espiritu - decayAmount)),
            pulso: Math.max(STAT_MIN, Math.min(STAT_MAX, currentStats.pulso - decayAmount)),
            hambre: Math.max(STAT_MIN, Math.min(STAT_MAX, currentStats.hambre + decayAmount)), // Hambre SUBE
        };
    }, []);

    // 1. Initial Offline Decay (on mount/load)
    useEffect(() => {
        if (stats && lastUpdated) {
            const decayedStats = calculateDecay(stats, lastUpdated);
            // Only update if stats actually changed
            if (
                decayedStats.espiritu !== stats.espiritu ||
                decayedStats.pulso !== stats.pulso ||
                decayedStats.hambre !== stats.hambre
            ) {
                // console.log('Applying offline decay:', decayedStats);
                onUpdateStats(decayedStats);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount when data is available (handled by parent checking null)

    // 2. Active Interval Decay
    useEffect(() => {
        if (!stats || !lastUpdated) return;

        const intervalId = setInterval(() => {
            // For active play, we can just apply a small fixed amount or recalculate based on time
            // To be consistent with "real time", we recalculate total decay from lastUpdated
            // But since lastUpdated updates on every action/save, it works out.

            // However, for a smoother "tick", maybe we just want to apply -1 every X minutes?
            // The requirement says: "Ritmo: tras 4-5 horas → baja leve".
            // Let's stick to the time-diff calculation to be robust.

            // Actually, if we just sit there, lastUpdated doesn't change unless we save.
            // So we should calculate diff from `lastUpdated` to `now`.

            const newStats = calculateDecay(stats, lastUpdated);
            if (
                newStats.espiritu !== stats.espiritu ||
                newStats.pulso !== stats.pulso ||
                newStats.hambre !== stats.hambre
            ) {
                onUpdateStats(newStats);
            }
        }, DECAY_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [stats, lastUpdated, onUpdateStats, calculateDecay]);
}
