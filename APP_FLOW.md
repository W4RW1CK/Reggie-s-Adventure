# 🗺️ APP_FLOW — Reggie's Adventure
> **Versión actual:** v0.1 — El Despertar
> **Última actualización:** 2026-02-12

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
- Texto con efecto typewriter:
  > *"En un rincón olvidado del mundo digital, una señal se enciende... algo quiere despertar. Un fragmento de energía antigua espera a alguien que le dé forma. Ese alguien... eres tú."*
- Botón "Continuar ▶" aparece al terminar el texto

**Interacción:**
1. Texto aparece letra por letra (no se puede saltar)
2. Al finalizar texto → aparece botón "Continuar ▶"
3. Clic en "Continuar ▶" → fade → P4: Creación

**Después:** Se marca `isFirstTime = false` en localStorage.
**Errores:** Ninguno posible.

---

### P4: Creación

**Trigger:** No existe Regenmon en localStorage.
**Contenido:**
- Título "Crea tu Regenmon"
- Carrusel de tipos (uno a la vez): ⚡ Rayo / 🔥 Flama / ❄️ Hielo
  - Cada tipo muestra: SVG de la criatura + nombre + mini-descripción
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
   - "v0.1 — El Despertar" (discreto)

2. **Paisaje de fondo:**
   - Pixel art según tipo (Rayo: llanura eléctrica / Flama: volcán / Hielo: montaña nevada)
   - Cambia sutilmente según estado emocional

3. **Regenmon:**
   - SVG centrado con idle animation (rebote/respiración)
   - Expresión/postura/color cambian según stats
   - Nombre debajo + ✏️ (si cambio no usado)

4. **Info:**
   - "Día X de aventura"

5. **Stats:**
   - 🔮 Espíritu [====----] 50/100
   - 💛 Pulso [====----] 50/100
   - 🍎 Hambre [====----] 50/100

6. **Botones de acción:**
   - ⚡ Entrenar | 🍎 Alimentar | 💤 Descansar
   - Layout responsive (fila u otra disposición según pantalla)

7. **Footer:**
   - Botón "Reiniciar" (discreto, centrado)

**Tutorial Modal (si no descartado):**
- Aparece superpuesto al entrar a P6
- Instrucciones breves de las acciones
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
2. Usuario lee instrucciones
3. ¿Marca checkbox "No volver a mostrar"?
   ├── SÍ → tutorialDismissed = true, se guarda en localStorage
   └── NO → Seguirá apareciendo la próxima vez
4. Cierra modal → juega normalmente
```

---

## Consideraciones de Accesibilidad en el Flujo

1.  **Transiciones:**
    -   Al cambiar de pantalla, el foco debe moverse al contenedor principal o al primer elemento interactivo de la nueva pantalla para usuarios de teclado/screen readers.
    -   Evitar "trampas de foco" en modales (Tutorial/Reset). El foco debe ciclar dentro del modal.

2.  **Feedback:**
    -   Las acciones (Entrenar, Alimentar) deben anunciar el resultado al lector de pantalla ("Tu Regenmon comió, Hambre bajó a 30").

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
```
