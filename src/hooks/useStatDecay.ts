import { useEffect, useCallback, useRef } from 'react';
import { RegenmonStats } from '@/lib/types';
import { DECAY_RATE_PER_HOUR, DECAY_INTERVAL_MS, STAT_MIN, STAT_MAX } from '@/lib/constants';

interface UseStatDecayProps {
    stats: RegenmonStats | null;
    lastUpdated: string | null;
    onUpdateStats: (newStats: RegenmonStats) => void;
}

export function useStatDecay({ stats, lastUpdated, onUpdateStats }: UseStatDecayProps) {
    // Refs to avoid dependency cycles in useEffect
    const statsRef = useRef(stats);
    const lastUpdatedRef = useRef(lastUpdated);
    const onUpdateStatsRef = useRef(onUpdateStats);
    const hasRunInitialDecay = useRef(false);

    useEffect(() => {
        statsRef.current = stats;
        lastUpdatedRef.current = lastUpdated;
        onUpdateStatsRef.current = onUpdateStats;
    }, [stats, lastUpdated, onUpdateStats]);

    const calculateDecay = useCallback((currentStats: RegenmonStats, lastTime: string) => {
        const now = Date.now();
        const last = new Date(lastTime).getTime();

        // Calculate hours elapsed
        // 3600000 ms = 1 hour
        const hoursElapsed = (now - last) / 3600000;

        // If less than 1 minute has passed (0.016 hours), ignore to avoid jitter
        // But for active tick (1 min), we want to check.
        // Let's rely on the decay calculation floor.
        // If DECAY_RATE is 2/hr, we need at least 0.5 hours for 1 point change.
        // This is too slow for 60s ticks to show anything naturally.
        // However, we want to accumulate 'potential' decay?
        // No, the requirement is simple: Calculate total expected stats based on time.

        // If 5 hours passed: 5 * 2 = 10 pts.
        // If 1 minute passed: 1/60 * 2 = 0.033 pts -> floored to 0.

        // To make it feel "alive" even if slow, maybe we strictly follow the math.
        // It means stats WON'T change every minute unless we increase rate or change logic.
        // But that's what was requested: "decaen en tiempo real... tras 4-5h se nota baja leve".

        const decayAmount = Math.floor(hoursElapsed * DECAY_RATE_PER_HOUR);

        if (decayAmount <= 0) return currentStats;

        return {
            espiritu: Math.max(STAT_MIN, Math.min(STAT_MAX, currentStats.espiritu - decayAmount)),
            pulso: Math.max(STAT_MIN, Math.min(STAT_MAX, currentStats.pulso - decayAmount)),
            esencia: Math.max(STAT_MIN, Math.min(STAT_MAX, currentStats.esencia - decayAmount)), // Esencia BAJA
            fragmentos: currentStats.fragmentos, // No cambia por decay
        };
    }, []);

    // 1. Initial Offline Decay (on mount/load)
    useEffect(() => {
        // We need to wait for data to be loaded and prevent multiple runs
        if (!stats || !lastUpdated || hasRunInitialDecay.current) return;
        hasRunInitialDecay.current = true;

        const currentStats = stats;
        const lastTime = lastUpdated;

        const decayedStats = calculateDecay(currentStats, lastTime);

        // Only update if stats actually changed
        if (
            decayedStats.espiritu !== currentStats.espiritu ||
            decayedStats.pulso !== currentStats.pulso ||
            decayedStats.esencia !== currentStats.esencia
        ) {
            onUpdateStats(decayedStats);
        }
    }, [stats, lastUpdated]); // React to data availability

    // 2. Active Interval Decay
    useEffect(() => {
        if (!stats || !lastUpdated) return;

        const intervalId = setInterval(() => {
            if (!statsRef.current || !lastUpdatedRef.current) return;

            // Inline calculateDecay logic here to avoid dependency
            const now = Date.now();
            const last = new Date(lastUpdatedRef.current).getTime();
            const hoursElapsed = (now - last) / 3600000;
            const decayAmount = Math.floor(hoursElapsed * DECAY_RATE_PER_HOUR);

            if (decayAmount <= 0) return;

            const newStats = {
                espiritu: Math.max(STAT_MIN, Math.min(STAT_MAX, statsRef.current.espiritu - decayAmount)),
                pulso: Math.max(STAT_MIN, Math.min(STAT_MAX, statsRef.current.pulso - decayAmount)),
                esencia: Math.max(STAT_MIN, Math.min(STAT_MAX, statsRef.current.esencia - decayAmount)), // Esencia BAJA
                fragmentos: statsRef.current.fragmentos,
            };

            // If calculated stats differ from current, apply update
            if (
                newStats.espiritu !== statsRef.current.espiritu ||
                newStats.pulso !== statsRef.current.pulso ||
                newStats.esencia !== statsRef.current.esencia
            ) {
                onUpdateStatsRef.current(newStats);
            }
        }, DECAY_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [stats, lastUpdated]); // Remove calculateDecay dependency
}
