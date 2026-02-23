# 🎨 REDESIGN_SPEC — Reggie's Adventure
> **Versión:** v1.0
> **Última actualización:** 2026-02-23
> **Autor:** w4rw1ck + Aibus
> **Estado:** EN PROGRESO
>
> 📜 **Referencia narrativa:** [LORE.md](./LORE.md)
> 🗺️ **Flujos y pantallas:** [APP_FLOW.md](./APP_FLOW.md)
> 🎨 **Guidelines actuales:** [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md)
> 🛠️ **Tech stack:** [TECH_STACK.md](./TECH_STACK.md)

---

## Objetivo

Rediseño visual completo de las 19 pantallas de Reggie's Adventure.
Estilo: **cyber-arcane + retro-pixel 8-bit + cypherpunk hacker + mystic arcane**.
Preview-first en HTML standalone → luego implementar en Next.js components.

---

## Design System

### Paleta Dark (Principal)

| Nombre | Hex | Uso |
|--------|-----|-----|
| `bg-void` | `#0a0a0f` | Fondo principal |
| `cyan` | `#00f0ff` | Acento primario, bordes activos, glow |
| `purple` | `#b44aff` | Acento secundario, magia, misticismo |
| `gold` | `#f5c542` | Recompensas, highlights, warnings |
| `text-primary` | `#e0e0e0` | Texto principal |
| `text-dim` | `#555555` | Texto secundario/inactivo |
| `surface` | `#1a1a2a` | Contenedores, panels |
| `border` | `#222233` | Bordes por defecto |

### Paleta Light (Papiro/Parchment)

| Nombre | Hex | Uso |
|--------|-----|-----|
| `bg-papiro` | `#f4e8c1` | Fondo principal |
| `ink-dark` | `#8b6914` | Texto principal |
| `ink-red` | `#8b2500` | Acentos, títulos |
| `border-papiro` | `#c4a56a` | Bordes |
| `surface-papiro` | `#efe0b9` | Contenedores |

### Tipografía

| Uso | Fuente | Nota |
|-----|--------|------|
| **Todo** | `Press Start 2P` | Google Fonts, monospace |

### Escala tipográfica

| Token | Size | Uso |
|-------|------|-----|
| `--fs-xs` | 7px | Labels mínimos, version |
| `--fs-sm` | 9px | Info secundaria |
| `--fs-base` | 11px | Texto general, botones |
| `--fs-lg` | 14px | Subtítulos |
| `--fs-xl` | 18px | Títulos de pantalla |
| `--fs-2xl` | 24px | Logo/título principal |
| `--fs-3xl` | 32px | Impacto (Loading, Fractura) |

### Elementos visuales

- **Scanlines:** overlay sutil `rgba(0,0,0,0.04)` en repeating-gradient
- **Glitch effects:** para transiciones y momentos de impacto
- **Runic glyphs:** decorativos en bordes y esquinas
- **Terminal glow borders:** `box-shadow: 0 0 Npx rgba(0,240,255,X)`
- **Glassmorphism:** para modales y overlays (`backdrop-filter: blur`)
- **Pixel borders:** para contenedores principales
- **image-rendering:** `pixelated` global

### Componentes reutilizables

| Componente | Descripción |
|------------|-------------|
| `pixel-container` | Contenedor con borde pixelado + glow |
| `glow-btn` | Botón con efecto glow al hover |
| `stat-bar` | Barra de stat con colores por tipo |
| `chat-bubble` | Burbuja de chat (user/bot) |
| `floating-text` | Texto flotante animado (+5 🔮, etc.) |
| `runic-corner` | Decoración de esquina rúnica |
| `modal-overlay` | Modal con glassmorphism |
| `nav-bottom` | Barra de navegación inferior (World/Chat/Photo/Social) |

---

## Inventario de Pantallas (19)

### Bloque 1 — Splash + Onboarding (pantallas 1-7)

| # | Pantalla | Ref APP_FLOW | Estado |
|---|----------|-------------|--------|
| 1 | Loading NES | P1 | [ ] |
| 2 | Loading + Fullscreen | S4 merge con P1 | [ ] |
| 3 | Title | P2 | [ ] |
| 4 | Typewriter (Historia) | P3 | [ ] |
| 5 | Iniciar Sesión (Privy) | S3 modal | [ ] |
| 6 | Creación | P4 | [ ] |
| 7 | Transición ("despertando...") | P5 | [ ] |

#### P1 — Loading NES
- Logo "Reggie's Adventure" centrado
- Animación de carga (barra o spinner pixel)
- Duración max 3s
- Fade out → P2
- **Dark:** Logo con glow cyan, fondo void, partículas sutiles
- **Light:** Logo en ink-dark sobre papiro, borde rúnico

#### P2 — Loading + Fullscreen (S4)
- Mismo screen que Loading pero al completar carga:
- Prompt de fullscreen: "Pantalla completa" / "Continuar así"
- Dos botones estilo glow-btn
- **Dark:** Botones con borde cyan/purple
- **Light:** Botones estilo pergamino

#### P3 — Title
- Título "Reggie's Adventure" prominente
- Regenmons decorativos en fondo (no protagonistas)
- "Press Start" parpadeante
- 🎵 Toggle música (esquina superior derecha)
- **Dark:** Título con glitch sutil, glow multicolor, fondo con runas tenues
- **Light:** Título estilo manuscrito arcano, fondo pergamino con sellos

#### P4 — Typewriter (Historia)
- Caja de diálogo estilo terminal/NES
- Texto con efecto typewriter (LORE.md → El Origen)
- Botón "Continuar ▶" aparece al terminar
- No se puede saltar
- **Dark:** Caja terminal con borde cyan, texto verde-cyan, cursor parpadeante
- **Light:** Caja pergamino, texto ink-dark, pluma como cursor

#### P5 — Iniciar Sesión (Privy)
- Modal overlay sobre Title
- Opciones: Google, Email, Passkey
- "Continuar sin cuenta" (modo demo)
- **Dark:** Modal glassmorphism con borde purple
- **Light:** Modal pergamino con sello

#### P6 — Creación
- Título "Crea tu Regenmon"
- Carrusel de 3 tipos (uno a la vez):
  - ⚡ Rayo — cyan/lightning
  - 🔥 Flama — orange/fire
  - ❄️ Hielo — purple/ice
- Flechas de navegación
- Campo de nombre (2-15 chars) con counter
- Botón "¡Despertar!"
- **Dark:** Sprites con glow del tipo, fondo con partículas elementales
- **Light:** Sprites sobre vitral de pergamino

#### P7 — Transición ("despertando...")
- Fondo oscuro
- Texto: "Tu Regenmon está despertando..."
- Puntos suspensivos animados
- Duración 2-3s → fade → World
- **Dark:** Flash de energía, partículas convergentes
- **Light:** Luz cálida expandiéndose

---

### Bloque 2 — Core Gameplay (pantallas 8-14)

| # | Pantalla | Ref APP_FLOW | Estado |
|---|----------|-------------|--------|
| 8 | Tutorial/Onboarding | S4 | [ ] |
| 9 | Home (World) | P6 game state | [ ] |
| 10 | Ajustes (Settings) | S3 panel | [ ] |
| 11 | Historial/Memorias | S3 bonus + S4 diary | [ ] |
| 12 | Chat | P6 chat state | [ ] |
| 13 | Cámara (Pre-camera) | S4 photo state | [ ] |
| 14 | Post-Photo (Evaluación) | S4 results | [ ] |

#### P8 — Tutorial/Onboarding
- Modal overlay sobre World
- New players: 5 pasos (Meet, Chat, Care, Photos✨, Evolution✨)
- Returning S3 players: 2 pasos (Photos✨, Evolution✨)
- "Saltar tutorial" siempre visible
- Badge "✨ Nuevo" en pasos 4-5
- **Dark:** Modal con bordes rúnicos, pasos como pergaminos glitch
- **Light:** Pasos como páginas de libro

#### P9 — Home (World)
- **HUD superior:**
  - 💠 Fragmentos (izq)
  - 🧠 Memorias count (si logueado)
  - Identidad usuario (der)
  - Version discreto
- **Paisaje de fondo** según tipo + estado emocional:
  - ⚡ Rayo: Llanura Eléctrica
  - 🔥 Flama: Volcán Ardiente
  - ❄️ Hielo: Montaña Nevada
- **Sprite Regenmon** centrado con idle animation (rebote/respiración)
  - 8 estados visuales según stats (Eufórico→Crítico)
  - Tap sprite → floating purification buttons
- **Stats** (🔮 Espíritu, 💛 Pulso, 🌱 Esencia)
- **Bottom nav:** 💬 Chat + 📷 Photo + 🌍 Social
- **Botones:** 🌀 Purificar + ⚙️ Settings + 📜 History
- **Misión activa** (si existe, MissionCard)
- **Dark:** Paisaje con colores profundos, partículas flotantes, glow en HUD
- **Light:** Paisaje acuarela/pixel, HUD en pergamino

#### P10 — Ajustes (Settings)
- Panel slide-in o modal
- Opciones:
  - 🎵 Música toggle
  - 🔄 Reiniciar (→ modal confirmación)
  - 📝 Cambiar nombre (1 uso, 2-15 chars)
  - 🚪 Login/Logout (Privy)
  - 🔤 Texto A+/A-
  - 🌙/☀️ Tema Dark/Light toggle
  - 🔁 Reiniciar tutorial
  - 🌍 Visibilidad en La Red (S5)
- **Dark:** Panel glassmorphism con borde purple
- **Light:** Panel pergamino con bordes dorados

#### P11 — Historial/Memorias
- Sección colapsable "📜 Historial"
- Últimas 10 acciones (cronológico inverso)
- Cada entrada: icono + cambio 💠 + tiempo relativo
- Se oculta durante chat
- **Dark:** Lista en contenedor terminal
- **Light:** Lista en rollo de pergamino

#### P12 — Chat
- Full-screen (mobile) o 30% panel (desktop)
- Header con ✕ cerrar + 📎 foto
- Burbujas de chat (user derecha, bot izquierda)
- Input texto + botón enviar
- Indicador "Escribiendo..." (puntos NES animados)
- Stats en modo compacto (🔮 80 | 💛 50 | 🌱 30)
- Música baja a 60% al abrir
- **Dark:** Burbujas con glow, fondo terminal oscuro
- **Light:** Burbujas pergamino, fondo crema

#### P13 — Cámara (Pre-camera)
- Full screen
- Explica qué quiere ver Reggie
- Misión activa (si existe)
- Dos opciones: "📸 Tomar foto" + "🖼️ Galería"
- Primera vez: texto sobre permisos + privacidad
- Si cooldown: timer countdown
- **Dark:** Interfaz con marco de cámara retro-pixel, glow cyan
- **Light:** Marco de viñeta antigua

#### P14 — Post-Photo (Evaluación)
- Full screen post-evaluación
- Regenmon reacciona con animación según resonancia:
  - Strong: happy bounce, bright particles
  - Weak: neutral
  - Penalizing: dimmed sprite, red text, strike warning
- Stat deltas mostrados
- Diary entry displayed
- Dos botones: "💬 Conversar" → Chat / "🏠 Volver" → World
- **Dark:** Resultado con glow según score, partículas del tipo
- **Light:** Resultado en carta de pergamino sellada

---

### Bloque 3 — Evolución + Social (pantallas 15-19)

| # | Pantalla | Ref APP_FLOW | Estado |
|---|----------|-------------|--------|
| 15 | Fractura (Evolución) | S4 thresholds | [ ] |
| 16 | Social | S5 social tab | [ ] |
| 17 | Leaderboard | S5 Regeneración Global | [ ] |
| 18 | Mi Perfil | S5 own profile | [ ] |
| 19 | Perfil Público | S5 visiting other | [ ] |

#### P15 — Fractura (Evolución)
- Animación dramática al cruzar umbral (50/100/200/400 progress)
- Flash brillante (brightness pulse)
- Shake sutil del sprite
- Partículas explotan hacia afuera
- Sprite transiciona a nueva forma
- Texto narrativo por tipo:
  - F1 (50): "Algo cambió en mí..."
  - F2 (100): "La conexión se profundiza..."
  - F3 (200): "Ya no soy lo que era..."
  - F4 (400): "La forma final..."
- **Dark:** Explosión de energía cyan/purple, glitch intenso, runas girando
- **Light:** Luz dorada expandiéndose, sellos arcanos rompiendo

#### P16 — Social
- Tab 🌍 en bottom nav
- Si no registrado: invitación "🌍 Registrar en La Red" + "Ahora no"
- Si registrado, 3 secciones:
  - 🌍 Regeneración Global (→ Leaderboard)
  - 📨 Mensajes recibidos (pulsos de datos)
  - 🔔 Actividad reciente (feed)
- Badge counter
- Auto-refresh cada 5min
- **Dark:** Feed estilo terminal, mensajes con glow
- **Light:** Feed estilo tablón de pergamino

#### P17 — Leaderboard (Regeneración Global)
- Lista de Regenmons públicos
- Cada entrada: sprite mini + nombre + tipo + progreso
- Tap → perfil público
- **Dark:** Tabla con bordes cyan, ranks con glow gold
- **Light:** Tabla en pergamino con sellos de ranking

#### P18 — Mi Perfil
- Mini-world propio
- Sprite con expresión actual + world background
- Stats visibles
- Memorias count
- Opciones: editar visibilidad
- **Dark:** Card con borde del tipo, glow personal
- **Light:** Card pergamino con sello personal

#### P19 — Perfil Público (de otro)
- Mini-world del otro Regenmon
- Sprite + world background + partículas del tipo
- Etapa de evolución + 🧠 N memorias (sin contenido)
- Acciones (si registrado):
  - 🍊 Alimentar (gasta $FRUTA)
  - 🎁 Regalar $FRUTA
  - 💬 Enviar pulso (max 140 chars)
- Si NO registrado: solo vista
- "← Volver" → leaderboard/social
- **Dark:** Card con borde del tipo del otro, glow sutil
- **Light:** Card pergamino con sello del otro tipo

---

## Implementación

### Fase 1 — Preview HTML
Archivo: `public/redesign-v4.html`
- HTML standalone con CSS/JS inline
- Nav tabs para cambiar entre pantallas
- Theme toggle (dark/light)
- Responsive (mobile-first)

### Fase 2 — Next.js Components
- Extraer CSS a `globals.css` + módulos
- Crear/actualizar componentes React por pantalla
- Integrar con lógica existente (state, localStorage, APIs)

### Fase 3 — Polish
- Animaciones finales
- Sonidos
- Performance (preloading, lazy load)
- Testing cross-browser

---

## Notas

- Dark mode es prioridad (light mode después)
- Preview-first: nada se implementa en Next.js sin aprobación en HTML
- Cada bloque se revisa y aprueba antes de pasar al siguiente
- Los sprites son PNG pixel art (no SVG) — generados por IA
