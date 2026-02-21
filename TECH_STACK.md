# ⚙️ TECH_STACK — Reggie's Adventure
> **Versión actual:** v0.4 — La Evolución
> **Última actualización:** 2026-02-21
> **Estado:** Sesión 4 — `COMPLETADA` | Sesión 5 — `PENDIENTE`
>
> 📜 **Referencia narrativa:** [LORE.md](./LORE.md) — los system prompts de IA (`lib/ai/prompts.ts`) se basan íntegramente en LORE
> 🛠️ **Implementación técnica:** [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) — schemas y lógica que usan estas herramientas
> 🔨 **Orden de instalación:** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — cuándo se instala cada dependencia

---

## Core Framework

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `next` | `16.1.x` | Framework web full-stack (App Router) |
| `react` | `19.2.x` | Librería de UI |
| `react-dom` | `19.2.x` | Renderizado en navegador |
| `typescript` | `5.9.x` | Tipado estático |

## UI y Estilos

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `nes.css` | `2.3.0` | Componentes retro estilo NES (barras, botones, contenedores) |
| `tailwindcss` | `4.1.x` | Utilidades CSS para layout responsive (config CSS-first en v4) |

> **Nota:** Tailwind CSS v4 usa configuración directa en CSS (`@theme`), ya no requiere `tailwind.config.ts`, `postcss` ni `autoprefixer` por separado.

## Fuentes

| Fuente | Fuente | Propósito |
|--------|--------|-----------|
| `Press Start 2P` | Google Fonts (CDN) | Fuente pixel art principal |

## IA Conversacional (Sesión 2)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@google/generative-ai` | `latest` | Gemini API — desarrollo local |
| `openai` | `latest` | OpenAI API — producción (Frutero) |

> **Nota:** Solo se usa UNA API a la vez. El auto-switch detecta `GEMINI_API_KEY` (dev) u `OPENAI_API_KEY` (prod). Arquitectura API-agnostic permite agregar Claude en el futuro sin cambiar código.
>
> 📜 **System Prompts:** El contenido de `lib/ai/prompts.ts` se basa íntegramente en [LORE.md](./LORE.md) — la biblia narrativa del universo.

## Auth y Persistencia (Sesión 3)

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@privy-io/react-auth` | `latest` | Autenticación de usuarios (Google, Email, Passkey) |
| `@supabase/supabase-js` | `latest` | Base de datos PostgreSQL en la nube |

> **Nota:** Privy maneja la autenticación y devuelve un user ID único. Supabase almacena los datos del juego vinculados a ese user ID. Credenciales propias (no del bootcamp).

## Asset Generation & Visual Techniques (Sesión 3)

| Herramienta/Técnica | Propósito |
|---------------------|-----------|
| **Gemini** (image generation) | Generate pixel art sprites (PNG) and backgrounds (PNG) |
| `CSS custom properties` (`var(--theme-*)`) | Theming system — dark (NES) / light (Game Boy Color) via class toggle |
| `image-rendering: pixelated` | Crisp pixel art scaling at any resolution |
| CSS `filter: brightness() saturate()` | Mood-based background modulation without extra assets |
| SVG animated overlays | Face expressions on sprites, streaks/particles on backgrounds |
| CSS `hud-floating-delta` + `@keyframes float-up-fade` | Floating stat delta animations ("+5 🔮 -1 ✨") above sprite on stat changes |
| CSS `hud-memories` | Memory indicator 🧠 N in top bar HUD (visible when logged in, memoryCount > 0) |
| CSS `.creation-screen__char-count` | Character counter below name input with color-coded feedback (red/green/dim) |
| CSS `.hud-history-btn` / `.hud-history-btn--active` | History button 📜 compact toggle on right side of bottom bar with active glow |

## Vision API (Sesión 4)

| Paquete / API | Versión | Propósito |
|---------------|---------|-----------|
| Gemini Vision API | `latest` | Evaluación emocional de fotos — desarrollo local |
| GPT-4o Vision API | `latest` | Evaluación emocional de fotos — producción |

> **Nota:** Dual Vision API — mismo patrón que el chat. Auto-switch: `GEMINI_API_KEY` (dev) → `OPENAI_API_KEY` (prod).
> Las fotos se envían a la Vision API para evaluación emocional pero **NUNCA se almacenan** — solo metadata y diary entries.

## Fullscreen API (Sesión 4)

| API | Propósito |
|-----|-----------|
| `Fullscreen API` (browser native) | Modo inmersivo fullscreen para máxima experiencia en mobile |

> **Nota:** API nativa del navegador, no requiere dependencia. `document.documentElement.requestFullscreen()`.

## Sesiones Futuras (no instalar todavía)

| Paquete | Versión | Sesión | Propósito |
|---------|---------|--------|-----------|
| `@anthropic-ai/sdk` | `latest` | S2+ | Claude API (opción futura de chat) |

---

## APIs Externas

| Servicio | Sesión | Propósito | Requiere API Key |
|----------|--------|-----------|------------------|
| Vercel | S1+ | Deploy y hosting | No (auth con GitHub) |
| Claude API / Gemini API | S2+ | Chat IA con personalidad | Sí |
| Privy | S3 | Autenticación (Google/Email/Passkey) | Sí (propia) |
| Supabase | S3 | Base de datos PostgreSQL | Sí (propia) |
| Gemini Vision | S4 | Evaluación emocional de fotos (dev) | Sí |
| GPT-4o Vision | S4 | Evaluación emocional de fotos (prod) | Sí |
| Fullscreen API | S4 | Modo inmersivo (browser native) | No |

---

## Variables de Entorno

### Desarrollo (`.env.local`)
```
GEMINI_API_KEY=tu_key_de_google_ai_studio
NEXT_PUBLIC_PRIVY_APP_ID=tu_privy_app_id
PRIVY_APP_SECRET=tu_privy_app_secret
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
# S4: Vision API usa la misma GEMINI_API_KEY para evaluación de fotos
```

### Producción (Vercel Environment Variables)
```
OPENAI_API_KEY=key_proporcionada_por_frutero
NEXT_PUBLIC_PRIVY_APP_ID=tu_privy_app_id
PRIVY_APP_SECRET=tu_privy_app_secret
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
# S4: Vision API usa la misma OPENAI_API_KEY para evaluación de fotos (GPT-4o Vision)
```

> **Regla:** Las API keys NUNCA se commitean al repo. Solo existen en `.env.local` o en las variables de Vercel.

---

## Almacenamiento

### Sesión 1-2: localStorage (se mantiene como fallback para modo demo)
```
Clave: "reggie-adventure-data"    → Datos del Regenmon
Clave: "reggie-adventure-config"   → Configuración de la app (música, tema, texto)
Clave: "reggie-adventure-chat"     → Historial de chat (max 50 mensajes)
Clave: "reggie-adventure-player"   → Nombre del jugador (descubierto por IA)
Clave: "reggie-adventure-fragments" → [NEW S3] Balance de Fragmentos 💠
Clave: "reggie-adventure-memories"  → [NEW S3] Memorias del Regenmon
Clave: "reggie-adventure-history"   → [NEW S3] Historial de actividades (max 10)
Clave: "reggie-adventure-progress"  → [NEW S4] Progreso lifetime (never decreases)
Clave: "reggie-adventure-diary"     → [NEW S4] Diary entries del Regenmon (memorias emocionales)
Clave: "reggie-adventure-missions"  → [NEW S4] Misión activa (max 1)
Clave: "reggie-adventure-strikes"   → [NEW S4] Strike counter + timestamps
```

### Sesión 3+: Supabase (usuarios autenticados)
Híbrido progresivo: localStorage como fallback, Supabase como fuente principal al loguearse.
Esquema detallado en [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md).

---

## Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| `v0.dev` | Generación de código con IA |
| `npm` | Gestión de paquetes |
| `git` | Control de versiones |
| `Vercel CLI` | Deploy desde terminal (opcional) |

## Accesibilidad y Calidad

| Herramienta | Propósito |
|-------------|-----------|
| `eslint-plugin-jsx-a11y` | Linter de accesibilidad (incluido en Next.js) |
| `axe-core` | Auditoría de accesibilidad (opcional en tests) |


## Estructura de Carpetas (Sesión 1 + 2 + 3)

```
reggie-adventure/
├── public/
│   ├── audio/              # Música 8-bit
│   ├── sprites/            # [NEW S3] Pixel art PNG sprites (Gemini-generated)
│   └── backgrounds/        # [NEW S3] Pixel art PNG backgrounds (Gemini-generated)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts      # API Route para chat con IA (S2, actualizado S3)
│   │   │   └── evaluate/
│   │   │       └── route.ts      # [NEW S4] API Route para evaluación emocional de fotos
│   │   ├── layout.tsx      # Layout principal, fuentes, metadata, PrivyProvider
│   │   ├── page.tsx        # Página única — maneja todos los estados
│   │   └── globals.css     # Estilos globales + NES.css imports + temas GBC/NES
│   ├── components/
│   │   ├── screens/        # Cada pantalla como componente
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── TitleScreen.tsx
│   │   │   ├── StoryScreen.tsx
│   │   │   ├── CreationScreen.tsx
│   │   │   ├── TransitionScreen.tsx
│   │   │   └── GameScreen.tsx     # [MOD S3] Nuevos botones, Fragmentos, Settings
│   │   ├── regenmon/       # Todo relacionado al Regenmon
│   │   │   ├── RegenmonSVG.tsx     # [MOD S3] Sprites reworked
│   │   │   ├── StatBar.tsx
│   │   │   └── ActionButtons.tsx   # [MOD S3] Purificar/⚙️/Conversar
│   │   ├── chat/           # Sistema de chat
│   │   │   ├── ChatBox.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── settings/       # [NEW S3] Panel de settings
│   │   │   └── SettingsPanel.tsx    # Música, Reset, Nombre, Auth, Texto, Tema
│   │   ├── auth/           # [NEW S3] Componentes de autenticación
│   │   │   └── LoginButton.tsx      # Botón/modal de login con Privy
│   │   ├── photo/          # [NEW S4] Sistema de fotos
│   │   │   ├── PhotoUpload.tsx      # Upload + preview + envío a Vision API
│   │   │   └── PhotoResult.tsx      # Resultado de evaluación emocional
│   │   ├── memorias/       # [NEW S4] Panel de memorias emocionales
│   │   │   └── MemoriasPanel.tsx    # Diario del Regenmon (frases por foto)
│   │   ├── missions/       # [NEW S4] Sistema de misiones
│   │   │   └── MissionCard.tsx      # Misión activa (1 max)
│   │   ├── evolution/      # [NEW S4] Visuales de evolución
│   │   │   └── EvolutionVisual.tsx  # Sprites por etapa + Fracturas
│   │   └── ui/             # Componentes reutilizables
│   │       ├── MusicToggle.tsx
│   │       ├── TutorialModal.tsx
│   │       ├── ResetButton.tsx
│   │       ├── NameEditor.tsx
│   │       └── FragmentCounter.tsx  # [NEW S3] Muestra balance de 💠
│   ├── hooks/
│   │   ├── useGameState.ts       # Estado del juego + localStorage/Supabase
│   │   ├── useStatDecay.ts       # Lógica de decaimiento + regen pasiva Pulso
│   │   ├── useScreenManager.ts   # Navegación entre pantallas
│   │   ├── useChat.ts            # Estado del chat + API calls + memoryCount exposure
│   │   ├── useAuth.ts            # [NEW S3] Wrapper de Privy hooks
│   │   ├── useFragments.ts       # [NEW S3] Economía de Fragmentos
│   │   ├── useTheme.ts           # [NEW S3] Dark/Light mode + tamaño texto
│   │   ├── useProgress.ts        # [NEW S4] Progreso lifetime + Fracturas
│   │   ├── usePhotoEval.ts       # [NEW S4] Upload + evaluación de fotos
│   │   ├── useMissions.ts        # [NEW S4] Misiones IA (1 activa max)
│   │   ├── useStrikes.ts         # [NEW S4] Sistema de strikes anti-abuse
│   │   └── useFullscreen.ts      # [NEW S4] Fullscreen API wrapper
│   ├── lib/
│   │   ├── constants.ts    # Valores fijos (decay rate, stat limits, etc.) (actualizado S4)
│   │   ├── types.ts        # TypeScript types (actualizado S4)
│   │   ├── storage.ts      # Funciones de localStorage (actualizado S4)
│   │   ├── supabase.ts     # [NEW S3] Cliente Supabase + funciones CRUD (actualizado S4)
│   │   ├── sync.ts         # [NEW S3] Sync localStorage ↔ Supabase
│   │   └── ai/             # Capa de abstracción IA
│   │       ├── provider.ts       # Auto-switch Gemini/OpenAI/Claude
│   │       ├── gemini.ts         # Adaptador Gemini (chat)
│   │       ├── openai.ts         # Adaptador OpenAI (chat)
│   │       ├── prompts.ts        # System prompts por tipo (actualizado S4)
│   │       ├── vision-provider.ts  # [NEW S4] Auto-switch Vision API (Gemini Vision / GPT-4o Vision)
│   │       ├── vision-interface.ts # [NEW S4] VisionProvider interface + VisionResult type
│   │       ├── gemini-vision.ts   # [NEW S4] Adaptador Gemini Vision (gemini-2.0-flash)
│   │       ├── openai-vision.ts   # [NEW S4] Adaptador GPT-4o Vision
│   │       └── vision-prompts.ts  # [NEW S4] Prompts emocionales para evaluación de fotos (9 bloques)
│   └── assets/
│       └── backgrounds/    # Paisajes pixel art (reconstruidos S3)
├── .env.local              # API keys (NO commitear)
├── PRD.md
├── APP_FLOW.md
├── TECH_STACK.md
├── FRONTEND_GUIDELINES.md
├── BACKEND_STRUCTURE.md
├── IMPLEMENTATION_PLAN.md
├── LORE.md
├── progress.txt
├── model.md
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## Reglas de Versionado

- **No instalar paquetes no listados** sin actualizar este archivo
- **No cambiar versiones** sin actualizar este archivo
- **Paquetes de sesiones futuras** se instalan SOLO al llegar a esa sesión
- Este archivo se actualiza cada vez que se agrega una dependencia

---

## Referencias Cruzadas

Este archivo define **con qué** se construye. Los otros documentos definen qué, cómo y por qué.

| Documento | Relación con TECH_STACK.md |
|-----------|---------------------------|
| [PRD.md](./PRD.md) | Los features requieren las herramientas listadas aquí |
| [LORE.md](./LORE.md) | Los system prompts de IA (Sesión 2+) se basan en LORE; la IA es herramienta central |
| [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) | Define schemas y lógica usando las herramientas de aquí (Supabase, Privy, IA providers) |
| [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) | Define estilos usando las herramientas de aquí (NES.css, Tailwind v4, Press Start 2P) |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Las fases de setup (Fase 1, 32) instalan dependencias listadas aquí |
| [APP_FLOW.md](./APP_FLOW.md) | Los flujos de auth (Privy) y persistencia (Supabase) dependen de estas herramientas |
| [model.md](./model.md) | Las decisiones de qué herramientas usar se documentan allá |
| [progress.txt](./progress.txt) | Trackea qué herramientas ya fueron instaladas y configuradas |

> **Regla:** Este archivo es la fuente de verdad para dependencias y versiones. Cualquier cambio se refleja aquí primero.
