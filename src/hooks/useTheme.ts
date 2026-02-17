'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';
type TextSize = 'sm' | 'base' | 'lg';

interface ThemeState {
  theme: Theme;
  textSize: TextSize;
  toggleTheme: () => void;
  setTextSize: (size: TextSize) => void;
}

const STORAGE_KEY = 'regenmon_theme';

function loadFromStorage(): { theme: Theme; textSize: TextSize } {
  if (typeof window === 'undefined') return { theme: 'dark', textSize: 'base' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        theme: parsed.theme === 'light' ? 'light' : 'dark',
        textSize: ['sm', 'base', 'lg'].includes(parsed.textSize) ? parsed.textSize : 'base',
      };
    }
  } catch {}
  return { theme: 'dark', textSize: 'base' };
}

function applyToHTML(theme: Theme, textSize: TextSize) {
  const html = document.documentElement;
  html.classList.remove('theme-dark', 'theme-light', 'text-sm', 'text-base', 'text-lg');
  html.classList.add(`theme-${theme}`, `text-${textSize}`);
}

export function useTheme(): ThemeState {
  const [theme, setTheme] = useState<Theme>('dark');
  const [textSize, setTextSizeState] = useState<TextSize>('base');

  useEffect(() => {
    const saved = loadFromStorage();
    setTheme(saved.theme);
    setTextSizeState(saved.textSize);
    applyToHTML(saved.theme, saved.textSize);
  }, []);

  const persist = useCallback((t: Theme, ts: TextSize) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: t, textSize: ts }));
    applyToHTML(t, ts);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persist(next, textSize);
      return next;
    });
  }, [textSize, persist]);

  const setTextSize = useCallback((size: TextSize) => {
    setTextSizeState(size);
    persist(theme, size);
  }, [theme, persist]);

  return { theme, textSize, toggleTheme, setTextSize };
}
