'use client';

import { useState, useCallback } from 'react';

export type ViewState = 'world' | 'chat' | 'photo';

interface ViewStateManager {
  currentView: ViewState;
  goToWorld: () => void;
  goToChat: () => void;
  goToPhoto: () => void;
  setView: (view: ViewState) => void;
}

export function useViewState(initialView: ViewState = 'world'): ViewStateManager {
  const [currentView, setCurrentView] = useState<ViewState>(initialView);

  const goToWorld = useCallback(() => setCurrentView('world'), []);
  const goToChat = useCallback(() => setCurrentView('chat'), []);
  const goToPhoto = useCallback(() => setCurrentView('photo'), []);
  const setView = useCallback((view: ViewState) => setCurrentView(view), []);

  return { currentView, goToWorld, goToChat, goToPhoto, setView };
}
