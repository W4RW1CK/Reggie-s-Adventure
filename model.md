# 🧠 MODEL — Reggie's Adventure
> **Última actualización:** 2026-02-15

---

## Estado del Proyecto

| Sesión | Versión | Estado |
|--------|---------|--------|
| S1: El Despertar | v0.1.16 | ✅ Completada y desplegada |
| S2: La Voz | v0.2 | ✅ Completada y desplegada |
| S3-S5 | — | 🔒 Pendientes |

---

## Sesión 2: Decisiones de Diseño (121 preguntas, 4 rondas)

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

### Stats y Mecánicas (S2 — DEPRECATED en S3, ver sección S3)
- **Por respuesta del Regenmon (S2):**
  - Espíritu: ±5 máximo (IA decide, fallback 0)
  - Pulso: -2 fijo
  - Hambre: +1 fijo
- **Reactividad**: Espíritu bajo=deprimido, Pulso bajo=cansado, Hambre alta=irritable
- **Stats críticos (3 < 10)**: Chat desactivado con tooltip
- **Stats compactos durante chat**: 🔮 80 | 💛 50 | 🍎 30

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

### Lore — COMPLETADO
- Documento: LORE.md (biblia narrativa)
- Universo: La Red Primordial (mundo original) vs El mundo digital (corrupto)
- Regenmon: Fragmento de energía antigua, regenerador del mundo digital
- 3 tipos: Rayo (Impulso/Claridad), Flama (Pasión/Conexiones), Hielo (Memoria/Sabiduría)
- La Conexión: Vínculo humano-Regenmon, acto de regeneración
- Stats = lore: Espíritu=Esperanza, Pulso=Energía vital, Hambre=Necesidad
- Paisajes = zonas del mundo digital con significado por tipo
- Filosofía: El progreso no es malo, la pérdida del equilibrio sí (spam, scams, odio, olvido)
- Tono: Místico + épico + oscuro pero esperanzador
- Frases de lore: indirectas, elusivas, esporádicas, filosóficas pero sutiles

### Deploy y Verificación
- **El usuario maneja el deploy personalmente**
- **Fase de auditoría rigurosa** previa: accesibilidad, seguridad, rendimiento, testing completo
- **Logging**: Solo en modo desarrollo

---

## Sesión 3: La Conexión — Decisiones de Diseño (4 rondas, ~40 preguntas)

> Fuente: Interrogación completa del 2026-02-15.
> Referencia: Demo del bootcamp en `regenmon-final.vercel.app` + `Docs/04. Sesiones/Sesion 3/`.
> Principio rector: **Adaptación personal del bootcamp**. El lore siempre gana.

### Cambios Mayores vs S2

| Área | S2 (antes) | S3 (ahora) |
|------|------------|------------|
| Moneda | No existía | **Fragmentos 💠** (100 iniciales) |
| Stat "Hambre" | Hambre (100=hambriento, lógica invertida) | **Esencia 🍎** (100=bien alimentado, lógica normal) |
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
| Esencia | Nutrición digital | 🍎 | 0-100 | Bien alimentado | Hambriento | Datos puros que lo nutren |

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
- **Feedback visual**: "+30 🍎" flotante + efecto visual (no "¡Ñam ñam!" — algo lore-appropriate)
- **Validaciones**: No funciona sin Fragmentos, botón se deshabilita, tooltip "Necesitas 10 💠"
- **No funciona si Esencia ya está al máximo**
- **Reacción del Regenmon**: Texto lore-appropriate contextual (no genérico)

### Botones del GameScreen (S3)

**Layout final:**
```
[🔮 Purificar (10 💠)]  [⚙️]  [💬 Conversar]
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

