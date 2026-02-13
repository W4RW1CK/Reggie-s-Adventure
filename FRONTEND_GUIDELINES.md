# 🎨 FRONTEND_GUIDELINES — Reggie's Adventure
> **Versión actual:** v0.1 — El Despertar
> **Última actualización:** 2026-02-12

---

## Identidad Visual

**Inspiración:** Kirby's Adventure (NES, 1993)
**Sensación:** Retro 8-bit con sustancia. No infantil, no genérico. Un juego que se siente clásico y querido.
**Principio:** La vibra de Kirby's Adventure — colores vibrantes, formas redondeadas, ambiente cálido pero con personalidad.

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

### Colores por Tipo

| Tipo | Primario | Secundario | Fondo Paisaje |
|------|----------|------------|---------------|
| ⚡ Rayo | `#f5c542` | `#d4a017` | `#2a2a40` (cielo tormentoso) |
| 🔥 Flama | `#e74c3c` | `#c0392b` | `#3d1f00` (volcánico) |
| ❄️ Hielo | `#3498db` | `#2980b9` | `#0a1628` (nocturno nevado) |

### Colores de Stats

| Stat | Barra Llena | Barra Baja | Fondo Barra |
|------|-------------|------------|-------------|
| 🔮 Espíritu | `#9b59b6` | `#4a235a` | `#2c2c2c` |
| 💛 Pulso | `#f1c40f` | `#7d6608` | `#2c2c2c` |
| 🍎 Hambre | `#e74c3c` | `#78281f` | `#2c2c2c` |

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
| `desktop` | `> 768px` | Layout centrado con max-width, Regenmon grande |

**Max-width del contenido en desktop:** `480px` (simula una pantalla vertical centrada)

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

## Reglas Generales

- **Todo texto en Press Start 2P** — sin excepciones
- **Bordes pixelados** usando NES.css o box-shadow escalonado
- **Sin sombras suaves** (drop-shadow, box-shadow blur) — rompen la estética NES
- **Sin bordes redondeados** (border-radius) — todo en ángulos rectos, pixelado
- **Colores sólidos** — sin gradientes suaves (se permiten gradientes escalonados/dithering)
- **Cursor personalizado** si es posible (puntero pixel art)
- Este archivo se actualiza cuando se agreguen nuevos componentes o cambien colores
