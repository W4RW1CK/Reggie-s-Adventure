'use client';

import { ReactNode } from 'react';
import { ViewState } from '@/hooks/useViewState';
import HUD from './HUD';
import BottomBar from './BottomBar';

interface GameLayoutProps {
  currentView: ViewState;
  fragments: number;
  isLoggedIn: boolean;
  missionActive: boolean;
  onSettingsClick: () => void;
  onChatClick: () => void;
  onPhotoClick: () => void;
  onDiarioClick: () => void;
  worldContent: ReactNode;
  chatContent: ReactNode;
  photoContent: ReactNode;
}

export default function GameLayout({
  currentView,
  fragments,
  isLoggedIn,
  missionActive,
  onSettingsClick,
  onChatClick,
  onPhotoClick,
  onDiarioClick,
  worldContent,
  chatContent,
  photoContent,
}: GameLayoutProps) {
  return (
    <div className="s4-layout">
      {/* HUD — always visible */}
      <HUD
        fragments={fragments}
        isLoggedIn={isLoggedIn}
        missionActive={missionActive}
        onSettingsClick={onSettingsClick}
      />

      {/* Main content area */}
      <div className="s4-layout__content">
        {/* World panel */}
        <div
          className={`s4-layout__panel s4-layout__panel--world ${currentView === 'world' ? 's4-layout__panel--visible' : ''}`}
          aria-hidden={currentView !== 'world'}
        >
          {worldContent}
        </div>

        {/* Chat panel */}
        <div
          className={`s4-layout__panel s4-layout__panel--chat ${currentView === 'chat' ? 's4-layout__panel--visible' : ''}`}
          aria-hidden={currentView !== 'chat'}
        >
          {chatContent}
        </div>

        {/* Photo panel */}
        <div
          className={`s4-layout__panel s4-layout__panel--photo ${currentView === 'photo' ? 's4-layout__panel--visible' : ''}`}
          aria-hidden={currentView !== 'photo'}
        >
          {photoContent}
        </div>
      </div>

      {/* Bottom bar — mobile/tablet vertical only (hidden via CSS on desktop and tablet landscape) */}
      <BottomBar
        currentView={currentView}
        onChatClick={onChatClick}
        onPhotoClick={onPhotoClick}
        onDiarioClick={onDiarioClick}
      />
    </div>
  );
}
