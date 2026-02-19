# 🎨 FRONTEND_GUIDELINES — Reggie's Adventure
> **Versión actual:** v0.4 — La Evolución
> **Última actualización:** 2026-02-19
> **Estado:** Sesión 3 — `COMPLETADA` (96/96 — 100%) | Sesión 4 — `PENDIENTE`
>
> 📜 **Lore visual:** Los colores por tipo, paisajes, y animaciones del Regenmon
> reflejan su significado narrativo. Ver [LORE.md](./LORE.md) para contexto.
> ⚙️ **Herramientas:** [TECH_STACK.md](./TECH_STACK.md) — NES.css, Tailwind v4, Press Start 2P
> 🗺️ **Layouts por pantalla:** [APP_FLOW.md](./APP_FLOW.md) — estructura de cada pantalla

---

## Identidad Visual

**Inspiración:** Kirby's Adventure (NES, 1993) + Game Boy Color
**Sensación:** Retro 8-bit con sustancia. No infantil, no genérico. Un juego que se siente clásico y querido.
**Principio:** La vibra de Kirby's Adventure — colores vibrantes, formas redondeadas, ambiente cálido pero con personalidad.
**Tono narrativo:** Místico + épico + oscuro pero esperanzador (ver LORE.md). La estética debe transmitir que este es un mundo digital vivo, antiguo, y que necesita sanarse.
**Temas:** Dos modos visuales: **Dark (NES)** y **Light (GBC)**. Toggle en Settings.

---

## Tipografía

| Uso | Fuente | Peso | Fuente |
|-----|--------|------|--------|
| **Todo el juego** | `Press Start 2P` | Regular (400) | Google Fonts |

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

font-family: 'Press Start 2P', monospace;
```

### Escala de Tamaños

| Nivel | Tamaño | Uso |
|-------|--------|-----|
| `xs` | `8px` | Versión, labels menores |
| `sm` | `10px` | Fecha, info secundaria |
| `base` | `12px` | Texto general, stats, botones |
| `lg` | `14px` | Subtítulos, nombre del Regenmon |
| `xl` | `18px` | Títulos de pantalla |
| `2xl` | `24px` | Logo / título principal |

> **Nota:** Press Start 2P se ve más grande de lo normal. Estos tamaños están ajustados para esa fuente.

---

## Paleta de Colores

### Colores Base (Tema Dark — NES)

| Nombre | Hex | Uso |
|--------|-----|-----|
| `bg-dark` | `#1a1a2e` | Fondo principal oscuro |
| `bg-medium` | `#16213e` | Fondo secundario |
| `surface` | `#0f3460` | Contenedores, cajas |
| `text-primary` | `#e8e8e8` | Texto principal |
| `text-secondary` | `#a0a0a0` | Texto secundario |
| `text-accent` | `#ffffff` | Texto destacado |
| `border-nes` | `#4a4a4a` | Bordes estilo NES |

### Colores Base (Tema Light — GBC)

> *(Nuevo en Sesión 3)* — Inspirado en la paleta del Game Boy Color

| Nombre | Hex | Uso |
|--------|-----|-----|
| `bg-light` | `#f5f0e1` | Fondo principal crema |
| `bg-light-secondary` | `#e8dcc8` | Fondo secundario |
| `surface-light` | `#d4c5a9` | Contenedores, cajas |
| `text-primary-light` | `#2a2a2a` | Texto principal |
| `text-secondary-light` | `#5a5a5a` | Texto secundario |
| `text-accent-light` | `#1a1a1a` | Texto destacado |
| `border-gbc` | `#8b8370` | Bordes estilo GBC |

### Colores por Tipo (ver LORE.md → Los Regenmon)

> Cada tipo representa un aspecto perdido de La Red Primordial.
> Los colores reflejan su esencia narrativa.

| Tipo | Representa | Primario | Secundario | Fondo Dark | Fondo Light |
|------|-----------|----------|------------|------------|-------------|
| ⚡ Rayo | **El Impulso** | `#f5c542` | `#d4a017` | `#2a2a40` | `#f5f0d0` |
| 🔥 Flama | **La Pasión** | `#e74c3c` | `#c0392b` | `#3d1f00` | `#f5e0d0` |
| ❄️ Hielo | **La Memoria** | `#3498db` | `#2980b9` | `#0a1628` | `#d0e8f5` |

### Colores de Stats (ver LORE.md → Stats y Lore)

> Los stats no son números arbitrarios. Representan el estado interno del Regenmon.
> Todos funcionan igual: 100 = bien, 0 = mal.

| Stat | Significado Lore | Barra Llena | Barra Baja | Fondo Barra |
|------|-----------------|-------------|------------|-------------|
| 🔮 Espíritu | **Esperanza** — cuánto cree en la regeneración | `#9b59b6` | `#4a235a` | `#2c2c2c` |
| 💛 Pulso | **Energía vital** — fuerza para existir y actuar | `#f1c40f` | `#7d6608` | `#2c2c2c` |
| 🌱 Esencia | **Nutrición digital** — datos puros que lo nutren | `#27ae60` | `#1a5c33` | `#2c2c2c` |

> ⚠️ **Cambio S3:** Esencia reemplaza Hambre. Color cambió de rojo a verde para reflejar que 100=bueno/nutrido.

### Colores de Fragmentos 💠

| Elemento | Color | Hex |
|----------|-------|-----|
| Fragmento icono | Cyan brillante | `#00e5ff` |
| Fragmento texto | Cyan suave | `#80deea` |
| Sin login (---) | Gris apagado | `#666666` |
| Buscar Fragmentos btn | Cyan suave | `#4dd0e1` |

### Colores de UI

| Elemento | Color | Hex |
|----------|-------|-----|
| Botón activo | Verde NES | `#4caf50` |
| Botón hover | Verde claro | `#66bb6a` |
| Botón desactivado | Gris | `#555555` |
| Botón peligro (reset) | Rojo apagado | `#8b0000` |
| Botón Purificar | Púrpura/cyan | `#7c4dff` |
| Feedback positivo (+10) | Verde | `#4caf50` |
| Feedback negativo (-10) | Rojo | `#e74c3c` |
| Modal overlay | Negro semi-transparente | `rgba(0,0,0,0.7)` |

---

## Espaciado

```
Escala: 4px base
4px  — gap mínimo entre elementos
8px  — padding interno pequeño
12px — separación entre stats
16px — padding de contenedores
24px — separación entre secciones
32px — margen entre bloques principales
48px — separación grande
```

---

## Layout

### Principios
- **Full viewport** — la app ocupa toda la pantalla
- **Orientación portrait** (vertical) como prioridad
- **Centrado vertical** del contenido principal
- **Un solo scroll** si el contenido excede la pantalla

### Estructura de la Pantalla de Juego (P6) — Actualizada S3

```
┌─────────────────────────────────────┐
│ 💠 100  🧠 3  mel@...  │ ← Header (Fragmentos + Memories + identidad)
├─────────────────────────────────────┤
│                                     │
│         [Paisaje de Fondo]          │ ← Background (ver LORE.md → Los Paisajes)
│                                     │
│          ┌─────────────┐            │
│          │  Regenmon    │            │ ← SVG centrado (reworked S3)
│          │  (SVG idle)  │            │
│          └─────────────┘            │
│           "Nombre"                   │
│          Día X de aventura          │
│                                     │
│  🔮 Esperanza [==========] 80/100    │ ← Stats
│  💛 Energía   [█████─────] 50/100    │
│  🌱 Esencia  [███───────] 30/100    │
│                                     │
│  [🌀 Purificar (10💠)] [⚙️] [💬 Conversar] [📜]  │ ← Botones (S3) + History toggle (right)
│                                     │
└─────────────────────────────────────┘
```

### Breakpoints

| Nombre | Ancho | Comportamiento |
|--------|-------|----------------|
| `mobile` | `< 480px` | Layout vertical compacto, Regenmon mediano |
| `tablet` | `480px - 768px` | Layout vertical holgado, Regenmon más grande |
| `desktop` | `> 768px` | Fondo llena viewport completo, UI centrada, Regenmon grande |

**Desktop:** El fondo (paisaje) cubre el viewport completo. Los elementos de UI (stats, botones) se centran con `max-width: 500px`. El Regenmon se escala a `1.2x`. Ya no se simula una pantalla móvil.

---

## Componentes

### Estados Visuales del Regenmon (S3 — Reworked)

> **24 sprites total:** 8 estados × 3 tipos (Rayo, Flama, Hielo).
> La estética se mantiene Kirby-esque pero se integra mejor con el lore.

**Lógica de selección de sprite:**
```
1. ¿Algún stat individual < 10?
   ├── SÍ → Mostrar sprite del stat MÁS BAJO
   │         Empate: Espíritu > Pulso > Esencia
   └── NO → Usar promedio: (Espíritu + Pulso + Esencia) / 3
```

**Estados por promedio de stats:**

| # | Estado | Promedio | Expresión visual |
|---|--------|----------|-----------------|
| 1 | 😄 Eufórico | ≥ 90 | Radiante, colores vibrantes, ojos brillantes, postura erguida |
| 2 | 🙂 Contento | ≥ 70, < 90 | Feliz, colores base, expresión alegre |
| 3 | 😐 Neutro | ≥ 30, < 70 | Neutral, colores normales, expresión tranquila |
| 4 | 😟 Decaído | ≥ 10, < 30 | Triste, colores apagados, postura caída |
| 5 | 😢 Crítico General | < 10 | Muy debilitado, colores desaturados, postura desplomada |

**Estados por stat individual crítico (< 10, override promedio):**

| # | Estado | Trigger | Expresión visual |
|---|--------|---------|-----------------|
| 6 | 🔮 Sin Esperanza | Espíritu < 10 (más bajo) | Mirada vacía, colores fríos, postura encogida — duda de todo |
| 7 | 💛 Sin Energía | Pulso < 10 (más bajo) | Ojos caídos, desplomado, colores muy apagados — agotado |
| 8 | 🌱 Sin Nutrición | Esencia < 10 (más bajo) | Aspecto marchito, colores pálidos — hambriento, debilitado |

> **Prioridad:** Stat individual crítico SIEMPRE gana sobre el promedio.
> Si múltiples stats están < 10, el sprite corresponde al stat con valor más bajo.
> En empate exacto: Espíritu > Pulso > Esencia (la esperanza es lo más fundamental).

### Barras de Stats (NES.css)
- Usar `<progress>` con estilos NES.css
- Altura: `20px`
- Ancho: `100%` del contenedor
- Label a la izquierda (emoji + nombre)
- Valor a la derecha (`50/100`)
- Color dinámico según nivel del stat

### Botones de Acción (S3 — Nuevo layout)

> **S3:** Los botones Entrenar/Alimentar/Descansar fueron reemplazados.

**Layout:** `[🌀 Purificar (10💠)]  [⚙️]  [💬 Conversar]`

| Botón | Estilo | Comportamiento |
|-------|--------|----------------|
| Purificar | NES btn, color púrpura/cyan | Cuesta 10 Fragmentos. Disabled si <10💠 o Esencia=100. Tooltip: "Necesitas 10 💠" |
| ⚙️ | NES btn, pequeño (icono solo) | Abre/cierra panel Settings |
| Conversar | NES btn verde | Toggle chat. Cambia a "✕ Cerrar" cuando abierto |

- Estilo NES.css (`nes-btn`)
- Padding: `12px 16px`
- Fuente: Press Start 2P a `10px`
- Estados: normal / hover / active / disabled
- Disabled: gris, cursor not-allowed, opacidad 0.5
- **Se ocultan durante chat** (Purificar y ⚙️)

### Identidad del Usuario en Header (S3)

```css
/* Texto discreto, alineado a la derecha */
.user-identity {
  font-size: 8px;
  color: var(--text-secondary);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Transición cuando Regenmon descubre el nombre */
.user-identity--discovered {
  animation: identity-reveal 1s ease;
}

@keyframes identity-reveal {
  0% { opacity: 0; transform: translateY(-4px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### Historial de Actividades (S3 — Bonus)

```css
/* Sección colapsable debajo de botones */
.activity-history {
  font-size: 8px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.activity-history--expanded {
  max-height: 200px;
  overflow-y: auto;
}

/* Cada entrada */
.activity-entry {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  border-bottom: 1px solid var(--border-nes);
}

.activity-entry__icon { width: 20px; }
.activity-entry__change--positive { color: #4caf50; }
.activity-entry__change--negative { color: #e74c3c; }
.activity-entry__time { color: var(--text-secondary); }
```

| Acción | Icono | Ejemplo |
|--------|-------|---------|
| Purificó | 🌀 | `🌀  -10 💠  hace 5 min` |
| Conversó | 💬 | `💬  +3 💠  hace 20 min` |
| Buscó Fragmentos | 🔍 | `🔍  +15 💠  hace 1h` |

- **Se oculta durante chat** (como Purificar y ⚙️)
- **Toggle:** Título "📜 Historial" clickeable para expandir/colapsar
- **Estilo:** NES container sutil, no compite con los stats ni el Regenmon

### Panel Settings (⚙️) (S3 — Nuevo)

Panel expandible que aparece al presionar ⚙️. Contiene:

| Opción | Icono | Control |
|--------|-------|---------|
| Música | 🎵 | Toggle on/off |
| Reiniciar | 🔄 | Botón con confirmación |
| Cambiar nombre | 📝 | Campo inline, mismas validaciones |
| Sesión | 🚪 | "Iniciar Sesión" / "Cerrar Sesión" |
| Texto | 🔤 | A+ / A- para agrandar/disminuir |
| Tema | 🌙/☀️ | Toggle Dark (NES) / Light (GBC) |

Estilo: NES container (`nes-container is-dark`), posición fija o slide-in, fondo opaco.

### Modales
- Fondo: `rgba(0,0,0,0.7)` overlay
- Contenedor: borde NES pixelado, fondo `bg-dark`
- Padding: `24px`
- Centrado vertical y horizontal
- Animación: fade in

### Cajas de Diálogo (Historia)
- Estilo NES.css (`nes-container is-dark`)
- Posición: parte inferior de la pantalla
- Efecto typewriter: 50ms por carácter

---

## Animaciones

| Animación | Duración | Easing | Uso |
|-----------|----------|--------|-----|
| Idle (rebote) | `2s` | `ease-in-out` | Regenmon sube/baja sutilmente |
| Idle (respiración) | `3s` | `ease-in-out` | Escala 1.0 → 1.03 → 1.0 |
| Fade entre pantallas | `0.5s` | `ease` | Transiciones P1→P2, etc. |
| Press Start parpadeo | `1s` | `steps(2)` | Texto aparece/desaparece |
| Feedback flotante | `1.5s` | `ease-out` | "+10" sube y se desvanece |
| Stat bar update | `0.3s` | `ease` | Barra crece/decrece suavemente |

---

## Responsive Rules

1. **Nunca usar scroll horizontal** — todo en una columna
2. **Regenmon siempre visible** sin necesidad de scroll
3. **Botones siempre accesibles** — si no caben en fila, se apilan
4. **Press Start 2P a 8px mínimo** — nunca más chico o se vuelve ilegible
5. **Touch targets mínimo 44x44px** en móvil
6. **Paisaje de fondo siempre cubre viewport** (background-size: cover)

---

## Chat UI (Sesión 2)

### Caja de Diálogo NES

| Propiedad | Valor |
|-----------|-------|
| Estilo | Final Fantasy / Zelda RPG dialog box |
| Fondo | Semi-transparente (sobre paisaje) |
| Borde | NES pixelado (similar al contenedor de stats) |
| Posición | Inferior en todas las pantallas |
| Tamaño | Se adapta al viewport automáticamente |
| Animación entrada | Fade in |
| Animación salida | Fade leve |

### Burbujas de Chat

```css
/* Base — todas las burbujas */
.chat-bubble {
  font-family: 'Press Start 2P';
  font-size: 8px;
  padding: 8px 12px;
  margin: 4px 0;
  max-width: 80%;
  image-rendering: pixelated;
}

/* Burbuja del usuario — derecha */
.chat-bubble--user {
  margin-left: auto;
  text-align: right;
}

/* Burbuja del Regenmon — izquierda */
.chat-bubble--regenmon {
  margin-right: auto;
  text-align: left;
}
```

**Borde por tipo** (tinte MUY sutil, casi imperceptible):
| Tipo | Color borde burbuja |
|------|---------------------|
| Rayo | `#f7dc6f` (amarillo suave) |
| Flama | `#e74c3c` (rojo suave) |
| Hielo | `#85c1e9` (azul suave) |

> Nota: Solo el **borde** cambia de color, no el fondo de la burbuja.

### Botón Conversar

```css
/* Mismo estilo NES verde que los otros botones */
/* Fila única con los 3 botones (S3) */
/* Conversar cambia texto a "✕ Cerrar" cuando chat está abierto */
/* Purificar y ⚙️ se ocultan durante chat */
```

### Stats Compactos (durante chat)

```css
/* Modo compacto: solo emoji + número + mini barra */
/* Ejemplo: 🔮 80 | 💛 50 | 🌱 30 */
/* Se muestran en una sola fila horizontal */
.stats-compact {
  display: flex;
  gap: 12px;
  justify-content: center;
  font-size: 8px;
}
```

### Indicador "Escribiendo..."

```css
/* Tres puntos animados estilo NES */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px;
}

.typing-dot {
  width: 4px;
  height: 4px;
  background: var(--text-primary);
  animation: typing-bounce 1.4s infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
```

### Chat Input

| Propiedad | Valor |
|-----------|-------|
| Max caracteres | 280 (límite de Twitter) |
| Enviar | Enter (desktop) / Botón (mobile) |
| Salto de línea | Ctrl+Enter (desktop) |
| Placeholder | Contextual según nombre del Regenmon |
| Borde | NES pixelado |

### Animaciones de Chat

| Animación | Cuándo | Duración |
|-----------|--------|---------|
| Bounce | Mensaje nuevo del Regenmon | 0.3s |
| Fade in | Caja de diálogo al abrir | 0.3s |
| Fade out | Caja de diálogo al cerrar | 0.2s |
| Botones reaparecen | Al cerrar chat | 0.3s sutil |

### Música durante Chat

| Acción | Efecto |
|--------|--------|
| Abrir chat | Volumen baja a 60% (fade 1.5s) |
| Cerrar chat | Volumen regresa a 100% (fade 1.5s) |

---

## Accesibilidad (A11y)

### Contraste y Color
- Verificar siempre contraste texto/fondo (mínimo 4.5:1).
- No usar solo color para transmitir información (usar iconos + texto).

### Navegación por Teclado
- **Focus visible:** El navegador debe mostrar el outline por defecto o uno personalizado estilo NES (borde pixelado). Nunca `outline: none`.
- Orden de tabulación lógico.

### Semántica y ARIA
- Botones de iconos (ajustes, música) deben tener `aria-label="Descripción"`.
- Barras de progreso deben tener `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Mensajes de estado (updates de stats) deben usar `role="status"` o `aria-live="polite"`.

### Chat (Sesión 2)
- Mensajes nuevos anunciados via `aria-live="polite"` (no interrumpe inmediatamente).
- Indicador "Escribiendo..." con `aria-label="Tu Regenmon está pensando"`.
- Botón "Conversar" desactivado: `aria-disabled="true"` + tooltip accesible.
- Input de chat: `aria-label` descriptivo.
- Scroll automático no debe interferir con lectores de pantalla.

### Movimiento Preferido
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Pixel Art Sprite System (S3 — Phase 40)

### PNG Base + SVG Face Overlay
- **Body**: Gemini-generated pixel art PNGs in `public/sprites/` (rayo-base.png, flama-base.png, hielo-base.png)
- **Face**: SVG overlays on top of PNG base for dynamic expressions
- **Face viewBox per type**: Rayo `0 0 150 150`, Flama `-4 -30 150 150`, Hielo `-7 3 150 150`
- **Expression logic**: Dark expressions for positive states (euphoric, happy, neutral), bright/white for negative states (sad, critical, no_hope, no_energy, no_nutrition)
- **Particle effects**: Type-specific particles around sprite — electric sparks (Rayo), fire particles (Flama), ice crystals (Hielo)
- **Scaling**: `image-rendering: pixelated` for crisp pixel art at any size

### Background System (PNG + CSS Filters)
- **Assets**: 6 pixel art PNGs in `public/backgrounds/` (Gemini-generated)
  - 3 dark variants: twilight, dusk, night (one per type)
  - 3 light variants: midday, golden hour, dawn (one per type)
- **Mood modulation via CSS filters** (no separate images per mood):
  - Good mood: `filter: brightness(1.1) saturate(1.15)`
  - Neutral mood: no filter (base image)
  - Bad mood: `filter: brightness(0.75) saturate(0.55)`
- **Transitions**: 1.5s CSS transitions between mood states
- **Scaling**: `image-rendering: pixelated`, `background-size: cover`

### Animated Streaks & Sparkles (Good Mood Only)
- SVG animated streaks appear ONLY when mood is good:
  - ⚡ Rayo: Electric bolts
  - 🔥 Flama: Heat shimmer
  - ❄️ Hielo: Aurora borealis
- Sparkle particles with type-specific colors on good mood
- Disappear on neutral/bad mood — visual reward for keeping stats high

### Theme System (CSS Custom Properties)
- All colors reference `var(--theme-*)` CSS custom properties
- `.theme-light` class on root element overrides all variables
- Components are theme-agnostic — they just use variables
- Game Boy Color warm palette for light theme: `#f5f0e1` (bg), `#d4c5a9` (surface), `#2a2a2a` (text)
- Toggle in Settings panel; persisted in localStorage via `useTheme` hook

---

### Floating Stat Deltas (S3 — Bonus)

```css
/* Fade-up animation showing stat changes above sprite */
.hud-floating-delta {
  position: absolute;
  font-size: 10px;
  font-family: 'Press Start 2P';
  pointer-events: none;
  animation: float-up-fade 1.5s ease-out forwards;
}

@keyframes float-up-fade {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-40px); }
}
```

- Shows "+5 🔮 -1 ✨" or "-10 💎" above sprite when stats change
- Triggered on: purify, search fragments, chat responses
- Auto-dismiss after animation completes (1.5s)
- Multiple deltas can stack vertically

### Memory Indicator 🧠 (S3 — Bonus)

```css
/* Shows in top bar HUD next to fragments */
.hud-memories {
  font-size: 8px;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
```

- Format: `🧠 N` where N = memoryCount
- Only visible when: logged in AND memoryCount > 0
- Position: top bar HUD, between fragments and user identity
- `useChat.ts` exposes `memoryCount` for this indicator

### Character Counter (S3 — Bonus)

```css
/* Below name input in CreationScreen */
.creation-screen__char-count {
  font-size: 8px;
  text-align: center;
  margin-top: 4px;
}

.creation-screen__char-count--valid { color: #4caf50; } /* green, ≥2 chars */
.creation-screen__char-count--invalid { color: #e74c3c; } /* red, >15 chars */
.creation-screen__char-count--dim { color: var(--text-secondary); } /* <2 chars */
```

- Format: `name.length/15`
- Color-coded: red when >15, green when ≥2, dim otherwise

### History Button 📜 (S3 — Repositioned)

```css
/* Compact toggle on right side of bottom bar */
.hud-history-btn {
  font-size: 10px;
  padding: 8px;
  cursor: pointer;
  border: 2px solid var(--border-nes);
  background: transparent;
}

.hud-history-btn--active {
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
  border-color: #00e5ff;
}
```

- Position: right side of bottom bar (after Conversar button)
- Compact: icon-only 📜 toggle
- Active state: glow effect when history is expanded

### Toast System (S3)

Toast notifications with three states for game actions:

| State | Style | Duration | Use |
|-------|-------|----------|-----|
| Loading | Pulsing, muted colors | Until resolved | "Purificando..." |
| Success | Green accent, brief | 3s auto-dismiss | "¡Me siento renovado!" |
| Error | Red accent | 5s or manual dismiss | "Error de conexión" |

- D4 purify toast: "¡Me siento renovado!"
- F1/F2/F3: loading → success/error state transitions
- B2: fragments show "💎 ---" when not logged in

---

## Photo UI (S4 — La Evolución)

### Photo Upload Component

```css
.photo-upload {
  /* NES container with camera icon */
  text-align: center;
  padding: 16px;
}

.photo-upload__preview {
  max-width: 200px;
  max-height: 200px;
  image-rendering: pixelated;
  border: 4px solid var(--border-nes);
}

.photo-upload__cooldown {
  font-size: 8px;
  color: var(--text-secondary);
}

.photo-upload__blocked {
  color: #e74c3c;
  font-size: 8px;
}
```

### Photo Result Component

| Resonance | Color | Visual |
|-----------|-------|--------|
| Weak | `#a0a0a0` (gray) | Subtle glow, minimal particles |
| Medium | `#f5c542` (gold) | Warm glow, moderate particles |
| Strong | `#4caf50` (green) | Bright glow, abundant particles |
| Penalizing | `#e74c3c` (red) | No glow, warning visual |

```css
.photo-result {
  text-align: center;
  padding: 16px;
  animation: result-reveal 0.5s ease;
}

.photo-result__diary {
  font-size: 8px;
  font-style: italic;
  color: var(--text-secondary);
  margin-top: 8px;
  /* The Regenmon's emotional phrase about the photo */
}

@keyframes result-reveal {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
```

### Memorias Panel (🧠)

> **Two panels, two purposes:**
> - 📜 **Historial** = transaction log (purify, chat, photo) — numbers
> - 🧠 **Memorias** = emotional diary of the Regenmon — phrases, feelings

```css
.memorias-panel {
  /* NES container, scrollable */
  max-height: 300px;
  overflow-y: auto;
}

.memorias-entry {
  padding: 8px;
  border-bottom: 1px solid var(--border-nes);
  font-size: 8px;
}

.memorias-entry__text {
  /* Diary entry from Regenmon's perspective */
  font-style: italic;
  color: var(--text-primary);
}

.memorias-entry__meta {
  color: var(--text-secondary);
  font-size: 6px;
  margin-top: 4px;
}

/* Resonance indicator dot */
.memorias-entry__resonance--weak { color: #a0a0a0; }
.memorias-entry__resonance--medium { color: #f5c542; }
.memorias-entry__resonance--strong { color: #4caf50; }
```

### Evolution Visual (S4)

> **5 invisible stages** — no visible progress bar. Player FEELS the progress.
> Sprite changes subtly with each stage. Fractures are dramatic moments.

```css
/* Fracture animation — plays when crossing threshold */
.fracture-animation {
  animation: fracture-flash 2s ease forwards;
}

@keyframes fracture-flash {
  0% { filter: brightness(1); }
  20% { filter: brightness(3) saturate(2); }
  40% { filter: brightness(0.5); }
  60% { filter: brightness(2); }
  80% { filter: brightness(1.2); }
  100% { filter: brightness(1); }
}

/* Dormant sprite when evolution frozen (all stats < 10) */
.sprite--dormant {
  opacity: 0.4;
  filter: grayscale(0.8);
  animation: dormant-pulse 4s ease-in-out infinite;
}

@keyframes dormant-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}
```

### Mission Card (S4)

```css
.mission-card {
  /* NES container with subtle glow */
  padding: 12px;
  font-size: 8px;
  border: 2px solid var(--border-nes);
}

.mission-card--active {
  box-shadow: 0 0 8px rgba(245, 197, 66, 0.3);
}

.mission-card__bonus {
  color: #4caf50;
  font-size: 6px;
}
```

### Fullscreen (S4)

```css
/* Fullscreen toggle button */
.fullscreen-btn {
  position: fixed;
  top: 4px;
  right: 4px;
  font-size: 12px;
  z-index: 100;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* Fullscreen mode adjustments */
:fullscreen .game-container {
  max-width: 100vw;
  height: 100vh;
}
```

### Strike Warning (S4)

```css
.strike-warning {
  color: #e74c3c;
  font-size: 8px;
  text-align: center;
  padding: 8px;
  animation: strike-shake 0.5s ease;
}

@keyframes strike-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

---

## Reglas Generales

- **Todo texto en Press Start 2P** — sin excepciones
- **Bordes pixelados** usando NES.css o box-shadow escalonado
- **Sin sombras suaves** (drop-shadow, box-shadow blur) — rompen la estética NES
- **Sin bordes redondeados** (border-radius) — todo en ángulos rectos, pixelado
- **Colores sólidos** — sin gradientes suaves (se permiten gradientes escalonados/dithering)
- **Cursor personalizado** si es posible (puntero pixel art)
- **Chat: sin sonido** — la música de fondo es suficiente, evitar ruido
- **Chat: sin typewriter** — los mensajes aparecen de golpe
- **Chat: sin avatares** — posición izq/der distingue Regenmon/usuario
- **Tema Dark (NES)** es el default. Light (GBC) activable en Settings
- **Temas afectan:** backgrounds, bordes, colores de texto, UI containers. NO afectan colores de tipo ni stats
- Este archivo se actualiza cuando se agreguen nuevos componentes o cambien colores

---

## Referencias Cruzadas

Este archivo define **cómo se ve y se siente** el juego. Los otros documentos definen qué, por qué y con qué.

| Documento | Relación con FRONTEND_GUIDELINES.md |
|-----------|-------------------------------------|
| [LORE.md](./LORE.md) | Los colores por tipo representan su esencia narrativa; los paisajes son zonas del mundo digital |
| [PRD.md](./PRD.md) | Los features visuales (F1.8-F1.14, F3.10-F3.13) se implementan según estas guías |
| [APP_FLOW.md](./APP_FLOW.md) | El layout de cada pantalla (P1-P6) sigue la estructura definida aquí |
| [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) | Los stats y sus colores aquí corresponden a los campos de datos definidos allá |
| [TECH_STACK.md](./TECH_STACK.md) | NES.css, Tailwind v4, Press Start 2P — las herramientas que hacen posible esta estética |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Las fases visuales (40: backgrounds/sprites, 41: tema GBC, 42: header, 46: polish) implementan estas guías |
| [model.md](./model.md) | Las decisiones de tema GBC, layout de botones, y chat UI se documentan allá |
| [progress.txt](./progress.txt) | Trackea qué componentes visuales ya están implementados |

> **Regla de precedencia visual:** Si hay conflicto entre este documento y [LORE.md](./LORE.md) en temas de significado de colores, paisajes o tono visual, **LORE.md gana**.
