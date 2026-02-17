import { RegenmonData, AppConfig, RegenmonStats, ChatMessage, PlayerData, RegenmonMemory } from './types';
import { STORAGE_KEYS, INITIAL_STATS } from './constants';

// --- Helpers ---

const isBrowser = typeof window !== 'undefined';

function getStorageItem<T>(key: string, defaultValue: T): T {
    if (!isBrowser) return defaultValue;
    try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        const parsed = JSON.parse(item);
        return parsed !== null ? parsed : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        // Clear corrupted data
        localStorage.removeItem(key);
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
    const data = getStorageItem<any | null>(STORAGE_KEYS.DATA, null);
    if (!data) return null;
    return migrateData(data);
}

// Migration Logic
function migrateData(data: any): RegenmonData {
    // 1. Convert Hambre -> Esencia (if needed)
    if (typeof data.stats.hambre === 'number' && typeof data.stats.esencia === 'undefined') {
        console.log('Migrating Hambre -> Esencia');
        data.stats.esencia = Math.max(0, 100 - data.stats.hambre); // Invert logic
        delete data.stats.hambre;
    }

    // 2. Initialize Fragmentos (if needed)
    if (typeof data.stats.fragmentos === 'undefined') {
        data.stats.fragmentos = 0;
    }

    // 3. Initialize Theme (if needed)
    if (typeof data.theme === 'undefined') {
        data.theme = 'dark';
    }

    // 4. Initialize Memories (if needed)
    if (!Array.isArray(data.memories)) {
        data.memories = [];
    }

    // 5. Initialize Evolution (if needed)
    if (!data.evolution) {
        data.evolution = { totalMemories: 0, stage: 1, threshold: 10 };
    }

    // 6. Sync evolution.totalMemories with actual memories count
    if (Array.isArray(data.memories)) {
        data.evolution.totalMemories = data.memories.length;
    }

    return data as RegenmonData;
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
    clearChatHistory();
    clearPlayerData();
    clearMemories(); // [NEW Phase 26]
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
    return getStorageItem<AppConfig>(STORAGE_KEYS.CONFIG, defaults);
}

// --- Chat History CRUD ---

export function saveChatHistory(history: ChatMessage[]): void {
    setStorageItem(STORAGE_KEYS.CHAT, history);
}

export function loadChatHistory(): ChatMessage[] {
    return getStorageItem<ChatMessage[]>(STORAGE_KEYS.CHAT, []);
}

export function clearChatHistory(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.CHAT);
}

// --- Player Data CRUD ---

export function savePlayerData(data: PlayerData): void {
    setStorageItem(STORAGE_KEYS.PLAYER, data);
}

export function loadPlayerData(): PlayerData | null {
    return getStorageItem<PlayerData | null>(STORAGE_KEYS.PLAYER, null);
}

export function clearPlayerData(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.PLAYER);
}

// --- Memories CRUD ---

const MAX_MEMORIES = 50;

export function saveMemories(memories: RegenmonMemory[]): void {
    // FIFO: keep only the last MAX_MEMORIES
    const trimmed = memories.slice(-MAX_MEMORIES);
    setStorageItem(STORAGE_KEYS.MEMORIES, trimmed);
}

export function saveMemory(key: string, value: string): void {
    const memories = loadMemories();
    const newMemory: RegenmonMemory = {
        key,
        value,
        type: 'datos_personales',
        discoveredAt: Date.now(),
    };

    const updatedMemories = [
        ...memories.filter(m => m.key !== key),
        newMemory
    ];

    saveMemories(updatedMemories);
}

export function loadMemories(): RegenmonMemory[] {
    return getStorageItem<RegenmonMemory[]>(STORAGE_KEYS.MEMORIES, []);
}

export function getMemory(key: string): RegenmonMemory | undefined {
    const memories = loadMemories();
    return memories.find(m => m.key === key);
}

export function clearMemories(): void {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.MEMORIES);
}

