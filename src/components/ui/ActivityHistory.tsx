'use client';

import { useState } from 'react';
import { ActivityEntry, timeAgo } from '@/lib/activityHistory';

interface ActivityHistoryProps {
  entries: ActivityEntry[];
  isVisible: boolean;
}

const ACTION_CONFIG: Record<ActivityEntry['action'], { icon: string; label: string }> = {
  purify: { icon: '🌀', label: 'Purificó' },
  chat: { icon: '💬', label: 'Conversó' },
  search_fragments: { icon: '🔍', label: 'Buscó Fragmentos' },
};

export default function ActivityHistory({ entries, isVisible }: ActivityHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (!isVisible || entries.length === 0) return null;

  return (
    <div className="nes-container is-dark" style={{ padding: '0.5rem 0.75rem', marginTop: '0.5rem' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left text-xs sm:text-sm text-white flex justify-between items-center"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
      >
        <span>📜 Historial</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="mt-2 flex flex-col gap-1">
          {entries.map((entry, i) => {
            const cfg = ACTION_CONFIG[entry.action];
            const sign = entry.fragmentChange >= 0 ? '+' : '';
            return (
              <div key={i} className="flex justify-between items-center text-xs text-white/80">
                <span>
                  {cfg.icon} {cfg.label} → {sign}{entry.fragmentChange} 💠
                </span>
                <span className="text-white/50">{timeAgo(entry.timestamp)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
