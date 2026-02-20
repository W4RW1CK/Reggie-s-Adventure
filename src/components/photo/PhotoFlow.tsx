'use client';

import { useState, useCallback } from 'react';
import { VisionResponse, RegenmonType, RegenmonMemory, RegenmonStats, Mission, StrikeData } from '@/lib/types';
import { getPhotoCooldownStatus } from '@/lib/photoCooldown';
import {
  PROGRESS_PHOTO_WEAK, PROGRESS_PHOTO_MEDIUM, PROGRESS_PHOTO_STRONG,
} from '@/lib/constants';
import PreCamera from './PreCamera';
import PostPhoto from './PostPhoto';

type PhotoStep = 'pre-camera' | 'loading' | 'result';

function getProgressForResonance(level: string): number {
  const ranges: Record<string, [number, number]> = {
    weak: PROGRESS_PHOTO_WEAK,
    medium: PROGRESS_PHOTO_MEDIUM,
    strong: PROGRESS_PHOTO_STRONG,
  };
  const range = ranges[level];
  if (!range) return 0;
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

interface PhotoFlowProps {
  regenmonType: RegenmonType;
  regenmonName: string;
  stats: RegenmonStats;
  memories: RegenmonMemory[];
  lastPhotoAt: number | null;
  strikes: StrikeData;
  activeMission: Mission | null;
  onAddFragments: (deltas: Partial<RegenmonStats>) => void;
  onAddProgress: (amount: number) => void;
  onAddPhotoEntry: (entry: import('@/lib/types').PhotoEntry) => void;
  onAddStrike: () => { newCount: number; message: string };
  onCompleteMission: () => number;
  onUseMissionBypass: () => boolean;
  onGoToChat: () => void;
  onGoToWorld: () => void;
  onSetLastPhotoAt: (ts: number) => void;
}

export default function PhotoFlow({
  regenmonType,
  regenmonName,
  stats,
  memories,
  lastPhotoAt,
  strikes,
  activeMission,
  onAddFragments,
  onAddProgress,
  onAddPhotoEntry,
  onAddStrike,
  onCompleteMission,
  onUseMissionBypass,
  onGoToChat,
  onGoToWorld,
  onSetLastPhotoAt,
}: PhotoFlowProps) {
  const [step, setStep] = useState<PhotoStep>('pre-camera');
  const [result, setResult] = useState<VisionResponse | null>(null);
  const [loadingText, setLoadingText] = useState('Tu Regenmon está sintiendo esta memoria...');
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [missionBonusAmount, setMissionBonusAmount] = useState(0);

  const cooldownStatus = getPhotoCooldownStatus(lastPhotoAt, strikes, activeMission);

  const handleCapture = useCallback(async (base64: string) => {
    setStep('loading');
    setLoadingText('Tu Regenmon está sintiendo esta memoria...');

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          regenmonType,
          regenmonName,
          stats: { espiritu: stats.espiritu, pulso: stats.pulso, esencia: stats.esencia },
          memories,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const visionResult: VisionResponse = await response.json();

      // Apply results
      const now = Date.now();
      onSetLastPhotoAt(now);

      // Add fragments + stat changes
      const deltas: Partial<RegenmonStats> = {};
      if (visionResult.fragments > 0) deltas.fragmentos = visionResult.fragments;
      if (visionResult.spiritChange !== 0) deltas.espiritu = visionResult.spiritChange;
      if (visionResult.pulseChange !== 0) deltas.pulso = visionResult.pulseChange;
      if (visionResult.essenceChange !== 0) deltas.esencia = visionResult.essenceChange;
      if (Object.keys(deltas).length > 0) onAddFragments(deltas);

      // Add progress
      const progress = getProgressForResonance(visionResult.resonanceLevel);
      if (progress > 0) onAddProgress(progress);

      // Check mission completion
      let missionBonus = 0;
      if (activeMission && !activeMission.completed) {
        missionBonus = onCompleteMission();
        if (missionBonus > 0) {
          onAddProgress(missionBonus);
          setMissionCompleted(true);
          setMissionBonusAmount(missionBonus);
        }
      }

      // Add photo entry
      onAddPhotoEntry({
        timestamp: now,
        resonanceLevel: visionResult.resonanceLevel,
        fragmentsEarned: visionResult.fragments,
        progressEarned: progress + missionBonus,
        diaryEntry: visionResult.diaryEntry,
        resonanceReason: visionResult.resonanceReason,
      });

      // Handle penalizing
      if (visionResult.resonanceLevel === 'penalizing') {
        onAddStrike();
      }

      setResult(visionResult);
      setStep('result');
    } catch {
      // Fallback: go back to pre-camera
      setStep('pre-camera');
    }
  }, [regenmonType, regenmonName, stats, memories, activeMission, onAddFragments, onAddProgress, onAddPhotoEntry, onAddStrike, onCompleteMission, onSetLastPhotoAt]);

  if (step === 'loading') {
    return (
      <div className="photoflow-loading">
        <div className="photoflow-loading__spinner" />
        <p className="photoflow-loading__text">{loadingText}</p>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <PostPhoto
        result={result}
        regenmonType={regenmonType}
        regenmonName={regenmonName}
        missionCompleted={missionCompleted}
        missionBonus={missionBonusAmount}
        onChat={onGoToChat}
        onWorld={onGoToWorld}
      />
    );
  }

  return (
    <PreCamera
      cooldownStatus={cooldownStatus}
      activeMission={activeMission}
      onCapture={handleCapture}
      onBack={onGoToWorld}
    />
  );
}
