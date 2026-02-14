import { RegenmonData, AppConfig, RegenmonStats } from './types';
import { STORAGE_KEYS, INITIAL_STATS } from './constants';

// --- Helpers ---

const isBrowser = typeof window !== 'undefined';

function getStorageItem<T>(key: string, defaultValue: T | null = null): T | null {
    if (!isBrowser) return defaultValue;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
}

function setStorageItem<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
}

// --- Regenmon Data CRUD ---

export function saveRegenmon(data: RegenmonData): void {
    setStorageItem(STORAGE_KEYS.DATA, data);
}

export function loadRegenmon(): RegenmonData | null {
    return getStorageItem<RegenmonData>(STORAGE_KEYS.DATA);
}

export function updateStats(newStats: Partial<RegenmonStats>): RegenmonData | null {
    const currentData = loadRegenmon();
    if (!currentData) return null;

    const updatedData: RegenmonData = {
        ...currentData,
        stats: { ...currentData.stats, ...newStats },
        lastUpdated: new Date().toISOString(),
    };

    saveRegenmon(updatedData);
    return updatedData;
}

export function updateName(newName: string): RegenmonData | null {
    const currentData = loadRegenmon();
    if (!currentData) return null;

    const updatedData: RegenmonData = {
        ...currentData,
        name: newName,
        nameChangeUsed: true,
    };

    saveRegenmon(updatedData);
    return updatedData;
}

export function deleteRegenmon(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.DATA);
}

// --- App Config CRUD ---

export function saveConfig(config: AppConfig): void {
    setStorageItem(STORAGE_KEYS.CONFIG, config);
}

export function loadConfig(): AppConfig {
    const defaults: AppConfig = {
        musicEnabled: false,
        isFirstTime: true,
    };
    return getStorageItem<AppConfig>(STORAGE_KEYS.CONFIG, defaults) || defaults;
}
