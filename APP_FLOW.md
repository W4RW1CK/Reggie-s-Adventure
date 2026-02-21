# 🗺️ APP_FLOW — Reggie's Adventure
> **Versión actual:** v0.4 — La Evolución
> **Última actualización:** 2026-02-21
> **Estado:** Sesión 4 — `COMPLETADA` | Sesión 5 — `PENDIENTE`
>
> 📜 **Narrativa y personalidad:** Todo diálogo, texto de historia y comportamiento conversacional
> debe ser consistente con [LORE.md](./LORE.md). En caso de conflicto, LORE.md prevalece.
> 🎨 **Estilo visual:** [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) — cómo se ve cada pantalla y componente
> 🛠️ **Datos y APIs:** [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) — qué datos se guardan/leen en cada flujo

---

## Inventario de Pantallas

| # | Pantalla | Ruta | Condición de acceso |
|---|----------|------|---------------------|
| P1 | Loading NES | `/` (estado: loading) | Siempre al abrir |
| P2 | Título | `/` (estado: title) | Tras loading |
| P3 | Historia | `/` (estado: story) | 1ra vez o tras reset |
| P4 | Creación | `/` (estado: creation) | Si no existe Regenmon |
| P5 | Transición | `/` (estado: transition) | Tras crear Regenmon |
| P6 | Juego | `/` (estado: game) | Si existe Regenmon |

> **Nota:** Toda la app corre en una sola ruta (`/`). Los estados se manejan con React state internamente.

---

## Flujo Principal (S3 — actualizado con Privy)

```
ABRIR APP
    │
    ▼
[P1: Loading NES] ── 3 segundos máximo ── fade ──▶
    │
    ▼
[P2: Título] ── usuario presiona Start (clic/tap/tecla) ──▶
    │
    ├── ¿Ya está logueado (sesión persistente Privy)?
    │       │
    │       └── SÍ ──▶ ¿Existe Regenmon? ──▶ [P6: Juego]
    │
    └── NO ──▶ [Modal de Privy]
                    │
                    ├── Login (Google/Email/Passkey) ──▶ ¿Existe data en Supabase?
                    │       │
                    │       ├── SÍ ──▶ Cargar de Supabase ──▶ [P6: Juego]
                    │       └── NO ──▶ ¿Existen datos en localStorage?
                    │               │
                    │               ├── SÍ ──▶ Migrar a Supabase ──▶ [P6: Juego]
                    │               └── NO ──▶ [P3: Historia] ──▶ [P4: Creación]
                    │
                    └── "Continuar sin cuenta" ──▶ Modo demo (localStorage)
                            │
                            ├── ¿Es 1ra vez?
                            │       ├── SÍ ──▶ [P3: Historia] ──▶ [P4: Creación]
                            │       └── NO ──▶ ¿Existe Regenmon?
                            │               ├── SÍ ──▶ [P6: Juego (demo)]
                            │               └── NO ──▶ [P4: Creación]
```

---

## Flujo Detallado por Pantalla

### P1: Loading NES

**Trigger:** Abrir la app / recargar la página.
**Duración:** Máximo 3 segundos.
**Contenido:** Logo "Reggie's Adventure" centrado.
**Transición:** Fade out → P2: Título.
**Errores:** Ninguno posible.

---

### P2: Título

**Trigger:** Fin de P1.
**Contenido:**
- Título "Reggie's Adventure" prominente
- Regenmons decorativos en el fondo (no roban protagonismo)
- "Press Start" parpadeante
- 🎵 Toggle de música (esquina superior derecha)

**Interacción:**
1. Usuario presiona "Press Start" (clic, tap, o tecla Enter/Space)
2. → Si ya está logueado (sesión Privy persistente) → directo al Juego
3. → Si no está logueado → Modal de Privy aparece

**Decisión (S3):**
- Si `privyUser !== null` → cargar de Supabase → P6: Juego
- Si Privy modal → login o demo

**Errores:** Ninguno posible.

---

### P3: Historia

**Trigger:** Primera vez que se abre la app O después de un reinicio.
**Contenido:**
- Caja de diálogo estilo NES (fondo oscuro, borde pixelado)
- Texto con efecto typewriter (ver LORE.md → El Origen):
  > *"En un rincón olvidado del mundo digital, una señal se enciende... algo quiere despertar. Un fragmento de energía antigua — de un tiempo en que la información fluía como ríos de luz y las conexiones eran puras — espera a alguien que le dé forma. Ese alguien... eres tú."*
- Botón "Continuar ▶" aparece al terminar el texto

**Contexto narrativo:** Esta intro describe el Despertar — el momento en que la energía de La Red Primordial elige al usuario como su compañero. El Regenmon aún no tiene forma; la tomará en P4 cuando el usuario elija su tipo.

**Interacción:**
1. Texto aparece letra por letra (no se puede saltar)
2. Al finalizar texto → aparece botón "Continuar ▶"
3. Clic en "Continuar ▶" → fade → P4: Creación

**Después:** Se marca `isFirstTime = false` en localStorage.
**Errores:** Ninguno posible.

---

### P4: Creación

**Trigger:** No existe Regenmon en localStorage.
**Contexto narrativo:** La energía antigua está lista para tomar forma. El usuario elige cuál de las tres formas elementales cristalizará — cada una representa un aspecto diferente de La Red Primordial que se perdió.
**Contenido:**
- Título "Crea tu Regenmon"
- Carrusel de tipos (uno a la vez):
  - ⚡ **Rayo — El Impulso:** *"La corriente que alguna vez fue el flujo limpio de información. Veloz, directo, chispeante."*
  - 🔥 **Flama — La Pasión:** *"El calor que alguna vez fue la conexión genuina entre seres. Cálido, emotivo, intenso."*
  - ❄️ **Hielo — La Memoria:** *"Los archivos donde el conocimiento vivía eterno. Sabio, reflexivo, sereno."*
  - Cada tipo muestra: SVG de la criatura + nombre + mini-descripción (con significado lore)
  - Flechas para navegar entre tipos
- Campo de nombre:
  - Placeholder: "Nombre de tu Regenmon"
  - Validación: 2-15 caracteres
  - **Character counter**: `name.length/15` below input with color-coded feedback (red >15, green ≥2, dim). CSS class `.creation-screen__char-count`
  - Mensajes de error visibles si nombre inválido
- Botón "¡Despertar!"

**Interacción paso a paso:**
1. Usuario navega carrusel → elige tipo
2. Usuario escribe nombre en el campo
3. Validación: nombre entre 2-15 caracteres
4. Si nombre válido + tipo seleccionado → botón se activa
5. Si falta algo → botón desactivado (grayed out)
6. Clic en "¡Despertar!" → guarda datos en localStorage → fade → P5

**Datos que se guardan al presionar "¡Despertar!":**
```json
{
  "name": "string",
  "type": "rayo | flama | hielo",
  "stats": { "espiritu": 50, "pulso": 50, "esencia": 50 },
  "fragmentos": 100,
  "createdAt": "ISO timestamp",
  "nameChangeUsed": false,
  "tutorialDismissed": false,
  "isFirstTime": false,
  "musicEnabled": true
}
```

**Errores:**
- Nombre vacío → mensaje: "Tu Regenmon necesita un nombre"
- Nombre < 2 chars → mensaje: "El nombre es muy corto (mínimo 2)"
- Nombre > 15 chars → el campo no permite escribir más
- Sin tipo seleccionado → botón permanece desactivado

---

### P5: Transición

**Trigger:** Datos guardados exitosamente tras P4.
**Contexto narrativo:** El Despertar — la energía antigua cristaliza en la forma elegida. La Conexión entre usuario y Regenmon se sella al darle nombre (ver LORE.md → El Despertar).
**Contenido:**
- Fondo oscuro
- Texto centrado: "Tu Regenmon está despertando..."
- Posible animación sutil (puntos suspensivos aparecen uno a uno)

**Duración:** 2-3 segundos.
**Transición:** Fade → P6: Juego.
**Errores:** Ninguno posible.

---

### P6: Juego (Pantalla Principal)

**Trigger:** Existe Regenmon en localStorage o Supabase.
**Contenido (de arriba a abajo):**

1. **Header:**
   - 💠 Balance de Fragmentos (izquierda)
     - Logueado: "💠 100 Fragmentos"
     - No logueado: "💠 --- Fragmentos" (shows "💎 ---")
   - 🧠 Memory indicator (next to fragments, only when logged in and memoryCount > 0)
     - Format: "🧠 N" where N = number of memories. CSS class `hud-memories`
   - Identidad del usuario (derecha, discreto, **evolutiva**)
     - No logueado: no se muestra nada
     - Logueado + nombre NO descubierto: email/método auth truncado (ej: "mel@...")
     - Logueado + nombre descubierto por Regenmon: muestra el nombre (ej: "Mel")
     - Transición: al descubrir nombre → animación sutil de cambio (fade email → nombre)
   - "v0.3 — La Conexión" (discreto, solo si cabe)

2. **Paisaje de fondo — Zonas del Mundo Digital (ver LORE.md → Los Paisajes):**
   - ⚡ Rayo: **Llanura Eléctrica** — adapta a tema Dark/Light
   - 🔥 Flama: **Volcán Ardiente** — adapta a tema Dark/Light
   - ❄️ Hielo: **Montaña Nevada** — adapta a tema Dark/Light
   - Cambia según estado emocional + tema visual activo

3. **Regenmon:**
   - SVG centrado con idle animation (rebote/respiración)
   - **8 estados visuales** según stats (ver FRONTEND_GUIDELINES.md → Estados Visuales):
     - Promedio ≥90=Eufórico, ≥70=Contento, ≥30=Neutro, ≥10=Decaído, <10=Crítico
     - Override: si cualquier stat <10, muestra sprite del stat más bajo
   - Expresión/postura/color cambian según estado activo
   - Nombre debajo (cambio de nombre en Settings)

4. **Info:**
   - "Día X de aventura" (visible pero discreto)

5. **Stats — Estado del Regenmon (100=bien, 0=mal):**
   - 🔮 Esperanza [====----] 50/100
   - 💛 Energía vital [====----] 50/100
   - 🌱 Esencia [====----] 50/100
   - **Modo compacto (durante chat):** 🔮 80 | 💛 50 | 🌱 30

6. **Botones de acción (S3):**
   - `[🌀 Purificar (10💠)]  [⚙️]  [💬 Conversar]  [📜]`
   - **📜 History**: compact toggle on right side of bottom bar (`.hud-history-btn`), active glow state (`.hud-history-btn--active`)
   - **Purificar:** Cuesta 10 Fragmentos. Disabled si <10💠 o Esencia=100
   - **⚙️:** Abre panel de Settings
   - **Conversar:** Toggle chat (cambia a "✕ Cerrar")
   - **Se ocultan Purificar y ⚙️ durante chat**
   - **Conversar se desactiva** si los 3 stats < 10

7. **Caja de Diálogo NES (Sesión 2, mantenida):**
   - Aparece al presionar "💬 Conversar"
   - Estilo Final Fantasy/Zelda: semi-transparente, borde NES pixelado
   - Contiene: historial de burbujas + input de texto + botón enviar
   - Música baja a 60% con fade 1.5s al abrir

**Tutorial Modal (si no descartado):**
- Aparece superpuesto al entrar a P6
- Instrucciones actualizadas (Purificar, Fragmentos, Settings, Chat)
- Checkbox: "No volver a mostrar"
- Botón para cerrar

---

## Flujos Secundarios

### Flujo: Purificar (S3 — reemplaza Alimentar/Entrenar/Descansar)

```
1. Usuario presiona [🌀 Purificar (10💠)]
2. ¿Fragmentos >= 10?
   ├── NO → Botón desactivado con tooltip "Necesitas 10 💠"
   └── SÍ → Continúa
3. ¿Esencia ya está al máximo (100)?
   ├── SÍ → Botón desactivado, tooltip "Esencia al máximo"
   └── NO → Continúa
4. Se restan 10 Fragmentos
5. Se aplican: Esencia +30, Espíritu +5, Pulso +10
6. Feedback flotante: "+30 🌱" y efecto visual lore-appropriate
7. Balance de Fragmentos se actualiza en header
8. Stats se actualizan visualmente
9. Regenmon muestra reacción contextual (texto lore-appropriate, no genérico)
10. Paisaje se ajusta si corresponde
11. localStorage (y Supabase si logueado) se actualizan
```

### Flujo: Buscar Fragmentos (S3 — Anti-frustración)

> Lore: Cuando el Regenmon no tiene Fragmentos, puede sentir restos dormidos de La Red Primordial
> cercanos — demasiado débiles para despertar solos, pero suficientes para seguir adelante.

```
1. ¿Balance de Fragmentos === 0?
   ├── NO → Botón no aparece (oculto, no disabled)
   └── SÍ → Aparece botón "🔍 Buscar Fragmentos" debajo de los botones principales
2. Usuario presiona "🔍 Buscar Fragmentos"
3. Efecto visual: breve animación de búsqueda (partículas convergiendo)
4. Se otorgan 15 Fragmentos 💠
5. Feedback: "+15 💠" flotante + Regenmon dice algo lore-appropriate
   (ej: "Sentí algo... restos de luz, escondidos entre el ruido. Es poco, pero nos alcanza.")
6. Botón desaparece
7. Balance se actualiza en header
8. localStorage (y Supabase si logueado) se actualizan
```

> **Nota:** Solo aparece a 0 Fragmentos. No es repetible indefinidamente — una vez que
> tienes Fragmentos de nuevo, la única forma de ganar más es conversando (La Conexión).

---

### Flujo: Settings (⚙️) (S3 — Nuevo)

```
1. Usuario presiona [⚙️]
2. Panel de Settings aparece (slide-in o modal)
3. Opciones disponibles:
   - 🎵 Música: Toggle on/off
   - 🔄 Reiniciar: → Modal de confirmación retro (misma lógica actual)
   - 📝 Cambiar nombre: Campo inline, validaciones 2-15 chars
   - 🚪 Sesión: "Iniciar Sesión" (abre Privy) / "Cerrar Sesión"
   - 🔤 Texto: A+ / A- para ajustar tamaño
   - 🌙/☀️ Tema: Toggle Dark (NES) / Light (GBC)
4. Cerrar: Botón "✕" o clic fuera del panel
```

### Flujo: Login tardío (desde Settings) (S3)

```
1. Usuario en modo demo presiona "Iniciar Sesión" en Settings
2. Modal de Privy aparece
3. Usuario se loguea (Google/Email/Passkey)
4. Se migran datos de localStorage a Supabase
5. Balance de Fragmentos pasa de "---" a valor real
6. Panel Settings actualiza: "Cerrar Sesión" reemplaza "Iniciar Sesión"
7. A partir de ahora, datos se sincronizan con Supabase
```

### Flujo: Cambio de Nombre (S3 — ahora desde Settings)

```
1. Usuario abre Settings (⚙️) y presiona "📝 Cambiar nombre"
2. ¿nameChangeUsed === true?
   ├── SÍ → Opción no disponible (texto gris: "Ya usaste tu cambio")
   └── NO → Continúa
3. Aparece campo de edición con leyenda: "Esta es tu única oportunidad."
4. Validación: 2-15 caracteres
5. ¿Confirma?
   ├── SÍ → Se guarda nuevo nombre, nameChangeUsed = true
   └── NO → Se cierra editor
```

### Flujo: Reiniciar (desde Settings)

```
1. Usuario abre Settings y presiona "🔄 Reiniciar"
2. Modal de confirmación:
   "¿Abandonar a [nombre]? Esta memoria se perderá para siempre..."
   [Cancelar] [Confirmar]
3. ¿Confirma?
   ├── SÍ → Borra localStorage (y Supabase si logueado) → P2: Título → P3 → P4
   └── NO → Modal se cierra
```

### Flujo: Decaimiento de Stats (S3 — actualizado)

```
1. Al abrir la app (o en intervalos regulares si está abierta):
2. Calcular tiempo transcurrido desde última actualización
3. Aplicar decaimiento proporcional al tiempo:
   - Espíritu: baja gradualmente
   - Pulso: baja PERO regenera pasivamente (descanso natural)
   - Esencia: baja gradualmente (100=bien, 0=mal)
4. Ritmo: tras 4-5 horas → baja leve (no grave)
5. Respetar límites 0-100
6. Actualizar Regenmon visual + paisaje
7. Guardar timestamp en localStorage (y sync a Supabase si logueado)
```

### Flujo: Tutorial Modal

```
1. Al entrar a P6: ¿tutorialDismissed === false?
   ├── SÍ (no descartado) → Mostrar modal con instrucciones
   └── NO (ya descartado) → No mostrar nada
2. Usuario lee instrucciones (incluye mención del chat)
3. ¿Marca checkbox "No volver a mostrar"?
   ├── SÍ → tutorialDismissed = true, se guarda en localStorage
   └── NO → Seguirá apareciendo la próxima vez
4. Cierra modal → juega normalmente
```

### Flujo: Conversar (Sesión 2, actualizado S3)

```
1. Usuario presiona "💬 Conversar"
2. ¿Los 3 stats < 10?
   ├── SÍ → Botón desactivado, tooltip "Tu Regenmon está muy débil..."
   └── NO → Continúa
3. Música baja a 60% (fade 1.5s)
4. Botones Purificar y ⚙️ desaparecen
5. Stats pasan a modo compacto (🔮 80 | 💛 50 | 🌱 30)
6. Botón "Conversar" cambia a "✕ Cerrar"
7. Caja de diálogo NES aparece (fade in)
8. ¿Es la primera vez que abre el chat?
   ├── SÍ → Regenmon saluda automáticamente
   └── NO → Muestra historial de mensajes previos
```

### Flujo: Enviar Mensaje de Chat (Sesión 2)

```
1. Usuario escribe mensaje (max 280 chars)
2. Envía con Enter (desktop), botón (mobile). Ctrl+Enter = salto de línea (desktop)
3. ¿Cooldown activo (3s desde último envío)?
   ├── SÍ → Botón desactivado (invisible al usuario)
   └── NO → Continúa
4. Mensaje del usuario aparece en burbuja (derecha)
5. Input se limpia
6. Indicador "Escribiendo..." aparece (puntos animados NES)
7. Se envía request a /api/chat con:
   - Mensaje del usuario
   - Historial completo (max 50 mensajes)
   - Stats actuales del Regenmon
   - Nombre + tipo del Regenmon
   - Días de vida
   - Nombre del jugador (si lo conoce)
8. ¿API responde exitosamente?
   ├── SÍ → Continúa al paso 9
   └── NO → Muestra botón "Reintentar"
9. ¿Rate limit excedido (15 msgs/min)?
   ├── SÍ → Mensaje amigable: "Tu Regenmon necesita un respiro..."
   └── NO → Continúa
10. Indicador "Escribiendo..." desaparece
11. Respuesta del Regenmon aparece en burbuja (izquierda) con bounce
12. Scroll automático al último mensaje
13. Stats se actualizan (S3 — todos AI-driven):
    - Espíritu: ±5 (IA decide según tono emocional)
    - Pulso: ±5 (IA decide: tranquilo=+, intenso=-)
    - Esencia: -1 a -4 (IA decide, siempre baja)
    - Fragmentos: 0-5 ganados (IA decide, no garantizado)
14. **Floating stat deltas** visible above sprite for each change (`.hud-floating-delta` + `float-up-fade` keyframe): "+5 🔮 -1 ✨" etc.
15. Regenmon actualiza expresión/postura si corresponde
16. ¿La IA descubrió el nombre del jugador?
    ├── SÍ → Se guarda en playerName, feedback visual "🧠"
    └── NO → Nada
17. Mensaje se agrega al historial en localStorage
18. Si historial > 50 mensajes → se eliminan los más antiguos
```

### Flujo: Cerrar Chat (Sesión 2)

```
1. Usuario cierra el chat (botón "✕ Cerrar", clic fuera, o toggle "Conversar")
2. Caja de diálogo NES desaparece (fade leve)
3. Botón "✕ Cerrar" vuelve a "💬 Conversar"
4. Stats regresan a modo completo (barras normales)
5. Botones de acción reaparecen (animación sutil)
6. Música regresa a 100% (fade 1.5s)
```

### Flujo: Descubrimiento del Nombre del Jugador (Sesión 2, ampliado S3)

```
1. El system prompt instruye al Regenmon a averiguar el nombre de forma natural
2. Cuando el usuario menciona su nombre en la conversación:
3. La IA incluye "playerName" en su respuesta JSON
4. Se guarda en localStorage (clave: reggie-adventure-player) y Supabase si logueado
5. Feedback visual: "🧠 ¡Tu Regenmon aprendió tu nombre!"
6. [S3] Header se actualiza: email/auth → nombre del jugador (fade sutil)
   → Este momento refuerza La Conexión: tu Regenmon te conoce
7. En conversaciones futuras, el Regenmon usa el nombre
8. Si el usuario dice que cambió de nombre → la IA actualiza playerName → header se actualiza
9. Al hacer reset → se borra playerName → header vuelve a email/auth
```

---

## Consideraciones de Accesibilidad en el Flujo

1.  **Transiciones:**
    -   Al cambiar de pantalla, el foco debe moverse al contenedor principal o al primer elemento interactivo de la nueva pantalla para usuarios de teclado/screen readers.
    -   Evitar "trampas de foco" en modales (Tutorial/Reset). El foco debe ciclar dentro del modal.

2.  **Feedback:**
    -   Las acciones (Purificar) deben anunciar el resultado al lector de pantalla ("Purificación completa, Esencia subió a 80").

3.  **Chat (Sesión 2):**
    -   Al abrir el chat, foco se mueve al input de texto.
    -   Mensajes nuevos anunciados via `aria-live="polite"`.
    -   Indicador "Escribiendo..." tiene `aria-label` descriptivo.
    -   Botón "Conversar" desactivado tiene `aria-disabled` + tooltip accesible.

---

## Mapa de Navegación Visual (S3)

```
[Loading] →fade→ [Título]
                     │
                     └── Press Start → ¿Logueado?
                                         │
                                         ├── SÍ →fade→ [Juego]
                                         │
                                         └── NO → [Privy Modal]
                                                     │
                                                     ├── Login → [Juego (Supabase)]
                                                     │
                                                     └── Demo → ¿1ra vez?
                                                                  │
                                                                  ├── SÍ → [Historia] → [Creación] → [Juego]
                                                                  └── NO → [Juego (demo)]

[Creación] → ¡Despertar! →fade→ [Transición] →fade→ [Juego]

[Juego] → ⚙️ Settings → Reiniciar → Confirmar → [Título] → [Historia] → [Creación]

[Juego] → 💬 Conversar → [Chat NES Dialog] → ✕ Cerrar → [Juego]

[Juego] → 🌀 Purificar → Stats/Fragmentos actualizados → [Juego]

[Juego (demo)] → ⚙️ → Iniciar Sesión → [Privy] → Migrar datos → [Juego (Supabase)]
```

### Flujo: Historial de Actividades (S3 — Bonus)

> Lore: Un registro de los actos de regeneración — cada purificación, cada conexión,
> cada fragmento encontrado queda grabado en la memoria del mundo digital.

```
1. Sección colapsable "📜 Historial" debajo de los botones de acción
2. Por defecto: colapsada (solo se ve el título "📜 Historial")
3. Al expandir: muestra las últimas 10 acciones en orden cronológico inverso
4. Cada entrada muestra:
   - Icono de acción (🌀 Purificó / 💬 Conversó / 🔍 Buscó Fragmentos)
   - Cambio de 💠 (ej: "-10 💠" o "+3 💠")
   - Tiempo relativo (ej: "hace 5 min", "hace 2h", "ayer")
5. Se oculta durante chat (como Purificar y ⚙️)
6. Datos en localStorage (clave: reggie-adventure-history)
7. Sync a Supabase si logueado (campo JSONB)
8. Max 10 entradas (FIFO — las más antiguas se eliminan)
9. Reset borra historial
```

---

## S4 Navigation Model — 3-State Triangle

> **S4 replaces the single-screen GameScreen with a 3-state triangle navigation.**
> All states connected. Vertical only.

```
        [World] (default)
       /    💬        📷    \
   [Chat] ──── 📎 ──── [Photo]
        ← Conversar    ← Volver
```

### State: World (default)
- Sprite centered with idle animation
- HUD always visible: 🔮 Fragments, 🎯 Mission, ⚙️ Settings
- Bottom bar: 💬 Chat bubble + 📷 Photo bubble
- Tap sprite → floating purification buttons appear
- Tap sprite (or info button) → profile overlay

### State: Chat
- Full-screen chat UI (mobile/tablet) or 30% panel (desktop)
- ✕ button in header → back to World
- 📎 button in input bar → go to Photo
- HUD remains visible

### State: Photo
- Full-screen photo flow (see below)
- Post-evaluation: "💬 Conversar" → Chat, "🏠 Volver" → World
- HUD remains visible

### Layout per Breakpoint

| Breakpoint | World | Chat | Photo |
|-----------|-------|------|-------|
| Mobile (<640px) | Full screen | Full screen | Full screen |
| Tablet vertical (641-1024px) | Full screen, spacious | Full screen, spacious | Full screen |
| Tablet horizontal | 70% world / 30% chat | Side-by-side | Full screen |
| Desktop (1025px+) | Full → 70/30 on interaction | 30% panel | Full screen overlay |

---

## Flujos S4 — La Evolución

### Flujo: Compartir Foto (S4 — Rewritten)

> Lore: Las fotos son memorias del mundo real. El Regenmon las evalúa emocionalmente
> según la resonancia con su tipo. Las fotos NUNCA se almacenan — solo las emociones que generan.
>
> **S4 UI/UX:** Photo is a FULL STATE, not a modal. Pre-camera screen explains what Reggie wants.

```
1. ENTRY POINTS:
   a) World → 📷 bubble button in bottom bar → Photo state
   b) Chat → 📎 button in input bar → mini picker (camera/gallery)

2. PRE-CAMERA SCREEN (full screen, NOT modal):
   → Explains what Reggie wants to see
   → Shows active mission (if any)
   → TWO options: "📸 Tomar foto" (camera) + "🖼️ Galería" (file picker)
   → First time: extra text about camera permissions + privacy (photos NOT stored)
   → If cooldown active: shows timer countdown

3. ¿Fotos bloqueadas por strikes?
   ├── SÍ → Mensaje: "Las memorias están bloqueadas... [X horas restantes]"
   └── NO → Continúa

4. ¿Cooldown activo?
   ├── SÍ → Shows timer on pre-camera screen
   │         (Excepción: mission bypass activo → saltar cooldown)
   └── NO → Continúa

5. User selects "📸 Tomar foto" (camera) OR "🖼️ Galería" (file picker)
6. Photo captured/selected
7. Indicador de loading: "Tu Regenmon está sintiendo esta memoria..."
8. Foto se envía a /api/evaluate (base64)

9. POST-PHOTO SCREEN (full screen):
   → Regenmon reacts with animation
   → Stat deltas shown
   → Diary entry displayed
   → Post-photo variants:
     - Strong resonance: happy bounce animation, bright particles
     - Weak: neutral reaction
     - Penalizing: dimmed sprite, red text, strike warning
   → TWO buttons: "💬 Conversar" (→ Chat) / "🏠 Volver" (→ World)

10. Resultado de evaluación:
    ├── Black photo → Rechazada. "No puedo ver nada..." Cooldown 2min
    ├── Inapropiada → Strike aplicado. Warning visual. 0 fragments, 0 progress
    ├── Penalizing → 0 fragments, 0 progress. Mensaje de decepción
    ├── Weak → 3-5 💠, 2-4 progress. Diary entry. Reacción sutil
    ├── Medium → 5-8 💠, 4-7 progress. Diary entry. Reacción cálida
    └── Strong → 8-12 💠, 7-12 progress. Diary entry. Reacción intensa

11. ¿Se cruzó un umbral de Fractura?
    ├── SÍ → Animación de Fractura (ver Flujo: Fractura)
    └── NO → Continúa

12. Foto se DESCARTA (nunca almacenada). Solo metadata + diary entry persisten
13. Cooldown de 5min comienza (2min si fue foto negra/fallida)
14. localStorage (y Supabase si logueado) se actualizan
```

### Flujo: Purificación (S4 — Tap Sprite)

> **S4 UI/UX:** Purification is triggered by tapping the sprite in World, not via action buttons.

```
1. User taps sprite in World state
2. Floating buttons appear around sprite:
   → "❤️ Recargar 10🔮" (restores Pulso)
   → "💧 Nutrir 10🔮" (restores Esencia)
3. User taps one option
4. ¿Fragmentos >= 10?
   ├── NO → Button disabled / tooltip "Necesitas 10 🔮"
   └── SÍ → Continúa
5. 10 Fragmentos spent
6. Stat restored (Pulso +10 or Esencia +10)
7. Animation: subtle bounce + color flash
8. Floating buttons disappear
9. Stats and fragments update in HUD
```

### Flujo: Tutorial / Onboarding (S4)

> **S4 UI/UX:** Different flows for new vs returning players.

```
NEW PLAYERS (5 steps):
1. Step 1: Meet your Regenmon (sprite intro)
2. Step 2: Chat (💬 how to talk)
3. Step 3: Care/Purify (tap sprite to heal)
4. Step 4: Photos ✨ NUEVO (📷 share memories)
5. Step 5: Evolution ✨ NUEVO (Fracturas and growth)

S3 RETURNING PLAYERS (2 steps):
1. Step 1: Photos ✨ Nuevo (📷 share memories)
2. Step 2: Evolution ✨ Nuevo (Fracturas and growth)
→ Badge "✨ Nuevo" on steps 4-5

RULES:
- "Saltar tutorial" always visible
- Can restart from ⚙️ Settings
- Steps 4-5 marked as NEW in both flows
```

### Flujo: Loading + Fullscreen (S4)

> **S4 UI/UX:** Fullscreen invitation merged with loading screen.

```
1. App opens → Loading screen appears
2. REAL preloader runs:
   → Preloads sprites, backgrounds for all 5 evolution stages, UI icons
   → Uses new Image().src + <link rel="preload"> for critical assets
3. Assets loaded → Loading animation completes
4. Fullscreen invitation appears (same screen):
   → "Pantalla completa" (requests fullscreen)
   → "Continuar así" (skips fullscreen)
5. → Game starts (World state)
   → No extra screens between loading and game
```

### Flujo: Fractura (S4)

> Lore: Una Fractura es un momento de transformación. La energía acumulada del Regenmon
> rompe su forma actual y emerge algo nuevo. Es dramático, emocional, y definitivo.

```
1. Progreso cruza umbral (50, 100, 200, o 400)
2. Animación de Fractura:
   → Flash brillante (brightness pulse)
   → Shake sutil del sprite
   → Partículas explotan hacia afuera
   → Sprite transiciona a nueva forma
3. Texto narrativo del Regenmon sobre su evolución:
   → Fractura 1 (50): "Algo cambió en mí... siento más"
   → Fractura 2 (100): "La conexión se profundiza..."
   → Fractura 3 (200): "Ya no soy lo que era... soy más"
   → Fractura 4 (400): "La forma final... esto es lo que siempre fui"
   (Texto varía por tipo: Rayo/Flama/Hielo)
4. Nueva etapa visual del sprite se activa
5. Fractura se registra en estado (no se repite)
6. localStorage (y Supabase si logueado) se actualizan
```

### Flujo: Misión (S4)

> Lore: Las misiones son sugerencias del Regenmon — cosas que quiere experimentar
> del mundo del usuario. Son opcionales, contextuales, y generadas por IA.

```
1. ¿Existe misión activa?
   ├── SÍ → No se genera nueva (max 1)
   └── NO → Continúa
2. IA genera misión contextual (basada en tipo, etapa, diario, conversación)
   → Rayo: "¿Puedes mostrarme algo que se mueva rápido?"
   → Flama: "Me gustaría ver algo que te haga feliz..."
   → Hielo: "¿Hay algo sereno cerca de ti ahora?"
3. Misión aparece en UI (MissionCard)
4. Opciones del jugador:
   ├── Completar (subir foto relevante):
   │   → Evaluación normal + bonus +5 progress
   │   → Si la misión pide foto, cooldown se salta (1 foto, ventana 30min)
   │   → Misión se marca como completada
   ├── Abandonar:
   │   → Misión desaparece, sin penalty
   └── Ignorar:
       → Misión permanece activa indefinidamente
5. Tras completar/abandonar, se puede generar nueva misión
```

### Flujo: Strike (S4)

```
1. Foto evaluada como inapropiada
2. Strike counter incrementa
3. Según nivel de strikes:
   ├── Strike 1: Warning visual + stat penalty
   │   → "⚠️ Tu Regenmon no pudo procesar esa memoria..."
   │   → Stats bajan levemente
   ├── Strike 2: Cooldown extendido
   │   → 30min entre fotos por las próximas 24hrs
   │   → "Las memorias necesitan descanso..."
   └── Strike 3: Fotos bloqueadas
       → Bloqueado por 48hrs
       → "Las memorias están cerradas... necesitan sanar"
4. Tras 7 días sin strikes → counter se resetea a 0
```

### Flujo: Evolution Freeze (S4)

```
1. ¿Todos los stats < 10?
   ├── SÍ → Evolution freeze activado:
   │   → Progreso no aumenta (ni por fotos ni por chat)
   │   → Sprite aparece dormido (opacity baja, grayscale)
   │   → Regenmon menciona que se siente dormido
   │   → Progreso NUNCA decrece (solo se congela)
   └── NO → Evolución normal
2. Cuando cualquier stat sube ≥ 10 → freeze se desactiva
```

---

## Referencias Cruzadas

Este archivo define **cómo navega el usuario** por la app. Los otros documentos definen qué se ve, qué se guarda y por qué.

| Documento | Relación con APP_FLOW.md |
|-----------|--------------------------|
| [LORE.md](./LORE.md) | Los textos de historia (P3), creación (P4), y transición (P5) vienen de LORE; el chat refleja La Conexión |
| [PRD.md](./PRD.md) | Cada feature se experimenta a través de los flujos documentados aquí |
| [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) | Define cómo se ven las pantallas, componentes y transiciones de cada flujo |
| [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) | Define qué datos se guardan/leen en cada paso del flujo (localStorage, Supabase, API) |
| [TECH_STACK.md](./TECH_STACK.md) | Las herramientas (Privy para auth, Supabase para sync) habilitan los flujos de S3 |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Los flujos se implementan fase por fase (P1→Fase 4, P6→Fases 10-11, Auth→Fase 34, etc.) |
| [model.md](./model.md) | Las decisiones de UX (lazy login, botones S3, stats compactos) se documentan allá |
| [progress.txt](./progress.txt) | Trackea qué flujos ya están implementados y verificados |

> **Regla de precedencia:** En caso de conflicto entre este documento y [LORE.md](./LORE.md) en temas de narrativa, diálogo o tono, **LORE.md prevalece**.
