# ⚙️ TECH_STACK — Reggie's Adventure
> **Versión actual:** v0.1 — El Despertar
> **Última actualización:** 2026-02-12

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

## Sesiones Futuras (no instalar todavía)

| Paquete | Versión | Sesión | Propósito |
|---------|---------|--------|-----------|
| `@anthropic-ai/sdk` | `latest` | S2 | Claude API para chat |
| `@google/generative-ai` | `latest` | S2 | Gemini API para chat |
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

## Almacenamiento

### Sesión 1: localStorage
```
Clave: "reggie-adventure-data"
Tipo: JSON string
Contenido: ver APP_FLOW.md → P4 → Datos que se guardan
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


## Estructura de Carpetas (Sesión 1)

```
reggie-adventure/
├── public/
│   └── audio/              # Música 8-bit
├── src/
│   ├── app/
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
│   │   └── ui/             # Componentes reutilizables
│   │       ├── MusicToggle.tsx
│   │       ├── TutorialModal.tsx
│   │       ├── ResetButton.tsx
│   │       └── NameEditor.tsx
│   ├── hooks/
│   │   ├── useGameState.ts       # Estado del juego + localStorage
│   │   ├── useStatDecay.ts       # Lógica de decaimiento temporal
│   │   └── useScreenManager.ts   # Navegación entre pantallas
│   ├── lib/
│   │   ├── constants.ts    # Valores fijos (decay rate, stat limits, etc.)
│   │   ├── types.ts        # TypeScript types
│   │   └── storage.ts      # Funciones de localStorage
│   └── assets/
│       └── backgrounds/    # Paisajes pixel art
├── PRD.md
├── APP_FLOW.md
├── TECH_STACK.md
├── FRONTEND_GUIDELINES.md
├── BACKEND_STRUCTURE.md
├── IMPLEMENTATION_PLAN.md
├── progress.txt
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
