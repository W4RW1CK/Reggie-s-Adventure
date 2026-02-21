'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { DiaryEntry, FragmentTransaction } from '@/lib/types';

type DiarioTab = 'memorias' | 'historial';

interface DiarioPanelProps {
  isOpen: boolean;
  onClose: () => void;
  diaryEntries: DiaryEntry[];
  activityLog: FragmentTransaction[];
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'justo ahora';
  if (mins < 60) return `hace ${mins} min`;
  if (hours < 24) return `hace ${hours}h`;
  if (days === 1) return 'ayer';
  return `hace ${days} días`;
}

function resonanceLabel(resonance: string): string {
  switch (resonance) {
    case 'strong': return '✨ Fuerte';
    case 'medium': return '🌟 Media';
    case 'weak': return '💫 Débil';
    case 'penalizing': return '⚠️ Penalizada';
    default: return resonance;
  }
}

function resonanceEmoji(resonance: string): string {
  switch (resonance) {
    case 'strong': return '✨';
    case 'medium': return '🌟';
    case 'weak': return '💫';
    case 'penalizing': return '⚠️';
    default: return '📷';
  }
}

function activityIcon(action: FragmentTransaction['action']): string {
  switch (action) {
    case 'photo': return '🖼️';
    case 'chat': return '💬';
    case 'purify_spirit': return '🔮';
    case 'purify_essence': return '🔮';
    case 'search_fragments': return '🔍';
    case 'mission': return '🎯';
    default: return '📋';
  }
}

function activityLabel(action: FragmentTransaction['action']): string {
  switch (action) {
    case 'photo': return 'Foto compartida';
    case 'chat': return 'Conversación';
    case 'purify_spirit': return 'Purificación (Espíritu)';
    case 'purify_essence': return 'Purificación (Esencia)';
    case 'search_fragments': return 'Fragmentos encontrados';
    case 'mission': return 'Misión completada';
    default: return action;
  }
}

export default function DiarioPanel({ isOpen, onClose, diaryEntries, activityLog }: DiarioPanelProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<DiarioTab>('memorias');
  const [closing, setClosing] = useState(false);

  useFocusTrap(overlayRef, isOpen && !closing);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={`diario-overlay ${closing ? 'diario-overlay--closing' : ''}`}
      onClick={(e) => {
        // Only close on backdrop click (desktop)
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Diario"
    >
      <div className={`diario-panel ${closing ? 'diario-panel--closing' : ''}`}>
        {/* Header */}
        <div className="diario__header">
          <h2 className="diario__title">📖 Diario</h2>
          <button
            className="diario__close"
            onClick={handleClose}
            aria-label="Cerrar diario"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="diario__tabs" role="tablist">
          <button
            className={`diario__tab ${activeTab === 'memorias' ? 'diario__tab--active' : ''}`}
            onClick={() => setActiveTab('memorias')}
            role="tab"
            aria-selected={activeTab === 'memorias'}
            aria-controls="diario-memorias"
          >
            Memorias
          </button>
          <button
            className={`diario__tab ${activeTab === 'historial' ? 'diario__tab--active' : ''}`}
            onClick={() => setActiveTab('historial')}
            role="tab"
            aria-selected={activeTab === 'historial'}
            aria-controls="diario-historial"
          >
            Historial
          </button>
        </div>

        {/* Content */}
        <div className="diario__content">
          {/* Memorias Tab */}
          {activeTab === 'memorias' && (
            <div id="diario-memorias" role="tabpanel" className="diario__tabpanel">
              {diaryEntries.length === 0 ? (
                <div className="diario__empty">
                  <p>Aún no has compartido memorias.</p>
                  <p>¡Toma tu primera foto! 📷</p>
                </div>
              ) : (
                <div className="diario__list">
                  {diaryEntries.map((entry, i) => (
                    <div key={`memo-${entry.timestamp}-${i}`} className="diario__entry diario__entry--memoria">
                      <div className="diario__entry-icon">{resonanceEmoji(entry.resonance)}</div>
                      <div className="diario__entry-body">
                        <p className="diario__entry-text">{entry.text}</p>
                        <div className="diario__entry-meta">
                          <span className={`diario__resonance diario__resonance--${entry.resonance}`}>
                            {resonanceLabel(entry.resonance)}
                          </span>
                          <span className="diario__entry-source">
                            {entry.source === 'photo' ? '📷' : entry.source === 'fracture' ? '⚡' : '🎯'}
                          </span>
                          <span className="diario__entry-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Historial Tab */}
          {activeTab === 'historial' && (
            <div id="diario-historial" role="tabpanel" className="diario__tabpanel">
              {activityLog.length === 0 ? (
                <div className="diario__empty">
                  <p>Tu aventura acaba de comenzar...</p>
                </div>
              ) : (
                <div className="diario__list">
                  {activityLog.map((entry, i) => (
                    <div key={`act-${entry.timestamp}-${i}`} className="diario__entry diario__entry--activity">
                      <div className="diario__entry-icon">{activityIcon(entry.action)}</div>
                      <div className="diario__entry-body">
                        <p className="diario__entry-label">{activityLabel(entry.action)}</p>
                        {entry.detail && (
                          <p className="diario__entry-detail">{entry.detail}</p>
                        )}
                        <div className="diario__entry-meta">
                          {entry.fragmentChange !== 0 && (
                            <span className={`diario__frag-delta ${entry.fragmentChange > 0 ? 'diario__frag-delta--positive' : 'diario__frag-delta--negative'}`}>
                              {entry.fragmentChange > 0 ? '+' : ''}{entry.fragmentChange} 💠
                            </span>
                          )}
                          {entry.progressChange > 0 && (
                            <span className="diario__progress-delta">
                              +{entry.progressChange} progreso
                            </span>
                          )}
                          <span className="diario__entry-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
