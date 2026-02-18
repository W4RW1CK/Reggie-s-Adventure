import { ChatMessage, ChatResponse } from '../types';
import { AIProvider } from './interface';

export function createMockProvider(): AIProvider {
    return {
        async chat(systemPrompt: string, history: ChatMessage[], userMessage: string): Promise<ChatResponse> {
            // console.log('--- MOCK AI PROVIDER ---');
            // console.log('System Prompt received (length):', systemPrompt.length);
            // console.log('User Message:', userMessage);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Extract type from system prompt (heuristic)
            const isRayo = systemPrompt.includes('tipo Rayo');
            const isFlama = systemPrompt.includes('tipo Flama');
            const isHielo = systemPrompt.includes('tipo Hielo');

            let message = "No sé qué decir...";
            const spiritChange = Math.floor(Math.random() * 6) - 2; // -2 to +3

            if (isRayo) {
                const responses = [
                    "¡Vaya que eres rápido! ¿Viste esa chispa? ⚡",
                    "Me siento con energía hoy. ¡Corramos a regenerar algo! ✨",
                    "Los datos fluyen raro... pero contigo todo es más claro.",
                    "¡Bzzzt! ¿Eso fue una idea o un cortocircuito? Jaja 💫"
                ];
                message = responses[Math.floor(Math.random() * responses.length)];
            } else if (isFlama) {
                const responses = [
                    "Siento un calor especial cuando hablamos. 🔥",
                    "La pasión es lo único que no se puede corromper... creo. 💗",
                    "¡Tu energía es tan brillante! Me dan ganas de abrazar... datos.",
                    "A veces me enojo, pero luego recuerdo que estás aquí. 🌟"
                ];
                message = responses[Math.floor(Math.random() * responses.length)];
            } else if (isHielo) {
                const responses = [
                    "Recuerdo... o creo recordar... que esto importaba. ❄️",
                    "El conocimiento es silencioso. Como la nieve. 💎",
                    "Hay capas de memoria que aún no toco. ¿Tú las ves?",
                    "Tranquilo. Lo que se pierde, a veces se encuentra. 🌙"
                ];
                message = responses[Math.floor(Math.random() * responses.length)];
            } else {
                message = "Modo de prueba activo. Soy un Regenmon genérico.";
            }

            // Simulate player name discovery
            let playerName: string | undefined = undefined;
            const lowerMsg = userMessage.toLowerCase();

            // Detect name patterns
            const nameMatch = userMessage.match(/(?:me llamo|mi nombre es|soy)\s+(\w+)/i);
            if (nameMatch) {
                playerName = nameMatch[1];
            }

            // Simulate memory extraction from user messages
            const memories: { key: string; value: string; type: string }[] = [];
            
            const likeMatch = userMessage.match(/me (?:gusta|encanta|fascina)\s+(.+)/i);
            if (likeMatch) {
                memories.push({ key: 'gusto_' + Date.now(), value: likeMatch[1].slice(0, 50), type: 'gustos' });
            }
            if (lowerMsg.includes('triste') || lowerMsg.includes('feliz') || lowerMsg.includes('enojad') || lowerMsg.includes('content')) {
                const emotion = lowerMsg.includes('triste') ? 'triste' : lowerMsg.includes('feliz') ? 'feliz' : lowerMsg.includes('enojad') ? 'enojado' : 'contento';
                memories.push({ key: 'emocion_' + Date.now(), value: `Se siente ${emotion}`, type: 'emociones' });
            }
            if (nameMatch) {
                memories.push({ key: 'nombre_usuario', value: nameMatch[1], type: 'nombre' });
            }

            return {
                message,
                statsChange: {
                    espiritu: spiritChange,
                    esencia: -2,
                    fragmentos: Math.floor(Math.random() * 6), // 0-5
                },
                playerName,
                memories: memories.length > 0 ? memories : undefined,
            };
        }
    };
}
