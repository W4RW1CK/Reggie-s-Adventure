import { useState, useCallback } from 'react';
import { Mission, RegenmonType, RegenmonMemory } from '@/lib/types';
import {
  MISSION_EXPIRATION_MS,
  MISSION_BYPASS_WINDOW_MS,
  PROGRESS_MISSION_BONUS,
  STORAGE_KEYS,
} from '@/lib/constants';

const STORAGE_KEY = STORAGE_KEYS.MISSION;

// Mission templates per type — AI would generate these in prod,
// but we provide contextual templates as a starting point
const MISSION_TEMPLATES: Record<RegenmonType, string[]> = {
  rayo: [
    'Captura algo en movimiento — un vehículo, una persona caminando, el viento en las hojas.',
    'Encuentra una fuente de luz artificial y muéstramela.',
    'Fotografía algo que represente velocidad o flujo para ti.',
    'Busca un reflejo interesante — en agua, vidrio o metal.',
    'Muéstrame el camino que recorres todos los días.',
  ],
  flama: [
    'Captura un momento de conexión — personas juntas, una mascota, un abrazo.',
    'Fotografía algo que te haga sentir calidez por dentro.',
    'Encuentra algo rojo o naranja en tu entorno y compártelo conmigo.',
    'Muéstrame tu lugar favorito para compartir con alguien.',
    'Captura algo que represente un recuerdo feliz.',
  ],
  hielo: [
    'Fotografía algo que guarde conocimiento — un libro, una señal, una inscripción.',
    'Encuentra un paisaje natural y muéstramelo en su quietud.',
    'Captura algo que haya sobrevivido al paso del tiempo.',
    'Muéstrame algo azul o blanco que encuentres a tu alrededor.',
    'Fotografía un lugar tranquilo donde puedas reflexionar.',
  ],
};

function loadMission(): Mission | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const mission = JSON.parse(raw) as Mission;
    // Check expiration
    if (Date.now() > mission.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return mission;
  } catch { return null; }
}

function saveMission(mission: Mission | null): void {
  if (typeof window === 'undefined') return;
  if (!mission) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
  }
}

/**
 * Generate a contextual mission prompt based on type and memories.
 * In production, this would call the AI. For now, we use templates.
 */
function generateMissionPrompt(
  type: RegenmonType,
  _memories: RegenmonMemory[],
): string {
  const templates = MISSION_TEMPLATES[type];
  const index = Math.floor(Math.random() * templates.length);
  return templates[index];
}

interface UseMissionsProps {
  regenmonType: RegenmonType;
  memories: RegenmonMemory[];
}

/**
 * Manage AI-generated missions.
 * - Missions are optional but give +5 progress bonus
 * - 1 active mission max
 * - Mission bypass: 1 photo allowed within 30min even during cooldown
 */
export function useMissions({ regenmonType, memories }: UseMissionsProps) {
  const [activeMission, setActiveMission] = useState<Mission | null>(loadMission);

  const generateMission = useCallback((): Mission | null => {
    // Don't generate if one is already active
    if (activeMission && !activeMission.completed && Date.now() < activeMission.expiresAt) {
      return activeMission;
    }

    const now = Date.now();
    const mission: Mission = {
      id: `mission-${now}-${Math.random().toString(36).slice(2, 8)}`,
      prompt: generateMissionPrompt(regenmonType, memories),
      createdAt: now,
      expiresAt: now + MISSION_EXPIRATION_MS,
      completed: false,
      bypassUsed: false,
    };

    saveMission(mission);
    setActiveMission(mission);
    return mission;
  }, [activeMission, regenmonType, memories]);

  const completeMission = useCallback((): number => {
    if (!activeMission || activeMission.completed) return 0;

    const completed: Mission = { ...activeMission, completed: true };
    saveMission(completed);
    setActiveMission(completed);
    return PROGRESS_MISSION_BONUS; // +5 progress
  }, [activeMission]);

  const useMissionBypass = useCallback((): boolean => {
    if (!activeMission || activeMission.completed || activeMission.bypassUsed) return false;
    const now = Date.now();
    if (now > activeMission.createdAt + MISSION_BYPASS_WINDOW_MS) return false;

    const updated: Mission = { ...activeMission, bypassUsed: true };
    saveMission(updated);
    setActiveMission(updated);
    return true;
  }, [activeMission]);

  const abandonMission = useCallback(() => {
    saveMission(null);
    setActiveMission(null);
  }, []);

  const canBypass = activeMission
    ? !activeMission.completed && !activeMission.bypassUsed && Date.now() < activeMission.createdAt + MISSION_BYPASS_WINDOW_MS
    : false;

  const isExpired = activeMission
    ? Date.now() > activeMission.expiresAt
    : false;

  return {
    activeMission,
    generateMission,
    completeMission,
    useMissionBypass,
    abandonMission,
    canBypass,
    isExpired,
  };
}
