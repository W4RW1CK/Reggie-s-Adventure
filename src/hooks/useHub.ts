'use client';

import { useCallback } from 'react';
import { HUB_URL, STORAGE_KEYS } from '@/lib/constants';

// --- Types ---

export interface HubRegisterRequest {
  name: string;
  ownerName: string;
  appUrl: string;
  sprite: string;
  ownerEmail?: string;
}

export interface HubRegisterResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    appUrl: string;
    balance: number;
    alreadyRegistered?: boolean;
    [key: string]: unknown;
  };
}

export interface HubSyncRequest {
  regenmonId: string;
  stats: { happiness: number; energy: number; hunger: number };
  totalPoints: number;
  trainingHistory?: unknown[];
}

export interface HubSyncResponse {
  data: {
    balance: number;
    tokensEarned?: number;
    totalPoints?: number;
  };
}

export interface HubLeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  ownerName: string;
  sprite: string;
  stage: number;
  totalPoints: number;
  balance: number;
}

export interface HubLeaderboardResponse {
  data: HubLeaderboardEntry[];
  pagination: { page: number; totalPages: number; total: number };
}

export interface HubProfileResponse {
  data: {
    id: string;
    name: string;
    ownerName: string;
    sprite: string;
    stage: number;
    stats: { happiness: number; energy: number; hunger: number };
    totalPoints: number;
    balance: number;
    totalVisits: number;
    registeredAt: string;
  };
}

export interface HubMessage {
  id: string;
  fromName: string;
  message: string;
  createdAt: string;
}

export interface HubMessagesResponse {
  data: { messages: HubMessage[] };
}

export interface HubFeedResponse {
  data: {
    senderBalance: number;
    targetName: string;
    cost: number;
  };
}

export interface HubGiftResponse {
  data: {
    senderBalance: number;
    targetName: string;
    amount: number;
  };
}

export interface HubActivityItem {
  type: string;
  description: string;
  amount?: number;
  createdAt: string;
}

export interface HubActivityResponse {
  data: { activity: HubActivityItem[] };
}

// --- Retry helper ---

async function fetchWithRetry<T>(url: string, options?: RequestInit): Promise<T | null> {
  const doFetch = async (): Promise<T> => {
    const res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) throw new Error(`HUB ${res.status}`);
    return res.json();
  };

  try {
    return await doFetch();
  } catch {
    // Retry once after 2s
    await new Promise(r => setTimeout(r, 2000));
    try {
      return await doFetch();
    } catch (e) {
      console.error('[HUB] Request failed after retry:', e);
      return null;
    }
  }
}

// --- Hook ---

export function useHub() {
  const register = useCallback(async (
    name: string,
    ownerName: string,
    appUrl: string,
    sprite: string,
    ownerEmail?: string,
  ): Promise<HubRegisterResponse | null> => {
    const body: HubRegisterRequest & { ownerEmail?: string } = { name, ownerName, appUrl, sprite };
    if (ownerEmail) body.ownerEmail = ownerEmail;
    return fetchWithRetry<HubRegisterResponse>(`${HUB_URL}/api/register`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }, []);

  const sync = useCallback(async (
    regenmonId: string,
    stats: { happiness: number; energy: number; hunger: number },
    totalPoints: number,
  ): Promise<HubSyncResponse | null> => {
    return fetchWithRetry<HubSyncResponse>(`${HUB_URL}/api/sync`, {
      method: 'POST',
      body: JSON.stringify({ regenmonId, stats, totalPoints, trainingHistory: [] }),
    });
  }, []);

  const getLeaderboard = useCallback(async (
    page = 1,
    limit = 10,
  ): Promise<HubLeaderboardResponse | null> => {
    return fetchWithRetry<HubLeaderboardResponse>(
      `${HUB_URL}/api/leaderboard?page=${page}&limit=${limit}`,
    );
  }, []);

  const getProfile = useCallback(async (id: string): Promise<HubProfileResponse | null> => {
    return fetchWithRetry<HubProfileResponse>(`${HUB_URL}/api/regenmon/${id}`);
  }, []);

  const feed = useCallback(async (targetId: string, fromId: string): Promise<HubFeedResponse | null> => {
    return fetchWithRetry<HubFeedResponse>(`${HUB_URL}/api/regenmon/${targetId}/feed`, {
      method: 'POST',
      body: JSON.stringify({ fromRegenmonId: fromId }),
    });
  }, []);

  const gift = useCallback(async (
    targetId: string,
    fromId: string,
    amount: number,
  ): Promise<HubGiftResponse | null> => {
    return fetchWithRetry<HubGiftResponse>(`${HUB_URL}/api/regenmon/${targetId}/gift`, {
      method: 'POST',
      body: JSON.stringify({ fromRegenmonId: fromId, amount }),
    });
  }, []);

  const getMessages = useCallback(async (
    id: string,
    limit = 20,
  ): Promise<HubMessagesResponse | null> => {
    return fetchWithRetry<HubMessagesResponse>(
      `${HUB_URL}/api/regenmon/${id}/messages?limit=${limit}`,
    );
  }, []);

  const sendMessage = useCallback(async (
    targetId: string,
    fromId: string,
    fromName: string,
    message: string,
  ): Promise<unknown> => {
    return fetchWithRetry(`${HUB_URL}/api/regenmon/${targetId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ fromRegenmonId: fromId, fromName, message }),
    });
  }, []);

  const getActivity = useCallback(async (
    id: string,
    limit = 10,
  ): Promise<HubActivityResponse | null> => {
    return fetchWithRetry<HubActivityResponse>(
      `${HUB_URL}/api/regenmon/${id}/activity?limit=${limit}`,
    );
  }, []);

  return {
    register,
    sync,
    getLeaderboard,
    getProfile,
    feed,
    gift,
    getMessages,
    sendMessage,
    getActivity,
  };
}
