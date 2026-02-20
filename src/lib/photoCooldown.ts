import {
  PHOTO_COOLDOWN_MS,
  PHOTO_FAILED_COOLDOWN_MS,
  MISSION_BYPASS_WINDOW_MS,
} from './constants';
import { Mission, StrikeData, CooldownStatus } from './types';

export type { CooldownStatus };

/**
 * Check if the user can take a photo right now.
 * Considers: standard cooldown, strike cooldown/block, mission bypass.
 */
export function getPhotoCooldownStatus(
  lastPhotoAt: number | null,
  strikes: StrikeData,
  activeMission: Mission | null,
  failed?: boolean,
): CooldownStatus {
  const now = Date.now();

  // Check if blocked by strikes (strike 3 = 48hr block)
  if (strikes.blockedUntil && now < strikes.blockedUntil) {
    return {
      canTakePhoto: false,
      remainingMs: strikes.blockedUntil - now,
      reason: 'blocked',
    };
  }

  // Check if in strike-2 cooldown (30min cooldown for 24hrs)
  if (strikes.cooldownUntil && now < strikes.cooldownUntil) {
    return {
      canTakePhoto: false,
      remainingMs: strikes.cooldownUntil - now,
      reason: 'strike_cooldown',
    };
  }

  // If no previous photo, good to go
  if (!lastPhotoAt) {
    return { canTakePhoto: true, remainingMs: 0, reason: 'ready' };
  }

  const cooldownMs = failed ? PHOTO_FAILED_COOLDOWN_MS : PHOTO_COOLDOWN_MS;
  const elapsed = now - lastPhotoAt;

  // Check mission bypass: 1 photo allowed within 30min window, even during cooldown
  if (
    activeMission &&
    !activeMission.completed &&
    !activeMission.bypassUsed &&
    now < activeMission.createdAt + MISSION_BYPASS_WINDOW_MS
  ) {
    // Mission bypass available — skip cooldown
    return { canTakePhoto: true, remainingMs: 0, reason: 'ready' };
  }

  if (elapsed < cooldownMs) {
    return {
      canTakePhoto: false,
      remainingMs: cooldownMs - elapsed,
      reason: 'cooldown',
    };
  }

  return { canTakePhoto: true, remainingMs: 0, reason: 'ready' };
}

/**
 * Format remaining cooldown ms into a human-readable string.
 */
export function formatCooldown(ms: number): string {
  if (ms <= 0) return '';
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const remainMin = minutes % 60;
    return `${hours}h ${remainMin}m`;
  }
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
