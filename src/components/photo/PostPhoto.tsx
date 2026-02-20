'use client';

import { VisionResponse, ResonanceLevel, RegenmonType } from '@/lib/types';

interface PostPhotoProps {
  result: VisionResponse;
  regenmonType: RegenmonType;
  regenmonName: string;
  missionCompleted?: boolean;
  missionBonus?: number;
  onChat: () => void;
  onWorld: () => void;
}

function getResonanceLabel(level: ResonanceLevel): { text: string; className: string } {
  switch (level) {
    case 'strong':
      return { text: 'Resonancia fuerte ✨', className: 'postphoto__resonance--strong' };
    case 'medium':
      return { text: 'Resonancia media', className: 'postphoto__resonance--medium' };
    case 'weak':
      return { text: 'Resonancia débil', className: 'postphoto__resonance--weak' };
    case 'penalizing':
      return { text: '⚠️ Penalizante', className: 'postphoto__resonance--penalizing' };
  }
}

function getSpriteClass(level: ResonanceLevel): string {
  switch (level) {
    case 'strong': return 'postphoto__sprite--happy';
    case 'medium': return 'postphoto__sprite--neutral';
    case 'weak': return 'postphoto__sprite--neutral';
    case 'penalizing': return 'postphoto__sprite--penalizing';
  }
}

export default function PostPhoto({ result, regenmonType, regenmonName, missionCompleted, missionBonus, onChat, onWorld }: PostPhotoProps) {
  const resonance = getResonanceLabel(result.resonanceLevel);
  const spriteClass = getSpriteClass(result.resonanceLevel);
  const isPenalizing = result.resonanceLevel === 'penalizing';

  const spriteFile = `/sprites/${regenmonType}-base.webp`;

  return (
    <div className="postphoto">
      <div className="postphoto__content">
        {/* Sprite */}
        <div className={`postphoto__sprite ${spriteClass}`}>
          <img
            src={spriteFile}
            alt={regenmonName}
            className="postphoto__sprite-img"
            width={120}
            height={120}
          />
        </div>

        {/* Regenmon name */}
        <p className="postphoto__name">{regenmonName}</p>

        {/* Resonance label */}
        <div className={`postphoto__resonance ${resonance.className}`}>
          {resonance.text}
        </div>

        {/* Diary entry */}
        <p className="postphoto__diary">&ldquo;{result.diaryEntry}&rdquo;</p>

        {/* Deltas */}
        <div className="postphoto__deltas">
          {result.fragments > 0 && (
            <span className="postphoto__delta postphoto__delta--fragments">+{result.fragments} 🔮</span>
          )}
          {result.spiritChange !== 0 && (
            <span className={`postphoto__delta ${result.spiritChange > 0 ? 'postphoto__delta--positive' : 'postphoto__delta--negative'}`}>
              {result.spiritChange > 0 ? '+' : ''}{result.spiritChange} ✨
            </span>
          )}
          {result.pulseChange !== 0 && (
            <span className={`postphoto__delta ${result.pulseChange > 0 ? 'postphoto__delta--positive' : 'postphoto__delta--negative'}`}>
              {result.pulseChange > 0 ? '+' : ''}{result.pulseChange} 💛
            </span>
          )}
          {missionCompleted && missionBonus && missionBonus > 0 && (
            <span className="postphoto__delta postphoto__delta--mission">🎯 +{missionBonus} progreso bonus</span>
          )}
          {isPenalizing && (
            <span className="postphoto__delta postphoto__delta--negative">⚠️ Strike registrado</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="postphoto__actions">
          {!isPenalizing && (
            <button className="postphoto__btn postphoto__btn--chat" onClick={onChat}>
              💬 Conversar
            </button>
          )}
          <button className="postphoto__btn postphoto__btn--world" onClick={onWorld}>
            🏠 Volver
          </button>
        </div>
      </div>
    </div>
  );
}
