import { RegenmonData } from './types';
import { getRegenmon, upsertRegenmon } from './supabase';
import { loadRegenmon, saveRegenmon } from './storage';

// Debounce map to track pending sync operations
const pendingSyncs = new Map<string, NodeJS.Timeout>();

/**
 * Syncs local data to Supabase with debouncing (2 second delay)
 */
export async function syncToSupabase(privyUserId: string, localData: RegenmonData): Promise<boolean> {
  try {
    // Clear any existing pending sync for this user
    const existingTimeout = pendingSyncs.get(privyUserId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set up debounced sync
    return new Promise((resolve) => {
      const timeoutId = setTimeout(async () => {
        try {
          const success = await upsertRegenmon(privyUserId, localData);
          pendingSyncs.delete(privyUserId);
          resolve(success);
        } catch (error) {
          console.error('Error syncing to Supabase:', error);
          pendingSyncs.delete(privyUserId);
          resolve(false);
        }
      }, 2000); // 2 second debounce

      pendingSyncs.set(privyUserId, timeoutId);
    });
  } catch (error) {
    console.error('Error in syncToSupabase:', error);
    return false;
  }
}

/**
 * Reads from Supabase and returns the data
 */
export async function syncFromSupabase(privyUserId: string): Promise<RegenmonData | null> {
  try {
    const supabaseData = await getRegenmon(privyUserId);
    return supabaseData;
  } catch (error) {
    console.error('Error syncing from Supabase:', error);
    return null;
  }
}

/**
 * One-time migration: read localStorage → create row in Supabase
 */
export async function migrateLocalToSupabase(privyUserId: string): Promise<boolean> {
  try {
    // Check if user already has data in Supabase
    const existingData = await getRegenmon(privyUserId);
    if (existingData) {
      // User already has data in Supabase, no migration needed
      console.log('User already has data in Supabase, skipping migration');
      return true;
    }

    // Load data from localStorage
    const localData = loadRegenmon();
    if (!localData) {
      // No local data to migrate
      console.log('No local data to migrate');
      return true;
    }

    // Create row in Supabase with local data
    const success = await upsertRegenmon(privyUserId, localData);
    
    if (success) {
      console.log('Successfully migrated local data to Supabase');
      return true;
    } else {
      console.error('Failed to migrate local data to Supabase');
      return false;
    }
  } catch (error) {
    console.error('Error in migrateLocalToSupabase:', error);
    return false;
  }
}

/**
 * Hybrid sync strategy: try Supabase first, fallback to localStorage
 */
export async function loadRegenmonHybrid(privyUserId?: string): Promise<RegenmonData | null> {
  // If not logged in, use localStorage only
  if (!privyUserId) {
    return loadRegenmon();
  }

  try {
    // If logged in, try Supabase first
    const supabaseData = await syncFromSupabase(privyUserId);
    
    if (supabaseData) {
      // Update localStorage cache with Supabase data
      saveRegenmon(supabaseData);
      return supabaseData;
    }
    
    // Fallback to localStorage if Supabase fails
    const localData = loadRegenmon();
    return localData;
  } catch (error) {
    console.error('Error in loadRegenmonHybrid:', error);
    // Fallback to localStorage
    return loadRegenmon();
  }
}

/**
 * Hybrid save strategy: save to localStorage immediately, sync to Supabase if logged in
 */
export async function saveRegenmonHybrid(data: RegenmonData, privyUserId?: string): Promise<boolean> {
  try {
    // Always save to localStorage first (immediate)
    saveRegenmon(data);
    
    // If logged in, sync to Supabase (debounced)
    if (privyUserId) {
      // Don't await this - it's fire-and-forget with debouncing
      syncToSupabase(privyUserId, data).catch(error => {
        console.error('Background sync to Supabase failed:', error);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveRegenmonHybrid:', error);
    return false;
  }
}