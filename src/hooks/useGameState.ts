
import { useState, useEffect, useCallback } from 'react';
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
        if (!regenmon) return;

        const updatedRegenmon = {
            ...regenmon,
            stats: newStats,
            lastUpdated: new Date().toISOString(),
        };

        setRegenmon(updatedRegenmon);
        saveRegenmon(updatedRegenmon);
    }, [regenmon]);

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

    const updateStatAction = (stat: keyof RegenmonStats, amount: number) => {
        if (!regenmon) return;

        const currentVal = regenmon.stats[stat];
        // Check limits
        if (amount > 0 && currentVal >= STAT_MAX) return; // Can't go above max
        if (amount < 0 && currentVal <= STAT_MIN) return; // Can't go below min

        const newVal = Math.max(STAT_MIN, Math.min(STAT_MAX, currentVal + amount));

        // Construct new stats object
        const newStats = { ...regenmon.stats, [stat]: newVal };
        handleUpdateStats(newStats);
    };

    const toggleMusic = () => {
        const newConfig = { ...config, musicEnabled: !config.musicEnabled };
        setConfig(newConfig);
        saveConfigToStorage(newConfig);
    };

    const resetGame = () => {
        deleteRegenmon();
        setRegenmon(null);
        setConfig({ ...config, isFirstTime: false });
    };

    const markIntroSeen = () => {
        const newConfig = { ...config, isFirstTime: false };
        setConfig(newConfig);
        saveConfigToStorage(newConfig);
    };

    return {
        regenmon,
        config,
        loading,
        createRegenmon,
        updateStatAction,
        toggleMusic,
        resetGame,
        markIntroSeen,
    };
}
