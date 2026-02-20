'use client';

import { useState, useCallback, useEffect } from 'react';

interface FullscreenState {
  isFullscreen: boolean;
  isSupported: boolean;
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
}

export function useFullscreen(): FullscreenState {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isSupported = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Silently fail — user gesture required or not supported
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Silently fail
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await exitFullscreen();
    } else {
      await requestFullscreen();
    }
  }, [requestFullscreen, exitFullscreen]);

  return { isFullscreen, isSupported, requestFullscreen, exitFullscreen, toggleFullscreen };
}
