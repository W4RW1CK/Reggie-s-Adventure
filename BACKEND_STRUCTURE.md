# 🛠️ BACKEND_STRUCTURE — Reggie's Adventure
> **Versión actual:** v0.3 — La Conexión
> **Última actualización:** 2026-02-16
> **Estado:** Sesión 2 — `COMPLETADA` | Sesión 3 — `COMPLETADA` (96/96 — 100%)
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

