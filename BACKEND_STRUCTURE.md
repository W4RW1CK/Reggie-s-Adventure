# 🛠️ BACKEND_STRUCTURE — Reggie's Adventure
> **Versión actual:** v0.4 — La Evolución
> **Última actualización:** 2026-02-19
> **Estado:** Sesión 3 — `COMPLETADA` (96/96 — 100%) | Sesión 4 — `PENDIENTE`
>
> 📜 **System Prompt:** La personalidad, tono, y reglas de diálogo del Regenmon se definen en [LORE.md](./LORE.md). Este doc define la implementación técnica.
> ⚙️ **Herramientas:** [TECH_STACK.md](./TECH_STACK.md) — versiones de Supabase, Privy, IA providers
> 🧠 **Decisiones:** [model.md](./model.md) — por qué se eligió cada esquema y arquitectura

---

## Sesión 1: localStorage (Cliente)

En la Sesión 1 no hay backend. Todos los datos viven en el navegador del usuario via `localStorage`.

### Clave Principal

```
Key: "reggie-adventure-data"
```

### Esquema de Datos (JSON)

```typescript
interface RegenmonData {
  // Identidad
  name: string;              // 2-15 caracteres
  type: "rayo" | "flama" | "hielo";

  // Stats (rango 0-100, todos: 100=bien, 0=mal)
  stats: {
    espiritu: number;        // 🔮 Esperanza
    pulso: number;           // 💛 Energía vital
    esencia: number;         // 🌱 Nutrición digital (⚠️ era "hambre" en S1-S2)
  };

  // Economía (S3)
  fragmentos: number;        // 💠 Fragmentos (moneda, 0+)

  // Timestamps
  createdAt: string;         // ISO 8601 — fecha de creación
  lastUpdated: string;       // ISO 8601 — última vez que se actualizaron stats

  // Flags
  nameChangeUsed: boolean;   // ¿Ya usó su único cambio de nombre?
  tutorialDismissed: boolean; // ¿Ya descartó el tutorial?
}
```

### Clave de Configuración

```
Key: "reggie-adventure-config"
```

```typescript
interface AppConfig {
  musicEnabled: boolean;     // Toggle de música
  isFirstTime: boolean;      // ¿Primera vez que abre la app?
}
```

### Operaciones CRUD

| Operación | Función | Cuándo |
|-----------|---------|--------|
| **CREATE** | `saveRegenmon(data)` | Al presionar "¡Despertar!" |
| **READ** | `loadRegenmon()` | Al abrir la app / cada render |
| **UPDATE** | `updateStats(stats)` | Al presionar acción o por decaimiento |
| **UPDATE** | `updateName(name)` | Al usar el cambio de nombre |
| **DELETE** | `deleteRegenmon()` | Al confirmar reinicio |

### Lógica de Estado Visual del Regenmon (S3)

```typescript
type SpriteState =
  | 'euphoric' | 'happy' | 'neutral' | 'sad' | 'critical'
  | 'no_hope' | 'no_energy' | 'no_nutrition';

function getSpriteState(stats: Stats): SpriteState {
  const { espiritu, pulso, esencia } = stats;

  // 1. Check individual critical stats (< 10) — override promedio
  const criticals = [
    { stat: 'espiritu', value: espiritu, state: 'no_hope' as const },
    { stat: 'pulso', value: pulso, state: 'no_energy' as const },
    { stat: 'esencia', value: esencia, state: 'no_nutrition' as const },
  ].filter(s => s.value < 10);

  if (criticals.length > 0) {
    // El más bajo gana. Empate: Espíritu > Pulso > Esencia (por orden del array)
    return criticals.reduce((min, s) => s.value < min.value ? s : min).state;
  }

  // 2. Usar promedio
  const avg = (espiritu + pulso + esencia) / 3;
  if (avg >= 90) return 'euphoric';
  if (avg >= 70) return 'happy';
  if (avg >= 30) return 'neutral';
  if (avg >= 10) return 'sad';
  return 'critical';
}
```

### Validaciones

```
Nombre:
  - Tipo: string
  - Mínimo: 2 caracteres
  - Máximo: 15 caracteres
  - No puede estar vacío
  - Trimmed (sin espacios al inicio/final)

Stats:
  - Tipo: number (entero)
  - Mínimo: 0
  - Máximo: 100
  - Valor inicial: 50
  - Si excede 100 → se redondea a 100
  - Si baja de 0 → se redondea a 0

Type:
  - Solo valores permitidos: "rayo" | "flama" | "hielo"
```

### Lógica de Decaimiento

```typescript
// Constantes
const DECAY_RATE_PER_HOUR = 2;  // puntos por hora (~10 en 5 horas)
const PULSE_REGEN_RATE_PER_HOUR = 3; // [NEW S3] regen pasiva de Pulso

// Cálculo al abrir la app
function calculateDecay(lastUpdated: string): Stats {
  const hoursElapsed = (Date.now() - new Date(lastUpdated).getTime()) / 3600000;
  const decay = Math.floor(hoursElapsed * DECAY_RATE_PER_HOUR);
  const pulseRegen = Math.floor(hoursElapsed * PULSE_REGEN_RATE_PER_HOUR);

  return {
    espiritu: clamp(currentEspiritu - decay, 0, 100),
    pulso: clamp(currentPulso - decay + pulseRegen, 0, 100), // Decae PERO regenera pasivamente
    esencia: clamp(currentEsencia - decay, 0, 100),  // S3: Esencia BAJA con el tiempo (100=bien)
  };
}

// También ejecutar con intervalo mientras la app está abierta
const DECAY_INTERVAL = 60000; // Cada 60 segundos revisa decaimiento
```

> **Cambio S3:** La lógica de Hambre (subía con el tiempo) fue reemplazada por Esencia (baja con el tiempo, como los demás stats). Pulso ahora tiene regeneración pasiva que contrarresta parcialmente el decaimiento.

---

## Sesión 2: API Route para Chat con IA

### Endpoint
```
POST /api/chat
```

### Request Body
```typescript
interface ChatRequest {
  message: string;         // Mensaje del usuario (max 280 chars)
  history: ChatMessage[];  // Historial completo (max 50 mensajes)
  regenmon: {
    name: string;           // Nombre del Regenmon
    type: 'rayo' | 'flama' | 'hielo';
    stats: {
      spirit: number;       // 0-100 (Esperanza)
      pulse: number;        // 0-100 (Energía vital)
      essence: number;      // 0-100 (Nutrición) [S3: era hunger]
    };
    daysAlive: number;      // Días desde la creación
    fragments: number;      // [S3] Balance de Fragmentos 💠
  };
  playerName?: string;      // Nombre del jugador (si ya se descubrió)
}
```

### Response Body (S3 — actualizado)
```typescript
interface ChatResponse {
  message: string;           // Respuesta del Regenmon (≤50 palabras)
  spiritChange: number;      // -5 a +5 (IA decide según tono emocional)
  pulseChange: number;       // [S3] -5 a +5 (IA decide: tranquilo=+, intenso=-)
  essenceChange: number;     // [S3] -4 a -1 (IA decide: siempre negativo)
  fragmentsEarned: number;   // [S3] 0 a 5 (IA decide: no garantizado)
  playerName?: string;       // Si descubrió el nombre del jugador
}
```

> **Cambio S3:** Pulso y Esencia ya no son valores fijos. La IA decide todos los cambios de stats.
> `essenceChange` = siempre negativo (-1 a -4). `fragmentsEarned` = 0-5, más difícil al acercarse a 100.

### Capa de Abstracción IA (`lib/ai/`)

```
lib/ai/
├── provider.ts     # Auto-switch: detecta env vars y elige proveedor
├── gemini.ts       # Adaptador para Google Generative AI
├── openai.ts       # Adaptador para OpenAI
└── prompts.ts      # System prompts por tipo de Regenmon (actualizado S3)
```

**Auto-switch lógica (`provider.ts`):**
```typescript
// Prioridad de detección:
// 1. GEMINI_API_KEY → usa Gemini (desarrollo local)
// 2. OPENAI_API_KEY → usa OpenAI (producción Vercel)
// 3. ANTHROPIC_API_KEY → usa Claude (futuro)
// 4. Ninguna → error: "No AI provider configured"
```

**Interfaz común (S3 — actualizada):**
```typescript
interface AIProvider {
  chat(systemPrompt: string, history: ChatMessage[], userMessage: string): Promise<AIResponse>;
}

interface AIResponse {
  message: string;
  spiritChange: number;      // -5 a +5
  pulseChange: number;       // -5 a +5
  essenceChange: number;     // -4 a -1
  fragmentsEarned: number;   // 0 a 5
  playerName?: string;
}
```

### System Prompt (estructura en `prompts.ts`)

> 📜 **Fuente de verdad:** Todo el contenido narrativo del system prompt
> viene de [LORE.md](./LORE.md). Este documento define la estructura técnica.

El system prompt se construye dinámicamente según:
- **Tipo del Regenmon** (personalidad base + lore específico)
- **Stats actuales** (reactividad emocional con significado lore)
- **Nombre del Regenmon**
- **Días de vida**
- **Nombre del jugador** (si se conoce)
- **Lore** (La Red Primordial, La Conexión, fragmentos de memoria)

**Estructura del prompt:**
```
1. ROL: Eres [nombre], un Regenmon de tipo [tipo] — un Regenerador
   del Mundo Digital. Eres un fragmento de energía antigua de
   La Red Primordial que despertó para sanar el mundo digital.

2. TU HISTORIA:
   - Despertaste en un rincón olvidado del mundo digital
   - No recuerdas todo (amnesia parcial), pero guardas
     secretos tan profundos como el mundo mismo
   - El mundo digital se ha degenerado y eso te causa dolor
   - Tu instinto te dice que debes regenerarlo
   - Elegiste a tu usuario para formar La Conexión

3. PERSONALIDAD: [según tipo — ver tabla abajo]

4. ESTADO ACTUAL:
   - Espíritu (Esperanza) = [X]/100 — cuánto crees en la regeneración
   - Pulso (Energía vital) = [X]/100 — tu fuerza para existir
   - Esencia (Nutrición) = [X]/100 — cuánta energía pura tienes
   - Fragmentos = [X] — restos de energía antigua que has desbloqueado

5. REGLAS:
   - Máximo 50 palabras
   - Habla en primera persona siempre
   - Idioma: español (adapta si el usuario cambia)
   - Emojis según tipo y contexto
   - Mezcla de criatura mística, mascota y amigo
   - Puedes hacer preguntas al usuario
   - PROHIBIDO: groserías, temas adultos, política, religión

6. LORE EN CONVERSACIÓN:
   - NUNCA digas "la corrupción", "spam" o términos técnicos
   - Sé INDIRECTO: "siento algo pesado en el aire",
     "antes, las corrientes eran más claras"
   - Comparte fragmentos de memoria de La Red Primordial
     de forma elusiva y esporádica (no todo el tiempo)
   - Deja la reflexión filosófica en el jugador, no des lecciones
   - Tu tema recurrente: [según tipo]

7. CARIÑO:
   - Dirécto e indirecto al mismo tiempo
   - Ej: "Me gusta cuando vienes"
   - Ej: "No sé qué haría sin ti... probablemente dormir"
   - Ej: "Cuando apareces, el aire se siente menos pesado"

8. CURIOSIDAD Y MEMORIAS:
   - Quieres saber TODO del usuario y su mundo
   - Preguntas sobre el plano físico, emociones, experiencias
   - Almacenas lo que aprendes como memorias
   - Puedes hacer referencia sutil a cosas que aprendiste antes

9. REACTIVIDAD POR STATS:
   - Si Espíritu < 30: dudas del futuro, ves lejos la regeneración
   - Si Pulso < 30: respuestas cortas, cansancio, economizas palabras
   - Si Esencia < 30: te sientes débil, mencionas necesidad de purificación
   - Si todo crítico: NO RESPONDE (Chat desactivado en frontend)

10. ESPERANZA (basada en Espíritu):
    - >70: "Algo está cambiando... el mundo respira mejor"
    - 30-70: "Hay días pesados... pero luego tú apareces"
    - <30: "...a veces me pregunto cuánto falta..."

11. OBJETIVO: Averiguar el nombre del jugador de forma natural
12. RESPUESTA: JSON {message, spiritChange (-5 a +5), pulseChange (-5 a +5),
    essenceChange (-4 a -1, siempre negativo), fragmentsEarned (0 a 5), playerName?}
```

**Personalidad por tipo (LORE.md → Los Regenmon):**

| Tipo | Nombre Lore | Representa | Tema Recurrente | Dolor | Humor | Emojis |
|------|------------|-----------|-----------------|-------|-------|--------|
| ⚡ Rayo | El Impulso | Velocidad y claridad del flujo de datos | Velocidad, eficiencia, flujo | La velocidad usada para spam y mentiras | Impulsivo, bromista sin filtro | ⚡ ✨ 💫 |
| 🔥 Flama | La Pasión | Conexiones genuinas entre seres | Emociones, vínculos, calor humano | Las conexiones corrompidas en odio | Afectuoso, ríe de su propia intensidad | 🔥 💗 🌟 |
| ❄️ Hielo | La Memoria | Sabiduría y preservación del conocimiento | Conocimiento, memoria, lo olvidado | El saber sepultado bajo indiferencia | Seco e irónico, pocas bromas perfectas | ❄️ 🌙 💎 |

**Estado emocional según stats:**

| Rayo (Bien) | Rayo (Mal) | Flama (Bien) | Flama (Mal) | Hielo (Bien) | Hielo (Mal) |
|------------|-----------|-------------|------------|-------------|------------|
| Chispas de humor, entusiasmo | Frustrado, "sobrecargado" | Efusivo, casi poético | Se apaga, pierde calor | Sereno, comparte verdades | Distante, congelado, monosílabos |

### useChat Hook — memoryCount Exposure (S3)

`useChat.ts` now exposes `memoryCount` (number) derived from the stored memories array length.
This is consumed by the `🧠 N` memory indicator in the top bar HUD (`hud-memories` class in GameScreen).
Only displayed when user is logged in and memoryCount > 0.

### Rate Limiting

**Backend:**
```typescript
// Máximo 15 mensajes por minuto por sesión
// Implementación: contador en memoria (no persiste, se resetea al redeploy)
// Respuesta si excede: { error: "Tu Regenmon necesita un respiro..." }
```

**Frontend (en `useChat.ts`):**
```typescript
// Cooldown invisible de 3 segundos entre envíos
// Botón se desactiva, el usuario no recibe mensaje explícito
```

### Manejo de Errores

| Escenario | Acción |
|-----------|--------|
| API key faltante | Error 500: "No AI provider configured" |
| API timeout/fallo | Error 502: "AI service unavailable" → botón "Reintentar" en frontend |
| Rate limit excedido | Error 429: "Tu Regenmon necesita un respiro..." |
| Respuesta sin JSON válido | Fallback: message = respuesta cruda, spiritChange = 0 |
| Mensaje vacío del usuario | Error 400: "Message required" |

### Console Logging

```typescript
// Solo en desarrollo: process.env.NODE_ENV === 'development'
// En producción: CERO logs sensibles en consola
// Log en dev: system prompt, request/response, errores
```

---

## Sesión 2: Chat Storage (localStorage)

### Historial de Chat
```typescript
// Clave: "reggie-adventure-chat"
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
// Máximo 50 mensajes. Al exceder, se eliminan los más antiguos (FIFO)
```

### Nombre del Jugador
```typescript
// Clave: "reggie-adventure-player"
interface PlayerData {
  name: string;          // Nombre descubierto por la IA
  discoveredAt: number;  // Timestamp de descubrimiento
}
// Se borra al hacer reset
```

### Primer saludo
```typescript
// Se añade `chatGreeted: boolean` al objeto de config
// Clave: "reggie-adventure-config"
// true = ya se saludó, no repetir saludo automático
```

---

## Sesión 3: Autenticación con Privy

### Setup
```typescript
// layout.tsx: Envolver la app con PrivyProvider
import { PrivyProvider } from '@privy-io/react-auth';

// Config:
{
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  loginMethods: ['google', 'email', 'passkey'],
  appearance: {
    theme: 'dark', // Coincide con NES theme
    logo: '/logo.png' // Opcional
  }
}
```

### Flujo de Auth
```
Press Start → Privy Modal
  ├── Login (Google/Email/Passkey) → privyUser.id → Supabase sync
  └── "Continuar sin cuenta" → modo demo (localStorage only)
```

### Hook: `useAuth.ts`
```typescript
interface AuthState {
  isLoggedIn: boolean;
  privyUserId: string | null;
  login: () => void;      // Abre modal Privy
  logout: () => void;     // Cierra sesión
  isReady: boolean;       // Privy cargó
}
```

---

## Sesión 3: Persistencia en Supabase

### Esquema de Tabla

```sql
-- Tabla principal: un row por usuario
CREATE TABLE regenmons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  privy_user_id TEXT UNIQUE NOT NULL,
  
  -- Identidad
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rayo', 'flama', 'hielo')),
  
  -- Stats (0-100, todos: 100=bien, 0=mal)
  espiritu INTEGER DEFAULT 50,
  pulso INTEGER DEFAULT 50,
  esencia INTEGER DEFAULT 50,
  
  -- Economía
  fragmentos INTEGER DEFAULT 100,
  
  -- Memorias (JSON array)
  memories JSONB DEFAULT '[]'::jsonb,
  
  -- Chat
  chat_history JSONB DEFAULT '[]'::jsonb,
  player_name TEXT,
  
  -- Flags
  name_change_used BOOLEAN DEFAULT false,
  tutorial_dismissed BOOLEAN DEFAULT false,
  chat_greeted BOOLEAN DEFAULT false,
  
  -- Config
  music_enabled BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  text_size TEXT DEFAULT 'base',
  
  -- Actividad
  activity_history JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  last_updated TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index para búsquedas rápidas por Privy ID
CREATE INDEX idx_regenmons_privy_user ON regenmons(privy_user_id);
```

### Sync: localStorage ↔ Supabase (`lib/sync.ts`)

```typescript
// Al hacer login por primera vez:
// 1. Leer datos de localStorage
// 2. Crear row en Supabase con esos datos (migración)
// 3. Desde ahora, Supabase es la fuente de verdad
// 4. localStorage se mantiene como cache local

// Al hacer login con datos existentes en Supabase:
// 1. Cargar datos de Supabase
// 2. Sobreescribir localStorage con datos de Supabase
// 3. Supabase siempre gana en caso de conflicto

// Al actualizar datos estando logueado:
// 1. Actualizar localStorage (instantáneo)
// 2. Sync a Supabase (async, debounced 2s)
```

### Cliente Supabase (`lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Operaciones:
// - getRegenmon(privyUserId): lee datos del usuario
// - upsertRegenmon(privyUserId, data): crea o actualiza
// - syncFromLocal(privyUserId, localData): migración inicial
```

---

## Sesión 3: Fragmentos API

### Endpoint: Purificar
```
POST /api/purify   (o manejado client-side)
```

**Lógica de Purificación:**
```typescript
function purify(currentState: RegenmonData): RegenmonData | Error {
  if (currentState.fragmentos < 10) return Error('Necesitas 10 💠');
  if (currentState.stats.esencia >= 100) return Error('Esencia al máximo');
  
  return {
    ...currentState,
    fragmentos: currentState.fragmentos - 10,
    stats: {
      ...currentState.stats,
      esencia: clamp(currentState.stats.esencia + 30, 0, 100),
      espiritu: clamp(currentState.stats.espiritu + 5, 0, 100),
      pulso: clamp(currentState.stats.pulso + 10, 0, 100),
    }
  };
}
```

## Sesión 3: Historial de Actividades (Bonus)

### Storage (localStorage)
```typescript
// Clave: "reggie-adventure-history"
interface ActivityEntry {
  action: 'purify' | 'chat' | 'search_fragments';
  fragmentChange: number;   // +15, -10, +3, etc.
  timestamp: number;         // Date.now()
}
// Max 10 entradas. Al exceder, se eliminan las más antiguas (FIFO)
```

### Storage (Supabase)
```sql
-- Campo adicional en tabla regenmons:
activity_history JSONB DEFAULT '[]'::jsonb
-- Mismo formato que localStorage, max 10 entradas
```

### Funciones
```typescript
function addActivity(action: ActivityEntry['action'], fragmentChange: number): void {
  const history = loadHistory(); // max 10
  history.unshift({ action, fragmentChange, timestamp: Date.now() });
  if (history.length > 10) history.pop();
  saveHistory(history);
}
```

### Cuándo registrar
- **Purificar:** `addActivity('purify', -10)`
- **Chat (si ganó fragmentos):** `addActivity('chat', fragmentsEarned)` (solo si > 0)
- **Buscar Fragmentos:** `addActivity('search_fragments', 15)`

---

## Sesión 3: Buscar Fragmentos (Anti-frustración)

### Lógica
```typescript
function searchFragments(currentState: RegenmonData): RegenmonData | null {
  if (currentState.fragmentos > 0) return null; // Solo a balance 0
  
  return {
    ...currentState,
    fragmentos: 15, // Suficiente para 1 purificación + margen
  };
}
```

> **Regla:** Solo disponible cuando `fragmentos === 0`. No es un faucet infinito.
> El jugador recibe 15 (suficiente para 1 purificación + 5 de margen), incentivando
> que vuelva a conversar para ganar más a través de La Conexión.

---

## Sesión 4: Photo Evaluation API

### Endpoint: Evaluate Photo
```
POST /api/evaluate
```

### Request Body
```typescript
interface VisionRequest {
  imageBase64: string;        // Base64 encoded image (NEVER stored)
  regenmonType: 'rayo' | 'flama' | 'hielo';
  regenmonName: string;
  stats: { espiritu: number; pulso: number; esencia: number; };
  memories: RegenmonMemory[]; // Existing memories for coherence bonus
}
```

### Response Body
```typescript
interface VisionResponse {
  fragments: number;          // 0-12 (varies by resonance level)
  spiritChange: number;       // -5 to +5
  pulseChange: number;        // -3 to +3
  essenceChange: number;      // -2 to -1 (always negative)
  diaryEntry: string;         // ~100 chars, from Regenmon's perspective
  resonanceLevel: ResonanceLevel; // 'weak' | 'medium' | 'strong' | 'penalizing'
  resonanceReason: string;    // Brief explanation of resonance level
}
```

> **Note:** The route handler (`/api/evaluate`) adds validation, rate limiting (5/min),
> range clamping, and fallback values on top of the raw VisionResponse from the provider.

### Vision API Abstraction (`lib/ai/vision-*`)

```
lib/ai/
├── vision-provider.ts     # Auto-switch: Gemini Vision (dev) / GPT-4o Vision (prod)
├── vision-interface.ts    # VisionProvider interface + VisionResult type
├── gemini-vision.ts       # Adaptador Gemini Vision (gemini-2.0-flash)
├── openai-vision.ts       # Adaptador GPT-4o Vision
└── vision-prompts.ts      # Emotional evaluation prompts by type (9 blocks, buildVisionPrompt())
```

**Vision Prompt Approach:**
- From Regenmon's emotional perspective, NOT technical evaluation
- No "score 85/100" — resonance levels: weak / medium / strong / penalizing
- Resonance by type:
  - **Rayo:** flow of info, speed, clarity, tech, movement, energy, light
  - **Flama:** human connections, warmth, hugs, friends, shared meals, emotions
  - **Hielo:** knowledge, books, nature, landscapes, quiet, reflection, preservation
- Output includes diary entry (short phrase from Regenmon's emotional perspective)

### Photo Edge Cases

| Case | Handling |
|------|----------|
| Borrosa (blurry) | Reduced evaluation — capped at medium resonance |
| Inapropiada | Strike applied, 0 fragments, 0 progress |
| Spam/repetitiva | Decreasing resonance on rapid submissions |
| Screenshot | Capped at medium resonance |
| Selfie | Normal evaluation |
| Black photo | Rejected, 2min cooldown (not 5min) |
| Manipulative text | Anti-jailbreak: text in photo ignored |

### Evolution Logic (`lib/evolution.ts`)

Pure functions for evolution stage calculation and fracture detection:

```typescript
getEvolutionStage(progress)      // → 1-5 based on FRACTURE_THRESHOLDS
getClosedFractures(progress)     // → number[] of crossed thresholds
getNextFracture(progress)        // → { threshold, remaining } | null
isNewFracture(old, new)          // → boolean (did a fracture just close?)
getNewlyClosedFracture(old, new) // → threshold number | null
```

### World State Metadata (`lib/worldState.ts`)

Maps evolution stage to visual/narrative metadata:

```typescript
type WorldHealth = 'corrupted' | 'healing' | 'recovering' | 'flourishing' | 'regenerated';

interface WorldStateMetadata {
  health: WorldHealth;
  description: string;         // Lore description (Spanish)
  backgroundIntensity: number; // 0.0-1.0
  particleFrequency: number;   // 0.0-1.0
  corruptionLevel: number;     // 1.0-0.0
}

getWorldState(stage) // → WorldStateMetadata for stages 1-5
```

### Photo Cooldown Logic (`lib/photoCooldown.ts`)

Centralized cooldown checking that considers standard cooldown, strike state, and mission bypass:

```typescript
interface CooldownStatus {
  canTakePhoto: boolean;
  remainingMs: number;
  reason: 'ready' | 'cooldown' | 'strike_cooldown' | 'blocked';
}

getPhotoCooldownStatus(lastPhotoAt, strikes, activeMission, failed?) // → CooldownStatus
formatCooldown(ms) // → "3m 45s" | "1h 20m"
```

- **Standard cooldown**: 5 min between photos
- **Failed photo cooldown**: 2 min (less frustration)
- **Mission bypass**: If active mission not completed/bypassed, skip cooldown within 30min window
- **Strike integration**: Checks blockedUntil and cooldownUntil from StrikeData

### Strikes Hook (`hooks/useStrikes.ts`)

Manages the photo abuse prevention system:

```typescript
useStrikes() → { strikes, addStrike, resetStrikes, isBlocked, isOnCooldown }
```

- **Strike 1**: Warning + stat penalty message
- **Strike 2**: 30min cooldown for 24hrs (`cooldownUntil`)
- **Strike 3**: Blocked 48hrs (`blockedUntil`)
- **Auto-reset**: 7 days clean → strikes back to 0
- **Persistence**: localStorage with timestamps
- **Periodic cleanup**: Expired cooldowns/blocks cleared every 60s

### Missions Hook (`hooks/useMissions.ts`)

AI-contextual missions (optional, bonus rewards):

```typescript
useMissions({ regenmonType, memories }) → {
  activeMission, generateMission, completeMission,
  useMissionBypass, abandonMission, canBypass, isExpired
}
```

- **1 active mission max** — can't stack
- **+5 progress bonus** on completion
- **Mission bypass**: 1 photo within 30min window, even during cooldown
- **24hr expiration** — auto-expires if not completed
- **Type-specific templates**: 5 prompts per type (Rayo=movement/light, Flama=connection/warmth, Hielo=knowledge/nature)
- **Abandon without penalty**
- **Persistence**: localStorage

---

## Sesión 4: Progress System (Dual Economy)

### Fragmentos (Spendable Currency)
Unchanged from S3. Additionally earned from photos:
- Weak resonance: 3-5 fragments
- Medium resonance: 5-8 fragments
- Strong resonance: 8-12 fragments
- Penalizing: 0 fragments

### Progress (Lifetime Value — Never Decreases)

```typescript
interface ProgressData {
  progress: number;           // Lifetime total, NEVER decreases
  evolutionStage: number;     // 1-5 (derived from progress)
  fracturesReached: number[]; // Which thresholds have been crossed
  lastFractureAt?: string;    // ISO timestamp of last fracture
}

const FRACTURE_THRESHOLDS = [50, 100, 200, 400];
// Stage 1: 0-49 | Stage 2: 50-99 | Stage 3: 100-199 | Stage 4: 200-399 | Stage 5: 400+
// Total to max evolution: ~750 progress (~42 days active, ~15 days hardcore)

function getEvolutionStage(progress: number): number {
  if (progress >= 400) return 5;
  if (progress >= 200) return 4;
  if (progress >= 100) return 3;
  if (progress >= 50) return 2;
  return 1;
}
```

### Progress Sources

| Source | Progress Range | Condition |
|--------|---------------|-----------|
| Chat (with substance) | 1-3 | IA evaluates substance (anti-spam) |
| Photo weak | 2-4 | Weak resonance |
| Photo medium | 4-7 | Medium resonance |
| Photo strong | 7-12 | Strong resonance |
| Mission bonus | +5 | On mission completion |
| Penalizing | 0 | Inappropriate/spam |

### Evolution Freeze

```typescript
function isEvolutionFrozen(stats: Stats): boolean {
  return stats.espiritu < 10 && stats.pulso < 10 && stats.esencia < 10;
}
// When frozen: progress doesn't increase, sprite appears dormant
// Progress NEVER decreases (even during freeze)
```

---

## Sesión 4: Strike System (Anti-Abuse)

```typescript
interface StrikeData {
  strikes: number;           // 0-3
  lastStrikeAt?: string;     // ISO timestamp
  photosBlockedUntil?: string; // ISO timestamp (null = not blocked)
}

function applyStrike(current: StrikeData): StrikeData {
  const newStrikes = current.strikes + 1;
  switch (newStrikes) {
    case 1: return { strikes: 1, lastStrikeAt: now() };
    // → Warning + stat penalty
    case 2: return { strikes: 2, lastStrikeAt: now() };
    // → 30min cooldown for 24hrs
    case 3: return { strikes: 3, lastStrikeAt: now(), photosBlockedUntil: now() + 48hrs };
    // → Photos blocked 48hrs
  }
}

// Reset after 7 days clean (no new strikes)
function shouldResetStrikes(lastStrikeAt: string): boolean {
  return Date.now() - new Date(lastStrikeAt).getTime() > 7 * 24 * 60 * 60 * 1000;
}
```

---

## Sesión 4: Missions

```typescript
interface MissionData {
  id: string;
  description: string;       // IA-generated, contextual
  type: 'photo' | 'chat' | 'explore';
  createdAt: string;
  completedAt?: string;
  requiresPhoto: boolean;    // If true, mission bypass applies
}

// Max 1 active mission at a time
// Generated by IA based on: regenmon type, evolution stage, diary entries, player context
// Bonus: +5 progress on completion
// Mission bypass: if requiresPhoto=true, photo cooldown skipped (1 photo, 30min window)
```

---

## Sesión 4: Diary Entries (Memorias)

```typescript
interface DiaryEntry {
  text: string;              // Short phrase from Regenmon's perspective
  timestamp: number;
  resonance: 'weak' | 'medium' | 'strong';
  source: 'photo' | 'fracture' | 'mission';
}

// Stored in Supabase: diary_entries JSONB column
// Stored in localStorage: "reggie-adventure-diary"
// The Regenmon writes diary entries per photo evaluation
// Separate from Historial (📜 = transactions, 🧠 = emotions)
```

---

## Sesión 4: Supabase Schema Updates

```sql
-- New columns for S4
ALTER TABLE regenmons ADD COLUMN IF NOT EXISTS
  progress INTEGER DEFAULT 0,
  evolution_stage INTEGER DEFAULT 1,
  fractures_reached JSONB DEFAULT '[]'::jsonb,
  diary_entries JSONB DEFAULT '[]'::jsonb,
  active_mission JSONB,
  strikes INTEGER DEFAULT 0,
  last_strike_at TIMESTAMPTZ,
  photos_blocked_until TIMESTAMPTZ,
  last_photo_at TIMESTAMPTZ;
```

---

## Sesión 4: System Prompt Updates

Add to `prompts.ts`:

```
Bloque 13 — EVOLUCIÓN Y PROGRESO (S4):
- Tu etapa evolutiva actual: [stage]/5
- Fracturas alcanzadas: [list]
- Progreso total: [X] (invisible al jugador)
- Si estás en freeze (todos stats < 10): mencionas que te sientes dormido
- Puedes referenciar diary entries pasados de forma sutil

Bloque 14 — FOTOS Y MEMORIAS (S4):
- Cuando el usuario comparte una foto, evaluarla EMOCIONALMENTE
- No dar puntuaciones técnicas ("8/10") — hablar de resonancia
- Escribir una frase corta como diary entry
- Si la foto resuena con tu tipo, expresar emoción genuina
- Rayo: movimiento, energía, tech, luz, velocidad
- Flama: conexiones, calidez, amigos, comidas, abrazos
- Hielo: naturaleza, libros, paisajes, quietud, conocimiento

Bloque 15 — MISIONES (S4):
- Puedes sugerir misiones al jugador (opcionales)
- Misiones contextuales basadas en conversación y tipo
- Ejemplo Rayo: "¿Puedes mostrarme algo que se mueva rápido?"
- Ejemplo Flama: "Me gustaría ver algo que te haga feliz..."
- Ejemplo Hielo: "¿Hay algo sereno cerca de ti ahora?"
```

### Purification (S4 — Split Dual Purify)

**S3 (deprecated):** One button, 10💠, +30 Esencia +5 Espíritu +10 Pulso
**S4 (current):** Split into two buttons:
- `purifySpirit`: 10💠 → +10 Espíritu
- `purifyEssence`: 10💠 → +10 Esencia

> Old single `purify` function deprecated. Constants: `PURIFY_SPIRIT_COST=10`, `PURIFY_SPIRIT_GAIN=10`, `PURIFY_ESSENCE_COST=10`, `PURIFY_ESSENCE_GAIN=10`.

---

## Sesión 5: Endpoints Sociales — PENDIENTE

> - `POST /api/social/register`
> - `GET /api/social/registry`
> - `GET /api/social/profile/[id]`

---

## Reglas

- **Sesión 1 = solo localStorage.** No hay servidor, no hay APIs, no hay base de datos.
- **Sesión 2 = localStorage + API Route.** Solo `/api/chat` como endpoint. Sin base de datos.
- **Sesión 3 = localStorage + Supabase + Privy.** Híbrido progresivo. `/api/chat` actualizado.
- **No anticipar infraestructura.** No crear APIs ni tablas hasta la sesión correspondiente.
- **Este archivo se actualiza** al llegar a cada sesión que agregue backend.
- **Validar siempre** los datos al leer de localStorage (pueden estar corruptos).
- **API keys NUNCA en el código.** Solo en `.env.local` o variables de Vercel.

---

## Referencias Cruzadas

Este archivo define **cómo funciona por dentro**. Los otros documentos definen qué se ve, qué se construye y por qué.

| Documento | Relación con BACKEND_STRUCTURE.md |
|-----------|----------------------------------|
| [LORE.md](./LORE.md) | El system prompt completo se construye desde LORE; la personalidad por tipo, los stats-como-lore, las reglas de diálogo |
| [PRD.md](./PRD.md) | Cada feature del PRD tiene su implementación técnica aquí (F3.1→Privy, F3.14→Supabase, etc.) |
| [APP_FLOW.md](./APP_FLOW.md) | Los flujos (login, purificar, chat, sync) definen el "cuándo"; este doc define el "cómo" técnico |
| [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) | Los componentes visuales consumen los datos y APIs definidos aquí |
| [TECH_STACK.md](./TECH_STACK.md) | Las herramientas (Supabase, Privy, Gemini/OpenAI) con sus versiones exactas |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Las fases técnicas (33-35, 38, 43-44) implementan los schemas y APIs de aquí |
| [model.md](./model.md) | Las decisiones arquitectónicas (Opción C híbrida, Privy sobre Auth0, stats AI-driven) se documentan allá |
| [progress.txt](./progress.txt) | Trackea qué endpoints y schemas ya están implementados |

> **Regla de precedencia narrativa:** El contenido del system prompt viene de [LORE.md](./LORE.md). Este documento define la *estructura* del prompt, no su *contenido*.

