# 🔨 IMPLEMENTATION_PLAN — Reggie's Adventure
> **Versión actual:** v0.1 — El Despertar
> **Última actualización:** 2026-02-14

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
 
### Fase 16: Fix It — Accesibilidad y Calidad (Interludio) 

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
```
 
---
 
### Fase 16+: Auditoría y Mejoras Post-Accesibilidad

```
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
```
 
---

## Sesiones Futuras (estructura general)

### Sesión 2 — La Voz
```
- Instalar SDK de IA (Claude/Gemini)
- Crear API route /api/chat
- Crear system prompts por tipo
- Crear componente de chat retro
- Integrar reactividad a stats
```

### Sesión 3 — La Conexión
```
- Instalar Privy SDK + Supabase
- Crear sistema de auth
- Migrar localStorage → base de datos
- Implementar sistema de ⭐ Estrellas
- Crear endpoint /api/feed
```

### Sesión 4 — La Evolución
```
- Diseñar etapas de evolución por tipo
- Implementar IA multimodal (fotos)
- Crear sistema de misiones
- Crear sistema de scoring
```

### Sesión 5 — El Encuentro
```
- Crear endpoints sociales
- Implementar perfiles públicos
- Crear feed de descubrimiento
- Implementar interacciones
```

---

## Reglas

- **Seguir el orden de fases.** No saltar adelante.
- **Verificar al final de cada fase** antes de avanzar.
- **Si algo falla**, resolver antes de continuar.
- **Actualizar progress.txt** al completar cada fase.
- **Este archivo se actualiza** al planificar cada nueva sesión en detalle.
