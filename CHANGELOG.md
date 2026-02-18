# Changelog

## v0.3 — La Conexión (S3)

### Features
- **Auth & Sync** — Supabase authentication with cloud save/load between devices
- **HUD Layout** — Redesigned game screen: top bar (day + stats + fragments + config), center sprite, bottom action buttons
- **Settings Panel** — Fullscreen on mobile/tablet (<1280px), side panel on desktop; custom header replacing NES `with-title`
- **Responsive UI** — All screens use `clamp()` with viewport units for consistent scaling
- **Light Theme** — Story and Transition screens support light mode via CSS variables
- **Tutorial Modal** — Enlarged, scrollable, word-wrapped for all screen sizes
- **Pixel Art Sprites** — PNG sprites (Rayo/Flama/Hielo) with SVG face overlays and particle effects

### Bug Fixes
- Story dialog scrollable (`max-height: 60vh`, `overflow-y: auto`)
- Config modal z-index fixed (z-100)
- Esencia bar color corrected (`#34d399`)
- Landscape media queries for all screens
- Title text-shadow reduced on mobile (no more "separated" shadow)
- Tutorial modal duplicate `style` attribute merged
- Auth screen styled consistently with game theme
- Prevented base-layer scroll on mobile (`overflow: hidden` on html/body)
- Overlay screens remain scrollable via `overflow-y: auto !important`
- Sprite enforces square aspect ratio (`aspect-ratio: 1/1`)

### Technical
- Console.log statements commented out for production
- All env vars via `process.env` (no hardcoded secrets)
- Build: Next.js 16.1.6 + Turbopack, 0 errors
- 84 files changed, ~30k lines delta from S2

---

## v0.2 — La Evolución (S2)

- Pixel art sprite system (Gemini-generated PNGs)
- SVG face overlays with expression states
- Particle effects (sparkles, flames, crystals)
- Dark/Light theme toggle
- Background pixel art per Regenmon type
- Hybrid chat layout (compressed game + side chat on desktop)

---

## v0.1 — El Despertar (S1)

- Initial game: create Regenmon, choose type (Rayo/Flama/Hielo)
- Stats system (Espíritu, Pulso, Esencia, Fragmentos)
- AI chat with OpenAI (contextual personality per type)
- Purification ritual
- Day counter and time-based stat decay
- localStorage persistence
- NES.css retro styling
