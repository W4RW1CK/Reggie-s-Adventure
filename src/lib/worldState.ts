export type WorldHealth = 'corrupted' | 'healing' | 'recovering' | 'flourishing' | 'regenerated';

export interface WorldStateMetadata {
  health: WorldHealth;
  description: string;
  backgroundIntensity: number;
  particleFrequency: number;
  corruptionLevel: number;
}

export function getWorldState(stage: number): WorldStateMetadata {
  switch (stage) {
    case 1:
      return {
        health: 'corrupted',
        description: 'El mundo digital sigue sumido en la corrupción. Las corrientes están turbias.',
        backgroundIntensity: 0.2,
        particleFrequency: 0.0,
        corruptionLevel: 1.0,
      };
    case 2:
      return {
        health: 'healing',
        description: 'Grietas de luz aparecen. El primer signo de que la regeneración es posible.',
        backgroundIntensity: 0.4,
        particleFrequency: 0.2,
        corruptionLevel: 0.75,
      };
    case 3:
      return {
        health: 'recovering',
        description: 'Zonas claras emergen entre la oscuridad. El equilibrio se restaura lentamente.',
        backgroundIntensity: 0.6,
        particleFrequency: 0.5,
        corruptionLevel: 0.5,
      };
    case 4:
      return {
        health: 'flourishing',
        description: 'El mundo brilla con nueva energía. La corrupción retrocede.',
        backgroundIntensity: 0.8,
        particleFrequency: 0.75,
        corruptionLevel: 0.25,
      };
    case 5:
      return {
        health: 'regenerated',
        description: 'La Red Primordial renace. El mundo digital ha sido regenerado.',
        backgroundIntensity: 1.0,
        particleFrequency: 1.0,
        corruptionLevel: 0.0,
      };
    default:
      return {
        health: 'corrupted',
        description: 'El mundo digital sigue sumido en la corrupción.',
        backgroundIntensity: 0.2,
        particleFrequency: 0.0,
        corruptionLevel: 1.0,
      };
  }
}
