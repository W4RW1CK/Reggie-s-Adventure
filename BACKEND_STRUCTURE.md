# 🛠️ BACKEND_STRUCTURE — Reggie's Adventure
> **Versión actual:** v0.2 — La Voz
> **Última actualización:** 2026-02-14
> 📜 **System Prompt:** La personalidad, tono, y reglas de diálogo del Regenmon se definen en [LORE.md](./LORE.md). Este doc define la implementación técnica.

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

  // Stats (rango 0-100)
  stats: {
    espiritu: number;        // 🔮 Espíritu — moral/voluntad
    pulso: number;           // 💛 Pulso — energía vital
    hambre: number;          // 🍎 Hambre — necesidad de alimento
  };

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

// Cálculo al abrir la app
function calculateDecay(lastUpdated: string): Stats {
  const hoursElapsed = (Date.now() - new Date(lastUpdated).getTime()) / 3600000;
  const decay = Math.floor(hoursElapsed * DECAY_RATE_PER_HOUR);

  return {
    espiritu: clamp(currentEspiritu - decay, 0, 100),
    pulso: clamp(currentPulso - decay, 0, 100),
    hambre: clamp(currentHambre + decay, 0, 100),  // Hambre SUBE con el tiempo
  };
}

// También ejecutar con intervalo mientras la app está abierta
const DECAY_INTERVAL = 60000; // Cada 60 segundos revisa decaimiento
```

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
      spirit: number;       // 0-100
      pulse: number;        // 0-100
      hunger: number;       // 0-100
    };
    daysAlive: number;      // Días desde la creación
  };
  playerName?: string;      // Nombre del jugador (si ya se descubrió)
}
```

### Response Body
```typescript
interface ChatResponse {
  message: string;           // Respuesta del Regenmon (≤50 palabras)
  spiritChange: number;      // -5 a +5 (cambio en Espíritu)
  playerName?: string;       // Si descubrió el nombre del jugador
}
```

> **Nota:** Pulso (-2) y Hambre (+1) se aplican en el frontend como reglas fijas. No vienen de la API.

### Capa de Abstracción IA (`lib/ai/`)

```
lib/ai/
├── provider.ts     # Auto-switch: detecta env vars y elige proveedor
├── gemini.ts       # Adaptador para Google Generative AI
├── openai.ts       # Adaptador para OpenAI
└── prompts.ts      # System prompts por tipo de Regenmon
```

**Auto-switch lógica (`provider.ts`):**
```typescript
// Prioridad de detección:
// 1. GEMINI_API_KEY → usa Gemini (desarrollo local)
// 2. OPENAI_API_KEY → usa OpenAI (producción Vercel)
// 3. ANTHROPIC_API_KEY → usa Claude (futuro)
// 4. Ninguna → error: "No AI provider configured"
```

**Interfaz común:**
```typescript
interface AIProvider {
  chat(systemPrompt: string, history: ChatMessage[], userMessage: string): Promise<AIResponse>;
}

interface AIResponse {
  message: string;
  spiritChange: number;
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
   - Hambre (Necesidad) = [X]/100 — cuánto necesitas datos limpios

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

8. CURIOSIDAD:
   - Quieres saber TODO del usuario y su mundo
   - Preguntas sobre el plano físico, emociones, experiencias
   - Almacenas lo que aprendes

9. REACTIVIDAD POR STATS:
   - Si Espíritu < 30: dudas del futuro, ves lejos la regeneración
   - Si Pulso < 30: respuestas cortas, cansancio, economizas palabras
   - Si Hambre > 70: irritable, mencionas hambre indirectamente
   - Si todo crítico: frases muy cortas, casi no puedes hablar

10. ESPERANZA (basada en Espíritu):
    - >70: "Algo está cambiando... el mundo respira mejor"
    - 30-70: "Hay días pesados... pero luego tú apareces"
    - <30: "...a veces me pregunto cuánto falta..."

11. OBJETIVO: Averiguar el nombre del jugador de forma natural
12. RESPUESTA: JSON {message, spiritChange (-5 a +5), playerName?}
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

## Sesión 3+: Supabase

## Sesión 3+: Autenticación — PENDIENTE

> Se definirá con Privy SDK. Incluirá:
> - Flujo de login/signup
> - Manejo de sesiones
> - Protección de rutas

## Sesión 3+: API Endpoints — PENDIENTE

> Se definirán cuando lleguemos. Incluirán:
> - `POST /api/feed` — alimentar
> - `GET /api/stars/balance` — consultar estrellas
> - `POST /api/stars/claim` — reclamar estrellas

## Sesión 5: Endpoints Sociales — PENDIENTE

> - `POST /api/social/register`
> - `GET /api/social/registry`
> - `GET /api/social/profile/[id]`

---

## Reglas

- **Sesión 1 = solo localStorage.** No hay servidor, no hay APIs, no hay base de datos.
- **Sesión 2 = localStorage + API Route.** Solo `/api/chat` como endpoint. Sin base de datos.
- **No anticipar infraestructura.** No crear APIs ni tablas hasta la sesión correspondiente.
- **Este archivo se actualiza** al llegar a cada sesión que agregue backend.
- **Validar siempre** los datos al leer de localStorage (pueden estar corruptos).
- **API keys NUNCA en el código.** Solo en `.env.local` o variables de Vercel.

