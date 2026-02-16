# 🗺️ APP_FLOW — Reggie's Adventure
> **Versión actual:** v0.3 — La Conexión
> **Última actualización:** 2026-02-15
>
> 📜 **Narrativa y personalidad:** Todo diálogo, texto de historia y comportamiento conversacional
> debe ser consistente con [LORE.md](./LORE.md). En caso de conflicto, LORE.md prevalece.

---

## Inventario de Pantallas

| # | Pantalla | Ruta | Condición de acceso |
|---|----------|------|---------------------|
| P1 | Loading NES | `/` (estado: loading) | Siempre al abrir |
| P2 | Título | `/` (estado: title) | Tras loading |
| P3 | Historia | `/` (estado: story) | 1ra vez o tras reset |
| P4 | Creación | `/` (estado: creation) | Si no existe Regenmon |
| P5 | Transición | `/` (estado: transition) | Tras crear Regenmon |
| P6 | Juego | `/` (estado: game) | Si existe Regenmon |

> **Nota:** Toda la app corre en una sola ruta (`/`). Los estados se manejan con React state internamente.

---

## Flujo Principal (S3 — actualizado con Privy)

```
ABRIR APP
    │
    ▼
[P1: Loading NES] ── 3 segundos máximo ── fade ──▶
    │
    ▼
[P2: Título] ── usuario presiona Start (clic/tap/tecla) ──▶
    │
    ├── ¿Ya está logueado (sesión persistente Privy)?
    │       │
    │       └── SÍ ──▶ ¿Existe Regenmon? ──▶ [P6: Juego]
    │
    └── NO ──▶ [Modal de Privy]
                    │
                    ├── Login (Google/Email/Passkey) ──▶ ¿Existe data en Supabase?
                    │       │
                    │       ├── SÍ ──▶ Cargar de Supabase ──▶ [P6: Juego]
                    │       └── NO ──▶ ¿Existen datos en localStorage?
                    │               │
                    │               ├── SÍ ──▶ Migrar a Supabase ──▶ [P6: Juego]
                    │               └── NO ──▶ [P3: Historia] ──▶ [P4: Creación]
                    │
                    └── "Continuar sin cuenta" ──▶ Modo demo (localStorage)
                            │
                            ├── ¿Es 1ra vez?
                            │       ├── SÍ ──▶ [P3: Historia] ──▶ [P4: Creación]
                            │       └── NO ──▶ ¿Existe Regenmon?
                            │               ├── SÍ ──▶ [P6: Juego (demo)]
                            │               └── NO ──▶ [P4: Creación]
```

---

## Flujo Detallado por Pantalla

### P1: Loading NES

**Trigger:** Abrir la app / recargar la página.
**Duración:** Máximo 3 segundos.
**Contenido:** Logo "Reggie's Adventure" centrado.
**Transición:** Fade out → P2: Título.
**Errores:** Ninguno posible.

---

### P2: Título

**Trigger:** Fin de P1.
**Contenido:**
- Título "Reggie's Adventure" prominente
- Regenmons decorativos en el fondo (no roban protagonismo)
- "Press Start" parpadeante
- 🎵 Toggle de música (esquina superior derecha)

**Interacción:**
1. Usuario presiona "Press Start" (clic, tap, o tecla Enter/Space)
2. → Si ya está logueado (sesión Privy persistente) → directo al Juego
3. → Si no está logueado → Modal de Privy aparece

**Decisión (S3):**
- Si `privyUser !== null` → cargar de Supabase → P6: Juego
- Si Privy modal → login o demo

**Errores:** Ninguno posible.

---

### P3: Historia

**Trigger:** Primera vez que se abre la app O después de un reinicio.
**Contenido:**
- Caja de diálogo estilo NES (fondo oscuro, borde pixelado)
- Texto con efecto typewriter (ver LORE.md → El Origen):
  > *"En un rincón olvidado del mundo digital, una señal se enciende... algo quiere despertar. Un fragmento de energía antigua — de un tiempo en que la información fluía como ríos de luz y las conexiones eran puras — espera a alguien que le dé forma. Ese alguien... eres tú."*
- Botón "Continuar ▶" aparece al terminar el texto

**Contexto narrativo:** Esta intro describe el Despertar — el momento en que la energía de La Red Primordial elige al usuario como su compañero. El Regenmon aún no tiene forma; la tomará en P4 cuando el usuario elija su tipo.

**Interacción:**
1. Texto aparece letra por letra (no se puede saltar)
2. Al finalizar texto → aparece botón "Continuar ▶"
3. Clic en "Continuar ▶" → fade → P4: Creación

**Después:** Se marca `isFirstTime = false` en localStorage.
**Errores:** Ninguno posible.

---

### P4: Creación

**Trigger:** No existe Regenmon en localStorage.
**Contexto narrativo:** La energía antigua está lista para tomar forma. El usuario elige cuál de las tres formas elementales cristalizará — cada una representa un aspecto diferente de La Red Primordial que se perdió.
**Contenido:**
- Título "Crea tu Regenmon"
- Carrusel de tipos (uno a la vez):
  - ⚡ **Rayo — El Impulso:** *"La corriente que alguna vez fue el flujo limpio de información. Veloz, directo, chispeante."*
  - 🔥 **Flama — La Pasión:** *"El calor que alguna vez fue la conexión genuina entre seres. Cálido, emotivo, intenso."*
  - ❄️ **Hielo — La Memoria:** *"Los archivos donde el conocimiento vivía eterno. Sabio, reflexivo, sereno."*
  - Cada tipo muestra: SVG de la criatura + nombre + mini-descripción (con significado lore)
  - Flechas para navegar entre tipos
- Campo de nombre:
  - Placeholder: "Nombre de tu Regenmon"
  - Validación: 2-15 caracteres
  - Mensajes de error visibles si nombre inválido
- Botón "¡Despertar!"

**Interacción paso a paso:**
1. Usuario navega carrusel → elige tipo
2. Usuario escribe nombre en el campo
3. Validación: nombre entre 2-15 caracteres
4. Si nombre válido + tipo seleccionado → botón se activa
5. Si falta algo → botón desactivado (grayed out)
6. Clic en "¡Despertar!" → guarda datos en localStorage → fade → P5

**Datos que se guardan al presionar "¡Despertar!":**
```json
{
  "name": "string",
  "type": "rayo | flama | hielo",
  "stats": { "espiritu": 50, "pulso": 50, "esencia": 50 },
  "fragmentos": 100,
  "createdAt": "ISO timestamp",
  "nameChangeUsed": false,
  "tutorialDismissed": false,
  "isFirstTime": false,
  "musicEnabled": true
}
```

**Errores:**
- Nombre vacío → mensaje: "Tu Regenmon necesita un nombre"
- Nombre < 2 chars → mensaje: "El nombre es muy corto (mínimo 2)"
- Nombre > 15 chars → el campo no permite escribir más
- Sin tipo seleccionado → botón permanece desactivado

---

### P5: Transición

**Trigger:** Datos guardados exitosamente tras P4.
**Contexto narrativo:** El Despertar — la energía antigua cristaliza en la forma elegida. La Conexión entre usuario y Regenmon se sella al darle nombre (ver LORE.md → El Despertar).
**Contenido:**
- Fondo oscuro
- Texto centrado: "Tu Regenmon está despertando..."
- Posible animación sutil (puntos suspensivos aparecen uno a uno)

**Duración:** 2-3 segundos.
**Transición:** Fade → P6: Juego.
**Errores:** Ninguno posible.

---

### P6: Juego (Pantalla Principal)

**Trigger:** Existe Regenmon en localStorage o Supabase.
**Contenido (de arriba a abajo):**

1. **Header:**
   - 🎵 Toggle música (esquina superior izquierda)
   - 💠 Balance de Fragmentos (centro/derecha)
     - Logueado: "💠 100 Fragmentos"
     - No logueado: "💠 --- Fragmentos"
   - "v0.3 — La Conexión" (discreto)

2. **Paisaje de fondo — Zonas del Mundo Digital (ver LORE.md → Los Paisajes):**
   - ⚡ Rayo: **Llanura Eléctrica** — adapta a tema Dark/Light
   - 🔥 Flama: **Volcán Ardiente** — adapta a tema Dark/Light
   - ❄️ Hielo: **Montaña Nevada** — adapta a tema Dark/Light
   - Cambia según estado emocional + tema visual activo

3. **Regenmon:**
   - SVG centrado con idle animation (rebote/respiración)
   - Expresión/postura/color cambian según stats
   - Nombre debajo (cambio de nombre en Settings)

4. **Info:**
   - "Día X de aventura" (visible pero discreto)

5. **Stats — Estado del Regenmon (100=bien, 0=mal):**
   - 🔮 Esperanza [====----] 50/100
   - 💛 Energía vital [====----] 50/100
   - 🍎 Esencia [====----] 50/100
   - **Modo compacto (durante chat):** 🔮 80 | 💛 50 | 🍎 30

6. **Botones de acción (S3):**
   - `[🔮 Purificar (10💠)]  [⚙️]  [💬 Conversar]`
   - **Purificar:** Cuesta 10 Fragmentos. Disabled si <10💠 o Esencia=100
   - **⚙️:** Abre panel de Settings
   - **Conversar:** Toggle chat (cambia a "✕ Cerrar")
   - **Se ocultan Purificar y ⚙️ durante chat**
   - **Conversar se desactiva** si los 3 stats < 10

7. **Caja de Diálogo NES (Sesión 2, mantenida):**
   - Aparece al presionar "💬 Conversar"
   - Estilo Final Fantasy/Zelda: semi-transparente, borde NES pixelado
   - Contiene: historial de burbujas + input de texto + botón enviar
   - Música baja a 60% con fade 1.5s al abrir

**Tutorial Modal (si no descartado):**
- Aparece superpuesto al entrar a P6
- Instrucciones actualizadas (Purificar, Fragmentos, Settings, Chat)
- Checkbox: "No volver a mostrar"
- Botón para cerrar

---

## Flujos Secundarios

### Flujo: Purificar (S3 — reemplaza Alimentar/Entrenar/Descansar)

```
1. Usuario presiona [🔮 Purificar (10💠)]
2. ¿Fragmentos >= 10?
   ├── NO → Botón desactivado con tooltip "Necesitas 10 💠"
   └── SÍ → Continúa
3. ¿Esencia ya está al máximo (100)?
   ├── SÍ → Botón desactivado, tooltip "Esencia al máximo"
   └── NO → Continúa
4. Se restan 10 Fragmentos
5. Se aplican: Esencia +30, Espíritu +5, Pulso +10
6. Feedback flotante: "+30 🍎" y efecto visual lore-appropriate
7. Balance de Fragmentos se actualiza en header
8. Stats se actualizan visualmente
9. Regenmon muestra reacción contextual (texto lore-appropriate, no genérico)
10. Paisaje se ajusta si corresponde
11. localStorage (y Supabase si logueado) se actualizan
```

### Flujo: Settings (⚙️) (S3 — Nuevo)

```
1. Usuario presiona [⚙️]
2. Panel de Settings aparece (slide-in o modal)
3. Opciones disponibles:
   - 🎵 Música: Toggle on/off
   - 🔄 Reiniciar: → Modal de confirmación retro (misma lógica actual)
   - 📝 Cambiar nombre: Campo inline, validaciones 2-15 chars
   - 🚪 Sesión: "Iniciar Sesión" (abre Privy) / "Cerrar Sesión"
   - 🔤 Texto: A+ / A- para ajustar tamaño
   - 🌙/☀️ Tema: Toggle Dark (NES) / Light (GBC)
4. Cerrar: Botón "✕" o clic fuera del panel
```

### Flujo: Login tardío (desde Settings) (S3)

```
1. Usuario en modo demo presiona "Iniciar Sesión" en Settings
2. Modal de Privy aparece
3. Usuario se loguea (Google/Email/Passkey)
4. Se migran datos de localStorage a Supabase
5. Balance de Fragmentos pasa de "---" a valor real
6. Panel Settings actualiza: "Cerrar Sesión" reemplaza "Iniciar Sesión"
7. A partir de ahora, datos se sincronizan con Supabase
```

### Flujo: Cambio de Nombre (S3 — ahora desde Settings)

```
1. Usuario abre Settings (⚙️) y presiona "📝 Cambiar nombre"
2. ¿nameChangeUsed === true?
   ├── SÍ → Opción no disponible (texto gris: "Ya usaste tu cambio")
   └── NO → Continúa
3. Aparece campo de edición con leyenda: "Esta es tu única oportunidad."
4. Validación: 2-15 caracteres
5. ¿Confirma?
   ├── SÍ → Se guarda nuevo nombre, nameChangeUsed = true
   └── NO → Se cierra editor
```

### Flujo: Reiniciar (desde Settings)

```
1. Usuario abre Settings y presiona "🔄 Reiniciar"
2. Modal de confirmación:
   "¿Abandonar a [nombre]? Esta memoria se perderá para siempre..."
   [Cancelar] [Confirmar]
3. ¿Confirma?
   ├── SÍ → Borra localStorage (y Supabase si logueado) → P2: Título → P3 → P4
   └── NO → Modal se cierra
```

### Flujo: Decaimiento de Stats (S3 — actualizado)

```
1. Al abrir la app (o en intervalos regulares si está abierta):
2. Calcular tiempo transcurrido desde última actualización
3. Aplicar decaimiento proporcional al tiempo:
   - Espíritu: baja gradualmente
   - Pulso: baja PERO regenera pasivamente (descanso natural)
   - Esencia: baja gradualmente (100=bien, 0=mal)
4. Ritmo: tras 4-5 horas → baja leve (no grave)
5. Respetar límites 0-100
6. Actualizar Regenmon visual + paisaje
7. Guardar timestamp en localStorage (y sync a Supabase si logueado)
```

### Flujo: Tutorial Modal

```
1. Al entrar a P6: ¿tutorialDismissed === false?
   ├── SÍ (no descartado) → Mostrar modal con instrucciones
   └── NO (ya descartado) → No mostrar nada
2. Usuario lee instrucciones (incluye mención del chat)
3. ¿Marca checkbox "No volver a mostrar"?
   ├── SÍ → tutorialDismissed = true, se guarda en localStorage
   └── NO → Seguirá apareciendo la próxima vez
4. Cierra modal → juega normalmente
```

### Flujo: Conversar (Sesión 2, actualizado S3)

```
1. Usuario presiona "💬 Conversar"
2. ¿Los 3 stats < 10?
   ├── SÍ → Botón desactivado, tooltip "Tu Regenmon está muy débil..."
   └── NO → Continúa
3. Música baja a 60% (fade 1.5s)
4. Botones Purificar y ⚙️ desaparecen
5. Stats pasan a modo compacto (🔮 80 | 💛 50 | 🍎 30)
6. Botón "Conversar" cambia a "✕ Cerrar"
7. Caja de diálogo NES aparece (fade in)
8. ¿Es la primera vez que abre el chat?
   ├── SÍ → Regenmon saluda automáticamente
   └── NO → Muestra historial de mensajes previos
```

### Flujo: Enviar Mensaje de Chat (Sesión 2)

```
1. Usuario escribe mensaje (max 280 chars)
2. Envía con Enter (desktop), botón (mobile). Ctrl+Enter = salto de línea (desktop)
3. ¿Cooldown activo (3s desde último envío)?
   ├── SÍ → Botón desactivado (invisible al usuario)
   └── NO → Continúa
4. Mensaje del usuario aparece en burbuja (derecha)
5. Input se limpia
6. Indicador "Escribiendo..." aparece (puntos animados NES)
7. Se envía request a /api/chat con:
   - Mensaje del usuario
   - Historial completo (max 50 mensajes)
   - Stats actuales del Regenmon
   - Nombre + tipo del Regenmon
   - Días de vida
   - Nombre del jugador (si lo conoce)
8. ¿API responde exitosamente?
   ├── SÍ → Continúa al paso 9
   └── NO → Muestra botón "Reintentar"
9. ¿Rate limit excedido (15 msgs/min)?
   ├── SÍ → Mensaje amigable: "Tu Regenmon necesita un respiro..."
   └── NO → Continúa
10. Indicador "Escribiendo..." desaparece
11. Respuesta del Regenmon aparece en burbuja (izquierda) con bounce
12. Scroll automático al último mensaje
13. Stats se actualizan:
    - Espíritu: ±5 (decidido por la IA, fallback 0)
    - Pulso: -2 (fijo)
    - Hambre: +1 (fijo)
14. Feedback flotante visible para cada cambio de stat
15. Regenmon actualiza expresión/postura si corresponde
16. ¿La IA descubrió el nombre del jugador?
    ├── SÍ → Se guarda en playerName, feedback visual "🧠"
    └── NO → Nada
17. Mensaje se agrega al historial en localStorage
18. Si historial > 50 mensajes → se eliminan los más antiguos
```

### Flujo: Cerrar Chat (Sesión 2)

```
1. Usuario cierra el chat (botón "✕ Cerrar", clic fuera, o toggle "Conversar")
2. Caja de diálogo NES desaparece (fade leve)
3. Botón "✕ Cerrar" vuelve a "💬 Conversar"
4. Stats regresan a modo completo (barras normales)
5. Botones de acción reaparecen (animación sutil)
6. Música regresa a 100% (fade 1.5s)
```

### Flujo: Descubrimiento del Nombre del Jugador (Sesión 2)

```
1. El system prompt instruye al Regenmon a averiguar el nombre de forma natural
2. Cuando el usuario menciona su nombre en la conversación:
3. La IA incluye "playerName" en su respuesta JSON
4. Se guarda en localStorage (clave: reggie-adventure-player)
5. Feedback visual: "🧠 ¡Tu Regenmon aprendió tu nombre!"
6. En conversaciones futuras, el Regenmon usa el nombre
7. Si el usuario dice que cambió de nombre → la IA actualiza playerName
8. Al hacer reset → se borra playerName
```

---

## Consideraciones de Accesibilidad en el Flujo

1.  **Transiciones:**
    -   Al cambiar de pantalla, el foco debe moverse al contenedor principal o al primer elemento interactivo de la nueva pantalla para usuarios de teclado/screen readers.
    -   Evitar "trampas de foco" en modales (Tutorial/Reset). El foco debe ciclar dentro del modal.

2.  **Feedback:**
    -   Las acciones (Entrenar, Alimentar) deben anunciar el resultado al lector de pantalla ("Tu Regenmon comió, Hambre bajó a 30").

3.  **Chat (Sesión 2):**
    -   Al abrir el chat, foco se mueve al input de texto.
    -   Mensajes nuevos anunciados via `aria-live="polite"`.
    -   Indicador "Escribiendo..." tiene `aria-label` descriptivo.
    -   Botón "Conversar" desactivado tiene `aria-disabled` + tooltip accesible.

---

## Mapa de Navegación Visual (S3)

```
[Loading] →fade→ [Título]
                     │
                     └── Press Start → ¿Logueado?
                                         │
                                         ├── SÍ →fade→ [Juego]
                                         │
                                         └── NO → [Privy Modal]
                                                     │
                                                     ├── Login → [Juego (Supabase)]
                                                     │
                                                     └── Demo → ¿1ra vez?
                                                                  │
                                                                  ├── SÍ → [Historia] → [Creación] → [Juego]
                                                                  └── NO → [Juego (demo)]

[Creación] → ¡Despertar! →fade→ [Transición] →fade→ [Juego]

[Juego] → ⚙️ Settings → Reiniciar → Confirmar → [Título] → [Historia] → [Creación]

[Juego] → 💬 Conversar → [Chat NES Dialog] → ✕ Cerrar → [Juego]

[Juego] → 🔮 Purificar → Stats/Fragmentos actualizados → [Juego]

[Juego (demo)] → ⚙️ → Iniciar Sesión → [Privy] → Migrar datos → [Juego (Supabase)]
```
