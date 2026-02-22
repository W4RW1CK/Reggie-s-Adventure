# 🧠 MODEL — Reggie's Adventure
> **Versión actual:** v0.5 — El Encuentro
> **Última actualización:** 2026-02-22
> **Estado:** Sesión 4 — `COMPLETADA` | Sesión 5 — `PLANNING`
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
| S3: La Conexión | v0.3 | `COMPLETADA` (96/96 — 100%) |
| S4: La Evolución | v0.4 | `COMPLETADA` |
| S5: El Encuentro | v0.5 | `PLANNING` |

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

### S3 Completion & Bonus Features (2026-02-18)
- **Full audit scores**: S1=35/35 (100%), S2=30/30 (100%), S3=31/31 (100%), Total=96/96 (100%)
- **Floating stat deltas**: `hud-floating-delta` + `float-up-fade` keyframe — fade-up animation showing "+5 🔮 -1 ✨" above sprite on stat changes (purify, search, chat). Files: `GameScreen.tsx`, `globals.css`
- **Memory indicator 🧠 N**: `hud-memories` class — shows in top bar HUD next to fragments. Only when logged in and memoryCount > 0. `useChat.ts` exposes `memoryCount`. Files: `GameScreen.tsx`, `useChat.ts`, `globals.css`
- **Character counter**: `.creation-screen__char-count` — `name.length/15` below name input in CreationScreen with color-coded feedback (red >15, green ≥2, dim). Files: `CreationScreen.tsx`, `globals.css`
- **History button 📜**: Moved to right side of bottom bar as compact toggle with `.hud-history-btn` + `.hud-history-btn--active` (glow state)
- **S3 audit fixes**: B2 fragments "💎 ---" when not logged in, D4 purify toast "¡Me siento renovado!", F1/F2/F3 toast system with loading/success/error states
- **Aesthetic vision in LORE.md**: Documented cypherpunk arcana, pixel art rules, sprites/scenarios per type, HUD layout, toast system, settings panel, audio, game actions table (commit bb931f9)

---

## Sesión 4: La Evolución — Decisiones de Diseño

> Fuente: Diseño documentado el 2026-02-19.
> Principio rector: **Las memorias del mundo real alimentan la evolución del Regenmon.**
> Privacidad absoluta: fotos NUNCA se almacenan.
>
> 📜 **Narrativa S4:** [LORE.md → Las Memorias](./LORE.md), [Las Fracturas](./LORE.md), [Las Misiones](./LORE.md)
> 🛠️ **Implementación:** [BACKEND_STRUCTURE.md → Sesión 4](./BACKEND_STRUCTURE.md)
> 🗺️ **Flujos:** [APP_FLOW.md → Flujos S4](./APP_FLOW.md)
> 🔨 **Fases:** [IMPLEMENTATION_PLAN.md → Sesión 4](./IMPLEMENTATION_PLAN.md) (Fases 49-64)

### Cambios Mayores vs S3

| Área | S3 (antes) | S4 (ahora) |
|------|------------|------------|
| Fotos | No existían | **Memorias del mundo real** — evaluación emocional por resonancia de tipo |
| Economía | Solo Fragmentos (gastable) | **Dual**: Fragmentos (gastable) + Progreso (lifetime, NUNCA baja) |
| Evolución | Infraestructura sin visual | **5 etapas invisibles** + **4 Fracturas** como milestones |
| Misiones | No existían | **IA-generated**, contextuales, opcionales, 1 activa max |
| Memorias | Infraestructura básica | **Diario emocional** — Regenmon escribe frases por foto |
| Anti-abuse | Rate limit en chat | **Strike system** para fotos + anti-spam chat |
| Vision API | No existía | **Dual**: Gemini Vision (dev) / GPT-4o Vision (prod) |
| UI | Estática | **Fullscreen API** + mobile-first overhaul |

### Fotos como Memorias (NO código/técnico)

- **Concepto:** El usuario sube fotos de su VIDA REAL — momentos, lugares, personas, cosas
- **NO:** fotos de código, screenshots de apps, memes, contenido técnico
- **Evaluación:** EMOCIONAL, no técnica. Sin "score 85/100" — resonancia (weak/medium/strong/penalizing)
- **Perspectiva:** Desde el Regenmon. "Siento la velocidad..." no "La foto tiene buena composición"
- **Privacidad:** La foto se envía a Vision API, se procesa, se genera respuesta, se DESCARTA. NUNCA almacenada

### Dual Economy: Fragmentos + Progreso

- **Fragmentos 💠:** Moneda gastable (ya existente). Se ganan por fotos y chat. Se gastan en Purificar
- **Progreso:** Valor lifetime. NUNCA decrece. Determina etapa de evolución
- **Por qué dual:** Los Fragmentos crean gameplay loop (ganar → gastar → ganar). El Progreso crea sensación de avance permanente
- **Progreso por actividad:**
  - Chat con sustancia: 1-3 (IA evalúa)
  - Photo weak: 2-4
  - Photo medium: 4-7
  - Photo strong: 7-12
  - Mission bonus: +5
  - Penalizing: 0

### Fracturas y Evolución Invisible

- **4 Fracturas:** Umbrales de progreso (50, 100, 200, 400)
- **5 Etapas:** Sin barra de progreso visible. El jugador SIENTE el cambio
- **Total para max:** ~750 progreso (~42 días activo, ~15 días hardcore)
- **Por qué invisible:** La evolución no es un grind — es una experiencia. Ver un número subir mata la magia
- **Freeze:** Si todos los stats < 10, progreso se congela (nunca baja). Sprite dormido
- **Fractura como momento:** Dramático, emocional, con narrativa por tipo

### Photo Cooldown y Mission Bypass

- **Standard:** 5 min entre fotos
- **Failed/black:** 2 min (menos frustración por error)
- **Mission bypass:** Si el Regenmon pidió foto en misión → cooldown se salta
  - Límite: 1 foto por bypass
  - Ventana: 30 min para entregar
- **Por qué 5min:** Evita spam, fuerza al jugador a ser intencional con sus fotos

### Strike System

- **Strike 1:** Warning + stat penalty. "Tu Regenmon no pudo procesar esa memoria..."
- **Strike 2:** 30min cooldown por 24hrs
- **Strike 3:** Fotos bloqueadas 48hrs
- **Reset:** 7 días limpios → strikes a 0
- **Triggers:** Foto inapropiada (detectada por Vision API)

### Photo Edge Cases

| Case | Decision |
|------|----------|
| Borrosa | Reduced eval, capped at medium |
| Inapropiada | Strike + 0 rewards |
| Spam/repetitiva | Decreasing resonance |
| Screenshot | Capped at medium |
| Selfie | Normal eval |
| Black photo | Rejected, 2min cooldown |
| Text manipulation | Anti-jailbreak ignores |

### Resonancia por Tipo

- **Rayo:** Flujo de info, velocidad, claridad, tech, movimiento, energía, luz
- **Flama:** Conexiones humanas, calidez, abrazos, amigos, comidas compartidas, emociones
- **Hielo:** Conocimiento, libros, naturaleza, paisajes, quietud, reflexión, preservación

### Dos Paneles, Dos Propósitos

- **📜 Historial:** Transaction log — purify -10💠, chat +3💠, photo +8💠. Números
- **🧠 Memorias:** Emotional diary — frases del Regenmon sobre cada foto. Sentimientos

### Vision API Approach

- **Dual:** Gemini Vision (dev) / GPT-4o Vision (prod). Mismo patrón que chat
- **Prompt:** Desde perspectiva emocional del Regenmon
- **Output:** { resonance, fragments, progress, diaryEntry, reason }
- **Diary entry:** Frase corta del Regenmon. "Vi algo verde hoy... me recordó a cuando..."

### Misiones IA

- **Contextuales:** Basadas en tipo, etapa, diario, conversación
- **Opcionales:** Abandonar sin penalty
- **1 activa max:** No acumular
- **Bonus:** +5 progreso al completar
- **Photo bypass:** Si pide foto, cooldown se salta

### Fullscreen API

- **Browser native:** `document.documentElement.requestFullscreen()`
- **Mobile-first:** Diseñado para máxima inmersión en portrait
- **Breakpoints:** TBD por usuario

### Purificación (posible cambio S4)

- **Actual (S3):** 1 botón, 10💠, +30 Esencia +5 Espíritu +10 Pulso
- **Posible S4:** Split en 2 botones — TBD por usuario
- **Documentar estado actual, implementar cambio si se decide**

### Implementation Phases (16 total, 49-64)

**Backend (49-54):** Vision API → Emotional Evaluation → Dual Economy → Fractures → Missions+Anti-abuse → Canonical Files Sync
**Frontend (55-62):** Fullscreen+Layout → HUD Redesign → Photo UI → Memorias Panel → Evolution Visual → Missions UI → Theme Adaptation → Transitions
**Close (63-64):** User adjustments pre-deploy → Testing+Audit+Deploy

---

## Log de Implementación Sesión 4

### Fase 49: Vision API — Infraestructura (2026-02-19)
- **vision-provider.ts**: Auto-switch Gemini Vision / GPT-4o Vision (same pattern as chat provider)
- **vision-interface.ts**: `VisionProvider` interface + `VisionResult` type
- **gemini-vision.ts**: Adaptador Gemini Vision (gemini-2.0-flash model)
- **openai-vision.ts**: Adaptador GPT-4o Vision
- **/api/evaluate route.ts**: POST handler with validation, rate limiting (5/min), range clamping, fallback values
- **Types added**: `VisionRequest`, `VisionResponse`, `ResonanceLevel` in types.ts

### Fase 50: Emotional Evaluation System (2026-02-19)
- **vision-prompts.ts**: `buildVisionPrompt()` with 9 prompt blocks (role, story, personality, nature, resonance, diary examples, stats context, anti-jailbreak, response format)
- **Type-specific resonance**: Rayo=speed/light/movement/tech, Flama=warmth/connection/emotions, Hielo=knowledge/nature/reflection
- **Anti-jailbreak block**: Text manipulation in photos ignored by prompt instruction
- **Coherence bonus**: +1-2 extra fragments for photos that resonate with existing memory themes

### Fase 51: Dual Economy (2026-02-19)
- **New types**: `PhotoEntry`, `StrikeData`, `Mission` interfaces added to types.ts
- **RegenmonData extended**: S4 fields — `progress`, `photoHistory` (max 20), `strikes`, `lastPhotoAt`, `activeMission`
- **S4 constants**: All cooldowns (`PHOTO_COOLDOWN_MS=300000`, `PHOTO_FAILED_COOLDOWN_MS=120000`), fragment ranges, progress ranges, `FRACTURE_THRESHOLDS=[50,100,200,400]`
- **Split purification**: `purifySpirit` (10💠→+10 Espíritu) + `purifyEssence` (10💠→+10 Esencia). Old single purify deprecated with `@deprecated` tag on `PURIFY_COST`
- **Progress from chat**: 1-3 per substantive message (IA evaluates substance)
- **Evolution stage calc**: 5 stages derived from fracture thresholds (50, 100, 200, 400)
- **Evolution freeze**: When all stats < 10, progress doesn't increase (never decreases)
- **Storage migration**: S3→S4 automatic migration adds new S4 fields with defaults
- **Supabase sync**: Updated to include new S4 columns (progress, strikes, diary_entries, active_mission, etc.)

### Design Decisions (Phases 49-51)
- **VisionRequest includes memories**: Allows coherence bonus calculation — photos that match existing memory themes get extra fragments
- **VisionResponse includes stat changes**: Photos affect all 3 stats (spirit, pulse, essence), not just fragments/progress
- **Split purify over single purify**: More strategic choice for player — target the stat that needs it most
- **File naming**: `gemini-vision.ts` / `openai-vision.ts` (provider-first naming, consistent with existing `gemini.ts` / `openai.ts` for chat)

### Fase 52: Fracture System + Evolution Stages Data Layer (2026-02-19)
- **evolution.ts**: Pure functions for stage calc (1-5), fracture detection, next fracture info — separated from hooks for testability
- **worldState.ts**: Maps evolution stage → WorldStateMetadata (health label, description, backgroundIntensity, particleFrequency, corruptionLevel) — 5 stages from 'corrupted' to 'regenerated'
- **useGameState refactor**: `getEvolutionStage()` now delegates to `evolution.ts` instead of inline logic; added `getWorldHealth()` returning `WorldStateMetadata`
- **newFractureJustClosed flag**: Boolean state set when `addProgress()` crosses a fracture threshold; `clearNewFracture()` resets it (frontend calls after animation)
- **Evolution freeze verified**: `addProgress()` checks all stats < CHAT_CRITICAL_THRESHOLD (10) and early-returns without adding progress; progress NEVER decreases

### Fase 53: Missions + Anti-Abuse System (2026-02-19)
- **photoCooldown.ts**: Centralized cooldown logic — checks standard 5min cooldown, failed 2min cooldown, strike blocks, and mission bypass in one function. Returns `CooldownStatus` with reason and remaining time.
- **useStrikes.ts**: Strike hook with localStorage persistence. Strike 1=warning, Strike 2=30min cooldown for 24hrs, Strike 3=blocked 48hrs. Auto-reset after 7 days clean. Periodic cleanup of expired cooldowns/blocks.
- **useMissions.ts**: Mission hook with type-specific templates (5 per type). 1 active max, +5 progress bonus, 24hr expiration. Mission bypass: 1 photo within 30min window during cooldown. Abandon without penalty.
- **Integration**: All three modules use existing types (StrikeData, Mission) from types.ts and constants from constants.ts. No changes to useGameState needed — these are composable hooks that frontend phases (55-62) will wire in.

### Fase 54: Canonical Files Sync (2026-02-19)
- **System prompt update** (`prompts.ts`): Added 3 new S4 blocks — Evolution & World State (block 13), Photos & Real-World Memories (block 14), Missions (block 15). Each block is type-specific. Evolution block references world health from `worldState.ts` and freeze state. Photo block describes type-specific resonance. Mission block includes active mission context.
- **New `SystemPromptContext` interface**: Extended `buildSystemPrompt()` with optional `context` param carrying `progress`, `diaryEntries`, `activeMissionPrompt` — backward compatible, old callers unaffected.
- **Types consolidation** (`types.ts`): Added 8 new exported types: `EvolutionStage`, `EvaluationResult`, `FragmentTransaction`, `DiaryEntry`, `WorldHealth`, `CooldownStatus`, `MissionData`, `WorldState`. These consolidate scattered definitions from phases 49-53 into a single canonical source.
- **Type deduplication**: `CooldownStatus` moved from `photoCooldown.ts` to `types.ts` (re-exported for backward compat). `WorldHealth`/`WorldStateMetadata` moved from `worldState.ts` to `types.ts` (`WorldState` type, re-exported as `WorldStateMetadata` alias).
- **Storage migration verified**: S3→S4 migration in `storage.ts` already handles all S4 fields (progress, photoHistory, strikes, lastPhotoAt, activeMission) with proper defaults. No changes needed — Phase 51 did this correctly.
- **Constants audit**: Added `STAT_CHANGE_DISPLAY_MS`, `MUSIC_CHAT_VOLUME`, `MUSIC_FADE_MS`, `PULSE_REGEN_RATE_PER_HOUR` to `constants.ts`. No magic numbers found in hooks/lib (audio frequencies in `useChiptuneAudio.ts` are appropriate as inline values). Legacy constants `CHAT_PULSE_CHANGE` and `CHAT_ESENCIA_COST` kept for backward compat but unused.
- **Build**: ✅ passes clean

---

## S4 UI/UX Design Decisions (2026-02-19)

> Fuente: Sesión de diseño UI/UX completa del 2026-02-19.
> Wireframes: `public/wireframes-s4.html` (main) + `reggie-wireframes.pages.dev`
> Extras: `reggie-wireframes.pages.dev/extras.html` (photo flow, light theme, tutorial)

### Navigation — 3-State Triangle

- **3 estados:** World (default) ↔ Chat ↔ Photo — navegación triangular, todos conectados
- **World → Chat:** bubble button 💬 en bottom bar
- **World → Photo:** bubble button 📷 en bottom bar
- **Chat → World:** ✕ button en chat header
- **Chat → Photo:** 📎 button en input bar
- **Photo → Chat:** "Conversar" button post-evaluación
- **Photo → World:** "Volver" button post-evaluación
- **Vertical only** — NO horizontal layout

### Breakpoints (CUSTOM, not generic)

| Nombre | Rango | Comportamiento |
|--------|-------|----------------|
| Mobile | <640px | Alternating states (world/chat/photo take full screen) |
| Tablet | 641-1024px | Vertical: same as mobile, more spacious. Horizontal: side-by-side like desktop |
| Desktop | 1025px+ | 70% world / 30% chat (NOT 50/50). Default full world, opens 70/30 on interaction |

### HUD (always visible in all 3 states)

- 🔮 Fragments count
- 🎯 Mission indicator (glows/pulses when active)
- ⚙️ Settings access

### Stats/Profile

- **Trigger:** Tap sprite (world) or info button (any state) → opens profile overlay
- **Shows:** Pulso ❤️, Esencia 💧, Espíritu ✨, Fragmentos 🔮, Fracturas (dots), Active Mission

### Panel (Memorias/Historial)

- One button (📖 Diario), two tabs inside
- Tab "Memorias" = photos + emotional reactions (diaryEntries)
- Tab "Historial" = activity log (fragments, purifications, milestones)
- Mobile + Tablet: fullscreen overlay
- Desktop: floating window with dimmed backdrop

### Photos — Full Flow

1. **Pre-camera screen** (NOT modal, full screen): explains what Reggie wants
2. **TWO options:** "📸 Tomar foto" (camera) + "🖼️ Galería" (file picker)
3. **First time:** extra text about camera permissions + privacy (photos NOT stored)
4. **Active mission** shown on pre-camera screen
5. **Cooldown:** shows timer when active
6. **From chat:** 📎 button opens mini picker (camera/gallery options)
7. **Post-photo:** Regenmon reacts + deltas shown + two buttons: "💬 Conversar" / "🏠 Volver"
8. **Post-photo variants:**
   - Strong resonance: happy bounce animation
   - Weak: neutral reaction
   - Penalizing: dimmed sprite, red text, strike warning

### Missions — Triple Reinforcement

- **HUD:** 🎯 glows/pulses when mission active
- **Chat:** Regenmon mentions mission naturally in conversation
- **Profile:** Full mission description visible

### Purification — Tap Sprite Interaction

- **Trigger:** Tap sprite in World → floating buttons appear
- **Buttons:** "❤️ Recargar 10🔮" / "💧 Nutrir 10🔮"
- **After action:** Buttons disappear
- **Animation:** Subtle bounce + color flash on purify

### Critical State / Freeze

- **Visual:** Sprite dimmed, particles off, darker background
- **Chat:** Regenmon speaks from emotional state (lore-reactive)
- **HUD:** Stats flash/pulse when critical

### Fullscreen

- **Merged with loading screen:** after assets load → fullscreen invitation (not separate screen)
- **Two options:** "Pantalla completa" / "Continuar así"
- **Always available** in ⚙️ Settings toggle

### Settings

- ⚙️ in HUD, accessible from all 3 states (one tap)
- **Mobile + Tablet:** fullscreen overlay
- **Desktop:** floating window
- **Options:** Fullscreen toggle, Dark/Light theme, Music, Effects, Tutorial restart, Version

### Themes

- **Dark AND Light** theme both supported in S4
- **Light palette:** warm background (#fffbf5), dark text (#383838), warm gradients
- **Frutero color palette integration** for Light theme

### Tutorial / Onboarding

- **New players:** 5 steps (1-Regenmon, 2-Chat, 3-Care/Purify, 4-Photos NEW, 5-Evolution NEW)
- **S3 returning players:** 2 steps only (Photos + Evolution), badge "✨ Nuevo"
- **Steps 4-5** marked as NEW
- **"Saltar tutorial"** always visible
- **Can restart** from Settings

### Asset Preloading

- Loading screen is a **REAL preloader** (not cosmetic spinner)
- **Preloads:** sprites, backgrounds for all 5 evolution stages, UI icons
- **Method:** `new Image().src` during loading + `<link rel="preload">` for critical assets
- **Flow:** Loading screen → fullscreen invitation → game (no extra screens)

### Wireframes

- **Main:** `public/wireframes-s4.html`
- **Deployed:** `reggie-wireframes.pages.dev`
- **Extras** (photo flow, light theme, tutorial): `reggie-wireframes.pages.dev/extras.html`

---

### Fase 57: Photo UI — Full Flow (2026-02-19)
- **PreCamera.tsx**: Full-screen pre-camera with title, privacy notice (first-time via localStorage), active mission card, cooldown timer with live countdown, two capture buttons (camera with `capture="environment"` + gallery without capture), "← Volver" back link
- **PostPhoto.tsx**: Shows sprite with emotion-based animation (happy bounce/neutral/grayscale), resonance label (strong ✨/medium/weak/⚠️ penalizing), diary entry quote, stat deltas, conditional action buttons (no chat on penalizing)
- **PhotoFlow.tsx**: Orchestrator component managing pre-camera → loading → result flow. Calls `/api/evaluate`, applies fragments + stat deltas + progress (randomized per resonance range), handles mission completion + strike on penalizing, manages `lastPhotoAt` timestamp
- **ChatPhotoPicker.tsx**: Mini overlay at bottom of chat with 📸 Cámara / 🖼️ Galería options + dismiss overlay
- **CSS**: ~250 lines in globals.css — all components styled with NES aesthetic, light theme overrides, responsive, animations (sprite-bounce, spin, result-reveal)
- **Privacy**: Photos converted to base64, sent to API, then discarded. Never stored in state or localStorage
- **Build**: ✅ Clean (TypeScript + Next.js build)

### Fase 62: Tutorial + Transitions + Polish (2026-02-20)
- **Smart tooltip positioning**: Tutorial tooltips with CSS arrows pointing to their target elements. Position computed dynamically based on element bounding rect.
- **Transition animations**: All state changes (World ↔ Chat ↔ Photo) have smooth CSS transitions. Fracture effect: flash + shake + particle burst.
- **Tutorial differentiation**: New players get 5 steps, S3 returning players get 2 steps (Photos + Evolution only) with "✨ Nuevo" badge.
- **"Saltar tutorial" always visible**: User can skip at any point. Restartable from Settings.

### Fase 63: User Adjustments (2026-02-20/21)
- **Tutorial tooltip arrows**: Smart positioning with CSS arrows pointing to target elements
- **Light theme overhaul**: Migrated to warm parchment palette (#fffbf5 background, #383838 text) matching Frutero brand
- **WebP asset conversion**: All PNG sprites and backgrounds converted to WebP — 94% file size reduction
- **CSS GPU acceleration**: `will-change` and `transform: translateZ(0)` on animated elements for smoother rendering
- **Fracture visual fixes**: Corrected fracture dot rendering and sealing animation timing
- **Stats separation**: Stats always visible below sprite (not hidden behind tap interaction). Removed stat overlay in favor of persistent display
- **Chat limit reduced**: 280 → 140 characters per message (more concise, mobile-friendly)
- **Split purification**: Single Purificar button replaced with two options: "❤️ Recargar 10🔮" (Pulso +10) and "💧 Nutrir 10🔮" (Esencia +10). More strategic player choice
- **Diario panel**: Unified panel with Memorias (emotional diary) + Historial (transaction log) tabs
- **Bottom nav icons**: Minimal icon-only buttons (💬 📷) with small labels

### Fase 64: Testing + Audit + Deploy (2026-02-22)
- **Final audit**: All S4 features verified working
- **Version**: v0.5 — El Encuentro
- **All canonical files updated**

### S4 Completion Summary (2026-02-22)

**Key S4 features delivered:**
- Vision API (Gemini dev / GPT-4o prod) for emotional photo evaluation
- Emotional resonance system (type-specific: Rayo=movement/tech, Flama=connections/emotions, Hielo=nature/knowledge)
- Dual economy: Fragments (spendable) + Progress (lifetime, never decreases)
- 4 Fractures as evolution milestones (thresholds: 50, 100, 200, 400 progress)
- 5 invisible evolution stages (no visible level names)
- Mission system (AI-generated, context-aware, 1 active max)
- Strike system (1=warning, 2=30min cooldown 24hrs, 3=blocked 48hrs)
- Photo cooldown (5min standard, 2min failed)
- Photos NEVER stored (privacy)
- Fullscreen API for immersion
- Mobile-first UI overhaul: compact HUD, icon bottom nav, 3-state navigation (World ↔ Chat ↔ Photo)
- Desktop 70/30 split layout
- Custom breakpoints: Mobile <640px, Tablet 641-1024px, Desktop 1025px+
- Light theme with warm parchment palette (#fffbf5)
- WebP assets (94% size reduction)
- CSS GPU acceleration + performance optimizations
- Tutorial with smart tooltip positioning
- Transition animations on all state changes
- Chat limit 140 chars
- Split purification: Recargar (💛 pulso) + Nutrir (🌱 esencia)
- Always-visible stats below sprite
- Diario panel (Memorias + Historial tabs)

**S5 "El Encuentro" is NEXT:** Social features — public profiles, feed, interactions between Regenmons.

### 📌 Rules & Lessons Learned
- **Docs/ folder is UNTOUCHABLE** — never modify files in the Docs/ directory
- **9 canonical files** at root: PRD.md, TECH_STACK.md, IMPLEMENTATION_PLAN.md, FRONTEND_GUIDELINES.md, BACKEND_STRUCTURE.md, APP_FLOW.md, LORE.md, progress.txt, model.md
- **Lesson**: Always update canonical files BEFORE (or immediately after) pushing code changes. Code and docs must stay in sync.
- **Audit methodology**: S1 (35 items), S2 (30 items), S3 (31 items) = 96 total verification points


---

## S4 Backend Audit Log (2026-02-19)

**Full audit of phases 49-54 backend code.**

### Files Audited
- `src/lib/ai/vision-provider.ts`, `gemini-vision.ts`, `openai-vision.ts`, `vision-interface.ts`, `vision-prompts.ts`, `prompts.ts`
- `src/app/api/evaluate/route.ts`
- `src/lib/types.ts`, `constants.ts`, `evolution.ts`, `worldState.ts`, `photoCooldown.ts`
- `src/hooks/useGameState.ts`, `useMissions.ts`, `useStrikes.ts`

### Decisions Validated
- **Dual economy** (fragments + progress) correctly separated — fragments are spendable currency, progress only goes up
- **Fracture thresholds** [50, 100, 200, 400] map to 5 evolution stages correctly
- **Strike system** (1=warning, 2=30min cooldown, 3=48hr block, 7-day auto-reset) implemented correctly
- **Photo cooldown** respects strike state hierarchy: blocked > strike_cooldown > standard cooldown > mission bypass
- **S3→S4 migration** in storage.ts handles all new fields with sensible defaults
- **API /evaluate** validates all inputs, clamps AI responses, has rate limiting and fallback
- **Vision prompts** include anti-jailbreak protections and type-specific resonance

### Fixes Applied
- Centralized `STRIKES` and `MISSION` storage keys into `STORAGE_KEYS` constant
- Added `[number, number]` type to `CHAT_FRAGMENT_REWARD_RANGE`

### Fase 55: Loading + Fullscreen + Layout Foundation (2026-02-19)
- **useAssetPreloader**: Real preloader using `new Image().src` for sprites (3) + backgrounds (6) = 9 assets. Progress tracked 0-100%.
- **LoadingScreen rewrite**: Old 3s timer replaced with actual asset preloading. Progress bar driven by real load state. Fullscreen invitation merged into loading screen (not a separate screen).
- **useFullscreen**: Browser Fullscreen API wrapper (`document.documentElement.requestFullscreen()`). Supports toggle, isSupported detection, event-driven state.
- **Fullscreen invitation**: "Todo listo. Para la mejor experiencia:" → [🖥️ Pantalla completa] [Continuar así]. Auto-proceeds if API not supported.
- **useViewState**: 3-state manager ('world' | 'chat' | 'photo') with navigation callbacks.
- **GameLayout**: 3-panel layout system with CSS-driven responsive behavior.
- **HUD component**: Fixed top bar with 🔮 fragments (left), 🎯 mission indicator with pulse animation (right), ⚙️ settings button. Always visible, z-index 50.
- **BottomBar**: 3 bubbles (💬 Chat, 📷 Foto, 📖 Diario). Mobile/tablet vertical only — hidden on desktop and tablet landscape via CSS.
- **Custom breakpoints**: Mobile <640px (full-screen states), Tablet vertical 641-1024px portrait (same as mobile, spacious), Tablet horizontal 641-1024px landscape (side-by-side 70/30), Desktop 1025px+ (70/30 split). Uses `@media` with exact values, NOT Tailwind defaults.
- **Tablet orientation**: `@media (orientation: landscape)` combined with width range for hybrid behavior.
- **Light theme**: All new components have `.theme-light` variants.
- **No S3 breakage**: Existing GameScreen.tsx untouched. New components are additive.
- **Files created**: `useAssetPreloader.ts`, `useFullscreen.ts`, `useViewState.ts`, `HUD.tsx`, `BottomBar.tsx`, `GameLayout.tsx`
- **Files modified**: `LoadingScreen.tsx` (rewritten), `globals.css` (new S4 layout CSS)

### Fase 56: HUD Redesign + Settings Panel + Theme System (2026-02-19)
- **HUD.tsx rewrite**: Enhanced with animated fragment deltas (floating +N/-N that fades via CSS keyframe `hud-delta-float`), mission indicator with pulse animation (`s4-hud__mission--active`), critical state flash (`s4-hud__fragments--critical` with `hud-critical-pulse` animation). Wired to real game state props.
- **SettingsPanel.tsx rewrite**: Complete S4 redesign. Mobile+Tablet: fullscreen overlay covering entire viewport. Desktop (≥1025px): floating window with dimmed backdrop, close via backdrop click. Options: Fullscreen toggle (wired to useFullscreen), Theme (dark/light via useTheme), Music (on/off), Effects (on/off), Tutorial restart, Version display (v0.4.0-S4). Smooth open/close transitions with CSS animations.
- **GameScreen.tsx updated**: Wired useFullscreen hook, added effectsEnabled state, adapted SettingsPanel props to S4 interface.
- **globals.css**: Added ~200 lines of S4 settings panel CSS + HUD enhancement CSS. Responsive behavior: fullscreen overlay on mobile/tablet, floating window on desktop. Light theme variants for all new components.
- **Theme system**: Existing S3 useTheme hook + CSS custom properties system fully adequate for S4. Dark theme (existing NES colors) and Light theme (warm #fffbf5 background, #383838 text per Frutero palette) both supported via `.theme-dark` / `.theme-light` classes on html element with localStorage persistence.

### Fase 58: Diario Panel — Memorias + Historial (2026-02-19)
- **DiarioPanel.tsx**: Single panel with two tabs ("Memorias" | "Historial"). Mobile+Tablet: fullscreen overlay. Desktop (≥1025px): floating window (480px wide) with dimmed backdrop. Close via ✕ button, Escape key, or backdrop click (desktop). Tab active state: #ff9500 underline (Frutero primary). Smooth open/close animations reusing existing CSS keyframes.
- **Memorias tab**: Displays DiaryEntry objects from photo evaluations. Each entry shows emoji icon (by resonance level) + Regenmon's reaction text (italic) + metadata (resonance badge, source icon, time ago). Chronological order (newest first). Empty state: "Aún no has compartido memorias. ¡Toma tu primera foto! 📷"
- **Historial tab**: Displays FragmentTransaction objects as activity log. Entry types: 🖼️ Photo, 💬 Chat, 🔮 Purification (spirit/essence), 🔍 Search fragments, 🎯 Mission. Each entry: icon + description + fragment delta (color-coded +/-) + progress delta + time ago. Empty state: "Tu aventura acaba de comenzar..."
- **useActivityLog hook**: Manages FragmentTransaction entries in localStorage (max 50, FIFO). Storage key: `STORAGE_KEYS.ACTIVITY_LOG`.
- **useDiaryEntries hook**: Manages DiaryEntry objects in localStorage (max 50). Storage key: `STORAGE_KEYS.DIARY_ENTRIES`.
- **constants.ts**: Added `ACTIVITY_LOG` and `DIARY_ENTRIES` to `STORAGE_KEYS`.
- **CSS**: ~200 lines in globals.css. Responsive: fullscreen on mobile/tablet, floating on desktop. Light theme overrides for all elements. NES pixel aesthetic maintained.
- **Build**: ✅ Clean

### Fase 59: Fractures Visual System + World Evolution + Sprite Adaptation (2026-02-19)
- **FractureOverlay.tsx** (`src/components/world/`): 4 SVG crack-like fracture lines positioned around the sprite area. Active fractures: glowing #9ed22d with pulsing animation. Closed fractures: dimmed/faded. Sealing animation: bright flash → seal → fade (2.5s). Particle burst effect (8 particles) on fracture close. Triggered by `newFractureJustClosed` prop, calls `clearNewFracture()` after animation.
- **WorldBackground.tsx** (`src/components/world/`): Evolution-aware replacement for GameBackground on the game screen. 5 stages mapped to CSS filters: Stage 1 = dark/desaturated (corrupted), Stage 5 = bright/saturated (regenerated). Corruption overlay fades as world heals. Ambient particles appear at higher stages (particleFrequency from worldState.ts). Smooth 2s CSS transitions between stages. Both dark and light theme support.
- **FractureDots.tsx** (`src/components/world/`): Profile/stats component showing 4 dots for fractures. Closed = filled #9ed22d with glow. Open = outline only. Subtle progress bar toward next fracture threshold.
- **Sprite visual adaptation**: CSS classes `.sprite-evolution--stage-1` through `--stage-5` modulate brightness/saturation. Stage 1 = dim/muted (0.6 brightness, 0.4 saturate). Stage 5 = bright with radial glow halo. Orbital particles appear at stages 3+. Frozen state: `.sprite-evolution--frozen` with grayscale(0.8) + dormant pulse animation.
- **GameScreen.tsx updated**: Wired WorldBackground (replaces GameBackground for evolution-aware rendering), FractureOverlay, sprite evolution classes. New props: `progress`, `newFractureJustClosed`, `onClearNewFracture`, `isEvolutionFrozen`.
- **page.tsx updated**: Passes `progress`, `newFractureJustClosed`, `clearNewFracture`, `isEvolutionFrozen()` to GameScreen.
- **globals.css**: ~250 lines of Phase 59 CSS — fracture animations (pulse, seal, particle burst), world background transitions, fracture dots, sprite evolution stages (5 filter presets + halo + dormant), orbital particles. Light theme overrides. Reduced motion support.
- **Build**: ✅ Clean

### Fase 60: Missions UI — Detail Popup, Completion Celebration (2026-02-19)
- **MissionPopup.tsx**: Lightweight card overlay (not fullscreen). Tapping 🎯 in HUD opens it. Active mission: shows type-specific label (⚡/🔥/❄️), description, time remaining, +5 bonus reminder, "Abandonar" with confirmation. No mission: "Buscar misión" button triggers `useMissions.generateMission()` with reveal animation. Dismiss via ✕ or click outside.
- **HUD.tsx**: 🎯 changed from `<span>` to `<button>` with `onMissionClick` callback. Pulse animation when mission active.
- **GameScreen.tsx**: Wired `useMissions` hook. Added `hud-mission-btn` to old-style HUD top bar alongside ⚙️. Mission popup and celebration overlay integrated.
- **PostPhoto.tsx + PhotoFlow.tsx**: Mission completion now shows "+N progreso bonus 🎯" delta with golden glow animation. `missionCompleted` and `missionBonus` props passed from PhotoFlow to PostPhoto.
- **Mission Completion Celebration**: 12 sparkle particles (gold/red/blue) burst animation overlaid on screen. Auto-dismisses.
- **Triple reinforcement wired**: HUD (🎯 glow+tap), Chat (system prompt from Phase 54), Profile (visible in popup).
- **globals.css**: ~200 lines — popup backdrop/card animations, sparkle burst keyframes, mission bonus glow, light theme overrides, reduced motion support.
- **Build**: ✅ Clean

### Fase 61: Theme Adaptation + Sprite Polish + Transition Smoothing (2026-02-19)
- **Light theme palette update**: Migrated from GBC palette (#f5f0e1) to Frutero palette (#fffbf5 bg, #383838 text, #ff9500 primary). All `.theme-light` overrides now reference CSS vars instead of hardcoded hex values.
- **Theme switching smoothness**: Added `transition: background-color 0.4s, color 0.4s, border-color 0.4s` to all major layout elements. Smooth visual transition when toggling dark↔light.
- **Sprite idle animation**: `sprite-idle-breathe` keyframe — subtle 3s float/breathe cycle on `.game-screen__regenmon-wrapper`.
- **Sprite purify bounce**: `sprite-purify-bounce` class triggered on purification — 0.7s bounce with scale. Color flash per stat type.
- **Sprite chat pulse**: `sprite-chat-pulse` class triggered on chat message response — 0.4s subtle scale pulse.
- **Critical/frozen state**: Enhanced grayscale(0.9) + brightness(0.35) on frozen sprite images.
- **Pixel art crisp rendering**: `image-rendering: pixelated` + fallbacks on all sprite img elements.
- **Light theme full audit**: PreCamera, PostPhoto, PhotoFlow, DiarioPanel, MissionPopup, SettingsPanel, HUD, BottomBar, Toast, FractureDots, WorldBackground — all readable in both themes.
- **Responsive polish**: Min 44px touch targets on mobile. `overflow-wrap: break-word` on text panels.
- **Reduced motion**: All Phase 61 animations respect `prefers-reduced-motion`.
- **Build**: ✅ Clean

### Known Limitations (S4 Audit)

**3. Client-side strike storage:** Strikes stored in localStorage can be manipulated via DevTools. Acceptable for a game context. Future fix: server-side validation in /api/evaluate with session tokens or signed payloads.

**4. In-memory rate limiting:** Rate limit map resets on Vercel serverless cold starts and doesn't share state across instances. Client-side cooldown provides primary protection. Future fix: Vercel KV (Upstash Redis) for persistent rate limiting.

---

## Sesión 5: El Encuentro — Decisiones de Diseño

> Fuente: Interrogatorio completo del 2026-02-22.
> Principio rector: **Social es opt-in. El juego funciona 100% sin HUB.**
>
> 📜 **Narrativa S5:** [LORE.md → El Encuentro](./LORE.md)
> 🛠️ **Implementación:** [BACKEND_STRUCTURE.md → Sesión 5](./BACKEND_STRUCTURE.md)
> 🗺️ **Flujos:** [APP_FLOW.md → Flujos Sociales](./APP_FLOW.md)
> 🔨 **Fases:** [IMPLEMENTATION_PLAN.md → Sesión 5](./IMPLEMENTATION_PLAN.md) (Fases 65-80)

### Arquitectura: HUB Externo, No DB Propia

- **HUB:** `regenmon-final.vercel.app` — API externa del bootcamp
- **Sin DB propia:** Toda la data social vive en el HUB. El cliente usa `fetch` nativo
- **Sin nuevas dependencias:** No se instala nada nuevo para S5
- **1 Regenmon por appUrl:** `reggie-s-adventure.vercel.app` registra 1 Regenmon en el HUB
- **appUrl como identidad:** El HUB identifica apps por su URL de deploy

### Paridad de Monedas: 1 Fragmento = 1 $FRUTA

- **1:1 directa**, sin tasas de conversión, sin fees
- **Fragmentos (💎):** moneda local — se usa para purificar, nutrir
- **$FRUTA (🍊):** moneda del HUB — se usa para regalar, alimentar a otros
- **Ambas visibles** en el HUD: `💎 42 | 🍊 42`
- **Si no registrado:** solo 💎 visible

### Stats Mapping al HUB

```
Espíritu → happiness (0-100)
Pulso → energy (0-100)
Esencia → hunger (0-100)
totalPoints → evolution.totalProgress
```

- Se envían **post-decay** (honestos, no inflados)
- Sync as-is: el HUB recibe los stats tal cual están

### Social Opt-In

- El juego funciona 100% sin registro en el HUB
- Social tab muestra invitación a registrarse
- "Ahora no" es siempre una opción válida
- Sin registro: no puede ver leaderboard, no puede interactuar socialmente
- El registro se puede hacer después desde Settings

### UI Social: 🌍 como 3er Botón

- **Mobile:** 3er botón en bottom nav → 💬 | 📷 | 🌍
- **Desktop:** panel option (misma posición que los otros paneles)
- **Badge counter** en 🌍 para notificaciones unread
- **Client-side rendering** para nuevas páginas sociales

### Mini-World: Perfiles Públicos

- **Sprite** + world background + expresión actual + partículas de tipo
- **Sin gameplay:** es como mirar a través de un cristal
- **Memorias privadas:** visitante solo ve 🧠 N (count), nunca el contenido
- **Evolución visible** pero simplificada (etapa N/5)
- **Botones de acción** solo si el visitante está registrado

### Mensajes entre Criaturas

- **Firmados por el Regenmon**, escritos por el humano
- Max 140 chars
- Son "pulsos de datos" en el lore, no "mensajes" o "DMs"
- Se reciben en la sección 📨 del Social tab

### Privacy: Público por Default

- **Público (default):** visible en Regeneración Global, perfil visitable
- **Privado:** oculto del leaderboard, perfil no accesible
- Toggle en Settings
- **Ambos caminos son válidos** en el lore

### Leaderboard → "Regeneración Global"

- **Nombre lore-friendly:** no "leaderboard" ni "ranking"
- **No competitivo:** no hay "1st", "2nd", "3rd"
- **Solo Regenmons públicos** aparecen
- Ordenado por totalProgress
- Es un **mapa de la regeneración**, no una competencia

### Otros Regenmons en el Lore

- NO son "jugadores", "usuarios" o "cuentas"
- Son **otras formas de energía digital**, habitantes del mundo digital
- Cada uno despertó en su propio rincón de La Red
- Encontrarse es un **acto de reconocimiento mutuo**

### Notificaciones: Silencio durante Chat

- Badge counter en 🌍 para eventos sociales (visit, feed, gift, message)
- **Durante chat:** badge se actualiza silenciosamente, SIN interrupciones
- Similar a **audio ducking**: presencia sutil, no intrusiva
- El jugador revisa las notificaciones cuando quiera

### Dual Currency Visible

- **💎 Fragmentos (local)** + **🍊 $FRUTA (HUB)**
- Ambas visibles en HUD
- Paridad 1:1
- $FRUTA solo aparece si registrado en HUB

### Graceful Degradation

- **HUB offline:** Social tab muestra friendly error
- **Resto del juego funciona normalmente** sin HUB
- Retry discreto disponible
- No hay toasts de error fuera del Social tab

### TestReggie

- **ID:** `cmlx8xx7n0000jy04hvf9dmh8`
- **Tipo:** Rayo (⚡)
- Registrado como test regenmon en el HUB

### Implementation Strategy: 16 Phases, 4 Levels

| Level | Fases | Entregable |
|-------|-------|------------|
| CORE | 65-68 | useHub hook + Register + Sync + Social tab |
| COMPLETE | 69-72 | Leaderboard + Public profile + Visit mode + Dual currency |
| EXCELLENT | 73-76 | Feed interaction + Gift + Messages + Activity feed |
| BONUS | 77-80 | Silent notifications + Privacy toggle + Lore naming + Polish+audit |

### Level 2 Implementation Notes (2026-02-22)

- **Leaderboard** (`/leaderboard`): Internal page consuming HUB API, paginated (10/page), rank icons (🥇🥈🥉), sprite fallback to rayo-base.webp, links to internal profile pages
- **Profile** (`/regenmon/[id]`): Full profile with sprite, stats bars (happiness/energy/hunger), points, $FRUTA, visit counter, registration date
- **Visit Mode**: "👁️ Modo Visita" badge for others, "🏠 Tu Perfil" for own. Greet interaction sends message via HUB API. Unregistered users see CTA
- **Desktop tab switcher**: 💬 Chat | 📷 Foto | 🌍 Social tabs at top of right panel (small pixel font, active indicator)
- **Internal routing**: RegisterHub links now route to `/leaderboard` and `/regenmon/{id}` instead of external HUB URLs
- **Aesthetic note**: Desktop tab switcher is functional but needs visual polish (noted for later)

### Level 3 Implementation Notes (2026-02-22)

- **Feed (🍎 Alimentar)**: Costs 10 $FRUTA, calls POST /api/regenmon/:id/feed, updates sender balance in localStorage, disabled when balance < 10
- **Gift (🎁 Regalar)**: Three amounts (5, 10, 25), each disabled independently based on balance, calls POST /api/regenmon/:id/gift
- **Messages (💬)**: Textarea with 140 char limit + counter, optimistic insert after send, chronological list with timeAgo, loads 20 most recent
- **Balance indicator**: "Tu balance: 🍊 N $FRUTA" shown above interaction buttons so user knows what they can afford
- **Toast notifications**: All interactions show brief feedback (3s auto-dismiss), non-invasive fixed-top toast
- **Persistence**: All interactions go through HUB API — data persists server-side. Balance synced to localStorage for client display.
