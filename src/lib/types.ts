export interface EvolutionData {
    totalMemories: number;
    stage: number;      // 1 = base, 2 = intermediate, 3 = advanced
    threshold: number;  // memories needed for next stage
}

export type RegenmonType = 'rayo' | 'flama' | 'hielo';

export interface RegenmonStats {
    espiritu: number; // 🔮 Espíritu — moral/voluntad (0-100)
    pulso: number;    // 💛 Pulso — energía vital (0-100)
    esencia: number;  // 🌱 Esencia — nutrición/vitalidad (0-100, 100=Bien)
    fragmentos: number; // 💠 Moneda del juego
}

export interface PhotoEntry {
    timestamp: number;
    resonanceLevel: ResonanceLevel;
    fragmentsEarned: number;
    progressEarned: number;
    diaryEntry: string;
    resonanceReason: string;
}

export interface StrikeData {
    count: number;               // 0-3
    lastStrikeAt: number | null;
    cooldownUntil: number | null;
    blockedUntil: number | null;
}

export interface Mission {
    id: string;
    prompt: string;
    createdAt: number;
    expiresAt: number;
    completed: boolean;
    bypassUsed: boolean;
}

export interface RegenmonData {
    // Identidad
    name: string;              // 2-15 caracteres
    type: RegenmonType;

    // Stats
    stats: RegenmonStats;

    // Visuals
    theme: 'dark' | 'light';      // Tema visual

    // Timestamps
    createdAt: string;         // ISO 8601
    lastUpdated: string;       // ISO 8601

    // Flags
    nameChangeUsed: boolean;   // ¿Ya usó su único cambio de nombre?
    tutorialDismissed: boolean; // ¿Ya descartó el tutorial?

    // Memories
    memories: RegenmonMemory[]; // Memorias del Regenmon sobre el usuario

    // Evolution
    evolution: EvolutionData;

    // Evolution S4
    progress: number;              // 0+, only goes UP, never decreases
    photoHistory: PhotoEntry[];    // max 20, metadata only, NO images
    strikes: StrikeData;
    lastPhotoAt: number | null;
    activeMission: Mission | null;
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
    memories?: RegenmonMemory[]; // Memorias existentes del Regenmon
}

export interface ChatResponse {
    message: string;           // Respuesta del Regenmon (≤50 palabras)
    statsChange: Partial<RegenmonStats>; // Cambios en stats
    playerName?: string;       // Si descubrió el nombre del jugador
    memories?: Array<{key: string, value: string, type: string}>; // Memorias descubiertas
}

export interface PlayerData {
    name: string;          // Nombre descubierto por la IA
    discoveredAt: number;  // Timestamp de descubrimiento
}

export type ResonanceLevel = 'weak' | 'medium' | 'strong' | 'penalizing';

export interface VisionRequest {
    imageBase64: string;
    regenmonType: RegenmonType;
    regenmonName: string;
    stats: { espiritu: number; pulso: number; esencia: number };
    memories: RegenmonMemory[];
}

export interface VisionResponse {
    fragments: number;            // 0-12
    spiritChange: number;         // -5 to +5
    pulseChange: number;          // -3 to +3
    essenceChange: number;        // -2 to -1 (always negative)
    diaryEntry: string;           // ~100 chars, from Regenmon's perspective
    resonanceLevel: ResonanceLevel;
    resonanceReason: string;      // brief explanation
}

export type MemoryType = 'nombre' | 'gustos' | 'emociones' | 'datos_personales' | 'tema_frecuente';

export interface RegenmonMemory {
    key: string;           // Identificador único (ej: "likes_pizza")
    value: string;         // Dato recordado (ej: "El usuario ama la pizza")
    type: MemoryType;      // Categoría de memoria
    discoveredAt: number;  // Timestamp
}

// --- S4 Consolidated Types ---

/** Evolution stage (1-5), derived from progress via FRACTURE_THRESHOLDS */
export type EvolutionStage = 1 | 2 | 3 | 4 | 5;

/** Evaluation result from photo Vision API */
export interface EvaluationResult {
    fragments: number;
    progress: number;
    spiritChange: number;
    pulseChange: number;
    essenceChange: number;
    diaryEntry: string;
    resonanceLevel: ResonanceLevel;
    resonanceReason: string;
}

/** Fragment transaction for activity history */
export interface FragmentTransaction {
    action: 'purify_spirit' | 'purify_essence' | 'chat' | 'photo' | 'search_fragments' | 'mission';
    fragmentChange: number;
    progressChange: number;
    timestamp: number;
    detail?: string;
}

/** Diary entry from Regenmon's emotional perspective */
export interface DiaryEntry {
    text: string;
    timestamp: number;
    resonance: ResonanceLevel;
    source: 'photo' | 'fracture' | 'mission';
}

/** World health level mapped from evolution stage */
export type WorldHealth = 'corrupted' | 'healing' | 'recovering' | 'flourishing' | 'regenerated';

/** Cooldown status for photo system */
export interface CooldownStatus {
    canTakePhoto: boolean;
    remainingMs: number;
    reason: 'ready' | 'cooldown' | 'strike_cooldown' | 'blocked';
}

/** Mission data (alias for Mission, used in BACKEND_STRUCTURE) */
export type MissionData = Mission;

/** World state metadata for UI rendering */
export interface WorldState {
    health: WorldHealth;
    description: string;
    backgroundIntensity: number;
    particleFrequency: number;
    corruptionLevel: number;
}
