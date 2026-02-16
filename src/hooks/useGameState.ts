
import { useState, useEffect, useCallback, useRef } from 'react';
import { RegenmonData, RegenmonStats, AppConfig } from '@/lib/types';
import {
    loadRegenmon,
    saveRegenmon,
    loadConfig,
    saveConfig as saveConfigToStorage,
    updateStats as updateStatsInStorage,
    deleteRegenmon
} from '@/lib/storage';
import { useStatDecay } from './useStatDecay';
import { STAT_MIN, STAT_MAX, STAT_INITIAL } from '@/lib/constants';

export function useGameState() {
    const [regenmon, setRegenmon] = useState<RegenmonData | null>(null);
    const [config, setConfig] = useState<AppConfig>({ musicEnabled: false, isFirstTime: true });
    const [loading, setLoading] = useState(true);
    const pendingUpdatesRef = useRef<Partial<RegenmonStats>[]>([]);

    // Load initial data
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadedRegenmon = loadRegenmon();
            const loadedConfig = loadConfig();

            setRegenmon(loadedRegenmon);
            setConfig(loadedConfig);
            setLoading(false);
        }
    }, []);

    // Wrapper to update stats state AND storage
    const handleUpdateStats = useCallback((newStats: RegenmonStats) => {
        setRegenmon(current => {
            if (!current) return null;
            const updated = { ...current, stats: newStats, lastUpdated: new Date().toISOString() };
            saveRegenmon(updated);
            return updated;
        });
    }, []); // Remove regenmon dependency

    // Hook for decay
    useStatDecay({
        stats: regenmon?.stats || null,
        lastUpdated: regenmon?.lastUpdated || null,
        onUpdateStats: handleUpdateStats,
    });

    // Actions
    const createRegenmon = (name: string, type: import('@/lib/types').RegenmonType) => {
        const newData: RegenmonData = {
            name,
            type,
            stats: { espiritu: STAT_INITIAL, pulso: STAT_INITIAL, hambre: STAT_INITIAL },
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            nameChangeUsed: false,
            tutorialDismissed: false,
        };
        setRegenmon(newData);
        saveRegenmon(newData);

        // Also update config since they are now playing
        const newConfig = { ...config, isFirstTime: false };
        setConfig(newConfig);
        saveConfigToStorage(newConfig);
    };

    const updateStatsWithDeltas = useCallback((deltas: Partial<RegenmonStats>) => {
        pendingUpdatesRef.current.push(deltas);
        
        // Debounce updates
        const processUpdates = () => {
            const allDeltas = pendingUpdatesRef.current;
            pendingUpdatesRef.current = [];
            
            // Merge all pending deltas
            const mergedDeltas = allDeltas.reduce((acc, delta) => {
                Object.entries(delta).forEach(([key, value]) => {
                    acc[key as keyof RegenmonStats] = (acc[key as keyof RegenmonStats] || 0) + value;
                });
                return acc;
            }, {} as Partial<RegenmonStats>);
            
            setRegenmon(prev => {
                if (!prev) return null;

                const newStats = { ...prev.stats };
                let hasChanges = false;

                (Object.entries(mergedDeltas) as [keyof RegenmonStats, number][]).forEach(([stat, amount]) => {
                    const currentVal = newStats[stat];

                    // Check limits based on delta direction
                    if (amount > 0 && currentVal >= STAT_MAX) return;
                    if (amount < 0 && currentVal <= STAT_MIN) return;

                    const newVal = Math.max(STAT_MIN, Math.min(STAT_MAX, currentVal + amount));

                    if (newVal !== currentVal) {
                        newStats[stat] = newVal;
                        hasChanges = true;
                    }
                });

                if (!hasChanges) return prev;

                const updatedRegenmon = {
                    ...prev,
                    stats: newStats,
                    lastUpdated: new Date().toISOString(),
                };

                // Side effect: save to storage
                saveRegenmon(updatedRegenmon);

                return updatedRegenmon;
            });
        };
        
        setTimeout(processUpdates, 0); // Next tick
    }, []);

    const toggleMusic = () => {
        const newConfig = { ...config, musicEnabled: !config.musicEnabled };
        setConfig(newConfig);
        saveConfigToStorage(newConfig);
    };

    const resetGame = () => {
        deleteRegenmon();
        setRegenmon(null);
        const newConfig = { ...config, isFirstTime: true };
        setConfig(newConfig);
        saveConfigToStorage(newConfig);
    };

    const markIntroSeen = () => {
        const newConfig = { ...config, isFirstTime: false };
        setConfig(newConfig);
        saveConfigToStorage(newConfig);
    };

    const updateRegenmonName = (newName: string) => {
        if (!regenmon) return;
        const updated = { ...regenmon, name: newName, nameChangeUsed: true };
        setRegenmon(updated);
        saveRegenmon(updated);
    };

    const dismissTutorial = () => {
        if (!regenmon) return;
        const updated = { ...regenmon, tutorialDismissed: true };
        setRegenmon(updated);
        saveRegenmon(updated);
    };

    return {
        regenmon,
        config,
        loading,
        createRegenmon,
        updateStatAction: updateStatsWithDeltas,
        toggleMusic,
        resetGame,
        markIntroSeen,
        updateRegenmonName,
        dismissTutorial,
    };
}
