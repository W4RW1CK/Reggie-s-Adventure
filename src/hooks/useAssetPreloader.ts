'use client';

import { useState, useEffect, useCallback } from 'react';

/** Critical assets loaded first (sprites for creation screen) */
const CRITICAL_ASSETS: string[] = [
  '/sprites/rayo-base.webp',
  '/sprites/flama-base.webp',
  '/sprites/hielo-base.webp',
];

/** Secondary assets loaded after critical (backgrounds) */
const SECONDARY_ASSETS: string[] = [
  '/backgrounds/bg-rayo-dark.webp',
  '/backgrounds/bg-rayo-light.webp',
  '/backgrounds/bg-flama-dark.webp',
  '/backgrounds/bg-flama-light.webp',
  '/backgrounds/bg-hielo-dark.webp',
  '/backgrounds/bg-hielo-light.webp',
];

interface PreloaderState {
  progress: number;
  loaded: boolean;
  error: boolean;
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Don't block on error
    img.src = src;
    // Timeout fallback — don't wait forever
    setTimeout(resolve, 5000);
  });
}

export function useAssetPreloader(): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    progress: 0,
    loaded: false,
    error: false,
  });

  const preload = useCallback(async () => {
    const total = CRITICAL_ASSETS.length + SECONDARY_ASSETS.length;

    // Load critical assets first (in parallel)
    await Promise.all(CRITICAL_ASSETS.map(preloadImage));
    setState({ progress: 50, loaded: false, error: false });

    // Load secondary assets (in parallel)
    await Promise.all(SECONDARY_ASSETS.map(preloadImage));
    setState({ progress: 100, loaded: true, error: false });
  }, []);

  useEffect(() => {
    preload();
  }, [preload]);

  return state;
}
