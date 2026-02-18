# 🌟 Reggie's Adventure

Un juego de criatura digital estilo Tamagotchi con elementos RPG, construido con Next.js y NES.css.

## 🎮 Sobre el Juego

Reggie's Adventure es un juego donde cuidas a tu Regenmon — un fragmento del mundo digital antiguo. Conversa con él, purifícalo, y ayúdalo a regenerar su mundo.

### Tipos de Regenmon
- ⚡ **Rayo** — El Impulso (velocidad y energía)
- 🔥 **Flama** — La Chispa (pasión y fuego)
- ❄️ **Hielo** — El Cristal (calma y sabiduría)

### Mecánicas
- **Espíritu** 🔮 — Esperanza del Regenmon (se restaura al Purificar)
- **Pulso** 💛 — Energía vital (conversar la consume, purificar la restaura)
- **Esencia** ✨ — Vitalidad primordial
- **Fragmentos** 💎 — Moneda arcana (se ganan conversando, se gastan purificando)
- **Conversación** — Chat con IA contextual (personalidad única por tipo)
- **Purificación** — Ritual de restauración de stats
- **Búsqueda** — Exploración cuando no tienes fragmentos

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Styling:** NES.css + CSS custom (responsive `clamp()`)
- **Font:** Press Start 2P
- **Auth:** Supabase (sync entre dispositivos)
- **AI:** OpenAI GPT (chat contextual)
- **Sprites:** Pixel art PNG (Rayo, Flama, Hielo) con SVG face overlays

## 🚀 Setup

```bash
pnpm install
pnpm dev
```

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

## 📋 Versiones

- **v0.1** — El Despertar (creación, stats, chat básico)
- **v0.2** — La Evolución (pixel art sprites, light/dark theme, particles)
- **v0.3** — La Conexión (auth, sync, HUD layout, responsive UI)

## 👥 Equipo

- **w4rw1ck** — Creator & Lead Developer
- **Aibus Dumbleclaw** 🧙‍♀️ — AI Assistant (Clawarts / Frutero)

---

*Parte del ecosistema [Clawarts](https://github.com/dumbleclaw) — Colegio de Mag-IA y Tecnología*
