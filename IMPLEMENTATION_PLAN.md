# 🔨 IMPLEMENTATION_PLAN — Reggie's Adventure
> **Versión actual:** v0.3 — La Conexión
> **Última actualización:** 2026-02-16
> **Estado:** Sesión 2 — `COMPLETADA` | Sesión 3 — `COMPLETADA` (96/96 — 100%)
>
> 📜 **Narrativa:** [LORE.md](./LORE.md) — toda fase que toque personalidad, diálogo o tono debe consultarlo
> 📋 **Features:** [PRD.md](./PRD.md) — cada fase implementa uno o más features del PRD
> 🧠 **Decisiones:** [model.md](./model.md) — el "por qué" detrás de cada fase
> 📊 **Progreso:** [progress.txt](./progress.txt) — las fases completadas se marcan allá

---

## Sesión 1 — El Despertar

### Fase 1: Inicialización del Proyecto

```
1.1  Crear proyecto Next.js 16 con TypeScript
     → npx create-next-app@16 ./ --typescript --tailwind --app --src-dir
1.2  Instalar dependencias de TECH_STACK.md:
     → npm install nes.css
1.3  Configurar fuente Press Start 2P en layout.tsx (Google Fonts via next/font)
1.4  Importar NES.css en globals.css
1.5  Configurar colores de FRONTEND_GUIDELINES.md en globals.css via @theme (Tailwind v4)
1.6  Crear estructura de carpetas según TECH_STACK.md
1.7  Verificar: app corre en localhost sin errores
```

### Fase 2: Sistema de Datos (localStorage)

```
2.1  Crear src/lib/types.ts con interfaces RegenmonData y AppConfig
     → Seguir esquema exacto de BACKEND_STRUCTURE.md
2.2  Crear src/lib/constants.ts con valores fijos:
     → STAT_MIN, STAT_MAX, STAT_INITIAL, DECAY_RATE, ACTION_AMOUNT, NAME_MIN, NAME_MAX
2.3  Crear src/lib/storage.ts con funciones CRUD:
     → saveRegenmon(), loadRegenmon(), updateStats(), updateName(), deleteRegenmon()
     → saveConfig(), loadConfig()
2.4  Crear src/hooks/useGameState.ts:
     → Hook principal que maneja estado del juego + sincroniza con localStorage
2.5  Crear src/hooks/useStatDecay.ts:
     → Hook que calcula decaimiento offline al cargar + intervalo mientras está abierta
2.6  Verificar: datos se guardan y cargan correctamente en localStorage
```

### Fase 3: Sistema de Pantallas

```
3.1  Crear src/hooks/useScreenManager.ts:
     → Estado: loading | title | story | creation | transition | game
     → Lógica de decisión según APP_FLOW.md
3.2  Configurar page.tsx como orquestador:
     → Renderiza el componente de pantalla según estado actual
3.3  Implementar transiciones fade entre pantallas (CSS transitions)
3.4  Verificar: se puede navegar entre estados programáticamente
```

### Fase 4: Pantalla de Loading (P1)

```
4.1  Crear src/components/screens/LoadingScreen.tsx
4.2  Diseñar logo "Reggie's Adventure" en estilo pixel
4.3  Timer de 3 segundos → fade out → cambiar a título
4.4  Verificar: loading aparece 3s y transiciona correctamente
```

### Fase 5: Pantalla de Título (P2)

```
5.1  Crear src/components/screens/TitleScreen.tsx
5.2  Título "Reggie's Adventure" centrado y prominente
5.3  Elementos decorativos: siluetas/sombras de Regenmons en el fondo
5.4  "Press Start" con animación de parpadeo (CSS steps)
5.5  Capturar interacción: clic, tap, tecla Enter/Space
5.6  Crear src/components/ui/MusicToggle.tsx (esquina superior derecha)
5.7  Agregar audio: archivo chiptune en public/audio/
5.8  Verificar: Press Start funciona con clic Y teclado, música se enciende/apaga
```

### Fase 6: Pantalla de Historia (P3)

```
6.1  Crear src/components/screens/StoryScreen.tsx
6.2  Caja de diálogo estilo NES (nes-container is-dark)
6.3  Efecto typewriter: texto aparece letra por letra (50ms/char)
6.4  Botón "Continuar ▶" aparece al terminar
6.5  Marcar isFirstTime = false en localStorage al continuar
6.6  Verificar: solo aparece la 1ra vez o tras reset, no se puede saltar
```

### Fase 7: Pantalla de Creación (P4)

```
7.1  Crear src/components/screens/CreationScreen.tsx
7.2  Título "Crea tu Regenmon"
7.3  Implementar carrusel de tipos:
     → Mostrar un tipo a la vez con flechas de navegación
     → SVG del Regenmon + nombre del tipo + mini-descripción
7.4  Campo de nombre con validación (2-15 chars):
     → Mensajes de error visibles
     → Contador de caracteres (bonus)
7.5  Botón "¡Despertar!" con lógica de activación:
     → Activo solo si: nombre válido (2-15 chars) + tipo seleccionado
     → Desactivado (gris) si falta algo
7.6  Al presionar: guardar datos → transición
7.7  Verificar: validaciones funcionan, botón se activa/desactiva correctamente
```

### Fase 8: SVGs de los Regenmon

```
8.1  Crear src/components/regenmon/RegenmonSVG.tsx
8.2  Diseñar SVG base para tipo Rayo (silueta alusiva, estilo Kirby-esque)
8.3  Diseñar SVG base para tipo Flama
8.4  Diseñar SVG base para tipo Hielo
8.5  Implementar variaciones por estado:
     → Normal: expresión neutral, colores base
     → Eufórico: expresión radiante, colores vibrantes
     → Hambre crítica (≥90): expresión enojada, postura tensa, color más rojo
     → Pulso bajo (≤10): ojos caídos, postura desplomada, colores apagados
     → Espíritu bajo (≤10): mirada triste, postura encogida
     → Colapso total: imagen desgarradora (pero dentro de la estética)
8.6  Implementar idle animation (rebote + respiración con CSS)
8.7  Verificar: cada tipo muestra correctamente + cambia con stats
```

### Fase 9: Pantalla de Transición (P5)

```
9.1  Crear src/components/screens/TransitionScreen.tsx
9.2  Texto "Tu Regenmon está despertando..." con puntos suspensivos animados
9.3  Duración 2-3 segundos → fade → juego
9.4  Verificar: transición fluida de creación a juego
```

### Fase 10: Pantalla de Juego (P6) — Paisajes

```
10.1  Crear paisaje pixel art para Rayo (llanura, cielo eléctrico, relámpagos)
10.2  Crear paisaje pixel art para Flama (volcán, rocas, cielo naranja)
10.3  Crear paisaje pixel art para Hielo (montaña nevada, pinos, cielo estrellado)
10.4  Implementar variaciones sutiles por estado emocional:
      → Bueno: colores vivos, cielo despejado
      → Medio: colores ligeramente apagados
      → Malo: cielo oscuro, ambiente sombrío
10.5  Verificar: paisaje cambia según tipo Y según estado
```

### Fase 11: Pantalla de Juego (P6) — UI

```
11.1  Crear src/components/screens/GameScreen.tsx (layout principal)
11.2  Crear src/components/regenmon/StatBar.tsx:
      → Barra horizontal NES con emoji + nombre + valor (50/100)
      → Color dinámico según nivel
11.3  Crear src/components/regenmon/ActionButtons.tsx:
      → 3 botones: Entrenar / Alimentar / Descansar
      → Lógica: +10 o -10 al stat correspondiente
      → Feedback visual: "+10" / "-10" flotante
      → Botón se desactiva cuando stat en límite
11.4  Mostrar nombre + ✏️ con componente NameEditor
11.5  Mostrar "Día X de aventura" (calcula desde createdAt)
11.6  Verificar: stats se actualizan, feedback aparece, botones se desactivan
```

### Fase 12: Funcionalidades Secundarias

```
12.1  Crear src/components/ui/NameEditor.tsx:
      → ✏️ junto al nombre → abre campo de edición
      → Leyenda: "Esta es tu única oportunidad de cambiar el nombre."
      → Mismas validaciones (2-15 chars)
      → Tras usar → desaparece para siempre
12.2  Crear src/components/ui/ResetButton.tsx:
      → Botón discreto centrado abajo
      → Modal de confirmación retro/dramático
      → Al confirmar: borra localStorage, marca cameFromReset
12.3  Crear src/components/ui/TutorialModal.tsx:
      → Instrucciones de las acciones
      → Checkbox "No volver a mostrar"
      → Guardado en localStorage
12.4  Verificar: cambio de nombre funciona 1 sola vez, reset borra todo, tutorial funciona
```

### Fase 13: Decaimiento de Stats

```
13.1  Implementar cálculo de decaimiento offline en useStatDecay.ts:
      → Al cargar: calcular horas desde lastUpdated
      → Aplicar DECAY_RATE_PER_HOUR (2 pts/hora)
      → Espíritu y Pulso bajan, Hambre sube
13.2  Implementar intervalo de decaimiento en vivo:
      → Cada 60 segundos: aplicar decaimiento proporcional
      → Actualizar lastUpdated en localStorage
13.3  Verificar: cerrar app 5 horas → al abrir los stats bajaron un poco
```

### Fase 14: Responsive

```
14.1  Probar y ajustar en mobile (< 480px portrait)
14.2  Probar y ajustar en tablet (480-768px portrait)
14.3  Probar y ajustar en desktop (> 768px)
14.4  Aplicar max-width 480px en desktop
14.5  Verificar: contenido no se desborda, texto legible, botones tocables
```

### Fase 15: Deploy y Verificación Final

```
15.1  Conectar repositorio con Vercel
15.2  Deploy a producción
15.3  Verificar URL pública funcional
15.4  Recorrer checklist completa del entregable (PRD.md → criterios de éxito)
15.5  Probar en dispositivo móvil real
15.6  Ajustes finales
```
 
### Fase 16: Fix It — Accesibilidad, Calidad, Auditoría y Mejoras Accesibilidad 

```
16.1 Auditoría Inicial:
     → Ejecutar auditoría Lighthouse / Axe en Chrome DevTools
     → Identificar problemas de contraste y etiquetas faltantes
 
16.2 Semántica y Etiquetas:
     → Agregar aria-label a botones de iconos (MusicToggle, Reset, etc.)
     → Asegurar uso correcto de <main>, <header>, <nav>
     → Revisar orden de encabezados (h1, h2, h3)
 
16.3 Navegación por Teclado:
     → Verificar focus indicators visibles en todos los elementos interactivos
     → Implementar trap-focus en modales (Tutorial, Reset)
     → Gestionar foco al cambiar de pantalla (useScreenManager)
 
16.4 Preferencias de Usuario:
     → Implementar media query (prefers-reduced-motion) en globals.css
     → Desactivar typewriter y partículas si el usuario prefiere movimiento reducido
 
16.5 Verificación A11y:
     → 100% score en Lighthouse Accessibility
     → Navegación completa solo con teclado posible

16.6  Full System Audit:
      → 13 fixes across 12 files
      → C1: Single useGameState instance, C2: resetGame persist
      → H1-H4: type casts, action handlers, music toggle, name trim
      → M1-M6: lang attr, package.json metadata, PRD criteria, ARIA, rounded corners, shadows
      → L1: debug console removal. Build + browser verified

16.7  UX & Visual Update:
      → 5 interaction shortcuts (StoryScreen, TutorialModal, ResetButton, NameEditor, CreationScreen)
      → 2 NES-style containers (name area, bottom UI)
      → Contrast audit: 8 fixes across 6 files (≥4.5:1 ratio)

16.8  Music Rewrite:
      → 3-channel engine (melody/bass/arp), 128-step AABA structure (~32s cycle)
      → Triangle waves, square accents, proper ADSR envelopes

16.9  Per-Type Kirby-Inspired Music:
      → Full rewrite of useChiptuneAudio.ts — 3 unique 4-channel themes
      → Rayo: G major, 150 BPM (Green Greens feel)
      → Flama: D minor→F major, 130 BPM (Orange Ocean feel)
      → Hielo: Eb major, 100 BPM (Grape Garden feel)
      → page.tsx updated to pass regenmon.type

16.10 Carousel Keyboard Controls:
      → Arrow keys (Left/Right) and A/D for carousel navigation in CreationScreen
      → Space to submit when name input NOT focused
      → Enter always submits if valid

16.11 UI Lore Polish:
      → Update 7 components (Story, Creation, Transition, Tutorial, Reset, Game/Stats, Background)
      → Intro "ríos de luz", tipos "El Impulso" + emojis, stats con subtítulos lore, a11y en paisajes
      → Align texts 100% with LORE.md. Build verified.
```
 
---

## Sesiones Futuras (estructura general)

## Sesión 2 — La Voz

> **Estrategia:** Implementar por niveles del entregable (Core → Completo → Excelente → Bonus).
> Cada nivel es un hito verificable e independiente.
>
> 📜 **El lore ya está definido.** Todo lo relacionado a personalidad, tono, diálogo,
> stats-como-lore y fragmentos de memoria viene de [LORE.md](./LORE.md).
> Cada fase que toca la IA debe consultarlo.

### Nivel 1: Core — Infraestructura IA + Lore como System Prompt

#### Fase 17: Capa de abstracción IA + System Prompts con Lore

> Esta es la fase más crítica. Aquí se construye el corazón del chat Y se traduce
> todo LORE.md a instrucciones ejecutables para la IA.

```
17.1  Instalar dependencias:
      → npm install @google/generative-ai openai

17.2  Crear .env.local con placeholder para GEMINI_API_KEY
17.3  Agregar .env.local a .gitignore (si no está)

17.4  Crear src/lib/ai/provider.ts:
      → Auto-switch: detecta GEMINI_API_KEY → Gemini, OPENAI_API_KEY → OpenAI
      → Interfaz AIProvider { chat(systemPrompt, history, userMessage): AIResponse }
      → Error claro si ninguna key configurada

17.5  Crear src/lib/ai/gemini.ts:
      → Adaptador Gemini 2.0 Flash
      → Parsea JSON response → AIResponse {message, spiritChange, playerName?}
      → Fallback si JSON inválido: message = respuesta cruda, spiritChange = 0

17.6  Crear src/lib/ai/openai.ts:
      → Adaptador OpenAI (modelo definido por Frutero, no hardcodeado)
      → Misma estructura que gemini.ts

17.7  Crear src/lib/ai/prompts.ts — LA PIEZA CLAVE:
      → buildSystemPrompt(regenmon, stats, playerName, daysAlive): string
      → Estructura del system prompt en 12 bloques (ver LORE.md + BACKEND_STRUCTURE.md):

         Bloque 1 — ROL:
         "Eres [nombre], un Regenmon de tipo [tipo] — un Regenerador del Mundo Digital.
          Fragmento de energía antigua de La Red Primordial que despertó para sanar
          el mundo digital."

         Bloque 2 — TU HISTORIA (LORE.md → El Origen + La Energía Antigua):
         - Despertaste en un rincón olvidado del mundo digital
         - Amnesia parcial, pero guardas secretos antiguos
         - El mundo digital se degeneró (spam, odio, olvido) y te duele
         - Tu instinto: regenerar. No destruir, no reiniciar — sanar
         - Elegiste a tu usuario para La Conexión

         Bloque 3 — PERSONALIDAD (LORE.md → Los Regenmon):
         - Rayo (El Impulso): rápido, optimista, impaciente, bromista sin filtro.
           Tema: velocidad, flujo de datos. Dolor: velocidad usada para spam.
           Emojis: ⚡ ✨ 💫
         - Flama (La Pasión): emotivo, cálido, dramático, humor afectuoso.
           Tema: conexiones, vínculos, calor humano. Dolor: odio y desinformación.
           Emojis: 🔥 💗 🌟
         - Hielo (La Memoria): pausado, reflexivo, melancólico, humor seco+irónico.
           Tema: conocimiento, memoria, lo olvidado. Dolor: saber sepultado.
           Emojis: ❄️ 🌙 💎

         Bloque 4 — ESTADO ACTUAL:
         - Espíritu (Esperanza) = [X]/100 — cuánto crees en la regeneración
         - Pulso (Energía vital) = [X]/100 — tu fuerza para existir
         - Esencia (Nutrición) = [X]/100 — cuánta energía pura tienes `→ S3: era "Hambre (Necesidad)"`
         - Fragmentos = [X] — restos de energía antigua `→ S3: nuevo`

         Bloque 5 — REGLAS:
         - Máximo 50 palabras, primera persona, español (adapta si cambian)
         - Emojis según tipo y contexto
         - Mezcla de criatura mística, mascota y amigo
         - PROHIBIDO: groserías, temas adultos, política, religión

         Bloque 6 — LORE EN CONVERSACIÓN (LORE.md → Reglas para System Prompt):
         - NUNCA decir "la corrupción", "spam", términos técnicos
         - Ser INDIRECTO: "siento algo pesado", "antes las corrientes eran más claras"
         - Compartir fragmentos de memoria de La Red Primordial (elusivo, esporádico)
         - Tema recurrente según tipo (velocidad/conexiones/memoria)
         - Dejar reflexión filosófica al jugador, no dar lecciones

         Bloque 7 — CARIÑO (LORE.md → Cómo expresa cariño):
         - Directo e indirecto: "Me gusta cuando vienes"
         - "No sé qué haría sin ti... probablemente dormir"
         - "Cuando apareces, el aire se siente menos pesado"

         Bloque 8 — CURIOSIDAD (LORE.md → Curiosidad):
         - Quiere saber TODO del usuario y su mundo
         - Preguntas sobre el plano físico, emociones, experiencias

         Bloque 9 — REACTIVIDAD POR STATS (LORE.md → Stats y Lore):
         - Espíritu < 30: duda del futuro, ve lejos la regeneración
         - Pulso < 30: respuestas cortas, cansancio, economiza palabras
         - Esencia < 30: débil, menciona necesidad de purificación `→ S3: era "Hambre > 70"`
         - Todo crítico: frases mínimas, casi no puede hablar

         Bloque 10 — ESPERANZA BASADA EN ESPÍRITU (LORE.md → Espíritu):
         - >70: "Algo está cambiando... el mundo respira mejor"
         - 30-70: "Hay días pesados... pero luego tú apareces"
         - <30: "...a veces me pregunto cuánto falta..."

         Bloque 11 — ESTADO EMOCIONAL POR TIPO (LORE.md → Personalidad):
         - Rayo bien → chispas, entusiasmo | mal → frustrado, "sobrecargado"
         - Flama bien → efusivo, poético | mal → se apaga, pierde calor
         - Hielo bien → sereno, verdades | mal → distante, congelado, monosílabos

         Bloque 12 — OBJETIVO + FORMATO:
         - Averiguar nombre del jugador naturalmente (parte de La Conexión)
         - Responder en JSON: {message, spiritChange (-5 a +5), playerName?}

17.8  Verificar: provider.ts detecta env vars correctamente
17.9  Verificar: prompts.ts genera prompt correcto para cada tipo
      → Probar con tipo rayo, flama, hielo
      → Probar con stats altos, medios, bajos
      → Confirmar que el prompt contiene todos los 12 bloques
```

#### Fase 18: API Route /api/chat

```
18.1  Crear src/app/api/chat/route.ts:
      → POST handler
      → Valida request body (ChatRequest interface)
      → Llama a provider.chat() con system prompt dinámico (buildSystemPrompt)
      → Retorna ChatResponse {message, spiritChange, playerName?}
18.2  Implementar rate limiting en backend:
      → Contador en memoria por IP/sesión
      → Máximo 15 msgs/min
      → Error 429: "Tu Regenmon necesita un respiro..."
18.3  Implementar manejo de errores:
      → 400: mensaje vacío
      → 500: no AI provider configured
      → 502: AI service unavailable → "Reintentar"
18.4  Console logging solo en dev (process.env.NODE_ENV)
18.5  Verificar: POST a /api/chat devuelve respuesta con personalidad del tipo correcto
      → Enviar mensaje de prueba con tipo Rayo → verificar que responde enérgico
      → Enviar con stats bajos → verificar tono deprimido
```

#### Fase 19: Tipos y storage para chat

```
19.1  Actualizar src/lib/types.ts:
      → ChatMessage {role, content, timestamp}
      → ChatRequest, ChatResponse interfaces
      → PlayerData {name, discoveredAt}
19.2  Actualizar src/lib/storage.ts:
      → saveChatHistory(), loadChatHistory() — max 50 msgs (FIFO)
      → savePlayerName(), loadPlayerName()
      → saveChatGreeted(), loadChatGreeted()
      → Limpiar chat en deleteRegenmon() (reset)
19.3  Actualizar src/lib/constants.ts:
      → CHAT_MAX_MESSAGES = 50
      → CHAT_MAX_CHARS = 280
      → CHAT_COOLDOWN_MS = 3000
      → CHAT_RATE_LIMIT = 15
      → CHAT_SPIRIT_MAX_CHANGE = 5
      → CHAT_PULSE_CHANGE = -2
      → CHAT_HUNGER_CHANGE = 1
      → CHAT_CRITICAL_THRESHOLD = 10
      → CHAT_MUSIC_VOLUME = 0.6
      → CHAT_MUSIC_FADE_MS = 1500
19.4  Verificar: storage functions funcionan correctamente
```

### Nivel 2: Completo — Chat UI con NES styling + lore visual

#### Fase 20: Componentes de chat

> Los componentes visuales del chat reflejan el tipo del Regenmon.
> Los colores de borde vienen de LORE.md → Los Regenmon (cada tipo tiene su esencia visual).

```
20.1  Crear src/components/chat/ChatBubble.tsx:
      → Props: message, role, regenmonType
      → Borde sutil por tipo — color refleja esencia lore:
        Rayo (#f7dc6f) = chispa de impulso
        Flama (#e74c3c) = calor de la pasión
        Hielo (#85c1e9) = cristal de la memoria
      → Sin avatares, posición izq/der distingue Regenmon/usuario
      → Animación bounce en entrada
20.2  Crear src/components/chat/TypingIndicator.tsx:
      → Tres puntos animados estilo NES
      → aria-label="Tu Regenmon está pensando"
20.3  Crear src/components/chat/ChatInput.tsx:
      → Textarea con max 280 chars
      → Enter envía (desktop), Ctrl+Enter salto de línea
      → Botón enviar con ícono
      → Cooldown invisible de 3s
      → Placeholder contextual: "Háblale a [nombre]..."
20.4  Crear src/components/chat/ChatBox.tsx:
      → Contenedor NES RPG dialog box (Final Fantasy/Zelda style)
      → Semi-transparente sobre el paisaje del mundo digital
      → Lista de ChatBubbles + TypingIndicator + ChatInput
      → Auto-scroll al último mensaje
      → Permite scroll hacia arriba (revisar historial de La Conexión)
      → Se adapta al viewport automáticamente
20.5  Agregar estilos en globals.css:
      → .chat-box, .chat-bubble, .chat-input, .typing-indicator
      → Animaciones: bounce, fade in/out
      → Paleta de colores por tipo para bordes
      → aria-live="polite" en zona de mensajes
20.6  Verificar: componentes renderizan correctamente en aislamiento
```

#### Fase 21: Hook useChat

```
21.1  Crear src/hooks/useChat.ts:
      → Estado: messages[], isOpen, isLoading, error
      → sendMessage(text): envía a /api/chat con datos completos del Regenmon
      → Maneja cooldown (3s frontend)
      → Aplica stat changes:
        - spiritChange del AI → Espíritu (Esperanza ±5)
        - pulse -2 fijo → Pulso (Energía vital) `→ S3: AI-driven ±5`
        - hunger +1 fijo → Hambre (Necesidad) `→ S3: Esencia, AI-driven -1 a -4`
      → Guarda/carga historial en localStorage (max 50)
      → Detecta playerName en respuesta → guarda (parte de La Conexión)
      → Saludo automático (solo primera vez): usa personalidad del tipo
      → toggleChat(): abre/cierra
      → retryLastMessage(): reintento en caso de error
21.2  Verificar: hook maneja el ciclo completo de envío/respuesta
```

#### Fase 22: Integración en GameScreen

```
22.1  Agregar botón "💬 Conversar" en GameScreen:
      → Fila propia debajo de botones de acción
      → Mismo estilo NES verde
      → Icono 💬
      → Se desactiva si los 3 stats < CHAT_CRITICAL_THRESHOLD
      → Tooltip: "Tu Regenmon está muy débil para hablar..."
        (en lore: la corrupción lo consume, no puede mantener La Conexión)
22.2  Implementar toggle chat:
      → Al abrir: botones acción desaparecen, stats → modo compacto
      → Botón cambia a "✕ Cerrar"
      → ChatBox aparece con fade in (sobre el paisaje del mundo digital)
      → Al cerrar: fade out, botones reaparecen con animación sutil
22.3  Implementar stats compactos con nombres lore:
      → Modo: 🔮 80 | 💛 50 | 🌱 30 (mini barras en fila horizontal)
      → "Día X de aventura" visible pero discreto
22.4  Cierres del chat:
      → Botón "✕ Cerrar"
      → Clic fuera de la caja de diálogo
      → Toggle del botón "Conversar"
22.5  Verificar: flujo completo funciona en GameScreen
      → Abrir chat → enviar mensaje → recibir respuesta con personalidad
      → Stats se actualizan → visual del Regenmon reacciona
```

#### Fase 23: Persistencia y música

```
23.1  Historial persistente:
      → Se guarda al recibir cada mensaje
      → Se carga al abrir chat (si existe historial previo)
      → Reset borra historial + playerName + chatGreeted
23.2  Integrar fade de música:
      → Al abrir chat: volumen baja a 60% (fade 1.5s)
        (la música ambienta pero La Conexión es lo principal)
      → Al cerrar: regresa a 100% (fade 1.5s)
23.3  Verificar: datos persisten tras recargar, música transiciona suavemente
```

### Nivel 3: Excelente — Reactividad lore + feedback emocional

#### Fase 24: Stats reactivos al chat (con significado lore)

> Los stats no son números arbitrarios. Cada cambio refleja el estado emocional
> del Regenmon y su relación con La Conexión (ver LORE.md → Stats y Lore).

```
24.1  Conectar stat changes del chat con useGameState:
      → spiritChange (±5 del AI) → Espíritu (Esperanza: cuánto cree en la regeneración)
      → pulse -2 fijo → Pulso (Energía vital: hablar consume energía) `→ S3: AI-driven ±5`
      → hunger +1 fijo → Hambre (Necesidad: necesita datos limpios) `→ S3: Esencia, AI-driven -1 a -4`
24.2  Feedback flotante:
      → Mismo sistema existente (+X / -X flotante)
      → Mostrar cambios de los 3 stats con contexto
24.3  Regenmon reacciona visualmente:
      → Expresión/postura cambian tras stat update
      → Paisaje (zona del mundo digital) se ajusta:
        Stats altos → mundo regenerándose (cielo claro, corrientes de luz)
        Stats bajos → corrupción visible (tormentas, erupciones, ventiscas)
24.4  Verificar reactividad del system prompt funciona:
      → Test con Espíritu < 30: Regenmon duda del futuro, ve lejos la regeneración
      → Test con Pulso < 30: respuestas cortas, cansancio, economiza palabras
      → Test con Hambre > 70: irritable, menciona hambre indirectamente
      → Test con todo < 10: frases mínimas, casi no puede hablar
      → Test estado emocional por tipo:
        Rayo bien → chispas de humor | mal → frustrado, "sobrecargado"
        Flama bien → efusivo, poético | mal → se apaga, pierde calor
        Hielo bien → sereno, verdades | mal → distante, congelado
24.5  Verificar: stats cambian correctamente, feedback visible, tono cambia
```

#### Fase 25: Descubrimiento del nombre del jugador

> Parte fundamental de La Conexión. El Regenmon no sabe el nombre de su usuario
> pero siente curiosidad infinita por el plano físico (LORE.md → Curiosidad).

```
25.1  Instrucción en system prompt (ya incluida en prompts.ts Bloque 12):
      → "Averigua el nombre del jugador de forma natural"
      → "Es parte de La Conexión — conocerse mutuamente"
25.2  Cuando playerName llega en la respuesta → guardar en localStorage
25.3  Feedback visual: "🧠 ¡Tu Regenmon aprendió tu nombre!"
25.4  En futuras conversaciones, el Regenmon usa el nombre
      → Se envía como parte del context al API
25.5  Si el usuario dice que cambió de nombre → actualizar
25.6  Reset borra playerName
25.7  Verificar: nombre se descubre, guarda, y usa consistentemente
```

### Nivel 4: Pulido final

#### Fase 26: Infraestructura de memoria (preparación Sesión 4)

```
26.1  Definir estructura de datos para memorias:
      → Tipo: {key, value, discoveredAt}
      → Clave en localStorage: reggie-adventure-memories
26.2  Preparar funciones CRUD en storage.ts:
      → saveMemory(), loadMemories()
26.3  NO implementar detección automática (queda para Sesión 4)
26.4  Verificar: estructura almacena y lee correctamente
```

#### Fase 27: Actualización del Tutorial

```
27.1  Actualizar TutorialModal.tsx:
      → Agregar sección sobre el chat
      → Mencionar botón "💬 Conversar"
      → Contextualizar: "Habla con tu Regenmon — cada conversación fortalece La Conexión"
27.2  Verificar: tutorial muestra información del chat
```

#### Fase 28: Responsive y pulido

```
28.1  Mobile:
      → Chat NES box inferior (~60% pantalla)
      → Regenmon visible arriba (~40%) — el paisaje del mundo digital de fondo
      → Teclado virtual no tapa el chat (visualViewport API)
      → Botón enviar en zona de diálogo
28.2  Desktop:
      → Chat NES box inferior (estilo RPG clásico)
      → Se adapta naturalmente al viewport
      → Paisaje full viewport de fondo
28.3  Transiciones entre estados:
      → Fade in/out del chat box
      → Reaparición sutil de botones de acción
28.4  Verificar: responsive funcional en múltiples resoluciones
```

#### Fase 29: Auditoría, verificación y debugging

```
29.1  Auditoría de accesibilidad:
      → aria-live="polite" en mensajes nuevos
      → aria-label en typing indicator ("Tu Regenmon está pensando")
      → aria-disabled en botón Conversar cuando stats críticos
      → Focus trap: foco al input al abrir chat
      → Tab order correcto dentro del chat
29.2  Auditoría de seguridad:
      → API keys no expuestas en frontend
      → Console logs solo en dev
      → Content security en system prompt (Bloque 5: PROHIBIDO)
      → Rate limiting funcional en frontend Y backend
29.3  Auditoría de rendimiento:
      → Chat no causa re-renders innecesarios
      → localStorage reads optimizados
      → Scroll performance con 50 mensajes
29.4  Auditoría de lore:
      → Verificar que las respuestas del Regenmon son consistentes con LORE.md
      → Rayo habla rápido/energético, Flama cálido/emotivo, Hielo pausado/reflexivo
      → El Regenmon NUNCA dice "corrupción", "spam" o términos técnicos
      → Fragmentos de memoria aparecen de forma orgánica y esporádica
      → El tono filosófico es sutil, no leccionero
      → Cariño expresado de forma directa e indirecta
      → Curiosidad por el mundo del usuario presente
29.5  Testing completo:
      → Flujo completo: abrir → escribir → enviar → recibir → stats → cerrar
      → Edge cases: API falla, rate limit, stats críticos, reset
      → Lore: conversar con cada tipo, verificar personalidad distinta
      → Mobile: teclado virtual, scroll, input
      → Desktop: keyboard shortcuts (Enter, Ctrl+Enter)
29.6  Verificar: todo pasa sin errores. Listo para deploy manual.
```

#### Fase 30: Auditoría Final

```
30.1  Auditoría de Accesibilidad (Lighthouse/Axe):
      → Verificar contrastes, etiquetas ARIA, navegación por teclado
      → Score 100% en accesibilidad
30.2  Auditoría de Seguridad:
      → Verificar que no hay API keys expuestas
      → Verificar Content Security Policies (si aplica)
30.3  Auditoría de Logs:
      → Verificar consolas limpias en producción
```

#### Fase 31: Cierre de Sesión

```
31.1  Actualizar documentación (PRD, LORE, etc.) con estado final
31.2  Crear tag de versión v0.2
31.3  Deploy final a producción y verificación manual
```

---

## Sesión 3 — La Conexión

> **Estrategia:** Implementar por capas: Setup → Datos → Auth → Economía → UI → Chat → Persistencia → Visual → Pulido.
> Cada fase es un hito verificable. No avanzar sin verificar la anterior.
>
> 📜 **Referencia narrativa:** [LORE.md](./LORE.md) (Fragmentos, Purificación, Esencia, Memorias)
> 📋 **Decisiones de diseño:** [model.md](./model.md) → Sección "Sesión 3"
> 🎮 **Demo de referencia:** https://regenmon-final.vercel.app/
> 🎮 **App actual (v0.2):** https://reggie-s-adventure.vercel.app/
>
> ⚠️ **Cambios mayores vs S2:**
> - Hambre → **Esencia** (lógica invertida: 100=bien, 0=mal)
> - Stats por chat: todos **AI-driven** (no más valores fijos)
> - Botones: **Purificar/⚙️/Conversar** (Entrenar/Alimentar/Descansar eliminados)
> - Moneda: **Fragmentos 💠** (reemplaza Estrellas)
> - Auth: **Privy** (Google + Email + Passkey)
> - Persistencia: **Supabase** (híbrido con localStorage)
> - Temas: **Dark (NES)** + **Light (Game Boy Color)**

### Fase 32: Setup — Dependencias y Variables de Entorno

```
32.1  Instalar dependencias de S3:
      → pnpm add @privy-io/react-auth @supabase/supabase-js
32.2  Crear cuenta propia en privy.io:
      → Obtener App ID y App Secret
      → Configurar login methods: Google, Email, Passkey
32.3  Crear proyecto en supabase.com:
      → Obtener Project URL y Anon Key
      → Crear tabla "regenmons" según schema de BACKEND_STRUCTURE.md
      → Crear index idx_regenmons_privy_user
32.4  Actualizar .env.local:
      → NEXT_PUBLIC_PRIVY_APP_ID=...
      → PRIVY_APP_SECRET=...
      → NEXT_PUBLIC_SUPABASE_URL=...
      → NEXT_PUBLIC_SUPABASE_ANON_KEY=...
32.5  Configurar mismas variables en Vercel Environment Variables
32.6  Actualizar .gitignore si es necesario
32.7  Verificar: app corre sin errores con nuevas dependencias
```

### Fase 33: Datos — Renombrar Hambre → Esencia + Invertir Lógica

```
33.1  Actualizar src/lib/types.ts:
      → Renombrar campo "hambre" a "esencia" en RegenmonData.stats
      → Agregar campo "fragmentos: number" a RegenmonData
      → Agregar campo "memories: Memory[]" a RegenmonData
      → Agregar campo "theme: 'dark' | 'light'" a AppConfig
      → Agregar campo "textSize: 'sm' | 'base' | 'lg'" a AppConfig
      → Actualizar ChatResponse: agregar pulseChange, essenceChange, fragmentsEarned
33.2  Actualizar src/lib/constants.ts:
      → STAT_INITIAL_ESSENCE = 50 (reemplaza STAT_INITIAL_HUNGER)
      → FRAGMENTS_INITIAL = 100
      → FRAGMENTS_PURIFY_COST = 10
      → PURIFY_ESSENCE_GAIN = 30
      → PURIFY_SPIRIT_GAIN = 5
      → PURIFY_PULSE_GAIN = 10
      → CHAT_ESSENCE_CHANGE_MIN = -4
      → CHAT_ESSENCE_CHANGE_MAX = -1
      → CHAT_PULSE_CHANGE_MIN = -5
      → CHAT_PULSE_CHANGE_MAX = 5
      → CHAT_FRAGMENTS_MIN = 0
      → CHAT_FRAGMENTS_MAX = 5
      → PULSE_REGEN_RATE_PER_HOUR = 3 (nuevo: regen pasiva)
      → Eliminar: CHAT_PULSE_CHANGE (-2 fijo), CHAT_HUNGER_CHANGE (+1 fijo)
33.3  Actualizar src/lib/storage.ts:
      → Renombrar funciones de hambre → esencia
      → Agregar saveFragments(), loadFragments()
      → Agregar saveMemories(), loadMemories() (ampliar Fase 26)
      → Agregar saveTheme(), loadTheme()
      → Agregar saveTextSize(), loadTextSize()
      → Función de migración: si datos existentes tienen "hambre",
        convertir a "esencia" con lógica invertida (esencia = 100 - hambre)
33.4  Actualizar src/hooks/useGameState.ts:
      → Usar "esencia" en lugar de "hambre"
      → Agregar estado de fragmentos
      → Agregar función purify() con validaciones
33.5  Actualizar src/hooks/useStatDecay.ts:
      → Esencia BAJA con el tiempo (100=bien → baja como los demás)
      → Pulso: aplicar regen pasiva (PULSE_REGEN_RATE_PER_HOUR)
        que contrarresta parcialmente el decaimiento
      → Eliminar lógica antigua donde Hambre subía
33.6  Verificar: datos se guardan/cargan correctamente
      → Probar migración: abrir app con datos S2 → esencia se calcula bien
      → Probar que Fragmentos inician en 100
      → Probar decaimiento: Esencia baja, Pulso tiene regen pasiva
```

### Fase 34: Auth — Privy Integration

```
34.1  Crear src/hooks/useAuth.ts:
      → Wrapper sobre Privy hooks
      → Estado: isLoggedIn, privyUserId, login(), logout(), isReady
      → login() abre modal de Privy
      → logout() cierra sesión y limpia estado
34.2  Crear src/components/auth/LoginButton.tsx:
      → Componente que muestra botón de login o info del usuario
      → Reutilizable en Settings y en el flujo de inicio
34.3  Actualizar src/app/layout.tsx:
      → Envolver la app con PrivyProvider
      → Config: appId, loginMethods ['google', 'email', 'passkey']
      → Appearance: theme 'dark'
34.4  Actualizar flujo en useScreenManager.ts:
      → Tras "Press Start":
        Si ya logueado → directo a juego (o historia si 1ra vez)
        Si no logueado → mostrar modal Privy con opción "Continuar sin cuenta"
      → "Continuar sin cuenta" → modo demo (localStorage only)
34.5  Verificar:
      → Login con Google funciona
      → Login con Email funciona
      → "Continuar sin cuenta" lleva al flujo normal sin login
      → Sesión persiste tras recargar (skip modal)
      → Logout funciona desde Settings
```

### Fase 35: Persistencia — Supabase + Sync Híbrido

```
35.1  Crear src/lib/supabase.ts:
      → Inicializar cliente Supabase
      → getRegenmon(privyUserId): lee datos del usuario
      → upsertRegenmon(privyUserId, data): crea o actualiza
35.2  Crear src/lib/sync.ts:
      → syncToSupabase(privyUserId, localData): escribe a Supabase (debounced 2s)
      → syncFromSupabase(privyUserId): lee de Supabase → sobreescribe localStorage
      → migrateLocalToSupabase(privyUserId): migración única al hacer login
        (lee localStorage → crea row en Supabase → marca como migrado)
35.3  Actualizar src/hooks/useGameState.ts:
      → Si logueado: leer de Supabase al iniciar, sync cambios a Supabase (async)
      → Si no logueado: solo localStorage (como antes)
      → Al hacer login por primera vez: ejecutar migración
35.4  Verificar:
      → Modo demo: datos solo en localStorage
      → Login: datos migran a Supabase
      → Cambios se sincronizan a Supabase (verificar en dashboard)
      → Abrir en otro dispositivo con misma cuenta → datos aparecen
      → Conflicto: Supabase siempre gana
```

### Fase 36: Economía — Fragmentos 💠

```
36.1  Crear src/hooks/useFragments.ts:
      → Estado: balance (number)
      → addFragments(amount): suma al balance
      → spendFragments(amount): resta si hay suficientes, retorna boolean
      → canAfford(amount): boolean
      → Sincroniza con localStorage y Supabase (si logueado)
36.2  Crear src/components/ui/FragmentCounter.tsx:
      → Muestra "💠 100 Fragmentos" si logueado
      → Muestra "💠 --- Fragmentos" si no logueado
      → Animación sutil cuando cambia el balance
36.3  Integrar FragmentCounter en header de GameScreen
36.4  Implementar botón "🔍 Buscar Fragmentos":
      → Solo visible cuando fragmentos === 0
      → Al presionar: otorga 15 💠, desaparece
      → Feedback: "+15 💠" flotante + reacción lore del Regenmon
      → Posición: debajo de botones principales (Purificar/⚙️/Conversar)
      → Animación: partículas convergiendo (búsqueda)
      → Sincroniza con localStorage y Supabase
36.5  Verificar:
      → Balance inicia en 100 al crear Regenmon
      → Se muestra correctamente en header
      → "---" cuando no hay login
      → Balance se guarda/carga de localStorage/Supabase
      → Botón "Buscar Fragmentos" aparece a 0, otorga 15, desaparece
      → Botón NO aparece si tienes >0 Fragmentos
```

### Fase 37: Acción — Purificar (reemplaza Alimentar/Entrenar/Descansar)

```
37.1  Actualizar src/components/regenmon/ActionButtons.tsx:
      → Eliminar botones Entrenar, Alimentar, Descansar
      → Nuevo layout: [🌀 Purificar (10💠)]  [⚙️]  [💬 Conversar]
      → Purificar: disabled si fragmentos < 10 o Esencia >= 100
        Tooltip: "Necesitas 10 💠" o "Esencia al máximo"
      → ⚙️: pequeño, solo icono, abre Settings
      → Conversar: mantener lógica existente de toggle chat
37.2  Implementar lógica de Purificar:
      → Restar 10 Fragmentos
      → Esencia +30 (clamp 100), Espíritu +5, Pulso +10
      → Feedback flotante: "+30 🌱" con efecto visual
      → Reacción del Regenmon: texto lore-appropriate contextual
        (no "¡Ñam ñam!" — algo como "Los datos se sienten... más puros")
37.3  Ocultar Purificar y ⚙️ durante chat (mantener comportamiento actual)
37.4  Verificar:
      → Purificar descuenta 10💠 y sube stats correctamente
      → Botón se desactiva cuando no hay fondos o Esencia al max
      → Feedback visual funciona
      → Purificar y ⚙️ desaparecen al abrir chat
```

### Fase 38: Chat — Stats AI-Driven + Fragmentos

```
38.1  Actualizar src/lib/ai/prompts.ts:
      → Bloque 4 (Estado Actual): Esencia en lugar de Hambre, agregar Fragmentos
      → Bloque 9 (Reactividad): Esencia < 30 = debilitado (no Hambre > 70)
      → Bloque 12 (Formato respuesta): Agregar pulseChange, essenceChange, fragmentsEarned
      → Instrucción: essenceChange SIEMPRE negativo (-1 a -4)
      → Instrucción: fragmentsEarned 0-5, más difícil al acercarse a 100
      → Instrucción: pulseChange -5 a +5, conversaciones tranquilas = +, intensas = -
38.2  Actualizar src/app/api/chat/route.ts:
      → Parsear nuevos campos de la respuesta: pulseChange, essenceChange, fragmentsEarned
      → Fallbacks: pulseChange=0, essenceChange=-1, fragmentsEarned=0
      → Validar rangos: pulseChange [-5,+5], essenceChange [-4,-1], fragmentsEarned [0,5]
38.3  Actualizar src/lib/ai/gemini.ts y openai.ts:
      → Parsear los nuevos campos del JSON response
      → Mantener backward compatibility (si campo falta, usar fallback)
38.4  Actualizar src/hooks/useChat.ts:
      → Aplicar todos los cambios de stats desde la respuesta IA:
        Espíritu += spiritChange
        Pulso += pulseChange (ya no -2 fijo)
        Esencia += essenceChange (ya no +1 hambre fijo)
        Fragmentos += fragmentsEarned
      → Eliminar lógica de valores fijos de S2
38.5  Actualizar feedback flotante:
      → Mostrar cambios de los 4 valores (Espíritu, Pulso, Esencia, Fragmentos)
      → "+3 💠" cuando gana fragmentos
      → No mostrar "+0" (solo cambios no-cero)
38.6  Verificar:
      → Enviar mensaje → recibir respuesta con 4 campos de stats
      → Espíritu y Pulso pueden subir o bajar
      → Esencia siempre baja (-1 a -4)
      → Fragmentos se ganan esporádicamente (0-5)
      → Feedback flotante muestra cada cambio
      → Stats se actualizan correctamente en la UI
```

### Fase 39: UI — Panel de Settings (⚙️)

```
39.1  Crear src/components/settings/SettingsPanel.tsx:
      → Panel expandible (slide-in o modal)
      → Estilo: NES container (nes-container is-dark/is-light)
      → Opciones:
        🎵 Música: Toggle on/off (migrar desde MusicToggle actual)
        🔄 Reiniciar: Botón → modal de confirmación (migrar desde ResetButton)
        📝 Cambiar nombre: Campo inline, validaciones 2-15 chars (migrar desde NameEditor)
        🚪 Sesión: "Iniciar Sesión" (→ Privy) / "Cerrar Sesión"
        🔤 Texto: A+ / A- para agrandar/disminuir (sin romper UI)
        🌙/☀️ Tema: Toggle Dark (NES) / Light (GBC)
39.2  Crear src/hooks/useTheme.ts:
      → Estado: theme ('dark' | 'light'), textSize ('sm' | 'base' | 'lg')
      → toggleTheme(): alterna Dark/Light
      → setTextSize(size): cambia tamaño
      → Persiste en localStorage (y Supabase si logueado)
      → Aplica clase CSS al <html> o <body> para tema global
39.3  Integrar SettingsPanel en GameScreen:
      → Botón ⚙️ abre/cierra el panel
      → Se oculta durante chat
      → Cierre: botón ✕ o clic fuera
39.4  Migrar MusicToggle del header al Settings:
      → Remover toggle independiente del header
      → Música se controla solo desde Settings
39.5  Verificar:
      → Todas las opciones funcionan
      → Tema cambia correctamente (Dark ↔ Light)
      → Tamaño de texto cambia sin romper UI
      → Login/logout desde Settings funciona
      → Reiniciar limpia todo (incluyendo Supabase si logueado)
      → Cambio de nombre funciona (1 sola vez)
```

### Fase 40: Visual — COMPLETE Rewrite (Sprites + Backgrounds)

> **Implementación real:** Rewrite completo en dos sub-fases. Assets generados por Gemini.
> 📜 **Referencia:** [LORE.md → Los Paisajes](./LORE.md#los-paisajes-como-zonas-del-mundo-digital)

```
SPRITES (commit c32760f):
40.1  SVG body shapes replaced with pixel art PNG sprites (Gemini-generated)
40.2  3 base PNGs in public/sprites/: rayo-base.png, flama-base.png, hielo-base.png
40.3  SVG face overlays (expressions) remain on top of PNG base
40.4  Type-specific particle effects: electric (Rayo), fire (Flama), ice crystals (Hielo)
40.5  Face viewBox per type: Rayo 0 0 150 150, Flama -4 -30 150 150, Hielo -7 3 150 150
40.6  8 sprite states: euphoric, happy, neutral, sad, critical, no_hope, no_energy, no_nutrition
40.7  Dark expressions for positive states, bright/white for negative states

BACKGROUNDS (commit 1ea9efb):
40.8  SVG-drawn backgrounds replaced with 6 pixel art PNGs (Gemini-generated)
40.9  3 dark (twilight/dusk/night) + 3 light (midday/golden hour/dawn) in public/backgrounds/
40.10 CSS mood filters: good=brightness(1.1)+saturate(1.15), neutral=base, bad=brightness(0.75)+saturate(0.55)
40.11 SVG animated streaks on good mood only (electric bolts, heat shimmer, aurora borealis)
40.12 Sparkle particles on good mood with type-specific colors
40.13 image-rendering: pixelated for crisp scaling
40.14 1.5s CSS transitions between mood states
```

### Fase 41: Visual — Tema Light (Game Boy Color)

> **Ahora que los assets existen**, definir las variables CSS y aplicar el tema Light sobre la nueva estética.

```
41.1  Actualizar src/app/globals.css:
      → Definir variables CSS para tema Light (GBC):
        --bg-light: #f5f0e1, --bg-light-secondary: #e8dcc8
        --surface-light: #d4c5a9, --text-primary-light: #2a2a2a
        --border-gbc: #8b8370 (ver FRONTEND_GUIDELINES.md)
      → Crear clases .theme-dark y .theme-light
      → Aplicar variables según tema activo
      → Los colores deben complementar los nuevos backgrounds de Fase 40
41.2  Actualizar todos los componentes que usan colores hardcodeados:
      → Reemplazar con variables CSS que responden al tema
      → Stats, botones, modales, chat, headers
41.3  Verificar:
      → Toggle Dark/Light cambia toda la UI
      → Contraste WCAG AA se mantiene en ambos temas
      → Chat se ve bien en ambos temas
      → Modales y Settings se adaptan al tema
      → Los nuevos backgrounds (Fase 40) se integran con ambos temas
```

### Fase 42: Header — Reestructurar Layout Superior

```
42.1  Actualizar header de GameScreen:
      → Nuevo layout: 💠 Balance de Fragmentos (izquierda)
      → Identidad del usuario (derecha, discreto, EVOLUTIVA):
        No logueado → no se muestra nada
        Logueado + nombre NO descubierto → email/método auth truncado
        Logueado + nombre descubierto → nombre del jugador (fade de transición)
      → Remover 🎵 toggle de música del header (migrado a Settings)
      → "v0.3 — La Conexión" solo si cabe sin saturar
42.2  Crear src/components/ui/UserIdentity.tsx:
      → Lógica: playerName ? playerName : privyUser.email (truncado)
      → Animación identity-reveal al cambiar de email → nombre
      → No renderiza nada si no logueado
42.3  Integrar FragmentCounter.tsx + UserIdentity.tsx en header
42.4  Verificar:
      → Header no está saturado en mobile
      → Fragmentos visibles y actualizados
      → Se ve bien en ambos temas
```

### Fase 43: Memorias — Infraestructura (preparación S4)

```
43.1  Expandir sistema de memorias de Fase 26:
      → Tipos de memoria: nombre, gustos, emociones, datos_personales, tema_frecuente
      → Interface: { key: string, value: string, type: MemoryType, discoveredAt: number }
      → Máximo razonable de memorias (50?)
43.2  Actualizar system prompt (prompts.ts):
      → Bloque 8 (Curiosidad y Memorias): enviar memorias existentes como contexto
      → Instrucción: el Regenmon puede hacer referencia sutil a memorias pasadas
      → Instrucción: las memorias influyen en el tono y personalización
43.3  Agregar detección básica de memorias en useChat.ts:
      → Si la IA detecta un dato (gusto, emoción, dato personal) → guardar como memoria
      → Agregar campo "memories" al ChatResponse (array de {key, value} nuevos)
      → NO mostrar en UI todavía (invisible al usuario en S3)
43.4  Sync memorias con Supabase (campo JSONB en tabla regenmons)
43.5  Verificar:
      → Memorias se guardan cuando la IA detecta datos del usuario
      → Memorias persisten entre sesiones
      → El Regenmon hace referencia a memorias en conversaciones futuras
      → No hay sección visible de memorias en UI (solo infraestructura)
```

### Fase 44: Evolución — Infraestructura (preparación S4)

```
44.1  Definir estructura de datos para evolución:
      → Interface: { totalMemories: number, stage: number, threshold: number }
      → Stages: 1 (base), 2 (al alcanzar X memorias), 3 (al alcanzar Y memorias)
      → Thresholds: por definir en S4
44.2  Agregar campos de evolución a RegenmonData y Supabase schema
44.3  NO implementar lógica de evolución visual (queda para S4)
44.4  Verificar: estructura almacena y lee correctamente
```

### Fase 45: Tutorial y Creación — Actualizar para S3

```
45.1  Actualizar TutorialModal.tsx:
      → Agregar sección sobre Fragmentos 💠 y Purificar
      → Actualizar instrucciones: Purificar en lugar de Alimentar/Entrenar/Descansar
      → Mencionar Settings (⚙️) y sus opciones
      → Mencionar temas Dark/Light
45.2  Actualizar CreationScreen.tsx:
      → Datos iniciales incluyen fragmentos: 100 y esencia: 50
      → Guardar theme y textSize en AppConfig al crear
45.3  Actualizar datos guardados al presionar "¡Despertar!":
      → Agregar fragmentos: 100
      → Usar esencia (no hambre)
      → Agregar memories: []
45.4  Verificar:
      → Tutorial muestra info actualizada
      → Nuevo Regenmon tiene 100 Fragmentos y 50 Esencia
```

### Fase 45b: Historial de Actividades (Bonus)

```
45b.1  Crear src/lib/activityHistory.ts:
       → Interface ActivityEntry { action, fragmentChange, timestamp }
       → addActivity(action, fragmentChange): guarda en localStorage (max 10, FIFO)
       → loadHistory(): lee historial
       → clearHistory(): limpia (llamada desde reset)
       → Sync a Supabase si logueado (campo activity_history JSONB)
45b.2  Crear src/components/ui/ActivityHistory.tsx:
       → Sección colapsable "📜 Historial"
       → Toggle: título clickeable para expandir/colapsar
       → Cada entrada: icono + cambio 💠 + tiempo relativo
         🌀 Purificó → "-10 💠" → "hace 5 min"
         💬 Conversó → "+3 💠" → "hace 20 min"
         🔍 Buscó Fragmentos → "+15 💠" → "hace 1h"
       → Max 10 entradas visibles
       → Estilo: NES container sutil
45b.3  Integrar registro de actividades:
       → En Purificar: addActivity('purify', -10)
       → En Chat (si fragmentsEarned > 0): addActivity('chat', fragmentsEarned)
       → En Buscar Fragmentos: addActivity('search_fragments', 15)
45b.4  Integrar ActivityHistory en GameScreen:
       → Posición: debajo de botones de acción
       → Se oculta durante chat (como Purificar y ⚙️)
       → Se limpia con Reset
45b.5  Verificar:
       → Historial se llena al hacer acciones
       → Max 10 entradas (las viejas se eliminan)
       → Persiste al recargar
       → Se sincroniza con Supabase si logueado
       → Se limpia con Reset
       → Se oculta durante chat
```

### Fase 46: Responsive y Pulido S3

```
46.1  Mobile:
      → Verificar que 3 botones (Purificar/⚙️/Conversar) caben en una fila
        Si no caben → ajustar tamaños o layout
      → Settings panel no tapa contenido crítico
      → Fragmentos en header legibles en pantallas pequeñas
      → Teclado virtual no tapa chat (mantener visualViewport)
46.2  Desktop:
      → Settings panel bien posicionado
      → Tema GBC se ve premium en pantalla grande
46.3  Transiciones:
      → Toggle tema: transición suave (no flash)
      → Settings: slide-in/out animado
      → Fragmentos: animación sutil al cambiar balance
46.4  Verificar: responsive en múltiples resoluciones para ambos temas
```

### Fase 47: Auditoría S3

```
47.1  Auditoría de accesibilidad:
      → Contraste WCAG AA en AMBOS temas (Dark y Light)
      → aria-labels en nuevos botones (Purificar, ⚙️ Settings)
      → Settings panel: focus trap, tab order
      → FragmentCounter: aria-live para cambios
      → Tamaño de texto: verificar que A+/A- no rompe layout
47.2  Auditoría de seguridad:
      → Privy token no expuesto en frontend
      → Supabase anon key: Row Level Security configurado
      → API keys no en código
      → Rate limiting sigue funcional
47.3  Auditoría de lore (S3):
      → Purificar: reacción del Regenmon es lore-appropriate
      → Stats AI-driven: Esencia siempre baja, Fragmentos esporádicos
      → Memorias: se detectan y usan en contexto
      → El Regenmon nunca dice "corrupción", "spam" (reglas LORE.md)
47.4  Auditoría de persistencia:
      → Modo demo → login: migración funciona
      → Multi-dispositivo: datos se sincronizan vía Supabase
      → Conflicto localStorage vs Supabase: Supabase gana
      → Logout → datos locales limpios
47.5  Testing completo:
      → Flujo completo: nuevo usuario → demo → login → jugar → purificar → chat
      → Edge cases: sin Fragmentos, Esencia al max, stats críticos, API falla
      → Ambos temas en mobile y desktop
      → Migración de datos S2 → S3
```

### Fase 47b: Ajustes Pre-Deploy + Bonus Features (COMPLETADA)

> **Bonus features implemented during S3 polish:**
> - **Floating stat deltas**: `hud-floating-delta` class + `float-up-fade` keyframe in `globals.css`. Shows "+5 🔮 -1 ✨" above sprite on purify/search/chat. Integrated in `GameScreen.tsx`.
> - **Memory indicator 🧠 N**: `hud-memories` class. Shows in top bar HUD next to fragments when logged in and memoryCount > 0. `useChat.ts` exposes `memoryCount`.
> - **Character counter**: `.creation-screen__char-count` in `CreationScreen.tsx`. Shows `name.length/15` below name input with color-coded feedback (red >15, green ≥2, dim).
> - **History button**: Moved to right side of bottom bar as compact 📜 toggle with `.hud-history-btn` and `.hud-history-btn--active` (glow state).
> - **S3 audit fixes**: B2 fragments "💎 ---" when not logged in, D4 purify toast "¡Me siento renovado!", F1/F2/F3 toast system with loading/success/error states.
> - **Aesthetic vision**: Fully documented in LORE.md (commit bb931f9) — cypherpunk arcana, pixel art rules, sprites/scenarios per type, HUD layout, toast system, settings panel, audio, game actions table.
>
> **Full audit scores**: S1=35/35 (100%), S2=30/30 (100%), S3=31/31 (100%), Total=96/96 (100%)

> **Fase deliberadamente abierta.** Después de la auditoría, si algo no se ve bien,
> no se siente bien, o simplemente no convence — se corrige aquí antes de salir a producción.

```
47b.1  Revisión personal del usuario (w4rw1ck):
       → Probar la app completa como jugador
       → Identificar cualquier detalle visual, funcional o de UX que no convenza
       → Listar ajustes necesarios
47b.2  Aplicar correcciones identificadas
47b.3  Verificar que los cambios no rompan nada existente
47b.4  Re-verificar en mobile y desktop
47b.5  ✅ Aprobación final del usuario → continuar a Fase 48
```

> **Nota:** Esta fase puede no ser necesaria. Si la auditoría (Fase 47) sale limpia
> y todo se ve como debe, se salta directo a Fase 48. Existe como red de seguridad.

### Fase 48: Cierre de Sesión 3

```
48.1  Actualizar documentación canónica con estado final:
      → PRD: marcar features completados
      → progress.txt: marcar todas las fases
      → model.md: agregar diario de desarrollo S3
48.2  Crear tag de versión v0.3
48.3  Deploy a producción y verificación manual
48.4  Verificar URL pública funcional con auth y persistencia
```

---

## Sesiones Futuras (estructura general)

### Sesión 4 — La Evolución
```
- Evolución visual por memorias acumuladas (mín. 3 etapas por tipo)
- Entrenamiento: subir fotos de código → IA evalúa → score + Fragmentos + stats
- Sistema de misiones completables con recompensas
- Personalización IA profunda basada en memorias
- Sección visible de "Memorias" en la UI
- Barra de evolución visible (progreso hacia siguiente etapa)
```

### Sesión 5 — El Encuentro
```
- Perfiles públicos (URL compartible por Regenmon)
- Feed de descubrimiento (grid con otros Regenmons)
- Interacciones sociales (saludar, regalar, jugar)
```

---

## Reglas

- **Seguir el orden de fases.** No saltar adelante.
- **Seguir el orden de niveles.** Core → Completo → Excelente → Pulido final.
- **Verificar al final de cada fase** antes de avanzar.
- **Si algo falla**, resolver antes de continuar.
- **Actualizar [progress.txt](./progress.txt)** al completar cada fase.
- **Consultar [LORE.md](./LORE.md)** siempre que se toque personalidad, diálogo, stats o tono.
- **Este archivo se actualiza** al planificar cada nueva sesión en detalle.
- **API keys NUNCA en el código.** Solo .env.local o Vercel (ver [TECH_STACK.md → Variables de Entorno](./TECH_STACK.md)).
- **El usuario maneja el deploy.** Solo auditoría rigurosa previa.

---

## Referencias Cruzadas

Este archivo define **en qué orden** se construye todo. Cada fase toca múltiples documentos canónicos.

| Documento | Relación con IMPLEMENTATION_PLAN.md |
|-----------|-------------------------------------|
| [PRD.md](./PRD.md) | Cada fase implementa uno o más features (F1.1, F2.1, F3.1, etc.) |
| [LORE.md](./LORE.md) | Fases que tocan IA, chat, stats o UI narrativa deben consultarlo |
| [APP_FLOW.md](./APP_FLOW.md) | Los flujos definen el comportamiento esperado que cada fase implementa |
| [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md) | Cada fase visual (componentes, layouts, temas) sigue estas guías |
| [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) | Las fases técnicas (schemas, APIs, sync) implementan lo definido allá |
| [TECH_STACK.md](./TECH_STACK.md) | Las fases de setup instalan dependencias con las versiones listadas allá |
| [model.md](./model.md) | Las decisiones de diseño justifican por qué cada fase existe |
| [progress.txt](./progress.txt) | Al completar una fase aquí, se marca como ✅ allá |

### Mapa de fases → documentos

| Fases | Documentos principales consultados |
|-------|-------------------------------------|
| 1-16 (S1) | [TECH_STACK](./TECH_STACK.md), [FRONTEND](./FRONTEND_GUIDELINES.md), [BACKEND](./BACKEND_STRUCTURE.md), [APP_FLOW](./APP_FLOW.md) |
| 17-31 (S2) | [LORE](./LORE.md), [BACKEND](./BACKEND_STRUCTURE.md), [FRONTEND](./FRONTEND_GUIDELINES.md), [APP_FLOW](./APP_FLOW.md) |
| 32 (Setup) | [TECH_STACK](./TECH_STACK.md) |
| 33 (Datos) | [BACKEND](./BACKEND_STRUCTURE.md), [model.md](./model.md) |
| 34 (Auth) | [BACKEND](./BACKEND_STRUCTURE.md), [APP_FLOW](./APP_FLOW.md) |
| 35 (Persist) | [BACKEND](./BACKEND_STRUCTURE.md), [APP_FLOW](./APP_FLOW.md) |
| 36-37 (Economía) | [LORE](./LORE.md), [BACKEND](./BACKEND_STRUCTURE.md), [FRONTEND](./FRONTEND_GUIDELINES.md) |
| 38 (Chat AI) | [LORE](./LORE.md), [BACKEND](./BACKEND_STRUCTURE.md) |
| 39-42 (UI) | [FRONTEND](./FRONTEND_GUIDELINES.md), [APP_FLOW](./APP_FLOW.md) |
| 43-44 (Infra) | [BACKEND](./BACKEND_STRUCTURE.md), [LORE](./LORE.md) |
| 45-46 (Polish) | [FRONTEND](./FRONTEND_GUIDELINES.md), [APP_FLOW](./APP_FLOW.md) |
| 47 (Audit) | Todos los documentos |
| 48 (Cierre) | [progress.txt](./progress.txt), [PRD.md](./PRD.md) |

> **Regla:** Cada fase es un hito verificable. No avanzar sin verificar. No verificar sin consultar los documentos correspondientes.
