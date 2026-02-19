'use client';

import { ViewState } from '@/hooks/useViewState';

interface BottomBarProps {
  currentView: ViewState;
  onChatClick: () => void;
  onPhotoClick: () => void;
  onDiarioClick: () => void;
}

export default function BottomBar({ currentView, onChatClick, onPhotoClick, onDiarioClick }: BottomBarProps) {
  return (
    <nav className="s4-bottom-bar" role="navigation" aria-label="Navegación principal">
      <button
        className={`s4-bottom-bar__bubble ${currentView === 'chat' ? 's4-bottom-bar__bubble--active' : ''}`}
        onClick={onChatClick}
        aria-label="Chat"
        aria-current={currentView === 'chat' ? 'page' : undefined}
      >
        <span className="s4-bottom-bar__icon">💬</span>
        <span className="s4-bottom-bar__label">Chat</span>
      </button>

      <button
        className={`s4-bottom-bar__bubble ${currentView === 'photo' ? 's4-bottom-bar__bubble--active' : ''}`}
        onClick={onPhotoClick}
        aria-label="Foto"
        aria-current={currentView === 'photo' ? 'page' : undefined}
      >
        <span className="s4-bottom-bar__icon">📷</span>
        <span className="s4-bottom-bar__label">Foto</span>
      </button>

      <button
        className={`s4-bottom-bar__bubble`}
        onClick={onDiarioClick}
        aria-label="Diario"
      >
        <span className="s4-bottom-bar__icon">📖</span>
        <span className="s4-bottom-bar__label">Diario</span>
      </button>
    </nav>
  );
}
