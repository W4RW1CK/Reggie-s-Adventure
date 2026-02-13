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
