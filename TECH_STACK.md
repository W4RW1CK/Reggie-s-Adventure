# ⚙️ TECH_STACK — Reggie's Adventure
> **Versión actual:** v0.2 — La Voz
> **Última actualización:** 2026-02-14

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

## Sesiones Futuras (no instalar todavía)

| Paquete | Versión | Sesión | Propósito |
|---------|---------|--------|-----------|
| `@anthropic-ai/sdk` | `latest` | S2+ | Claude API (opción futura de chat) |
| `@privy-io/react-auth` | `latest` | S3 | Autenticación de usuarios |
| `@supabase/supabase-js` | `latest` | S3 | Base de datos en la nube |

---

## APIs Externas

| Servicio | Sesión | Propósito | Requiere API Key |
|----------|--------|-----------|------------------|
| Vercel | S1+ | Deploy y hosting | No (auth con GitHub) |
| Claude API / Gemini API | S2 | Chat IA con personalidad | Sí |
| Privy | S3 | Autenticación | Sí |
| Supabase | S3 | Base de datos | Sí |
| Frutero API | S3 | Sistema de ⭐ Estrellas | Sí |
| Gemini Vision | S4 | IA multimodal (fotos) | Sí |

---

## Variables de Entorno

### Desarrollo (`.env.local`)
```
GEMINI_API_KEY=tu_key_de_google_ai_studio
```

### Producción (Vercel Environment Variables)
```
OPENAI_API_KEY=key_proporcionada_por_frutero
# (O la key que decidas usar: Gemini, Claude, etc.)
```

> **Regla:** Las API keys NUNCA se commitean al repo. Solo existen en `.env.local` o en las variables de Vercel.

---

## Almacenamiento

### Sesión 1-2: localStorage
```
Clave: "reggie-adventure-data"    → Datos del Regenmon
Clave: "reggie-adventure-config"   → Configuración de la app
Clave: "reggie-adventure-chat"     → Historial de chat (max 50 mensajes)
Clave: "reggie-adventure-player"   → Nombre del jugador (descubierto por IA)
```

### Sesión 3+: Supabase
Se definirá en BACKEND_STRUCTURE.md cuando lleguemos a esa sesión.

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


## Estructura de Carpetas (Sesión 1 + 2)

```
reggie-adventure/
├── public/
│   └── audio/              # Música 8-bit
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # [NEW S2] API Route para chat con IA
│   │   ├── layout.tsx      # Layout principal, fuentes, metadata
│   │   ├── page.tsx        # Página única — maneja todos los estados
│   │   └── globals.css     # Estilos globales + NES.css imports
│   ├── components/
│   │   ├── screens/        # Cada pantalla como componente
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── TitleScreen.tsx
│   │   │   ├── StoryScreen.tsx
│   │   │   ├── CreationScreen.tsx
│   │   │   ├── TransitionScreen.tsx
│   │   │   └── GameScreen.tsx
│   │   ├── regenmon/       # Todo relacionado al Regenmon
│   │   │   ├── RegenmonSVG.tsx
│   │   │   ├── StatBar.tsx
│   │   │   └── ActionButtons.tsx
│   │   ├── chat/           # [NEW S2] Sistema de chat
│   │   │   ├── ChatBox.tsx           # Caja de diálogo NES principal
│   │   │   ├── ChatBubble.tsx        # Burbujas individuales
│   │   │   ├── ChatInput.tsx         # Input + botón enviar
│   │   │   └── TypingIndicator.tsx   # Indicador "Escribiendo..."
│   │   └── ui/             # Componentes reutilizables
│   │       ├── MusicToggle.tsx
│   │       ├── TutorialModal.tsx
│   │       ├── ResetButton.tsx
│   │       └── NameEditor.tsx
│   ├── hooks/
│   │   ├── useGameState.ts       # Estado del juego + localStorage
│   │   ├── useStatDecay.ts       # Lógica de decaimiento temporal
│   │   ├── useScreenManager.ts   # Navegación entre pantallas
│   │   └── useChat.ts            # [NEW S2] Estado del chat + API calls
│   ├── lib/
│   │   ├── constants.ts    # Valores fijos (decay rate, stat limits, etc.)
│   │   ├── types.ts        # TypeScript types
│   │   ├── storage.ts      # Funciones de localStorage
│   │   └── ai/             # [NEW S2] Capa de abstracción IA
│   │       ├── provider.ts       # Auto-switch Gemini/OpenAI/Claude
│   │       ├── gemini.ts         # Adaptador Gemini
│   │       ├── openai.ts         # Adaptador OpenAI
│   │       └── prompts.ts        # System prompts por tipo
│   └── assets/
│       └── backgrounds/    # Paisajes pixel art
├── .env.local              # [NEW S2] API keys (NO commitear)
├── PRD.md
├── APP_FLOW.md
├── TECH_STACK.md
├── FRONTEND_GUIDELINES.md
├── BACKEND_STRUCTURE.md
├── IMPLEMENTATION_PLAN.md
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
