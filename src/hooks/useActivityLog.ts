import { useState, useCallback } from 'react';
import { FragmentTransaction } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';

const STORAGE_KEY = STORAGE_KEYS.ACTIVITY_LOG;
const MAX_ENTRIES = 50;

function loadEntries(): FragmentTransaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: FragmentTransaction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/**
 * Hook for managing the S4 activity log (Historial tab in Diario).
 * Stores FragmentTransaction entries in localStorage.
 */
export function useActivityLog() {
  const [entries, setEntries] = useState<FragmentTransaction[]>(loadEntries);

  const addEntry = useCallback((entry: Omit<FragmentTransaction, 'timestamp'>) => {
    setEntries(prev => {
      const newEntry: FragmentTransaction = { ...entry, timestamp: Date.now() };
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      saveEntries(updated);
      return updated;
    });
  }, []);

  const clearLog = useCallback(() => {
    setEntries([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { entries, addEntry, clearLog };
}
