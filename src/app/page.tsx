'use client';

import { useGameState } from '@/hooks/useGameState';
import { useScreenManager } from '@/hooks/useScreenManager';
import { useAuth } from '@/hooks/useAuth';
import { loadPlayerData } from '@/lib/storage';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/screens/LoadingScreen';
import TitleScreen from '@/components/screens/TitleScreen';
import AuthScreen from '@/components/screens/AuthScreen';
import StoryScreen from '@/components/screens/StoryScreen';
import CreationScreen from '@/components/screens/CreationScreen';
import TransitionScreen from '@/components/screens/TransitionScreen';
import GameScreen from '@/components/screens/GameScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RegenmonType } from '@/lib/types';

export default function Home() {
  const { isLoggedIn, isReady: isAuthReady, privyUserId, user } = useAuth();

  const [playerName, setPlayerName] = useState<string | undefined>();
  useEffect(() => {
    const pd = loadPlayerData();
    setPlayerName(pd?.name);
  }, []);

  const {
    regenmon,
    config,
    createRegenmon,
    updateStatAction,
    toggleMusic,
    resetGame,
    markIntroSeen,
    updateRegenmonName,
    dismissTutorial,
  } = useGameState({ privyUserId: privyUserId || undefined, isLoggedIn });

  const { 
    currentScreen, 
    navigateTo, 
    handleStartGame, 
    handleStoryComplete,
    handleAuthLogin, 
    handleContinueWithoutAccount 
  } = useScreenManager({
    regenmon,
    config,
    isLoggedIn,
    isAuthReady,
  });


  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white font-mono" style={{ maxWidth: '100vw', maxHeight: '100vh' }}>
      <div className="game-container">
        {currentScreen === 'LOADING' && (
          <LoadingScreen onComplete={() => navigateTo('TITLE')} />
        )}

        {currentScreen === 'TITLE' && (
          <TitleScreen onStart={handleStartGame} />
        )}

        {currentScreen === 'AUTH' && (
          <AuthScreen 
            onLogin={handleAuthLogin}
            onContinueWithoutAccount={handleContinueWithoutAccount}
          />
        )}

        {currentScreen === 'STORY' && (
          <StoryScreen onContinue={() => {
            markIntroSeen();
            handleStoryComplete();
          }} />
        )}

        {currentScreen === 'CREATION' && (
          <CreationScreen
            onDespertar={(name, type) => {
              createRegenmon(name, type);
              navigateTo('TRANSITION');
            }}
          />
        )}

        {currentScreen === 'TRANSITION' && (
          <TransitionScreen onComplete={() => navigateTo('GAME')} />
        )}

        {currentScreen === 'GAME' && regenmon && (
          <ErrorBoundary>
            <GameScreen
              regenmon={regenmon}
              musicEnabled={config.musicEnabled}
              onToggleMusic={toggleMusic}
              onUpdateStats={updateStatAction}
              onUpdateName={updateRegenmonName}
              onDismissTutorial={dismissTutorial}
              onReset={() => {
                resetGame();
                navigateTo('TITLE');
              }}
              isLoggedIn={isLoggedIn}
              email={user?.email}
              playerName={playerName}
            />
          </ErrorBoundary>
        )}
      </div>
    </main>
  );
}
