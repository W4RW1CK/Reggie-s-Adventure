# 🎨 FRONTEND_GUIDELINES — Reggie's Adventure
> **Versión actual:** v0.2 — La Voz
> **Última actualización:** 2026-02-14
>
> 📜 **Lore visual:** Los colores por tipo, paisajes, y animaciones del Regenmon
> reflejan su significado narrativo. Ver [LORE.md](./LORE.md) para contexto.

---

## Identidad Visual

**Inspiración:** Kirby's Adventure (NES, 1993)
**Sensación:** Retro 8-bit con sustancia. No infantil, no genérico. Un juego que se siente clásico y querido.
**Principio:** La vibra de Kirby's Adventure — colores vibrantes, formas redondeadas, ambiente cálido pero con personalidad.
**Tono narrativo:** Místico + épico + oscuro pero esperanzador (ver LORE.md). La estética debe transmitir que este es un mundo digital vivo, antiguo, y que necesita sanarse.

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

### Colores Base

| Nombre | Hex | Uso |
|--------|-----|-----|
| `bg-dark` | `#1a1a2e` | Fondo principal oscuro |
| `bg-medium` | `#16213e` | Fondo secundario |
| `surface` | `#0f3460` | Contenedores, cajas |
| `text-primary` | `#e8e8e8` | Texto principal |
| `text-secondary` | `#a0a0a0` | Texto secundario |
| `text-accent` | `#ffffff` | Texto destacado |
| `border-nes` | `#4a4a4a` | Bordes estilo NES |

### Colores por Tipo (ver LORE.md → Los Regenmon)

> Cada tipo representa un aspecto perdido de La Red Primordial.
> Los colores reflejan su esencia narrativa.

| Tipo | Representa | Primario | Secundario | Fondo Paisaje |
|------|-----------|----------|------------|---------------|
| ⚡ Rayo | **El Impulso** — el flujo limpio de información | `#f5c542` | `#d4a017` | `#2a2a40` (cielo tormentoso) |
| 🔥 Flama | **La Pasión** — la conexión genuina entre seres | `#e74c3c` | `#c0392b` | `#3d1f00` (volcánico) |
| ❄️ Hielo | **La Memoria** — el conocimiento preservado | `#3498db` | `#2980b9` | `#0a1628` (nocturno nevado) |

### Colores de Stats (ver LORE.md → Stats y Lore)

> Los stats no son números arbitrarios. Representan el estado interno del Regenmon.

| Stat | Significado Lore | Barra Llena | Barra Baja | Fondo Barra |
|------|-----------------|-------------|------------|-------------|
| 🔮 Espíritu | **Esperanza** — cuánto cree en la regeneración | `#9b59b6` | `#4a235a` | `#2c2c2c` |
| 💛 Pulso | **Energía vital** — fuerza para existir y actuar | `#f1c40f` | `#7d6608` | `#2c2c2c` |
| 🍎 Hambre | **Necesidad** — datos limpios que lo nutren | `#e74c3c` | `#78281f` | `#2c2c2c` |

### Colores de UI

| Elemento | Color | Hex |
|----------|-------|-----|
| Botón activo | Verde NES | `#4caf50` |
| Botón hover | Verde claro | `#66bb6a` |
| Botón desactivado | Gris | `#555555` |
| Botón peligro (reset) | Rojo apagado | `#8b0000` |
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

### Estructura de la Pantalla de Juego (P6)

```
┌─────────────────────────────────────┐
│ 🎵          v0.1 — El Despertar     │ ← Header (fijo arriba)
├─────────────────────────────────────┤
│                                     │
│         [Paisaje de Fondo]          │ ← Background (absoluto, cubre todo)
│                                     │
│          ┌─────────────┐            │
│          │  Regenmon    │            │ ← SVG centrado
│          │  (SVG idle)  │            │
│          └─────────────┘            │
│           "Nombre" ✏️               │
│          Día X de aventura          │
│                                     │
│  🔮 Espíritu [████████──] 80/100    │ ← Stats
│  💛 Pulso    [█████─────] 50/100    │
│  🍎 Hambre   [███───────] 30/100    │
│                                     │
│  [Entrenar] [Alimentar] [Descansar] │ ← Botones
│                                     │
│          [Reiniciar]                │ ← Footer (discreto)
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

### Barras de Stats (NES.css)
- Usar `<progress>` con estilos NES.css
- Altura: `20px`
- Ancho: `100%` del contenedor
- Label a la izquierda (emoji + nombre)
- Valor a la derecha (`50/100`)
- Color dinámico según nivel del stat

### Botones de Acción
- Estilo NES.css (`nes-btn`)
- Padding: `12px 16px`
- Fuente: Press Start 2P a `10px`
- Estados: normal / hover / active / disabled
- Disabled: gris, cursor not-allowed, opacidad 0.5

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
/* Fila propia debajo de Entrenar/Alimentar/Descansar */
/* Cambia texto a "✕ Cerrar" cuando chat está abierto */
```

### Stats Compactos (durante chat)

```css
/* Modo compacto: solo emoji + número + mini barra */
/* Ejemplo: 🔮 80 | 💛 50 | 🍎 30 */
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
- Este archivo se actualiza cuando se agreguen nuevos componentes o cambien colores
