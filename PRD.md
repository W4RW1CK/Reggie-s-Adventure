# 📋 PRD — Reggie's Adventure
> **Versión actual:** v0.1 — El Despertar
> **Última actualización:** 2026-02-12
> **Estado:** Sesión 1 — En construcción

---

## 1. ¿Qué es Reggie's Adventure?

Un **juego web retro de crianza y aventura** donde el jugador cuida a un Regenmon — una criatura digital que evoluciona según las interacciones del usuario. Inspirado en la estética de *Kirby's Adventure* (NES), combina elementos de Pokémon (tipos, evolución) y Tamagotchi (cuidado, stats en tiempo real).

No es una app de mascota para niños. Es un juego con sustancia, tono retro 8-bit y peso emocional real.

## 2. ¿Para quién es?

- **Usuario primario:** Estudiantes del bootcamp VibeCoding
- **Perfil:** Personas sin experiencia técnica profunda que quieren aprender a construir apps con IA
- **Plataforma:** Web (móvil portrait y desktop vertical)
- **Navegadores:** Chrome, Firefox, Safari, Edge (modernos)

## 3. Visión del producto

Al completar las 5 sesiones, el jugador tiene:
- Una criatura única que refleja su personalidad y decisiones
- Un juego funcional desplegado en internet
- Interacciones con IA que hacen que la criatura se sienta viva
- Conexión social con otros jugadores del bootcamp

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
| F1.5 | Creación: Nombre | Campo 2-15 chars, validación visible |
| F1.6 | Creación: Botón "¡Despertar!" | Solo activo cuando nombre válido + tipo seleccionado |
| F1.7 | Transición | Texto "Tu Regenmon está despertando..." con fade |
| F1.8 | Display: SVG del Regenmon | Criatura SVG modular con idle animation (rebote/respiración) |
| F1.9 | Display: Paisaje de fondo | Pixel art que cambia según tipo Y estado emocional (cambios sutiles) |
| F1.10 | Display: Barras de stats | 3 barras NES horizontales (Espíritu 🔮 / Pulso 💛 / Hambre 🍎) con valor visible (50/100) |
| F1.11 | Display: Botones de acción | Entrenar (+10 Pulso) / Alimentar (-10 Hambre) / Descansar (+10 Espíritu) con feedback "+10"/"-10" flotante |
| F1.12 | Display: Fecha | "Día X de aventura" (cuenta días desde creación) |
| F1.13 | Decaimiento de stats | Stats cambian en tiempo real. Tras 4-5h se nota baja leve. Calcula tiempo offline |
| F1.14 | Estados visuales del Regenmon | Normal, eufórico, hambre crítica, pulso bajo, espíritu bajo, colapso total — cambios en expresión, postura, color |
| F1.15 | Límites de stats | Rango 0-100. Botones se desactivan en el límite. Valores se redondean si exceden |
| F1.16 | Cambio de nombre | ✏️ junto al nombre. 1 solo cambio permitido. Leyenda de advertencia. Desaparece tras uso |
| F1.17 | Reiniciar | Botón discreto centrado abajo. Modal de confirmación retro. Borra todo y regresa a historia + creación |
| F1.18 | Tutorial modal | Aparece cada entrada. Checkbox "No volver a mostrar". Estado en localStorage |
| F1.19 | Música 8-bit | Melodía chiptune atmosférica. Toggle 🎵 esquina superior derecha. Estado guardado |
| F1.20 | Persistencia | Todos los datos en localStorage. Persiste al recargar |
| F1.21 | Responsive | Portrait vertical en móvil. Layout adaptativo desktop/móvil |
| F1.22 | Deploy | URL pública en Vercel |

#### Fuera de Scope ❌ (Sesión 1)
- Contador de ⭐ Estrellas (Sesión 3)
- Chat con IA (Sesión 2)
- Login / autenticación (Sesión 3)
- Evolución visual (Sesión 4)
- Interacciones sociales (Sesión 5)
- Límite de uso de botones / cooldowns
- Acciones que afectan múltiples stats

---

### Sesión 2 — La Voz (v0.2) `PENDIENTE`
| # | Feature | Criterio de éxito |
|---|---------|-------------------|
| F2.1 | Chat retro | Ventana de diálogo NES con efecto typewriter |
| F2.2 | Personalidad por tipo | Rayo: enérgico. Flama: apasionado. Hielo: sereno |
| F2.3 | Reactividad a stats | Respuestas cambian según niveles de stats |
| F2.4 | API Route | Conexión con Claude/Gemini API vía Next.js |

### Sesión 3 — La Conexión (v0.3) `PENDIENTE`
| # | Feature | Criterio de éxito |
|---|---------|-------------------|
| F3.1 | Auth con Privy | Login funcional con botón estilo NES |
| F3.2 | ⭐ Estrellas | Balance visible, reclamar, gastar en acciones |
| F3.3 | Persistencia nube | Migración de localStorage a Supabase |

### Sesión 4 — La Evolución (v0.4) `PENDIENTE`
| # | Feature | Criterio de éxito |
|---|---------|-------------------|
| F4.1 | Evolución visual | Mínimo 3 etapas por tipo |
| F4.2 | IA multimodal | Subir fotos, IA evalúa, da score |
| F4.3 | Misiones | Lista completable con recompensas |
| F4.4 | Personalización IA | Regenmon se adapta visualmente por conversaciones |

### Sesión 5 — El Encuentro (v0.5) `PENDIENTE`
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

## 6. Criterios de Éxito Globales

- [ ] App desplegada con URL pública funcional
- [ ] Flujo completo sin errores: Loading → Título → Historia → Creación → Juego
- [ ] Stats decaen en tiempo real y calculan tiempo offline
- [ ] Regenmon reacciona visualmente a sus stats
- [ ] Datos persisten tras recargar/cerrar navegador
- [ ] Responsive en portrait (móvil + desktop)
- [ ] Música funcional con toggle
