'use client';

import { useGameState } from '@/hooks/useGameState';
import { useScreenManager } from '@/hooks/useScreenManager';
import LoadingScreen from '@/components/screens/LoadingScreen';
import TitleScreen from '@/components/screens/TitleScreen';
import StoryScreen from '@/components/screens/StoryScreen';
import CreationScreen from '@/components/screens/CreationScreen';
import TransitionScreen from '@/components/screens/TransitionScreen';
import GameScreen from '@/components/screens/GameScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RegenmonType } from '@/lib/types';

export default function Home() {
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
  } = useGameState();

  const { currentScreen, navigateTo, handleStartGame } = useScreenManager({
    regenmon,
    config,
  });


  return (
    <main className="min-h-screen w-full overflow-hidden bg-black text-white font-mono">
      <div className="game-container">
        {currentScreen === 'LOADING' && (
          <LoadingScreen onComplete={() => navigateTo('TITLE')} />
        )}

        {currentScreen === 'TITLE' && (
          <TitleScreen onStart={handleStartGame} />
        )}

        {currentScreen === 'STORY' && (
          <StoryScreen onContinue={() => {
            markIntroSeen();
            navigateTo('CREATION');
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
            />
          </ErrorBoundary>
        )}
      </div>
    </main>
  );
}
