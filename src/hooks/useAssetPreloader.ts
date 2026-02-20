'use client';

import { useState, useEffect, useCallback } from 'react';

/** All assets that must be preloaded before the game starts */
const ASSETS_TO_PRELOAD: string[] = [
  // Sprites (3 types)
  '/sprites/rayo-base.webp',
  '/sprites/flama-base.webp',
  '/sprites/hielo-base.webp',
  // Backgrounds (3 types × 2 themes = 6)
  '/backgrounds/bg-rayo-dark.webp',
  '/backgrounds/bg-rayo-light.webp',
  '/backgrounds/bg-flama-dark.webp',
  '/backgrounds/bg-flama-light.webp',
  '/backgrounds/bg-hielo-dark.webp',
  '/backgrounds/bg-hielo-light.webp',
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
