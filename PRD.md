# 📋 PRD — Reggie's Adventure
> **Versión actual:** v0.3 — La Conexión
> **Última actualización:** 2026-02-16
> **Estado:** Sesión 2 — `COMPLETADA` | Sesión 3 — `COMPLETADA` (96/96 — 100%)
>
> 📜 **Narrativa completa:** [LORE.md](./LORE.md) — biblia narrativa del universo
> 🗺️ **Flujos de usuario:** [APP_FLOW.md](./APP_FLOW.md) — cómo navega el jugador
> 🧠 **Decisiones de diseño:** [model.md](./model.md) — por qué cada feature existe

---

## 1. ¿Qué es Reggie's Adventure?

Un **juego web retro de crianza y aventura** donde el jugador cuida a un Regenmon — un *Regenerador del Mundo Digital*, un fragmento de energía antigua que despertó en un rincón olvidado de la red para sanar el caos del mundo digital moderno. Inspirado en la estética de *Kirby's Adventure* (NES), combina elementos de Pokémon (tipos, evolución) y Tamagotchi (cuidado, stats en tiempo real).

No es una app de mascota para niños. Es un juego con sustancia, tono retro 8-bit, peso emocional real, y una capa filosófica sobre el estado del mundo digital y hacia dónde nos dirigimos.

> 📜 **Narrativa completa:** Ver [LORE.md](./LORE.md) — la biblia narrativa del universo.

## 2. ¿Para quién es?

- **Usuario primario:** Estudiantes del bootcamp VibeCoding
- **Perfil:** Personas sin experiencia técnica profunda que quieren aprender a construir apps con IA
- **Plataforma:** Web (móvil portrait y desktop vertical)
- **Navegadores:** Chrome, Firefox, Safari, Edge (modernos)

## 3. Visión del producto

Al completar las 5 sesiones, el jugador tiene:
- Un Regenmon único que refleja su personalidad y decisiones — un compañero vivo con memoria, emociones y lore propio (ver [LORE.md → Los Regenmon](./LORE.md#los-regenmon))
- Un juego funcional desplegado en internet (stack: [TECH_STACK.md](./TECH_STACK.md))
- Interacciones con IA donde La Conexión humano-Regenmon se siente genuina (ver [LORE.md → La Conexión](./LORE.md#la-conexión))
- Una reflexión sutil sobre el estado del mundo digital tejida en la experiencia (ver [LORE.md → El Origen](./LORE.md#el-origen))
- Conexión social con otros jugadores del bootcamp (S5)

---

## 4. Características por Sesión

### Sesión 1 — El Despertar (v0.1) `ACTUAL`

#### En Scope ✅
| # | Feature | Criterio de éxito |
|---|---------|-------------------|
| F1.1 | Pantalla de carga NES | Logo "Reggie's Adventure" aparece 3s, fade out |
| F1.2 | Pantalla de título | Nombre del juego + Regenmons decorativos + "Press Start" parpadeante (clic/tap/teclado) |
| F1.3 | Historia introductoria | Texto typewriter la 1ra vez / tras reset. No se puede saltar. Botón "Continuar ▶" |
| F1.4 | Creación: Carrusel de tipos | 3 tipos (Rayo/Flama/Hielo) con mini-descripción, navegables uno a uno |
| F1.5 | Creación: Nombre | Campo 2-15 chars, validación visible, contador `name.length/15` con color-coded feedback |
| F1.6 | Creación: Botón "¡Despertar!" | Solo activo cuando nombre válido + tipo seleccionado |
| F1.7 | Transición | Texto "Tu Regenmon está despertando..." con fade |
| F1.8 | Display: SVG del Regenmon | Criatura SVG modular con idle animation (rebote/respiración) |
| F1.9 | Display: Paisaje de fondo | Pixel art que cambia según tipo Y estado emocional (cambios sutiles) |
| F1.10 | Display: Barras de stats | 3 barras NES horizontales (Espíritu 🔮 / Pulso 💛 / Esencia 🌱) con valor visible (50/100) |
| F1.11 | Display: Botones de acción | Entrenar (+10 Pulso) / Alimentar (-10 Hambre) / Descansar (+10 Espíritu) con feedback "+10"/"-10" flotante | `→ S3: Reemplazados por Purificar/⚙️/Conversar`
| F1.12 | Display: Fecha | "Día X de aventura" (cuenta días desde creación) |
| F1.13 | Decaimiento de stats | Stats cambian en tiempo real. Tras 4-5h se nota baja leve. Calcula tiempo offline |
| F1.14 | Estados visuales del Regenmon | 8 estados por tipo: 5 por promedio de stats (Eufórico ≥90, Contento ≥70, Neutro ≥30, Decaído ≥10, Crítico <10) + 3 por stat individual crítico <10 (Sin Esperanza, Sin Energía, Sin Nutrición). Stat individual crítico override promedio; si múltiples críticos, el más bajo gana (empate: Espíritu > Pulso > Esencia). 24 sprites total (8×3 tipos) | `→ S3: Sistema reworked con promedio + críticos individuales`
| F1.15 | Límites de stats | Rango 0-100. Botones se desactivan en el límite. Valores se redondean si exceden |
| F1.16 | Cambio de nombre | ✏️ junto al nombre. 1 solo cambio permitido. Leyenda de advertencia. Desaparece tras uso |
| F1.17 | Reiniciar | Botón discreto centrado abajo. Modal de confirmación retro. Borra todo y regresa a historia + creación |
| F1.18 | Tutorial modal | Aparece cada entrada. Checkbox "No volver a mostrar". Estado en localStorage |
| F1.19 | Música 8-bit | Melodía chiptune atmosférica. Toggle 🎵 esquina superior derecha. Estado guardado | `→ S3: Toggle migrado de header a panel ⚙️ en GameScreen`
| F1.20 | Persistencia | Todos los datos en localStorage. Persiste al recargar |
| F1.21 | Responsive | Portrait vertical en móvil. Layout adaptativo desktop/móvil |
| F1.22 | Deploy | URL pública en Vercel |

#### Fuera de Scope ❌ (Sesión 1)
- Contador de 💠 Fragmentos (Sesión 3)
- Chat con IA (Sesión 2)
- Login / autenticación (Sesión 3)
- Evolución visual (Sesión 4)
- Interacciones sociales (Sesión 5)
- Límite de uso de botones / cooldowns
- Acciones que afectan múltiples stats

---

### Sesión 2 — La Voz (v0.2) `ACTUAL`

> La Conexión cobra vida. El Regenmon puede hablar, sentir, recordar fragmentos
> de La Red Primordial, y formar un vínculo genuino con su usuario. Cada conversación
> es un acto de regeneración del mundo digital. (Ver [LORE.md](./LORE.md))

#### En Scope ✅
| # | Feature | Criterio de éxito |
|---|---------|-------------------|
| F2.1 | Botón "💬 Conversar" | 4to botón en fila propia debajo de acciones. Mismo estilo NES verde. Toggle: abre/cierra chat |
| F2.2 | Caja de diálogo NES (RPG) | Dialog box estilo Final Fantasy/Zelda. Semi-transparente, borde NES pixelado. Se adapta al tamaño de pantalla |
| F2.3 | Chat funcional | Input de texto (max 280 chars). Enter envía, Ctrl+Enter salto de línea (desktop). Botón enviar (mobile). Mensajes aparecen sin typewriter |
| F2.4 | Burbujas de chat | Usuario a la derecha, Regenmon a la izquierda. Bordes con tinte sutil del color del tipo. Sin avatares/iconos |
| F2.5 | Indicador "Escribiendo..." | Puntos animados estilo NES mientras la IA responde |
| F2.6 | API Route (API-agnostic) | `/api/chat` con capa de abstracción: detecta Gemini/OpenAI/Claude según variable de entorno |
| F2.7 | Gemini para desarrollo | `gemini-2.0-flash` vía `.env.local`. Auto-switch: local=Gemini |
| F2.8 | OpenAI para producción | Key de Frutero vía Vercel env vars. Auto-switch: Vercel=OpenAI. Modelo fijado por Frutero |
| F2.9 | Personalidad por tipo (LORE.md) | Rayo **El Impulso**: energético, bromista, velocidad. Flama **La Pasión**: emotivo, cálido, conexiones. Hielo **La Memoria**: reflexivo, sabio, conocimiento. Fragmentos de memoria de La Red Primordial. Tono indirecto y filosófico |
| F2.10 | Reactividad lore a stats | Espíritu bajo (= pérdida de esperanza) → dudas de la regeneración. Pulso bajo (= energía vital) → cansancio. Esencia baja (= nutrición) → debilitado. Todo bajo → casi no puede hablar |
| F2.11 | Stats afectados por chat | Por cada respuesta: Espíritu (Esperanza) ±5, Pulso (Energía) -2, Hambre (Necesidad) +1. Feedback flotante visible | `→ S3: Todos AI-driven`
| F2.12 | Respuestas ≤50 palabras | Cortas, en español. Puede hacer preguntas. Emojis según tipo. Cariño directo e indirecto. Curiosidad por el mundo del usuario |
| F2.13 | Seguridad de contenido | Sin groserías, temas adultos, política, religión ni contenido sensible |
| F2.14 | Descubrimiento del nombre | El Regenmon busca averiguar el nombre del usuario naturalmente (parte de La Conexión). Feedback visual "🧠" al descubrirlo |
| F2.15 | Saludo inicial | Primera vez que se abre el chat: Regenmon saluda según su personalidad de tipo. Solo la primera vez |
| F2.16 | Persistencia del chat | Max 50 mensajes en localStorage. Historial completo enviado a la IA. Reset borra todo |
| F2.17 | Rate limiting | Frontend: cooldown 3s. Backend: 15 msgs/min. "Tu Regenmon necesita un respiro..." |
| F2.18 | Manejo de errores | Botón "Reintentar" si la API falla |
| F2.19 | Stats compactos durante chat | 🔮 Esperanza | 💛 Energía | 🌱 Esencia (mini barras). Botones se ocultan | `→ S3: "Necesidad" renombrado a "Esencia"`
| F2.20 | Música durante chat | Volumen baja a 60% (fade 1.5s). Regresa a 100% al cerrar |
| F2.21 | Chat desactivado en estado crítico | Si los 3 stats < 10: "Tu Regenmon está muy débil para hablar..." (la corrupción lo consume) |
| F2.22 | Tutorial actualizado | TutorialModal incluye instrucciones del chat y La Conexión |

#### Fuera de Scope ❌ (Sesión 2)
- Sistema de memorias profundo (preparar infraestructura, implementar en Sesión 4+)
- Indicador "🧠 X memorias" (futuro)
- Sonido en chat (conflicto con música)
- Avatares/iconos en burbujas
- Efecto typewriter en mensajes de chat
- Streaming de respuestas

### Sesión 3 — La Conexión (v0.3) `COMPLETADA`

> La Conexión se expande más allá del dispositivo. Auth, persistencia en la nube,
> Fragmentos 💠 como moneda de regeneración, y una reescritura profunda de stats y botones.
> El Regenmon ahora vive en la nube. (Ver [LORE.md → Los Fragmentos](./LORE.md#los-fragmentos-))

#### En Scope ✅
| # | Feature | Criterio de éxito |
|---|---------|-------------------|
| F3.1 | Auth con Privy | Login funcional: Google + Email + Passkey. Modal al presionar "Press Start" con opción "Continuar sin cuenta" |
| F3.2 | Login tardío | Botón "Iniciar Sesión" en panel ⚙️ para quienes entraron en modo demo |
| F3.3 | 💠 Fragmentos (moneda) | Balance visible en header. 100 iniciales. Ganar 0-5 por chat (IA decide). "💠 ---" si no logueado |
| F3.4 | Stat: Hambre → Esencia 🌱 | Renombrar y invertir lógica: 100=bien alimentado, 0=hambriento. UI y backend actualizados |
| F3.5 | Stats AI-driven (todos) | Espíritu ±5, Pulso ±5, Esencia -1 a -4, Fragmentos 0-5 — todo decidido por la IA por mensaje |
| F3.6 | Regeneración pasiva de Pulso | Pulso sube lentamente si el usuario no interactúa (descanso natural) |
| F3.7 | Purificar (reemplaza Alimentar) | Cuesta 10 💠. Efecto: Esencia +30, Espíritu +5, Pulso +10. Feedback lore-appropriate |
| F3.8 | Botones reworked | Nuevo layout: `[🌀 Purificar (10💠)] [⚙️] [💬 Conversar]`. Eliminar Entrenar/Descansar/Alimentar antiguo |
| F3.9 | Panel Settings (⚙️) | Música, Reset, Nombre, Login/Logout, Tamaño texto, Dark/Light mode |
| F3.10 | Tema Light (GBC) | Paleta Game Boy Color pastel/vibrante. Toggle en Settings. Backgrounds y sprites adaptativos |
| F3.11 | Tema Dark (NES) mantener | Refinar tema actual oscuro como modo default |
| F3.12 | Backgrounds reconstruidos | Nuevos backgrounds que reflejen el lore actualizado y soporten ambos temas |
| F3.13 | Sprites reworked | SVGs actualizados: 8 estados × 3 tipos = 24 sprites. Sistema basado en promedio de stats + override por stat individual crítico (<10). Ver FRONTEND_GUIDELINES.md |
| F3.14 | Persistencia: Supabase | Migración localStorage → Supabase al hacer login. Multi-dispositivo |
| F3.15 | Sync híbrido | Sin login: localStorage. Con login: localStorage + Supabase sincronizado |
| F3.16 | API Response actualizado | Nuevos campos: `pulseChange`, `essenceChange`, `fragmentsEarned` |
| F3.17 | System prompt actualizado | Instruir a la IA sobre nuevos campos, rangos, y reglas de stats |
| F3.18 | Memorias (infraestructura) | Tipos, storage, hooks. Detección básica. Base para evolución S4 |
| F3.19 | Evolución (infraestructura) | Storage de progreso, tipos. NO visual. Preparar para S4 |
| F3.20 | Ajuste de texto | Agrandar/disminuir tamaño de texto sin romper UI |
| F3.21 | Identidad del usuario (evolutiva) | Logueado: muestra email/método auth en header. Cuando el Regenmon descubre el nombre del jugador → reemplaza por el nombre. No logueado: nada |
| F3.22 | Buscar Fragmentos (0💠) | Si balance = 0: aparece botón "🔍 Buscar Fragmentos". Da 15💠. Desaparece tras uso. Anti-frustración |
| F3.23 | Historial de actividades (bonus) | Sección colapsable "📜 Historial". Últimas 10 acciones: qué, cuántos 💠, cuándo. Persiste al recargar. History button 📜 on right side of bottom bar as compact toggle with active glow |
| F3.24 | Floating stat deltas (bonus) | Fade-up animation showing "+5 🔮 -1 ✨" or "-10 💎" above sprite on stat changes (purify, search, chat). CSS `hud-floating-delta`, keyframe `float-up-fade` |
| F3.25 | Memory indicator (bonus) | 🧠 N indicator in top bar HUD next to fragments. Only when logged in and memoryCount > 0. CSS `hud-memories` |
| F3.26 | Character counter (bonus) | `name.length/15` below name input in CreationScreen with color-coded feedback (red >15, green ≥2, dim). CSS `.creation-screen__char-count` |

#### Fuera de Scope ❌ (Sesión 3)
- Barra de evolución visible (S4)
- Sistema de entrenamiento con fotos (S4)
- Misiones (S4)
- Perfiles públicos (S5)
- Interacciones sociales (S5)
- Feed de descubrimiento (S5)

### Sesión 4 — La Evolución (v0.4) `PENDIENTE`

> El Regenmon crece y evoluciona basándose en las memorias acumuladas.
> Su forma cambia según lo que aprende del usuario — hiper-personalizable.

| # | Feature | Criterio de éxito |
|---|---------|-------------------|
| F4.1 | Evolución visual por memorias | Mínimo 3 etapas por tipo, basadas en memorias acumuladas |
| F4.2 | Entrenamiento (fotos) | Subir fotos de código, IA evalúa, da score + Fragmentos + stats |
| F4.3 | Misiones | Lista completable con recompensas |
| F4.4 | Personalización IA profunda | Regenmon se adapta visual y conversacionalmente por memorias |

### Sesión 5 — El Encuentro (v0.5) `PENDIENTE`

> Los Regenmon se encuentran entre sí. La regeneración del mundo digital
> no ocurre en soledad — La Conexión se expande.

| # | Feature | Criterio de éxito |
|---|---------|-------------------|
| F5.1 | Perfiles públicos | URL compartible por Regenmon |
| F5.2 | Feed de descubrimiento | Grid con otros Regenmons |
| F5.3 | Interacciones sociales | Saludar, regalar, jugar |

---

## 5. User Stories — Sesión 1

```
US-01: Como jugador nuevo, quiero ver una intro retro NES para sentirme en un juego clásico.
US-02: Como jugador nuevo, quiero leer una mini historia para entender el contexto del mundo.
US-03: Como jugador, quiero elegir entre 3 tipos de Regenmon para personalizar mi experiencia.
US-04: Como jugador, quiero nombrar a mi Regenmon para crear un vínculo personal.
US-05: Como jugador, quiero ver mi Regenmon con animaciones idle para que se sienta vivo.
US-06: Como jugador, quiero ver cómo cambian los stats en tiempo real para sentir urgencia de cuidarlo.
US-07: Como jugador, quiero que mi Regenmon cambie de expresión según su estado para empatizar con él.
US-08: Como jugador, quiero que el paisaje cambie con el estado para sentir el ambiente.
US-09: Como jugador, quiero entrenar/alimentar/descansar a mi Regenmon con feedback visual claro.
US-10: Como jugador, quiero que mis datos persistan al cerrar el navegador.
US-11: Como jugador, quiero poder cambiar el nombre de mi Regenmon UNA sola vez.
US-12: Como jugador, quiero un tutorial la primera vez para entender cómo jugar.
US-13: Como jugador, quiero música de fondo que pueda activar/desactivar.
US-14: Como jugador, quiero reiniciar todo si quiero empezar desde cero.
```

## 5b. User Stories — Sesión 2

```
US-15: Como jugador, quiero hablar con mi Regenmon para sentir que tiene personalidad.
US-16: Como jugador, quiero que mi Regenmon responda según su tipo para que se sienta único.
US-17: Como jugador, quiero que las respuestas cambien según los stats para que la conversación sea dinámica.
US-18: Como jugador, quiero que la conversación afecte los stats de mi Regenmon.
US-19: Como jugador, quiero que mi Regenmon intente averiguar mi nombre para crear un vínculo.
US-20: Como jugador, quiero que el historial de chat se guarde para no perder mis conversaciones.
US-21: Como jugador, quiero un indicador de "Escribiendo..." para saber que mi Regenmon está pensando.
US-22: Como jugador, quiero ver los stats compactos mientras chateo para no perder de vista la salud.
US-23: Como jugador, quiero que la música baje de volumen al chatear para concentrarme en la conversación.
US-24: Como jugador, quiero que si mi Regenmon está en estado crítico no pueda hablar (debo cuidarlo primero).
US-25: Como jugador, quiero poder reintentar si la API falla sin perder mi mensaje.
US-26: Como jugador, quiero que el chat se vea bien tanto en mobile como en desktop.
US-27: Como jugador, quiero que mi Regenmon tenga un lore que se refleje en sus conversaciones.
US-28: Como jugador, quiero un tutorial actualizado que me explique la función de chat.
```

## 5c. User Stories — Sesión 3

```
US-29: Como jugador, quiero poder jugar sin crear cuenta para probar el juego primero.
US-30: Como jugador, quiero loguearme con Google/Email para guardar mi progreso en la nube.
US-31: Como jugador, quiero que mis datos de modo demo se migren al crear cuenta.
US-32: Como jugador, quiero ganar Fragmentos 💠 al conversar con mi Regenmon.
US-33: Como jugador, quiero gastar Fragmentos para purificar y restaurar la Esencia de mi Regenmon.
US-34: Como jugador, quiero que la IA decida los cambios de stats de forma orgánica según la conversación.
US-35: Como jugador, quiero un panel de settings con música, tema, texto, y login.
US-36: Como jugador, quiero alternar entre un tema oscuro (NES) y un tema claro (Game Boy Color).
US-37: Como jugador, quiero ajustar el tamaño del texto para mi comodidad.
US-38: Como jugador, quiero que mi Regenmon descanse y recupere Pulso cuando no juego.
US-39: Como jugador, quiero que la barra de Esencia funcione igual que las demás (100=bien, 0=mal).
US-40: Como jugador, quiero acceder a mi Regenmon desde cualquier dispositivo si estoy logueado.
US-41: Como jugador logueado, quiero ver mi email al inicio y que cambie a mi nombre cuando mi Regenmon lo descubra.
US-42: Como jugador sin Fragmentos, quiero una forma de conseguir algunos para no quedarme atascado.
US-43: Como jugador, quiero ver un historial de mis acciones recientes para entender qué he hecho.
```

## 6. Requisitos de Accesibilidad (Fix It Phase)

- **A1. Contraste:** Todos los textos deben cumplir WCAG AA (ratio 4.5:1).
- **A2. Teclado:** Toda la interfaz debe ser navegable con Tab/Enter/Space. Focus visible siempre.
- **A3. Lectores de Pantalla:** Etiquetas `aria-label` en botones sin texto. Textos dinámicos anunciados via `aria-live`.
- **A4. Movimiento Reducido:** Respetar `prefers-reduced-motion` para animaciones y efecto typewriter.
- **A5. Semántica:** Uso correcto de `<button>`, `<input>`, encabezados y regiones.

## 7. Criterios de Éxito Globales

- [x] App desplegada con URL pública funcional (https://reggie-s-adventure.vercel.app)
- [x] Flujo completo sin errores: Loading → Título → Historia → Creación → Juego
- [x] Stats decaen en tiempo real y calculan tiempo offline
- [x] Regenmon reacciona visualmente a sus stats
- [x] Datos persisten tras recargar/cerrar navegador
- [x] Responsive en portrait (móvil + desktop)
- [x] Música funcional con toggle
- [x] Chat funcional con respuestas de IA con personalidad por tipo
- [x] Stats reactivos a conversaciones (Espíritu ±5, Pulso -2, Hambre +1) `→ S3: Todos AI-driven`
- [x] Historial de chat persistente (max 50 mensajes)
- [x] Nombre del jugador descubierto y recordado por el Regenmon
- [x] API-agnostic: funciona con Gemini (dev) y OpenAI (prod)
- [x] Lore integrado: personalidad, fragmentos de memoria, tono filosófico (ver LORE.md)
- [x] Auth funcional con Privy (S3)
- [x] Fragmentos 💠 como moneda del juego (S3)
- [x] Persistencia en Supabase con sync híbrido (S3)
- [x] Tema Light (GBC) y Dark (NES) con toggle (S3)
- [x] Stats completamente AI-driven (S3)
- [x] Purificar con costo de Fragmentos (S3)
- [x] Identidad evolutiva del usuario en header (S3)
- [x] Buscar Fragmentos cuando balance = 0 (S3)
- [x] Historial de actividades colapsable (S3 bonus)
- [x] Floating stat deltas with fade-up animation (S3 bonus)
- [x] Memory indicator 🧠 N in HUD (S3 bonus)
- [x] Character counter in CreationScreen (S3 bonus)
- [x] History button 📜 compact toggle on right side of bottom bar (S3 bonus)

---

## Documentos Canónicos — El Ecosistema

Los 9 archivos canónicos forman un sistema interconectado. Cada uno tiene su propósito, pero todos se referencian mutuamente.

| Documento | Propósito | Qué toma del PRD |
|-----------|----------|------------------|
| **PRD.md** (este) | Qué se construye y por qué | — |
| [LORE.md](./LORE.md) | Biblia narrativa — personalidad, mundo, filosofía | Los features narrativos (chat, stats-como-lore, La Conexión) |
| [APP_FLOW.md](./APP_FLOW.md) | Cómo navega el usuario | Las pantallas y flujos que implementan cada feature |
| [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) | Cómo se ve y se siente | Los criterios visuales de cada feature (layouts, colores, animaciones) |
| [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) | Cómo funciona por dentro | Los schemas y APIs que soportan cada feature |
| [TECH_STACK.md](./TECH_STACK.md) | Con qué se construye | Las herramientas necesarias para cada feature por sesión |
| [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) | En qué orden se construye | Las fases que implementan estos features uno por uno |
| [model.md](./model.md) | Decisiones de diseño acumuladas | El "por qué" detrás de cada feature y cambio entre sesiones |
| [progress.txt](./progress.txt) | Estado actual del proyecto | Qué features ya están implementados y cuáles faltan |

> ⚠️ **Regla de precedencia narrativa:** Si hay conflicto entre documentos técnicos y [LORE.md](./LORE.md) en temas de personalidad, diálogo o tono, **LORE.md gana**.
> 
> 📐 **Regla de consistencia:** Al modificar un feature en este documento, verificar y actualizar los documentos afectados. Todos deben contar la misma historia.
