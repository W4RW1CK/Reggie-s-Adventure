import { RegenmonStats } from './types';

// Límites de Stats
export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const STAT_INITIAL = 50;

// Valores de Acciones
export const ACTION_AMOUNT = 10; // Cantidad que sube/baja por acción

// Decaimiento
export const DECAY_RATE_PER_HOUR = 2; // Puntos que bajan por hora
export const DECAY_INTERVAL_MS = 60000; // Intervalo de chequeo en vivo (1 min)

// Validación de Nombre
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 15;

// Valores Iniciales Defaults
export const INITIAL_STATS: RegenmonStats = {
    espiritu: STAT_INITIAL,
    pulso: STAT_INITIAL,
    hambre: STAT_INITIAL,
};

// Configuración de LocalStorage Keys

export const STORAGE_KEYS = {
    DATA: 'reggie-adventure-data',
    CONFIG: 'reggie-adventure-config',
    CHAT: 'reggie-adventure-chat',
    PLAYER: 'reggie-adventure-player',
};

// Chat Constants
export const CHAT_MAX_MESSAGES = 50;
export const CHAT_MAX_CHARS = 280;
export const CHAT_COOLDOWN_MS = 3000;
export const CHAT_RATE_LIMIT = 15;
export const CHAT_SPIRIT_MAX_CHANGE = 5;
export const CHAT_PULSE_CHANGE = -2;
export const CHAT_HUNGER_CHANGE = 1;
export const CHAT_CRITICAL_THRESHOLD = 10;

