# 🧠 MODEL — Reggie's Adventure
> **Última actualización:** 2026-02-15

---

## Estado del Proyecto

| Sesión | Versión | Estado |
|--------|---------|--------|
| S1: El Despertar | v0.1.16 | ✅ Completada y desplegada |
| S2: La Voz | v0.2 | 🚧 En desarrollo (Fase 17) |
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

### Stats y Mecánicas
- **Por respuesta del Regenmon:**
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
- **2026-02-15**: 🚀 Inicio de implementación Sesión 2 (Fases 17-30). Revisión de archivos completada. Comenzando Fase 17 (Capa de Abstracción IA).

