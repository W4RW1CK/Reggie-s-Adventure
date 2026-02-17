export interface ActivityEntry {
  action: 'purify' | 'chat' | 'search_fragments';
  fragmentChange: number;
  timestamp: number;
}

const STORAGE_KEY = 'regenmon_activity_history';
const MAX_ENTRIES = 10;

export function addActivity(action: ActivityEntry['action'], fragmentChange: number): void {
  const entries = loadHistory();
  entries.unshift({ action, fragmentChange, timestamp: Date.now() });
  const trimmed = entries.slice(0, MAX_ENTRIES);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

export function loadHistory(): ActivityEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'justo ahora';
  if (mins < 60) return `hace ${mins} min`;
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${days} días`;
}
