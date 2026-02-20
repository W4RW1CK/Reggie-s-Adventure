import { useState, useCallback } from 'react';
import { DiaryEntry } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

const STORAGE_KEY = STORAGE_KEYS.DIARY_ENTRIES;
const MAX_ENTRIES = 50;

function loadEntries(): DiaryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: DiaryEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/**
 * Hook for managing diary entries (Memorias tab in Diario).
 * Stores DiaryEntry objects from photo evaluations.
 */
export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>(loadEntries);

  const addEntry = useCallback((entry: DiaryEntry) => {
    setEntries(prev => {
      const updated = [entry, ...prev].slice(0, MAX_ENTRIES);
      saveEntries(updated);
      return updated;
    });
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { entries, addEntry, clearEntries };
}
