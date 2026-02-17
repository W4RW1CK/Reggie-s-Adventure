
import { useState, useEffect, useCallback, useRef } from 'react';
import { RegenmonData, RegenmonStats, AppConfig } from '@/lib/types';
import {
    loadConfig,
    saveConfig as saveConfigToStorage,
    deleteRegenmon
} from '@/lib/storage';
import { 
    loadRegenmonHybrid, 
    saveRegenmonHybrid, 
    migrateLocalToSupabase 
} from '@/lib/sync';
import { useStatDecay } from './useStatDecay';
import { STAT_MIN, STAT_MAX, STAT_INITIAL } from '@/lib/constants';

interface UseGameStateProps {
    privyUserId?: string;
    isLoggedIn: boolean;
}

export function useGameState({ privyUserId, isLoggedIn }: UseGameStateProps) {
    const [regenmon, setRegenmon] = useState<RegenmonData | null>(null);
    const [config, setConfig] = useState<AppConfig>({ musicEnabled: false, isFirstTime: true });
    const [loading, setLoading] = useState(true);
    const [migrationComplete, setMigrationComplete] = useState(false);
    const pendingUpdatesRef = useRef<Partial<RegenmonStats>[]>([]);
    const previousPrivyUserId = useRef<string | undefined>(privyUserId);

    // Load initial data and handle auth changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadData = async () => {
            try {
                // Always load config from localStorage
                const loadedConfig = loadConfig();
                setConfig(loadedConfig);

                // Handle first login migration
                if (isLoggedIn && privyUserId && !migrationComplete && previousPrivyUserId.current !== privyUserId) {
                    console.log('First login detected, attempting migration...');
                    await migrateLocalToSupabase(privyUserId);
                    setMigrationComplete(true);
                }

                // Load regenmon data using hybrid strategy
                const loadedRegenmon = await loadRegenmonHybrid(privyUserId);
                setRegenmon(loadedRegenmon);
            } catch (error) {
                console.error('Error loading data:', error);
                // Fallback to localStorage only
                const loadedRegenmon = await loadRegenmonHybrid();
                setRegenmon(loadedRegenmon);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        
        // Update previous user ID
        previousPrivyUserId.current = privyUserId;
    }, [isLoggedIn, privyUserId, migrationComplete]);

    // Wrapper to update stats state AND storage
    const handleUpdateStats = useCallback((newStats: RegenmonStats) => {
        setRegenmon(current => {
            if (!current) return null;
            const updated = { ...current, stats: newStats, lastUpdated: new Date().toISOString() };
            // Use hybrid save strategy
            saveRegenmonHybrid(updated, privyUserId).catch(error => {
                console.error('Error saving regenmon:', error);
            });
            return updated;
        });
    }, [privyUserId]);

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
            stats: { espiritu: STAT_INITIAL, pulso: STAT_INITIAL, esencia: 100, fragmentos: 0 },
            theme: 'dark',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            nameChangeUsed: false,
            tutorialDismissed: false,
        };
        setRegenmon(newData);
        
        // Use hybrid save strategy
        saveRegenmonHybrid(newData, privyUserId).catch(error => {
            console.error('Error saving new regenmon:', error);
        });

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

                // Side effect: save to storage using hybrid strategy
                saveRegenmonHybrid(updatedRegenmon, privyUserId).catch(error => {
                    console.error('Error saving stats update:', error);
                });

                return updatedRegenmon;
            });
        };

        setTimeout(processUpdates, 0); // Next tick
    }, [privyUserId]);

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
        saveRegenmonHybrid(updated, privyUserId).catch(error => {
            console.error('Error saving name update:', error);
        });
    };

    const dismissTutorial = () => {
        if (!regenmon) return;
        const updated = { ...regenmon, tutorialDismissed: true };
        setRegenmon(updated);
        saveRegenmonHybrid(updated, privyUserId).catch(error => {
            console.error('Error saving tutorial dismissal:', error);
        });
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
