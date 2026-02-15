export type RegenmonType = 'rayo' | 'flama' | 'hielo';

export interface RegenmonStats {
    espiritu: number; // 🔮 Espíritu — moral/voluntad (0-100)
    pulso: number;    // 💛 Pulso — energía vital (0-100)
    hambre: number;   // 🍎 Hambre — necesidad de alimento (0-100)
}

export interface RegenmonData {
    // Identidad
    name: string;              // 2-15 caracteres
    type: RegenmonType;

    // Stats
    stats: RegenmonStats;

    // Timestamps
    createdAt: string;         // ISO 8601
    lastUpdated: string;       // ISO 8601

    // Flags
    nameChangeUsed: boolean;   // ¿Ya usó su único cambio de nombre?
    tutorialDismissed: boolean; // ¿Ya descartó el tutorial?
}

export interface AppConfig {
    musicEnabled: boolean;     // Toggle de música
    isFirstTime: boolean;      // ¿Primera vez que abre la app?
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface ChatRequest {
    message: string;         // Mensaje del usuario (max 280 chars)
    history: ChatMessage[];  // Historial completo (max 50 mensajes)
    regenmon: {
        name: string;           // Nombre del Regenmon
        type: RegenmonType;
        stats: RegenmonStats;
        daysAlive: number;      // Días desde la creación
    };
    playerName?: string;      // Nombre del jugador (si ya se descubrió)
}

export interface ChatResponse {
    message: string;           // Respuesta del Regenmon (≤50 palabras)
    spiritChange: number;      // -5 a +5 (cambio en Espíritu)
    playerName?: string;       // Si descubrió el nombre del jugador
}

export interface PlayerData {
    name: string;          // Nombre descubierto por la IA
    discoveredAt: number;  // Timestamp de descubrimiento
}
