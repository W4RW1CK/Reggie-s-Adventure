import { RegenmonStats } from './types';

// Límites de Stats
export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const STAT_INITIAL = 50;

// Valores de Acciones
export const ACTION_AMOUNT = 10; // Cantidad que sube/baja por acción

// Decaimiento
export const DECAY_RATE_PER_HOUR = 3; // Puntos que bajan por hora — 33h to empty from full
export const DECAY_INTERVAL_MS = 60000; // Intervalo de chequeo en vivo (1 min)

// Validación de Nombre
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 15;

// Valores Iniciales Defaults
export const INITIAL_STATS: RegenmonStats = {
    espiritu: STAT_INITIAL,
    pulso: STAT_INITIAL,
    esencia: STAT_INITIAL, // Empieza en 50
    fragmentos: 100, // Inicia con 100 Fragmentos
};

// Economía
export const PURIFY_COST = 10; // @deprecated — use PURIFY_SPIRIT_COST / PURIFY_ESSENCE_COST
export const SEARCH_FRAGMENTS_REWARD = 15;
export const SEARCH_FRAGMENTS_THRESHOLD = 0; // Solo aparece si tienes 0

// Photo system
export const PHOTO_COOLDOWN_MS = 300000;           // 5 minutes
export const PHOTO_FAILED_COOLDOWN_MS = 120000;    // 2 minutes
export const PHOTO_MAX_SIZE_MB = 5;
export const PHOTO_HISTORY_MAX = 20;
export const PHOTO_RATE_LIMIT = 5;                 // per minute

// Fragment ranges (photos)
export const FRAGMENT_PHOTO_WEAK: [number, number] = [3, 5];
export const FRAGMENT_PHOTO_MEDIUM: [number, number] = [5, 8];
export const FRAGMENT_PHOTO_STRONG: [number, number] = [8, 12];
export const FRAGMENT_PHOTO_PENALIZING = 0;

// Progress ranges
export const PROGRESS_CHAT_RANGE: [number, number] = [1, 3];
export const PROGRESS_PHOTO_WEAK: [number, number] = [2, 4];
export const PROGRESS_PHOTO_MEDIUM: [number, number] = [4, 7];
export const PROGRESS_PHOTO_STRONG: [number, number] = [7, 12];
export const PROGRESS_MISSION_BONUS = 5;

// Fracture thresholds
export const FRACTURE_THRESHOLDS = [50, 100, 200, 400];
export const PROGRESS_MAX = 600; // Cap: 600 × 2.5 = 1500 HUB pts (exact HUB ceiling)

// Purification S4 (split into two buttons)
export const PURIFY_SPIRIT_COST = 15;    // 15 fragments — meaningful trade-off
export const PURIFY_SPIRIT_GAIN = 12;    // +12 pulso — ~2.5 good chats worth
export const PURIFY_ESSENCE_COST = 15;   // 15 fragments
export const PURIFY_ESSENCE_GAIN = 12;   // +12 esencia — ~2.5 good chats worth

// Strikes
export const STRIKE_COOLDOWN_DURATION_MS = 1800000;    // 30 min
export const STRIKE_BLOCK_DURATION_MS = 172800000;      // 48 hrs
export const STRIKE_RESET_DAYS = 7;

// Missions
export const MISSION_EXPIRATION_MS = 86400000;          // 24 hrs
export const MISSION_BYPASS_WINDOW_MS = 1800000;        // 30 min
export const MISSION_GENERATION_CHANCE = 0.33;          // 33%

// Configuración de LocalStorage Keys

export const STORAGE_KEYS = {
    DATA: 'reggie-adventure-data',
    CONFIG: 'reggie-adventure-config',
    CHAT: 'reggie-adventure-chat',
    PLAYER: 'reggie-adventure-player',
    MEMORIES: 'reggie-adventure-memories', // [NEW Phase 26]
    STRIKES: 'reggie-adventure-strikes',   // [NEW Phase 49 — S4]
    MISSION: 'reggie-adventure-mission',   // [NEW Phase 49 — S4]
    ACTIVITY_LOG: 'reggie-adventure-activity-log', // [NEW Phase 58 — S4]
    DIARY_ENTRIES: 'reggie-adventure-diary-entries', // [NEW Phase 58 — S4]
    TUTORIAL_COMPLETED: 'reggie-adventure-tutorial-completed', // [NEW Phase 62 — S4]
    // S5 — Social / HUB
    HUB_REGENMON_ID: 'reggie-adventure-hub-id',
    IS_REGISTERED_IN_HUB: 'reggie-adventure-hub-registered',
    HUB_BALANCE: 'reggie-adventure-hub-balance',
};

// HUB API
export const HUB_URL = 'https://regenmon-final.vercel.app';

// Chat Constants
export const CHAT_MAX_MESSAGES = 50;
export const CHAT_MAX_CHARS = 140;
export const CHAT_COOLDOWN_MS = 3000;
export const CHAT_RATE_LIMIT = 15;
export const CHAT_SPIRIT_MAX_CHANGE = 5; // Maximo cambio de espíritu
export const CHAT_PULSE_CHANGE = -1; // Hablar gasta energía
export const CHAT_ESENCIA_COST = -2; // Hablar gasta esencia
export const CHAT_FRAGMENT_REWARD_RANGE: [number, number] = [0, 5];
export const CHAT_CRITICAL_THRESHOLD = 10;

// UI Constants
export const STAT_CHANGE_DISPLAY_MS = 3000;    // How long floating stat deltas show
export const MUSIC_CHAT_VOLUME = 0.6;          // Music volume during chat
export const MUSIC_FADE_MS = 1500;             // Music fade transition duration

// Pulse passive regen
export const PULSE_REGEN_RATE_PER_HOUR = 3;

