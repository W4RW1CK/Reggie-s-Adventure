# 🗺️ APP_FLOW — Reggie's Adventure
> **Versión actual:** v0.2 — La Voz
> **Última actualización:** 2026-02-14
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

## Flujo Principal

```
ABRIR APP
    │
    ▼
[P1: Loading NES] ── 3 segundos máximo ── fade ──▶
    │
    ▼
[P2: Título] ── usuario presiona Start (clic/tap/tecla) ──▶
    │
    ├── ¿Es la primera vez O viene de un reset?
    │       │
    │       ├── SÍ ──▶ [P3: Historia] ── "Continuar ▶" ──▶ [P4: Creación]
    │       │
    │       └── NO ──▶ ¿Existe Regenmon en localStorage?
    │                       │
    │                       ├── SÍ ──▶ [P6: Juego]
    │                       │
    │                       └── NO ──▶ [P4: Creación]
    │
    ▼
[P4: Creación] ── llenar datos ── "¡Despertar!" ──▶ [P5: Transición] ──▶ [P6: Juego]
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
2. → Evalúa si es primera vez o si viene de reset

**Decisión:**
- Si `isFirstTime === true` O `cameFromReset === true` → P3: Historia
- Si `regenmonExists === true` → P6: Juego
- Si `regenmonExists === false` → P4: Creación

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
  "stats": { "espiritu": 50, "pulso": 50, "hambre": 50 },
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

**Trigger:** Existe Regenmon en localStorage.
**Contenido (de arriba a abajo):**

1. **Header:**
   - 🎵 Toggle música (esquina superior derecha)
   - "v0.2 — La Voz" (discreto)

2. **Paisaje de fondo — Zonas del Mundo Digital (ver LORE.md → Los Paisajes):**
   - ⚡ Rayo: **Llanura Eléctrica** — los campos donde fluía la información libre. Stats altos: cielo despejado, corrientes de luz. Stats bajos: tormentas, estática.
   - 🔥 Flama: **Volcán Ardiente** — el corazón donde se forjaban las conexiones. Stats altos: volcán dormido, cielo cálido. Stats bajos: erupciones violentas, humo.
   - ❄️ Hielo: **Montaña Nevada** — los archivos antiguos del conocimiento. Stats altos: nieve cristalina, aurora boreal. Stats bajos: ventisca ciega, hielo negro.
   - Cambia según estado emocional (la regeneración o degeneración del mundo es visible)

3. **Regenmon:**
   - SVG centrado con idle animation (rebote/respiración)
   - Expresión/postura/color cambian según stats
   - Nombre debajo + ✏️ (si cambio no usado)

4. **Info:**
   - "Día X de aventura" (visible pero discreto, también durante chat)

5. **Stats — Estado del Regenmon (ver LORE.md → Stats y Lore):**
   - 🔮 Espíritu (**= Esperanza**) [====----] 50/100
   - 💛 Pulso (**= Energía vital**) [====----] 50/100
   - 🍎 Hambre (**= Necesidad**) [====----] 50/100
   - **Modo compacto (durante chat):** 🔮 80 | 💛 50 | 🍎 30 (mini barras con emoji + número)

6. **Botones de acción:**
   - ⚡ Entrenar | 🍎 Alimentar | 💤 Descansar
   - Layout responsive (fila u otra disposición según pantalla)
   - **Se ocultan durante chat**

7. **Botón "💬 Conversar" (Sesión 2):**
   - Fila propia debajo de los 3 botones de acción
   - Mismo estilo NES verde
   - Toggle: abre/cierra la caja de diálogo NES
   - Cambia a "✕ Cerrar" cuando el chat está abierto
   - **Se desactiva** si los 3 stats < 10 (tooltip: "Tu Regenmon está muy débil para hablar...")

8. **Caja de Diálogo NES (Sesión 2):**
   - Aparece al presionar "💬 Conversar"
   - Estilo Final Fantasy/Zelda: semi-transparente, borde NES pixelado
   - Se adapta al tamaño de pantalla automáticamente
   - Contiene: historial de burbujas + input de texto + botón enviar
   - Música baja a 60% con fade 1.5s al abrir
   - **Cerrar:** Botón "✕ Cerrar", clic fuera de la caja, o toggle del botón. Fade leve al cerrar. Botones de acción reaparecen con animación sutil.

9. **Footer:**
   - Botón "Reiniciar" (discreto, centrado)

**Tutorial Modal (si no descartado):**
- Aparece superpuesto al entrar a P6
- Instrucciones breves de las acciones **+ mención del chat (Sesión 2)**
- Checkbox: "No volver a mostrar"
- Botón para cerrar

---

## Flujos Secundarios

### Flujo: Presionar Acción

```
1. Usuario presiona botón de acción (Entrenar/Alimentar/Descansar)
2. ¿El stat objetivo está en su límite?
   ├── SÍ → Botón está desactivado, no pasa nada
   └── NO → Continúa
3. Se modifica el stat (+10 o -10)
4. Si el valor excede 100 → se redondea a 100
5. Si el valor baja de 0 → se redondea a 0
6. Aparece "+10" o "-10" flotante (animación)
7. Stats se actualizan visualmente
8. Regenmon actualiza expresión/postura si corresponde
9. Paisaje se ajusta sutilmente si corresponde
10. localStorage se actualiza
11. Si stat llega a límite → botón se desactiva
```

### Flujo: Cambio de Nombre

```
1. Usuario presiona ✏️ junto al nombre
2. ¿nameChangeUsed === true?
   ├── SÍ → ✏️ no existe (ya desapareció)
   └── NO → Continúa
3. Aparece campo de edición con leyenda: "Esta es tu única oportunidad de cambiar el nombre."
4. Usuario escribe nuevo nombre (mismas validaciones: 2-15 chars)
5. ¿Confirma el cambio?
   ├── SÍ → Se guarda nuevo nombre, nameChangeUsed = true, ✏️ desaparece
   └── NO → Se cierra editor, nada cambia
```

### Flujo: Reiniciar

```
1. Usuario presiona "Reiniciar"
2. Modal de confirmación retro aparece:
   "¿Abandonar a [nombre]? Esta memoria se perderá para siempre..."
   [Cancelar] [Confirmar]
3. ¿Confirma?
   ├── SÍ → Se borra todo del localStorage, cameFromReset = true → P2: Título → P3: Historia → P4: Creación
   └── NO → Modal se cierra, nada cambia
```

### Flujo: Decaimiento de Stats

```
1. Al abrir la app (o en intervalos regulares si está abierta):
2. Calcular tiempo transcurrido desde última actualización
3. Aplicar decaimiento proporcional al tiempo:
   - Espíritu: baja gradualmente
   - Pulso: baja gradualmente
   - Hambre: sube gradualmente
4. Ritmo: tras 4-5 horas → baja leve (no grave)
5. Respetar límites 0-100
6. Actualizar Regenmon visual + paisaje
7. Guardar timestamp de última actualización en localStorage
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

### Flujo: Conversar (Sesión 2)

```
1. Usuario presiona "💬 Conversar"
2. ¿Los 3 stats < 10?
   ├── SÍ → Botón desactivado, tooltip "Tu Regenmon está muy débil para hablar..."
   └── NO → Continúa
3. Música baja a 60% (fade 1.5s)
4. Botones de acción (Entrenar/Alimentar/Descansar) desaparecen
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

## Mapa de Navegación Visual

```
[Loading] →fade→ [Título]
                     │
                     ├── Press Start (1ra vez) →fade→ [Historia] →fade→ [Creación]
                     │
                     ├── Press Start (sin Regenmon) →fade→ [Creación]
                     │
                     └── Press Start (con Regenmon) →fade→ [Juego]

[Creación] → ¡Despertar! →fade→ [Transición] →fade→ [Juego]

[Juego] → Reiniciar → Confirmar →fade→ [Título] → [Historia] → [Creación]

[Juego] → 💬 Conversar → [Chat NES Dialog] → ✕ Cerrar → [Juego]
```
