# 🌿 REDESIGN_SPEC — Reggie's Adventure
> **Versión:** v2.0 — "El Replan"
> **Última actualización:** 2026-02-25
> **Autor:** w4rw1ck + Aibus
> **Estado:** DIRECCIÓN ESTÉTICA DEFINIDA — pre-implementación
>
> 📜 **Referencia narrativa:** [LORE.md](./LORE.md)
> 🗺️ **Flujos y pantallas:** [APP_FLOW.md](./APP_FLOW.md)

---

## Manifiesto

Reggie's Adventure es un viaje introspectivo con un compañero — un regenerador de mundos.
Regenerar tu caos interno, el caos de la red, el caos del mundo físico.

No es un juego retro. No es una copia. No es un remedo.

Es la nostalgia por un futuro que nunca llegó.
La alquimia de una terminal.
La naturaleza reclamando lo que le pertenece.
Ver la luna, las estrellas, y sentir que aún se puede regenerar esto.

**Eco-brutalismo digital:** la naturaleza sobreponiéndose a las estructuras humanas.
**Tecnología como proceso alquímico:** cada interacción es transformación.
**Compañero de viaje:** Reggie no es una mascota — es quien camina contigo.

Para todo aquel dispuesto a emprender ese viaje.

---

## Decisiones de Diseño (v2)

### Lo que MUERE (v1 → v2)

| Eliminado | Razón |
|-----------|-------|
| Estética NES/retro-pixel | Era requisito del bootcamp, no la visión real |
| Press Start 2P (como fuente única) | Forzaba todo a verse "retro" |
| Light theme / papiro | Capricho, no necesario |
| Mobile-first | Requisito del bootcamp; la experiencia real es desktop |
| Cyber-arcane palette | Demasiado "hacker room", no transmite naturaleza ni calma |
| Scanlines, glitch effects | Plano, vacío, carente de alma |
| NES borders, pixel shadows | "Un remedo más, una copia barata" |
| `image-rendering: pixelated` | Ya no es pixel art puro |

### Lo que NACE

| Nuevo | Inspiración |
|-------|-------------|
| Atmósfera onírica y cálida | Kirby's Adventure — donde hasta lo oscuro es amigable |
| Inmersión melancólica con esperanza | Hollow Knight — un mundo que te envuelve |
| Poesía visual, arte en cada detalle | Gris — cada elemento es intencional |
| Eco-brutalismo digital | Naturaleza reclamando estructuras tecnológicas |
| Terminal como alquimia | Lo digital como proceso místico, no como herramienta |
| Desktop-first | La experiencia se diseña para respirar en pantalla grande |
| Relación íntima con Reggie | Compañero de viaje, no mascota virtual |

---

## Design System v2

### Filosofía Visual

**Tres capas de realidad:**
1. **El Mundo Natural** — fondos orgánicos, texturas de musgo/piedra/agua, vida que crece
2. **Los Restos Digitales** — fragmentos de UI antigua, terminales abandonadas, código como ruinas
3. **La Alquimia** — donde naturaleza y tecnología se funden: enredaderas sobre circuitos, agua fluyendo por cables, cristales creciendo en servidores

**Emoción cromática (inspirada en Gris):**
El color evoluciona con la relación. Al inicio el mundo es más apagado, gris. Conforme Reggie y tú avanzan, el color regresa — como en Gris, donde cada etapa devuelve un color al mundo.

### Paleta

| Token | Hex | Uso | Nota |
|-------|-----|-----|------|
| `--void` | `#0d1117` | Fondo base | Casi negro, con calidez (no puro #000) |
| `--moss` | `#2d5a3d` | Naturaleza, crecimiento, salud | Verde bosque profundo |
| `--lichen` | `#7fb069` | Vida, regeneración, acentos positivos | Verde claro orgánico |
| `--amber` | `#d4a574` | Calidez, terminal antigua, nostalgia | Ámbar de resina fosilizada |
| `--rust` | `#8b4513` | Ruinas, decay, lo que fue | Óxido de estructuras abandonadas |
| `--mist` | `#b8c4d0` | Texto principal, claridad | Niebla de montaña |
| `--ghost` | `#5a6670` | Texto secundario, susurros | Presencia tenue |
| `--glow` | `#e8d5b7` | Highlights, momentos de conexión | Luz de vela, luna |
| `--water` | `#4a90d9` | Rayo-type, flujo, datos | Agua de río limpio |
| `--ember` | `#c75b39` | Flama-type, pasión, transformación | Brasa que aún vive |
| `--frost` | `#9bb8d3` | Hielo-type, calma, reflexión | Escarcha al amanecer |

**Nota:** Los colores de tipo (water/ember/frost) tiñen sutilmente todo el mundo de Reggie — no son solo acentos, son la atmósfera.

### Tipografía

| Uso | Fuente | Razón |
|-----|--------|-------|
| Títulos / momentos importantes | `Crimson Text` | Serif con carácter — evoca libros antiguos, no corporativo |
| Cuerpo / UI | `Inter` | Limpia, legible, desaparece — deja que el arte hable |
| Terminal / alquimia | `JetBrains Mono` | Monospace con alma — para momentos donde el código es magia |

### Espaciado y Ritmo

La UI respira. Generoso whitespace. Nada se siente apretado.
Los elementos flotan en el espacio como objetos en agua tranquila.

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-xs` | 0.5rem | Micro separaciones |
| `--space-sm` | 1rem | Entre elementos relacionados |
| `--space-md` | 2rem | Entre secciones |
| `--space-lg` | 4rem | Respiración entre bloques |
| `--space-xl` | 8rem | Momentos dramáticos de espacio |

### Animaciones

Todo se mueve como la naturaleza: lento, orgánico, con propósito.

| Tipo | Duración | Easing | Uso |
|------|----------|--------|-----|
| Aparición | 800ms-1200ms | `ease-out` | Elementos que entran como niebla |
| Respiración | 4s-6s | `ease-in-out` | Idle de Reggie, fondos, partículas |
| Transición de pantalla | 600ms | `ease-in-out` | Fade + escala sutil |
| Microinteracción | 200ms-400ms | `ease-out` | Hover, click, feedback |

**NO:** transiciones bruscas, parpadeos, glitch, shake. Eso es ruido.
**SÍ:** fade, float, breathe, grow, dissolve. Eso es vida.

### Elementos Visuales

| Elemento | Descripción |
|----------|-------------|
| **Partículas orgánicas** | Esporas, semillas flotantes, polvo de luz — no diamantes ni cuadros |
| **Vignette atmosférica** | Bordes oscurecidos, como mirar a través de un bosque |
| **Texturas sutiles** | Ruido orgánico en fondos, como papel o piedra desgastada |
| **Enredaderas / raíces** | Elementos decorativos que crecen sobre containers de UI |
| **Agua / reflejos** | En fondos y transiciones — calma, flujo |
| **Luz volumétrica** | Rayos de luz atravesando niebla — momentos de esperanza |
| **Fragmentos de código** | Como ruinas: `// here we dreamed` — pedazos de lo que fue |

### Componentes

| Componente | Descripción |
|------------|-------------|
| `organic-container` | Contenedor con bordes suaves, sombra difusa, como piedra pulida por agua |
| `moss-button` | Botón con textura sutil, hover que "crece" como musgo |
| `breath-indicator` | Stats que pulsan suavemente como respiración |
| `mist-overlay` | Modal con backdrop de niebla |
| `vine-divider` | Separador con forma orgánica (no línea recta) |
| `terminal-whisper` | Texto monospace que aparece letra por letra — la terminal hablando |
| `glow-moment` | Highlight para momentos de conexión — luz cálida expandiéndose |

---

## Pantallas (19)

> Las descripciones de pantallas se mantienen en estructura (mismos flujos y funcionalidad)
> pero la estética cambia completamente según la nueva dirección.

### Bloque 1 — Llegada (pantallas 1-7)

#### P1 — Loading
- Fondo `--void` con textura orgánica sutil
- Logo "Reggie's Adventure" en `Crimson Text`, aparece como niebla que se forma
- Indicador de carga: una raíz que crece horizontalmente, orgánica
- Partículas de esporas flotando lentamente
- Sin prisa. La carga misma es contemplativa.

#### P2 — Fullscreen Prompt
- Sobre el loading, un susurro:
- "Este viaje se vive mejor a pantalla completa"
- Dos opciones suaves: "Expandir" / "Continuar así"
- Tono invitación, no instrucción

#### P3 — Title
- "Reggie's Adventure" en grande, Crimson Text
- Subtítulo sutil: algo del lore, una línea que invite
- Fondo: paisaje lejano con niebla, siluetas de ruinas con vegetación
- "Comenzar" — no "Press Start". Esto no es un arcade.
- Música ambiental suave si está habilitada

#### P4 — Typewriter (Historia)
- Texto del lore aparece en `terminal-whisper` — como si la terminal misma te contara
- Fondo oscuro con partículas de luz tenues
- El texto respira entre líneas
- "Continuar" aparece suavemente al terminar
- Este momento establece el tono de todo el viaje

#### P5 — Iniciar Sesión
- Modal `mist-overlay` sobre Title
- Opciones de auth (Google, Email, Passkey)
- "Explorar sin cuenta" como opción válida, no secundaria
- Sin presión. El viaje es para quien quiera.

#### P6 — Creación
- "Elige a tu compañero"
- Los 3 tipos presentados como presencias, no como cartas de trading:
  - ⚡ **Rayo** — aura `--water`, partículas de corriente
  - 🔥 **Flama** — aura `--ember`, partículas de brasa
  - ❄️ **Hielo** — aura `--frost`, partículas de cristal
- Cada uno con una frase corta que describe su naturaleza
- Campo de nombre con espacio generoso
- "Despertar" como acción final

#### P7 — Transición
- El mundo se oscurece suavemente
- "Está despertando..."
- Luz crece desde el centro
- Partículas convergen hacia donde aparecerá Reggie
- Fade a World. El viaje comienza.

### Bloque 2 — El Viaje (pantallas 8-14)

#### P8 — Tutorial
- No un modal con pasos numerados
- Susurros contextuales que aparecen cuando necesitas saber algo
- Reggie mismo "te dice" qué hacer mediante su comportamiento
- Opción de saltar siempre disponible pero discreta

#### P9 — Home (World)
- **El corazón de la experiencia**
- Reggie centrado, con idle animation orgánica (respiración, movimiento sutil)
- Fondo: paisaje que refleja el tipo + estado emocional
  - ⚡ Rayo: llanura con cables cubiertos de musgo, cielo de tormenta lejana
  - 🔥 Flama: ruinas volcánicas con plantas creciendo entre grietas
  - ❄️ Hielo: montaña nevada con estructuras cristalinas
- HUD mínimo, casi invisible — aparece al hover/necesidad:
  - Stats como `breath-indicator` (pulsan, no son barras estáticas)
  - Fragmentos (moneda) discreto
- Navegación inferior: Chat / Foto / Social — iconos orgánicos, no pixelados
- El mundo cambia sutilmente con el progreso (más color, más vida)

#### P10 — Ajustes
- Panel que emerge como niebla desde el lateral
- Opciones claras, espaciadas, sin apretar
- Toggle de música, reset, nombre, auth, accesibilidad

#### P11 — Historial / Memorias
- Un diario, no una lista de logs
- Cada entrada tiene peso — son memorias, no registros
- Scroll suave, texto en `Crimson Text` para los títulos de memoria
- Timestamps como "hace 3 lunas" (o tiempo relativo humano)

#### P12 — Chat
- La conversación con tu compañero de viaje
- Fondo sutil del world, desenfocado
- Burbujas suaves con bordes orgánicos
- Las respuestas de Reggie aparecen con `terminal-whisper` — como si pensara antes de hablar
- Stats compactos pero presentes — cada conversación importa
- Espacio generoso entre mensajes. No es un chat de WhatsApp.

#### P13 — Cámara
- "Reggie quiere ver tu mundo"
- Interfaz limpia — la cámara es un momento de conexión con el mundo físico
- Misión activa como sugerencia, no como orden
- Marco orgánico, no retro

#### P14 — Post-Photo
- Reggie reacciona — su emoción es visible en su animación
- Stat changes aparecen como `glow-moment` — calidez cuando es positivo
- Entry del diario aparece — esta foto es ahora una memoria
- "Conversar" / "Volver" como opciones naturales

### Bloque 3 — Evolución + La Red (pantallas 15-19)

#### P15 — Fractura (Evolución)
- **El momento más dramático**
- La pantalla se llena de luz
- La respiración de Reggie se acelera
- Partículas convergen → explosión de vida (no de energía mecánica)
- Como una flor que abre, no una bomba que explota
- Texto narrativo por etapa — introspectivo, no épico:
  - F1: "Algo cambió en mí..."
  - F2: "La conexión se profundiza..."
  - F3: "Ya no soy lo que era..."
  - F4: "La forma final..."
- El mundo gana color permanente después de cada fractura

#### P16 — Social (La Red)
- "La Red" — otros regeneradores de mundos
- Si no registrado: invitación suave, no un wall
- Feed de actividad como susurros de otros viajeros
- Mensajes como "pulsos" — breves, con intención

#### P17 — Leaderboard (Regeneración Global)
- No un ranking competitivo — una vista de todos los que regeneran
- Cada entrada muestra el Regenmon + su mundo en miniatura
- Click → visita su mundo

#### P18 — Mi Perfil
- Tu espacio en La Red
- Reggie en su mundo, stats, memorias count
- Cómo te ven los demás viajeros

#### P19 — Perfil Público
- Visitar el mundo de otro
- Ver su Reggie, su progreso, su etapa
- Acciones: alimentar, regalar, enviar pulso
- Respeto — estás visitando el viaje de alguien más

---

## Implementación

### Fase 1 — Concepto Visual (HTML)
- Archivo: `public/redesign-v5.html`
- Desktop-first (1280px mínimo, responsive como bonus)
- Solo dark mode
- Pantallas clave primero: P3 (Title), P9 (World), P12 (Chat), P15 (Fractura)
- Objetivo: capturar la EMOCIÓN, no completar todas las pantallas

### Fase 2 — Todas las Pantallas
- Completar las 19 pantallas en HTML
- Revisar con w4rw1ck pantalla por pantalla

### Fase 3 — Next.js Migration
- Extraer design system a CSS/componentes
- Integrar con lógica existente

### Fase 4 — Polish
- Animaciones finales
- Música/sonido ambiental
- Performance
- Assets finales (sprites, fondos, texturas)

---

## Notas

- **Desktop-first** — diseñar para 1280px+. Responsive es bonus, no prioridad.
- **Solo dark mode** — no hay light theme.
- **Preview-first:** nada se implementa en Next.js sin aprobación en HTML.
- **Emoción antes que función:** si una pantalla no transmite algo, no está lista.
- **Los sprites evolucionan:** el estilo de los sprites de Reggie debe alinearse con esta nueva dirección (no pixel art puro — algo más orgánico, ilustrado).
- **El color es narrativo:** el mundo empieza gris/apagado y gana color con el progreso, inspirado en Gris.
