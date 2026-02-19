'use client';

import { useState, useEffect, useCallback } from 'react';

/** All assets that must be preloaded before the game starts */
const ASSETS_TO_PRELOAD: string[] = [
  // Sprites (3 types)
  '/sprites/rayo-base.png',
  '/sprites/flama-base.png',
  '/sprites/hielo-base.png',
  // Backgrounds (3 types × 2 themes = 6)
  '/backgrounds/bg-rayo-dark.png',
  '/backgrounds/bg-rayo-light.png',
  '/backgrounds/bg-flama-dark.png',
  '/backgrounds/bg-flama-light.png',
  '/backgrounds/bg-hielo-dark.png',
  '/backgrounds/bg-hielo-light.png',
];

interface PreloaderState {
  progress: number;   // 0-100
  loaded: boolean;
  error: boolean;
}

export function useAssetPreloader(): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    progress: 0,
    loaded: false,
    error: false,
  });

  const preload = useCallback(() => {
    const total = ASSETS_TO_PRELOAD.length;
    if (total === 0) {
      setState({ progress: 100, loaded: true, error: false });
      return;
    }

    let loadedCount = 0;
    let hasError = false;

    const onAssetDone = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / total) * 100);
      if (loadedCount >= total) {
        setState({ progress: 100, loaded: true, error: hasError });
      } else {
        setState(prev => ({ ...prev, progress }));
      }
    };

    ASSETS_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.onload = onAssetDone;
      img.onerror = () => {
        hasError = true;
        onAssetDone();
      };
      img.src = src;
    });
  }, []);

  useEffect(() => {
    preload();
  }, [preload]);

  return state;
}
