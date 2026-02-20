import { useState, useCallback, useEffect } from 'react';
import { StrikeData } from '@/lib/types';
import {
  STRIKE_COOLDOWN_DURATION_MS,
  STRIKE_BLOCK_DURATION_MS,
  STRIKE_RESET_DAYS,
  STORAGE_KEYS,
} from '@/lib/constants';

const STORAGE_KEY = STORAGE_KEYS.STRIKES;
const MS_PER_DAY = 86400000;

function loadStrikes(): StrikeData {
  if (typeof window === 'undefined') {
    return { count: 0, lastStrikeAt: null, cooldownUntil: null, blockedUntil: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StrikeData;
  } catch { /* ignore */ }
  return { count: 0, lastStrikeAt: null, cooldownUntil: null, blockedUntil: null };
}

function saveStrikes(data: StrikeData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Manage the photo strike system.
 * Strike 1 = warning
 * Strike 2 = 30min cooldown for 24hrs
 * Strike 3 = blocked 48hrs
 * Reset after 7 days clean
 */
export function useStrikes() {
  const [strikes, setStrikes] = useState<StrikeData>(loadStrikes);

  // Check for 7-day auto-reset on mount and periodically
  useEffect(() => {
    const checkReset = () => {
      setStrikes(prev => {
        if (prev.count === 0 || !prev.lastStrikeAt) return prev;
        const now = Date.now();
        const daysSinceLastStrike = (now - prev.lastStrikeAt) / MS_PER_DAY;
        if (daysSinceLastStrike >= STRIKE_RESET_DAYS) {
          const reset: StrikeData = { count: 0, lastStrikeAt: null, cooldownUntil: null, blockedUntil: null };
          saveStrikes(reset);
          return reset;
        }
        // Also clear expired cooldown/block
        let updated = { ...prev };
        let changed = false;
        if (prev.cooldownUntil && now >= prev.cooldownUntil) {
          updated.cooldownUntil = null;
          changed = true;
        }
        if (prev.blockedUntil && now >= prev.blockedUntil) {
          updated.blockedUntil = null;
          changed = true;
        }
        if (changed) {
          saveStrikes(updated);
          return updated;
        }
        return prev;
      });
    };

    checkReset();
    const interval = setInterval(checkReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const addStrike = useCallback((): { newCount: number; message: string } => {
    const now = Date.now();
    let result = { newCount: 0, message: '' };

    setStrikes(prev => {
      const newCount = Math.min(prev.count + 1, 3);
      const updated: StrikeData = {
        count: newCount,
        lastStrikeAt: now,
        cooldownUntil: prev.cooldownUntil,
        blockedUntil: prev.blockedUntil,
      };

      switch (newCount) {
        case 1:
          result = { newCount: 1, message: 'Tu Regenmon no pudo procesar esa memoria...' };
          break;
        case 2:
          updated.cooldownUntil = now + STRIKE_COOLDOWN_DURATION_MS;
          result = { newCount: 2, message: 'Las corrientes se agitan... necesitas esperar.' };
          break;
        case 3:
          updated.blockedUntil = now + STRIKE_BLOCK_DURATION_MS;
          result = { newCount: 3, message: 'El canal de memorias se ha cerrado temporalmente.' };
          break;
      }

      saveStrikes(updated);
      return updated;
    });

    return result;
  }, []);

  const resetStrikes = useCallback(() => {
    const reset: StrikeData = { count: 0, lastStrikeAt: null, cooldownUntil: null, blockedUntil: null };
    saveStrikes(reset);
    setStrikes(reset);
  }, []);

  const isBlocked = strikes.blockedUntil ? Date.now() < strikes.blockedUntil : false;
  const isOnCooldown = strikes.cooldownUntil ? Date.now() < strikes.cooldownUntil : false;

  return {
    strikes,
    addStrike,
    resetStrikes,
    isBlocked,
    isOnCooldown,
  };
}
