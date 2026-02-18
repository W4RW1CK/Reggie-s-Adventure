'use client';

import { useState } from 'react';
import { ActivityEntry, timeAgo } from '@/lib/activityHistory';

interface ActivityHistoryProps {
  entries: ActivityEntry[];
  isVisible: boolean;
  defaultExpanded?: boolean;
}

const ACTION_CONFIG: Record<ActivityEntry['action'], { icon: string; label: string }> = {
  purify: { icon: '🌀', label: 'Purificó' },
  chat: { icon: '💬', label: 'Conversó' },
  search_fragments: { icon: '🔍', label: 'Buscó Fragmentos' },
};

export default function ActivityHistory({ entries, isVisible, defaultExpanded = false }: ActivityHistoryProps) {
  if (!isVisible || entries.length === 0) return null;

  return (
    <div className="nes-container is-dark" style={{ padding: '0.5rem 0.75rem' }}>
      <div className="flex items-center justify-between mb-2" style={{ color: 'var(--theme-text)' }}>
        <span className="text-xs sm:text-sm font-bold">📜 Historial</span>
      </div>
      <div className="flex flex-col gap-1">
        {entries.map((entry, i) => {
          const cfg = ACTION_CONFIG[entry.action];
          const sign = entry.fragmentChange >= 0 ? '+' : '';
          return (
            <div key={i} className="flex justify-between items-center text-xs" style={{ color: 'var(--theme-text)' }}>
              <span>
                {cfg.icon} {cfg.label} → {sign}{entry.fragmentChange} 💠
              </span>
              <span style={{ color: 'var(--theme-text-secondary)' }}>{timeAgo(entry.timestamp)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
