# 🗄️ BACKEND_STRUCTURE — Reggie's Adventure
> **Versión actual:** v0.1 — El Despertar
> **Última actualización:** 2026-02-12

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

### Edge Cases

| Caso | Manejo |
|------|--------|
| localStorage no disponible | Mostrar error amigable, jugar sin persistencia |
| Datos corruptos / JSON inválido | Borrar datos, empezar desde cero |
| Datos con campos faltantes | Usar valores por defecto |
| Timestamp en el futuro | Ignorar, usar fecha actual |
| Múltiples tabs abiertas | Última escritura gana (no hay sincronización entre tabs) |

---

## Sesión 3: Supabase (Servidor) — PENDIENTE

> Se definirá cuando lleguemos a la Sesión 3. Incluirá:
> - Tabla `users` (id, email, created_at)
> - Tabla `regenmons` (id, user_id, name, type, stats, created_at)
> - Tabla `stars` (user_id, balance, transactions)
> - Función de migración localStorage → Supabase
> - Row Level Security (RLS) policies

## Sesión 3: Autenticación — PENDIENTE

> Se definirá con Privy SDK. Incluirá:
> - Flujo de login/signup
> - Manejo de sesiones
> - Protección de rutas (no aplica en Sesión 1)

## Sesión 3: API Endpoints — PENDIENTE

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
- **No anticipar infraestructura.** No crear APIs ni tablas hasta la sesión correspondiente.
- **Este archivo se actualiza** al llegar a cada sesión que agregue backend.
- **Validar siempre** los datos al leer de localStorage (pueden estar corruptos).
