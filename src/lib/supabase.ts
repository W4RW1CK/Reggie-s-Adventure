import { createClient } from '@supabase/supabase-js';
import { RegenmonData } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a fallback client that won't cause errors when env vars are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Type mapping between client-side camelCase and Supabase snake_case
interface SupabaseRegenmon {
  id: string;
  privy_user_id: string;
  name: string;
  type: string;
  espiritu: number;
  pulso: number;
  esencia: number;
  fragmentos: number;
  memories: any[];
  chat_history: any[];
  player_name: string | null;
  name_change_used: boolean;
  tutorial_dismissed: boolean;
  chat_greeted: boolean;
  music_enabled: boolean;
  theme: string;
  text_size: string;
  activity_history: any[];
  evolution: any;
  created_at: string;
  last_updated: string;
  updated_at: string;
}

// Convert from Supabase snake_case to client camelCase
function fromSupabaseFormat(data: SupabaseRegenmon): RegenmonData {
  return {
    name: data.name,
    type: data.type as 'rayo' | 'flama' | 'hielo',
    stats: {
      espiritu: data.espiritu,
      pulso: data.pulso,
      esencia: data.esencia,
      fragmentos: data.fragmentos,
    },
    theme: data.theme as 'dark' | 'light',
    createdAt: data.created_at,
    lastUpdated: data.last_updated,
    nameChangeUsed: data.name_change_used,
    tutorialDismissed: data.tutorial_dismissed,
    memories: data.memories || [],
    evolution: data.evolution || { totalMemories: 0, stage: 1, threshold: 10 },
  };
}

// Convert from client camelCase to Supabase snake_case
function toSupabaseFormat(privyUserId: string, data: RegenmonData): Partial<SupabaseRegenmon> {
  return {
    privy_user_id: privyUserId,
    name: data.name,
    type: data.type,
    espiritu: data.stats.espiritu,
    pulso: data.stats.pulso,
    esencia: data.stats.esencia,
    fragmentos: data.stats.fragmentos,
    name_change_used: data.nameChangeUsed,
    tutorial_dismissed: data.tutorialDismissed,
    music_enabled: true, // Default
    theme: data.theme,
    text_size: 'base', // Default
    last_updated: data.lastUpdated,
    updated_at: new Date().toISOString(),
    memories: [], // Default
    chat_history: [], // Default
    player_name: null, // Default
    chat_greeted: false, // Default
    activity_history: [], // Default
    evolution: data.evolution || { totalMemories: 0, stage: 1, threshold: 10 },
  };
}

/**
 * Reads user's regenmon from Supabase
 */
export async function getRegenmon(privyUserId: string): Promise<RegenmonData | null> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping getRegenmon');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('regenmons')
      .select('*')
      .eq('privy_user_id', privyUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found - user hasn't created a regenmon yet
        return null;
      }
      console.error('Error fetching regenmon from Supabase:', error);
      return null;
    }

    if (!data) return null;

    return fromSupabaseFormat(data);
  } catch (error) {
    console.error('Error in getRegenmon:', error);
    return null;
  }
}

/**
 * Creates or updates user's row in Supabase
 */
export async function upsertRegenmon(privyUserId: string, data: RegenmonData): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping upsertRegenmon');
    return false;
  }
  
  try {
    const supabaseData = toSupabaseFormat(privyUserId, data);
    
    const { error } = await supabase
      .from('regenmons')
      .upsert(supabaseData, {
        onConflict: 'privy_user_id'
      });

    if (error) {
      console.error('Error upserting regenmon to Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in upsertRegenmon:', error);
    return false;
  }
}