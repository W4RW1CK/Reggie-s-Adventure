# 🌿 REDESIGN_SPEC — Reggie's Adventure
> **Versión:** v3.0 — "El Replan Final"
> **Última actualización:** 2026-02-28
> **Autor:** w4rw1ck + Aibus
> **Estado:** DIRECCIÓN COMPLETA — listo para construir
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

**Eco-brutalismo digital:** la naturaleza sobreponiéndose a las estructuras humanas.
**Tecnología como proceso alquímico:** cada interacción es transformación.
**Compañero de viaje:** Reggie no es una mascota — es quien camina contigo.

Para todo aquel dispuesto a emprender ese viaje.

---

## Referencias Fundacionales

| Juego | Qué tomamos |
|-------|------------|
| **Journey** | La relación con el compañero, la esperanza silenciosa, las ruinas de algo que fue. Social no competitivo — encontrar huellas de otros viajeros. |
| **Ori and the Blind Forest** | La naturaleza regenerándose, la luz que vuelve, el mundo que revive conforme avanzas. |
| **Rain World** | Eco-brutalismo puro. Estructuras industriales abandonadas con vegetación creciendo entre las ruinas. |
| **Gris** | Narrativa cromática — el color como progresión emocional. Poesía visual en cada detalle. |
| **Kirby's Adventure** | Atmósfera onírica donde hasta lo oscuro se siente cálido y amigable. |
| **Hollow Knight** | Inmersión melancólica con esperanza. Un mundo que te envuelve. |

---

## Los Tres Tipos de Reggie

Ya no son elementos clásicos. Son **formas de regeneración** — estados de la materia/energía:

### 🔥 Brasa
Lo que queda después del fuego. No destruye, calienta. Regenera con calor.
- **Reggie:** Luz cálida pulsante, como carbón vivo
- **Partículas:** Chispas flotantes, ceniza cálida
- **Mundo:** Fábricas con calor residual, metal que aún brilla, grietas con luz naranja
- **Paleta:** `--amber` → `--ember`

### 🌫️ Niebla
Presencia sutil, lo cubre todo. Regenera ocultando lo feo, revelando lo esencial.
- **Reggie:** Forma difusa, casi transparente, se expande y contrae
- **Partículas:** Volutas de vapor, gotitas suspendidas
- **Mundo:** Estructuras cubiertas de neblina, visibilidad limitada, siluetas misteriosas
- **Paleta:** `--mist` → `--ghost`

### 💎 Cristal
Crece lento, se forma con presión. Regenera con estructura.
- **Reggie:** Facetas de luz, geometría orgánica, refracta colores
- **Partículas:** Fragmentos de prisma, destellos
- **Mundo:** Servidores con cristales creciendo entre circuitos, formaciones minerales
- **Paleta:** `--frost` → `--glow`

---

## Reggie — El Compañero

**Apariencia:** Presencia luminosa entre orgánico y digital. Se funde entre tecnología, magia y regeneración en su estado más puro. NO tiene cara — las emociones se expresan a través de:
- Intensidad de su luz
- Color de sus partículas
- Ritmo de su "respiración" (expansión/contracción)
- Velocidad y amplitud de su movimiento

**Estados emocionales:** 8 estados (Eufórico → Crítico) expresados mediante:
- Partículas alrededor (cantidad, velocidad, brillo)
- Color (saturado = bien, apagado = mal)
- Movimiento (rápido/amplio = bien, lento/mínimo = mal)
- Respiración (rítmica = bien, errática o casi detenida = mal)

**Evolución:** Sutil. Reggie gana detalles y complejidad gradualmente, pero los cambios no son bruscos. El protagonista del avance es el mundo, no Reggie.

**Stats que descuidas → Reggie pierde color.** Independiente del mundo — puedes tener un mundo colorido pero un Reggie apagado si lo descuidas.

**Estilo de arte:** Entre watercolor y digital painting. Generado con IA (Gemini).

---

## El Mundo

### Eco-Brutalismo Digital
Tres capas de realidad en cada paisaje:
1. **El Mundo Natural** — fondos orgánicos, texturas de musgo/piedra/agua, vida que crece
2. **Los Restos Digitales** — fragmentos de código como ruinas en el fondo. Presencia moderada — visible pero no saturante. `// here we dreamed`
3. **La Alquimia** — donde naturaleza y tecnología se funden: enredaderas sobre circuitos, agua fluyendo por cables, cristales creciendo en servidores

### Ambientes por Tipo (eco-brutalistas)
- 🔥 **Brasa:** Fábricas abandonadas con calor residual. Metal que aún brilla entre grietas. Vegetación resistente al calor creciendo entre maquinaria.
- 🌫️ **Niebla:** Estructuras cubiertas de neblina. Siluetas misteriosas de lo que fue. Agua condensándose sobre superficies frías.
- 💎 **Cristal:** Centros de datos abandonados. Cristales creciendo entre servidores y circuitos. Formaciones minerales donde antes había cables.

### Parallax
Fondos con capas de profundidad (mínimo 2-3 capas: fondo lejano, medio, cercano). No plano.

### Ciclo Día/Noche + Clima
Explorar implementación. El mundo no es estático — tiene vida propia.

### Narrativa Cromática
- **NO empieza en escala de grises literal**
- Empieza apagado, sin vida, abandonado
- Conforme avanzas: colores ganan saturación, tonalidades se expanden, "vida" crece
- **Progresión continua y gradual** — no etapas rígidas
- Basada en progreso total (todo contribuye: mensajes, fotos, misiones)

### Fracturas = El Mundo se Rompe/Regenera
Las fracturas ya no son evoluciones de Reggie. Son **momentos dramáticos del mundo**:
- Se rompe algo viejo (pared industrial, techo de concreto)
- Entra luz, crece vegetación, fluye agua
- Salto visible de regeneración
- Reggie reacciona (brilla más, se expande) pero el protagonista es el entorno

---

## Design System

### Paleta

| Token | Hex | Uso | Nota |
|-------|-----|-----|------|
| `--void` | `#0d1117` | Fondo base | Casi negro con calidez |
| `--moss` | `#2d5a3d` | Naturaleza, crecimiento, salud | Verde bosque profundo |
| `--lichen` | `#7fb069` | Vida, regeneración, acentos positivos | Verde claro orgánico |
| `--amber` | `#d4a574` | Calidez, terminal antigua, nostalgia | Ámbar de resina fosilizada |
| `--rust` | `#8b4513` | Ruinas, decay, lo que fue | Óxido de estructuras abandonadas |
| `--mist` | `#b8c4d0` | Texto principal, claridad | Niebla de montaña |
| `--ghost` | `#5a6670` | Texto secundario, susurros | Presencia tenue |
| `--glow` | `#e8d5b7` | Highlights, momentos de conexión | Luz de vela, luna |
| `--water` | `#4a90d9` | Datos, flujo | Agua de río limpio |
| `--ember` | `#c75b39` | Brasa-type, pasión, transformación | Brasa que aún vive |
| `--frost` | `#9bb8d3` | Cristal-type, calma, reflexión | Escarcha al amanecer |

Los colores de tipo tiñen sutilmente todo el mundo — no son solo acentos, son la atmósfera.

### Tipografía

| Uso | Fuente | Razón |
|-----|--------|-------|
| Títulos / momentos importantes | `Crimson Text` | Serif con carácter — evoca libros antiguos |
| Cuerpo / UI | `Inter` | Limpia, legible, desaparece — deja que el arte hable |
| Terminal / alquimia | `JetBrains Mono` | Monospace con alma — código como magia |

### Espaciado
La UI respira. Generoso whitespace. Nada apretado. Los elementos flotan como objetos en agua tranquila.

### Animaciones
Todo se mueve como la naturaleza: lento, orgánico, con propósito.

| Tipo | Duración | Easing |
|------|----------|--------|
| Aparición | 800ms-1200ms | `ease-out` |
| Respiración | 4s-6s | `ease-in-out` |
| Transición de pantalla | 600ms | `ease-in-out` |
| Microinteracción | 200ms-400ms | `ease-out` |

**NO:** transiciones bruscas, parpadeos, glitch, shake.
**SÍ:** fade, float, breathe, grow, dissolve.

### Elementos Visuales

| Elemento | Descripción |
|----------|-------------|
| **Partículas orgánicas** | Esporas, semillas flotantes, polvo de luz |
| **Vignette atmosférica** | Bordes oscurecidos, como mirar a través de un bosque |
| **Texturas sutiles** | Ruido orgánico en fondos, como piedra desgastada |
| **Enredaderas / raíces** | Decorativas, crecen sobre containers de UI |
| **Agua / reflejos** | En fondos y transiciones — calma, flujo |
| **Luz volumétrica** | Rayos de luz atravesando niebla — momentos de esperanza |
| **Fragmentos de código** | Como ruinas: `// here we dreamed` — pedazos de lo que fue |

### Componentes UI

Estilo: mezcla de **bordes suaves/difusos** + **texturas orgánicas** (piedra pulida, pergamino desgastado).

| Componente | Descripción |
|------------|-------------|
| `organic-container` | Bordes suaves, sombra difusa, textura de piedra pulida |
| `moss-button` | Hover que "crece" como musgo |
| `breath-indicator` | Stats que pulsan como respiración — visibles pero integrados al mundo |
| `mist-overlay` | Modal con backdrop de niebla |
| `vine-divider` | Separador orgánico (no línea recta) |
| `terminal-whisper` | Texto monospace letra por letra — la terminal hablando |
| `glow-moment` | Highlight para momentos de conexión — luz cálida |

### Navegación
Orgánica, integrada en la atmósfera. No una barra rígida — elementos del mundo que puedes tocar. Los stats son visibles pero no disonantes con el entorno.

---

## Pantallas (12)

### Bloque 1 — Llegada (pantallas 1-6)

#### 1. Despertar (loading + fullscreen)
- El mundo emerge desde la oscuridad
- Raíz que crece como indicador de carga
- Susurro: "Este viaje se vive mejor a pantalla completa"
- Partículas de esporas flotando
- Sin prisa — la carga misma es contemplativa

#### 2. Umbral (title)
- "Reggie's Adventure" en Crimson Text
- Paisaje lejano con niebla, siluetas de ruinas con vegetación
- "Comenzar" — no "Press Start"
- Música ambiental melancólica si está habilitada

#### 3. El Origen (historia)
- Texto del lore emerge del mundo — no en una caja de terminal
- `terminal-whisper` pero integrado en el paisaje
- Partículas de luz tenues
- El texto respira entre líneas
- Establece el tono de todo el viaje

#### 4. Acceso (login — overlay)
- `mist-overlay` sobre Umbral
- Google, Email, Passkey
- "Explorar sin cuenta" como opción válida, no secundaria
- Sin presión

#### 5. Elección (creación)
- "Elige a tu compañero"
- 🔥 Brasa — aura cálida, chispas, frase sobre calidez
- 🌫️ Niebla — aura difusa, vapor, frase sobre sutileza
- 💎 Cristal — aura prismática, destellos, frase sobre estructura
- Campo de nombre con espacio generoso
- "Despertar" como acción final

#### 6. Nacimiento (transición)
- El mundo se oscurece suavemente
- "Está despertando..."
- Luz crece desde el centro
- Partículas convergen hacia donde aparecerá Reggie
- Fade a El Mundo

### Bloque 2 — El Viaje (pantallas 7-9)

#### 7. El Mundo (home + memorias + ajustes)
- **El corazón de la experiencia**
- Reggie centrado, idle animation orgánica (respiración, movimiento sutil)
- Fondo: paisaje eco-brutalista según tipo + nivel de regeneración
- Parallax con capas de profundidad
- HUD: stats como `breath-indicator` — visibles, integrados al mundo
- Navegación orgánica: Chat / Captura / La Red
- Memorias accesibles como diario integrado (no pantalla aparte)
- Ajustes como panel lateral que emerge como niebla
- Tutorial: NO modal — susurros contextuales al interactuar por primera vez
- El mundo cambia gradualmente con el progreso (más color, más vida)

#### 8. Diálogo (chat)
- La conversación con tu compañero de viaje
- Fondo sutil del world, desenfocado
- Burbujas suaves con bordes orgánicos, texturas de piedra/pergamino
- Respuestas de Reggie con `terminal-whisper`
- Stats compactos pero presentes
- Espacio generoso entre mensajes — no es WhatsApp

#### 9. Captura (cámara + resultado)
- "Reggie quiere ver tu mundo"
- Flujo único: abres cámara → tomas foto → Reggie reacciona
- Efecto watercolor sobre la foto para integrarla al estilo
- Marco orgánico
- Reggie reacciona con animación según resonancia
- Entry del diario aparece — esta foto es ahora una memoria
- "Conversar" / "Volver" como opciones naturales

### Bloque 3 — Regeneración + La Red (pantallas 10-12)

#### 10. Fractura (el mundo se rompe/regenera)
- **El momento más dramático**
- Algo viejo se rompe — pared industrial, techo de concreto
- Entra luz, crece vegetación, fluye agua
- Como una flor que abre, no una bomba que explota
- Reggie reacciona (brilla más) pero el protagonista es el mundo
- Texto narrativo introspectivo:
  - F1: "Algo cambió aquí..."
  - F2: "La luz encuentra camino..."
  - F3: "Lo viejo cede. Lo nuevo crece."
  - F4: "El mundo recuerda lo que era."
- El mundo gana color permanente después de cada fractura

#### 11. La Red (social + tu presencia)
- NO competitivo — contemplativo
- Como encontrar huellas de otros viajeros
- Tu presencia en La Red: tu Reggie en su mundo
- Feed de actividad como susurros de otros regeneradores
- Mensajes como "pulsos" — breves, con intención
- Requiere estudio profundo para la implementación final

#### 12. Otro Viajero (perfil público)
- Visitar el mundo de otro regenerador
- Ver su Reggie, su progreso, la vida de su mundo
- Acciones: alimentar, regalar, enviar pulso
- Respeto — estás visitando el viaje de alguien más

---

## Implementación

### Fase 1 — Concepto Visual (HTML)
- Archivo: `public/redesign-v5.html`
- Desktop-first (1280px mínimo, escala hasta 1920px)
- Solo dark mode
- Pantallas clave primero: **Umbral**, **El Mundo**, **Diálogo**, **Fractura**
- Objetivo: capturar la EMOCIÓN, no completar todas las pantallas

### Fase 2 — Todas las Pantallas
- Completar las 12 pantallas en HTML
- Revisar con w4rw1ck pantalla por pantalla

### Fase 3 — Next.js Migration
- Extraer design system a CSS/componentes
- Integrar con lógica existente

### Fase 4 — Polish
- Animaciones finales
- Música/sonido ambiental melancólico (generado con IA)
- Performance
- Assets finales (Reggie, fondos, texturas — generados con Gemini)

---

## Producción

- **Assets:** generados con IA (Gemini) — Reggie, fondos, elementos
- **Música:** ambient melancólico, generado con IA (prompts con ayuda de Aibus)
- **Resolución:** 1280px min → escala a 1920px
- **Solo dark mode** — no hay light theme
- **Desktop-first** — responsive como bonus
- **Preview-first:** nada se implementa en Next.js sin aprobación en HTML
- **Emoción antes que función:** si una pantalla no transmite algo, no está lista

---

## Pendientes

- [ ] **La Red** — definir mecánica no-competitiva en profundidad
- [ ] **Ciclo día/noche + clima** — definir implementación
- [ ] **Generar assets** — Reggie (3 tipos × estados), fondos (3 ambientes × niveles de regeneración)
- [ ] **Música** — generar ambient melancólico con prompts de IA
