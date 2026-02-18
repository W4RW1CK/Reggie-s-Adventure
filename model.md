# 🧠 MODEL — Reggie's Adventure
> **Versión actual:** v0.3 — La Conexión
> **Última actualización:** 2026-02-17
> **Estado:** Sesión 2 — `COMPLETADA` | Sesión 3 — `EN PROGRESO`
>
> 📜 **Referencia narrativa:** [LORE.md](./LORE.md) — toda decisión de personalidad, tono o diálogo se valida contra LORE
> 📋 **Spec del producto:** [PRD.md](./PRD.md) — toda decisión de features se refleja ahí
> 📊 **Estado de completitud:** [progress.txt](./progress.txt) — las fases completadas basadas en estas decisiones

---

## Estado del Proyecto

| Sesión | Versión | Estado |
|--------|---------|--------|
| S1: El Despertar | v0.1.16 | `COMPLETADA` |
| S2: La Voz | v0.2 | `COMPLETADA` |
| S3: La Conexión | v0.3 | `EN PROGRESO` (Fases 32-38 ✅, 39 en curso) |
| S4: La Evolución | — | `PENDIENTE` |
| S5: El Encuentro | — | `PENDIENTE` |

---

## Sesión 2: La Voz — Decisiones de Diseño (121 preguntas, 4 rondas)

> Estas decisiones se implementaron en las Fases 17-31 de [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).
> La personalidad y lore se definen en [LORE.md](./LORE.md). Los componentes visuales en [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md).

### API y Arquitectura
- **Dual API**: Gemini 2.0 Flash (dev local) / OpenAI (prod Vercel, key Frutero)
- **API-agnostic**: Capa de abstracción en `lib/ai/` que auto-detecta env vars
- **Prioridad**: GEMINI_API_KEY → OPENAI_API_KEY → ANTHROPIC_API_KEY
- **Modelo OpenAI**: Fijado por Frutero, no controlamos cuál es
- **Presupuesto OpenAI**: $5 (Frutero). Recomendado gpt-4o-mini
- **Keys**: `.env.local` para Gemini, Vercel env vars para OpenAI
- **Yo nunca toco las API keys del usuario**

### Chat UI
- **Trigger**: Botón "💬 Conversar" (4to botón, fila propia, verde NES)
- **Estilo**: Caja de diálogo NES tipo Final Fantasy/Zelda
- **Fondo**: Semi-transparente, borde NES pixelado
- **Posición**: Inferior en todas las pantallas (RPG clásico)
- **Tamaño**: Se adapta automáticamente al viewport (no redimensionable por usuario)
- **Sin avatares/iconos**: Posición izq/der distingue Regenmon/usuario
- **Sin typewriter**: Mensajes aparecen de golpe
- **Sin sonido**: Conflicto con música de fondo
- **Bordes de burbuja**: Tinte sutil del color del tipo
- **Toggle**: "💬 Conversar" ↔️ "✕ Cerrar"
- **Al abrir**: Botones acción desaparecen, stats → compactos, música baja 60%
- **Al cerrar**: Fade leve, botones reaparecen con animación sutil, música 100%

### Personalidad
- **Primera persona** siempre
- **Tono**: Mezcla de criatura mística, mascota y amigo
- **Tipos**: Rayo=enérgico, Flama=apasionado, Hielo=sereno
- **Emojis**: Sí, según tipo y contexto
- **Máximo**: 50 palabras por respuesta
- **Puede hacer preguntas** al jugador
- **Idioma**: Español (adapta si usuario cambia)
- **PROHIBIDO**: Groserías, adultos, política, religión, sensible

### Stats y Mecánicas (S2 — `LEGACY`, reemplazado en S3)
> ⚠️ **LEGACY S2:** Los valores fijos de abajo ya NO aplican desde S3. Todos los stats son ahora AI-driven.
> Ver sección "Mecánicas de Stats por Chat (S3)" más abajo para los valores actuales.
> Significado lore de cada stat: [LORE.md → Stats y Lore](./LORE.md#stats-y-lore)
- ~~Espíritu: ±5 máximo (IA decide, fallback 0)~~
- ~~Pulso: -2 fijo~~
- ~~Hambre: +1 fijo~~ `→ S3: Hambre renombrado a Esencia, lógica invertida`
- **Reactividad** (se mantiene): Espíritu bajo=deprimido, Pulso bajo=cansado, Esencia baja=debilitado
- **Stats críticos (3 < 10)**: Chat desactivado con tooltip (ver [APP_FLOW.md → Flujo Conversar](./APP_FLOW.md))
- **Stats compactos durante chat**: 🔮 80 | 💛 50 | 🌱 30 (ver [FRONTEND_GUIDELINES.md → Stats Compactos](./FRONTEND_GUIDELINES.md))

### Nombre del Jugador
- **Objetivo oculto**: El Regenmon intenta averiguarlo naturalmente
- **Se guarda**: playerName en localStorage
- **Feedback**: "🧠 ¡Tu Regenmon aprendió tu nombre!"
- **Actualizable**: Si el usuario dice que cambió, la IA actualiza
- **Reset**: Borra playerName

### Memoria y Persistencia
- **Max 50 mensajes** en localStorage
- **Historial completo** enviado a la IA para contexto
- **Reset borra todo**: Chat + playerName + chatGreeted
- **Saludo**: Solo la primera vez que se abre el chat
- **Infraestructura de memorias**: Preparar, no implementar profundamente

### Rate Limiting
- **Frontend**: 3s cooldown invisible entre envíos
- **Backend**: 15 msgs/min máximo
- **Error**: "Tu Regenmon necesita un respiro..."

### Música
- Volumen baja a 60% al abrir chat (fade 1.5s)
- Regresa a 100% al cerrar (fade 1.5s)

### Responsive
- **Mobile**: Chat NES box inferior (~60%), Regenmon arriba (~40%)
- **Desktop**: Chat NES box inferior (RPG style)
- **Teclado mobile**: visualViewport API para no tapar el chat

### Lore — `COMPLETADO`
- **Documento:** [LORE.md](./LORE.md) (biblia narrativa — fuente de verdad para todo lo narrativo)
- **Universo:** La Red Primordial (mundo original) vs El mundo digital (corrupto)
- **Regenmon:** Fragmento de energía antigua, regenerador del mundo digital
- **3 tipos:** Rayo (Impulso/Claridad), Flama (Pasión/Conexiones), Hielo (Memoria/Sabiduría)
- **La Conexión:** Vínculo humano-Regenmon, acto de regeneración
- **Stats = lore:** Espíritu=Esperanza, Pulso=Energía vital, Esencia=Nutrición Digital
- **Paisajes:** Zonas del mundo digital con significado por tipo (ver [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md))
- **Filosofía:** El progreso no es malo, la pérdida del equilibrio sí (spam, scams, odio, olvido)
- **Tono:** Místico + épico + oscuro pero esperanzador
- **Frases de lore:** Indirectas, elusivas, esporádicas, filosóficas pero sutiles

### Deploy y Verificación
- **El usuario maneja el deploy personalmente**
- **Fase de auditoría rigurosa** previa: accesibilidad, seguridad, rendimiento, testing completo (ver [IMPLEMENTATION_PLAN.md → Fase 47](./IMPLEMENTATION_PLAN.md))
- **Logging**: Solo en modo desarrollo

---

## Sesión 3: La Conexión — Decisiones de Diseño (4 rondas, ~40 preguntas)

> Fuente: Interrogación completa del 2026-02-15.
> Referencia: Demo del bootcamp en `regenmon-final.vercel.app` + `Docs/04. Sesiones/Sesion 3/`.
> Principio rector: **Adaptación personal del bootcamp**. El lore siempre gana.
>
> 📜 **Narrativa S3:** [LORE.md → Los Fragmentos](./LORE.md#los-fragmentos-) + [La Purificación](./LORE.md#la-purificación-)
> 🛠️ **Implementación:** [BACKEND_STRUCTURE.md → Sesión 3](./BACKEND_STRUCTURE.md) (Privy, Supabase, Fragmentos API)
> 🗺️ **Flujos:** [APP_FLOW.md → Flujo Principal S3](./APP_FLOW.md) (login, purificar, settings)
> 🔨 **Fases:** [IMPLEMENTATION_PLAN.md → Sesión 3](./IMPLEMENTATION_PLAN.md) (Fases 32-48)

### Cambios Mayores vs S2

| Área | S2 (antes) | S3 (ahora) |
|------|------------|------------|
| Moneda | No existía | **Fragmentos 💠** (100 iniciales) |
| Stat "Hambre" | Hambre (100=hambriento, lógica invertida) | **Esencia 🌱** (100=bien alimentado, lógica normal) |
| Stats por chat | Espíritu ±5 (IA), Pulso -2 (fijo), Hambre +1 (fijo) | **Todos IA-driven** (ver sección abajo) |
| Botones | Alimentar, Entrenar, Descansar, Conversar | **Purificar (10💠) + ⚙️ + Conversar** |
| Alimentar | Gratis, -10 Hambre | **Purificar**: 10 Fragmentos, Esencia +30, Espíritu +5, Pulso +10 |
| Auth | No existía | **Privy** (Google + Email + Passkey) |
| Persistencia | Solo localStorage | **Híbrido**: localStorage (demo) → Supabase (con login) |
| Tema visual | Solo dark (NES) | **Dark (NES)** + **Light (Game Boy Color)** |
| Backgrounds | Estáticos por tipo | **Reconstruir** basados en nuevo lore |
| Sprites | SVGs originales | **Rework** para mejor integración con lore |
| Settings | Toggle música en header | **Panel ⚙️** completo |

### Moneda: Fragmentos 💠

- **Nombre**: Fragmentos (fragmentos de la energía antigua de La Red Primordial)
- **Icono**: 💠
- **Balance inicial**: 100 Fragmentos al crear cuenta
- **Ganar**: 0-5 por mensaje de chat (IA decide, no garantizado cada mensaje)
- **Curva de dificultad**: Al acercarse a 100, ganar es más difícil (detalles por definir)
- **No logueado**: Muestra "💠 --- Fragmentos"
- **Logueado**: Muestra "💠 100 Fragmentos"
- **Se acumulan sin login**: Los Fragmentos ganados en modo demo se migran al hacer login
- **Gastar**: Purificar cuesta 10 Fragmentos
- **Botón reclamar**: Solo aparece si tienes 0 Fragmentos (anti-frustración)

### Stats Redefinidos

| Stat | Nombre | Icono | Rango | 100 = | 0 = | Lore |
|------|--------|-------|-------|-------|-----|------|
| Espíritu | Esperanza | 🔮 | 0-100 | Máxima esperanza | Desesperanza | La fuerza que mueve al Regenmon |
| Pulso | Energía vital | 💛 | 0-100 | Lleno de energía | Exhausto | El latido de la Red Primordial |
| Esencia | Nutrición digital | 🌱 | 0-100 | Bien alimentado | Hambriento | Datos puros que lo nutren |

> **CAMBIO CRÍTICO**: Hambre → Esencia. Lógica INVERTIDA. Antes 100=hambriento (malo),
> ahora 100=bien alimentado (bueno). Las 3 barras funcionan igual: 100=bien, 0=mal.

### Mecánicas de Stats por Chat (S3)

**Por cada mensaje enviado, la IA decide TODO:**
```
Espíritu:     -5 a +5    (IA decide según tono emocional)
Pulso:        -5 a +5    (IA decide: tranquilo=+, intenso=-)
Esencia:      -4 a -1    (IA decide: siempre baja, mínimo -1)
Fragmentos:   0 a 5      (IA decide: no siempre gana)
```

**¿Por qué Esencia siempre baja?**
- Es el motor de la economía — crea necesidad de Purificar
- La IA decide CUÁNTO (-1 a -4) según complejidad de la conversación
- Respuestas largas/profundas = más Esencia consumida
- Nunca puede ser 0 = la presión económica siempre existe

**Regeneración pasiva de Pulso:**
- Si el jugador NO interactúa por un tiempo, el Pulso sube lentamente
- Como "descanso natural" del Regenmon
- Contrarresta el desgaste del chat

**Decaimiento temporal de stats (se mantiene pero se ajusta):**
- Los 3 stats siguen bajando con el tiempo si no hay interacción
- Velocidades por definir en implementación

### Acción: Purificar (reemplaza Alimentar)

- **Nombre lore**: "Purificar" — purificar el mundo digital desde su interior, regenerar su esencia pura, devolver esperanza
- **Costo**: 10 Fragmentos 💠
- **Efecto**: Esencia +30, Espíritu +5, Pulso +10
- **Feedback visual**: "+30 🌱" flotante + efecto visual (no "¡Ñam ñam!" — algo lore-appropriate)
- **Validaciones**: No funciona sin Fragmentos, botón se deshabilita, tooltip "Necesitas 10 💠"
- **No funciona si Esencia ya está al máximo**
- **Reacción del Regenmon**: Texto lore-appropriate contextual (no genérico)

### Botones del GameScreen (S3)

**Layout final:**
```
[🌀 Purificar (10 💠)]  [⚙️]  [💬 Conversar]
```

- **Purificar**: Acción principal con costo, efecto en Esencia+stats
- **⚙️ Settings**: Panel expandible con opciones
- **Conversar**: Chat existente (se mantiene)
- **ELIMINADOS**: Entrenar, Descansar, Alimentar (viejo)

### Panel de Settings (⚙️)

Opciones incluidas:
- 🎵 Música On/Off
- 🔄 Reiniciar Regenmon (con confirmación)
- 📝 Cambiar nombre del Regenmon
- 🚪 Iniciar / Cerrar Sesión
- 🔤 Tamaño de texto (agrandar/disminuir, sin romper UI)
- 🌙/☀️ Modo Dark (NES) / Light (Game Boy Color)

### API Response (S3 — actualizado)

```json
{
  "message": "Los datos fluyen con más claridad...",
  "spiritChange": 3,
  "pulseChange": -2,
  "essenceChange": -2,
  "fragmentsEarned": 3,
  "playerName": null
}
```

> El system prompt se actualiza para instruir a la IA sobre los nuevos campos.
> `essenceChange` = siempre negativo (-1 a -4).
> `fragmentsEarned` = 0-5, no siempre gana. Más difícil al acercarse a 100.

### Autenticación: Privy

- **Proveedor**: Privy (`@privy-io/react-auth`)
- **Métodos**: Google (primario) + Email (secundario) + Passkey (si disponible)
- **Credenciales**: Crear cuenta propia en privy.io (bootcamp keys son ejemplo, no funcionan)
- **Variables de entorno**: `NEXT_PUBLIC_PRIVY_APP_ID` + `PRIVY_APP_SECRET` en `.env.local` y Vercel

### Flujo de Login

```
Loading → Título → [Press Start] → Modal de Privy
                                      ├── Login → Historia → Creación → Juego (con Fragmentos 💠)
                                      └── "Continuar sin cuenta" → Historia → Creación → Juego (modo demo)
```

- **Lazy login**: Se puede jugar sin login (modo demo)
- **Modo demo**: Datos en localStorage, Fragmentos se muestran como "💠 --- Fragmentos"
- **Al loguearse**: Datos se migran de localStorage a Supabase
- **Sesión persistente**: Si ya estás logueado y recargas → Loading → Título → Juego (skip modal)
- **Login tardío**: Botón "Iniciar Sesión" disponible en panel ⚙️ del GameScreen

### Persistencia: Híbrido Progresivo (Opción C)

```
Sin login (demo):     localStorage → funcional pero temporal
Con login (Privy):    localStorage + Supabase → sincronizado, permanente
Migración al login:   localStorage → Supabase (automática, una sola vez)
Multi-dispositivo:    Supabase permite acceso desde cualquier dispositivo
```

- **Supabase**: Crear proyecto + obtener URL + anon key (incluir en plan como paso de setup)
- **Cada usuario**: Datos separados por Privy user ID
- **Mismos datos**: Regenmon, stats, chat, playerName, memorias, Fragmentos

### Temas Visuales

| Modo | Inspiración | Descripción |
|------|-------------|-------------|
| **Dark (NES)** | NES original | Fondo `#1a1a2e` oscuro, colores neón, pixel art nocturno (actual) |
| **Light (GBC)** | Game Boy Color | Fondos crema/pastel, colores más vivos, estilo retro luminoso |

- Los backgrounds se reconstruyen según el lore actualizado y soportan ambos modos
- Los sprites se rehacen para mejor integración con el lore
- Toggle en panel ⚙️
- Los paisajes se adaptan a cada modo

### Evolución (infraestructura S3, implementación S4)

- **Base**: Memorias acumuladas (NO puntos de entrenamiento)
- **Concepto**: Más memorias = más "conocimiento" = más evolución
- **Personalización**: El Regenmon evoluciona BASÁNDOSE en las memorias (gustos del usuario, temas frecuentes, etc.)
- **S3**: Solo preparar infraestructura (storage, tipos, hooks). NO barra de evolución visible.
- **S4**: Implementación completa con etapas visuales

### Sistema de Memorias (infraestructura S3, expansión S4)

- **Tipos de memorias**: Nombre, gustos, emociones, datos personales, temas frecuentes
- **Visible en UI**: Sí, se muestran en algún lugar (por definir ubicación)
- **Storage**: Guardar con Regenmon data
- **Contexto IA**: Las memorias se envían como parte del context para personalizar respuestas
- **S3**: Infraestructura base + detección básica
- **S4**: Expansión completa con evolución basada en memorias

### Identidad del Usuario (evolutiva — conectada a La Conexión)

- **Concepto:** La identidad en el header **evoluciona** conforme el Regenmon conoce al jugador
- **Estado 1 (logueado, nombre NO descubierto):** Muestra email/método auth truncado (ej: "mel@...")
- **Estado 2 (logueado, nombre descubierto):** Reemplaza por el nombre del jugador (ej: "Mel")
  → Transición con fade sutil — refuerza La Conexión: "tu Regenmon te conoce"
- **No logueado:** No se muestra nada en el header (limpio)
- **Settings:** Info completa del usuario (nombre, email, botón logout)
- **Decisión:** No saturar el header — la prioridad visual son los Fragmentos y el Regenmon
- **Conexión lore:** El descubrimiento del nombre (objetivo oculto de S2) ahora tiene impacto visual directo

### Emojis de Stats y Acciones (revisión S3)

- 🔮 Espíritu (morado) — se mantiene
- 💛 Pulso (amarillo) — se mantiene
- 🌱 Esencia (verde) — antes 🍎 (manzana evocaba comida/hambre, ya no aplica; el brote conecta con regeneración)
- 💠 Fragmentos (cyan) — se mantiene
- 🌀 Purificar (azul/ritual) — antes 🔮 (se confundía con Espíritu; el espiral evoca ritual de limpieza)

> **Paleta de colores por stat:** morado → amarillo → verde → cyan. Sin repetición.

### Buscar Fragmentos (anti-frustración)

- **Trigger:** Solo aparece cuando balance = 0 Fragmentos
- **Cantidad:** 15 💠 (suficiente para 1 purificación + margen)
- **Lore:** El Regenmon siente restos dormidos de La Red Primordial cercanos
- **UI:** Botón "🔍 Buscar Fragmentos" debajo de botones principales, desaparece tras uso
- **Límite:** No es repetible infinitamente — solo a 0
- **Bootcamp pide:** "Botón Conseguir monedas, solo si tienes 0"
- **Nuestra adaptación:** Nombre lore-appropriate, cantidad calibrada, reacción del Regenmon

### Historial de Actividades (bonus)

- **Concepto:** Registro de los actos de regeneración — sección colapsable "📜 Historial"
- **Contenido:** Últimas 10 acciones (Purificó, Conversó, Buscó Fragmentos)
- **Cada entrada:** Icono + cambio de 💠 + tiempo relativo
- **Por defecto:** Colapsado (solo título visible)
- **Se oculta durante chat** (como Purificar y ⚙️)
- **Persistencia:** localStorage + Supabase (JSONB, max 10, FIFO)
- **Bootcamp:** "Historial de últimas 10 acciones con qué, cuántas monedas, cuándo"
- **Nuestra adaptación:** Iconos lore-appropriate, tiempo relativo en vez de timestamps raw

### Sistema de sprites (8 estados × 3 tipos = 24 sprites)

- **Selección por promedio de stats:** (Espíritu + Pulso + Esencia) / 3
  - ≥90 Eufórico, ≥70 Contento, ≥30 Neutro, ≥10 Decaído, <10 Crítico General
- **Override por stat individual crítico (<10):** muestra sprite específico del stat más bajo
  - 🔮 Espíritu <10 → Sin Esperanza
  - 💛 Pulso <10 → Sin Energía
  - 🌱 Esencia <10 → Sin Nutrición
- **Prioridad:** Stat individual crítico SIEMPRE gana sobre promedio
- **Múltiples críticos:** el stat con valor más bajo gana
- **Empate exacto:** Espíritu > Pulso > Esencia (la esperanza es lo más fundamental del Regenmon)
- **Estética:** Mantener Kirby-esque actual pero con mejor integración al lore
- **Implementación:** `getSpriteState()` en BACKEND_STRUCTURE.md, visual en FRONTEND_GUIDELINES.md

### Orden de fases visuales (decisión de diseño)

- **Fase 40: Backgrounds + Sprites PRIMERO** — los nuevos assets definen la estética base (guía visual: [LORE.md → Los Paisajes](./LORE.md#los-paisajes-como-zonas-del-mundo-digital))
- **Fase 41: Tema Light (GBC) DESPUÉS** — se deriva de los nuevos assets, no al revés
- **Razón:** Evita trabajo doble. Si el tema Light se creara sobre assets viejos, habría que re-adaptarlo cuando se rehagan los sprites. Diseñar los backgrounds con ambos temas en mente desde el inicio es más eficiente.

### Fase 47b: Fixes de Auditoría Visual

- **Propósito:** Correcciones encontradas en revisión de 18 capturas (5 viewports)
- **8 bugs fixeados** (commit `30a0848`):
  1. Barra Esencia invisible → CSS var `hambre` → `esencia`, color verde #2ecc71
  2. Esencia inicia 100→50 → usar STAT_INITIAL
  3. Avatar Privy "N" tapaba UI → `showWalletUIs: false` + CSS hide
  4. Botón Settings sin texto → agregado "CONFIG"
  5. Landscape sin scroll → `overflow-y: auto`, `height: auto`
  6. Chat overlay semi-transparente → opacidad 0.95
  7. CreationScreen overlap descripción/form → margins
  8. Purificar bloqueado si Esencia=100 → permite si cualquier stat < 100

### Preparación para S4 y S5

- **S4 (Entrenamiento)**: Allanar terreno para sistema de subida de fotos + evaluación IA
- **S5 (Social)**: Allanar terreno para perfiles públicos y feed
- **Twist personal**: Todo gira alrededor de memorias, no de puntos genéricos

---

## Observaciones Técnicas

### Sesión 1 (referencia)
- Arquitectura: SPA con Next.js App Router, estado en localStorage
- Layout: Full viewport con UI centrada
- Paisajes emocionales: Cambian según stats
- Música: 3 temas Kirby-inspired por tipo (4 canales, 128 pasos)
- Accesibilidad: ARIA labels, focus indicators, reduced motion
- Interacciones: Atajos de teclado en carrusel de creación
- El proyecto usa Tailwind CSS v4 con @theme directives
- **UI Lore Polish (v0.1.17)**: Textos de intro, creación, transición y tutorial alineados 100% con LORE.md. Stats con subtítulos lore.


### Patrones establecidos
- Hooks para lógica: useGameState, useStatDecay, useScreenManager, useChiptuneAudio
- Componentes organizados: screens/, regenmon/, ui/
- Storage utilities en lib/storage.ts
- Constantes centralizadas en lib/constants.ts
- CSS global con variables y animaciones en globals.css

---

## Diario de Desarrollo (Sesión 2)
- **2026-02-15**: 🚀 Inicio de implementación Sesión 2 (Fases 17-30). Revisión de archivos completada.
- **2026-02-15**: ✅ Fases 17-25 completadas (Chat core, UI, API integration).
- **2026-02-15**: 🏗️ Comenzando planificación Fase 26 (Infraestructura de Memoria).
- **2026-02-15**: ✅ Fase 26, 27, 28, 29, 30 completadas (Memoria, Tutorial, Lore, Responsive, Auditoría).
- **2026-02-15**: 🚀 Fase 31 completada. Despliegue manual exitoso. Sesión 2 cerrada.

---

## Referencias Cruzadas

Este archivo es el **registro de decisiones**. Cada decisión aquí se materializa en los otros documentos canónicos.

| Documento | Qué toma de model.md |
|-----------|---------------------|
| [PRD.md](./PRD.md) | Las decisions aquí se convierten en features y criterios de éxito |
| [LORE.md](./LORE.md) | Las decisiones narrativas (tipos, stats-como-lore, tono) se definen y expanden allá |
| [APP_FLOW.md](./APP_FLOW.md) | Los flujos reflejan las decisiones de UX documentadas aquí |
| [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) | Paletas, layouts y componentes implementan las decisiones visuales de aquí |
| [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) | Schemas, API responses y system prompts implementan las decisiones técnicas |
| [TECH_STACK.md](./TECH_STACK.md) | Las herramientas elegidas (Privy, Supabase, IA) se documentan allá con versiones |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | Cada decisión se traduce en fases ejecutables con pasos verificables |
| [progress.txt](./progress.txt) | Las fases derivadas de estas decisiones se trackean como completadas o pendientes |

> **Regla:** Al tomar una decisión nueva, documentarla aquí Y actualizar los documentos afectados.
> Si hay conflicto entre este documento y [LORE.md](./LORE.md) en temas narrativos, **LORE.md gana**.

---

## Log de Implementación Sesión 3

### Análisis Inicial (2026-02-17)
- **Estado Actual:** Sesión 2 completada (v0.2). Fase 32 (Setup) parcialmente ejecutada por el usuario.
- **Migración Hambre→Esencia**: localStorage migration automática invierte el valor (hambre 80 → esencia 20).

### Implementación Core (2026-02-17)
- **Fases 32-38 completadas** en secuencia rápida (audit → setup → data → auth → sync → economy → chat)
- **Pre-S3 audit**: 12 issues found and fixed before starting S3 implementation
- **Team workflow**: Dumbleclaw (planner+auditor+subagents) + w4rw1ck (tester+reviewer) + Gemini (backup coder)
- **Commit format**: `[Phase XX] Title` + bullet list + `Build: ✅ | Audit: ✅ | Verify: ✅`
- **WIP commits**: Gemini drafts pushed as `WIP:` prefix, cleaned up by Dumbleclaw before final commit

### Fases 39-46 (2026-02-17/18)
- **Phase 39**: SettingsPanel as slide-in modal with NES styling. useTheme hook for dark/light toggle with localStorage persistence. MusicToggle migrated from header to Settings. Login/Logout button added to Settings.
- **Phase 40 — Visual COMPLETE rewrite**: Two major sub-phases:
  - **Sprites**: SVG body shapes completely replaced with Gemini-generated pixel art PNG sprites (rayo-base.png, flama-base.png, hielo-base.png in public/sprites/). SVG face overlays remain on top of PNG base for expressions. Type-specific particle effects added (electric sparks for Rayo, fire particles for Flama, ice crystals for Hielo). Face viewBox tuned per type for proper alignment. 8 sprite states with dark expressions for positive states and bright/white for negative states.
  - **Backgrounds**: SVG-drawn backgrounds replaced with 6 Gemini-generated pixel art PNGs (3 dark + 3 light variants in public/backgrounds/). CSS mood filters applied: good=brightness(1.1)+saturate(1.15), neutral=base, bad=brightness(0.75)+saturate(0.55). SVG animated streaks on good mood only (type-specific: electric bolts, heat shimmer, aurora borealis). Sparkle particles on good mood with type-specific colors. image-rendering: pixelated for crisp scaling. 1.5s CSS transitions between mood states.
- **Phase 41 — Light Theme (Game Boy Color)**: All hardcoded colors replaced with CSS custom properties `var(--theme-*)`. `.theme-light` class overrides for all components (ChatBubble, ChatInput, ChatBox, TypingIndicator, StatBar, LoadingScreen, TitleScreen, CreationScreen). Game Boy Color warm palette: #f5f0e1 (bg), #d4c5a9 (surface), #2a2a2a (text).
- **Phase 45**: Tutorial updated for S3 terminology (Esencia, Fragmentos, Purificar).
- **Phase 46**: Mobile responsive layout, desktop polish, CSS transitions, fragment counter pulse animation.

### Design Decisions (Phases 39-46)
- **Pixel Art PNG + SVG Overlay System**: Hybrid approach — Gemini generates the pixel art body as PNG, SVG overlays handle facial expressions. This allows rich pixel art bodies while keeping expressions dynamically changeable without regenerating images.
- **CSS Mood Filters**: Instead of separate background images per mood, CSS filters (brightness/saturate) transform the same base image. Reduces asset count from 18 (3 types × 3 moods × 2 themes) to 6 (3 types × 2 themes).
- **Background Streaks/Particles (Good Mood Only)**: SVG animated streaks and sparkle particles only appear when mood is good. Type-specific: electric bolts (Rayo), heat shimmer (Flama), aurora borealis (Hielo). Creates visual reward for keeping stats high without cluttering bad-mood states.
- **Light Theme via CSS Custom Properties**: Instead of duplicating component styles, all colors reference `var(--theme-*)` variables. `.theme-light` class on root overrides all variables at once. Clean separation of concerns — components don't know about themes.
- **Face ViewBox Per Type**: Each type needs different face positioning on its PNG sprite. Rayo: `0 0 150 150`, Flama: `-4 -30 150 150`, Hielo: `-7 3 150 150`. Tuned manually for each Gemini-generated sprite.

### Decisiones de Implementación (2026-02-17)
- **Privy login methods**: 5 total (Google + Email + Passkey + GitHub + Discord) — más que el mínimo del bootcamp
- **Supabase table**: Single `regenmons` table with all data as JSONB columns, indexed by `privy_user_id`
- **Phase 33 scope creep**: Gemini coded ~50% of the data migration, Dumbleclaw subagent fixed remaining 7 files + 3 bugs
- **Stats clamping**: Both server-side (route.ts) and client-side (provider adapters) for safety
- **Floating feedback**: Auto-dismiss after 3s, shows all non-zero changes with emoji indicators
- **FragmentCounter**: Shows "💠 ---" when not logged in (preserves mystery/incentive to login)
- **Purificar disabled states**: When fragmentos < 10 OR esencia >= 100 (no wasted purifications)

