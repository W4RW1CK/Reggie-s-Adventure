'use client';

import { useGameState } from '@/hooks/useGameState';
import { useScreenManager } from '@/hooks/useScreenManager';
import LoadingScreen from '@/components/screens/LoadingScreen';
import TitleScreen from '@/components/screens/TitleScreen';
import StoryScreen from '@/components/screens/StoryScreen';
import CreationScreen from '@/components/screens/CreationScreen';
import {
  GameScreen
} from '@/components/screens/placeholders';
import { RegenmonType } from '@/lib/types';

export default function Home() {
  const { createRegenmon, resetGame, markIntroSeen } = useGameState();
  const { currentScreen, navigateTo, handleStartGame } = useScreenManager();

  // Debug (optional, can remove later)
  // console.log('Current Screen:', currentScreen);

  return (
    <main className="min-h-screen w-full overflow-hidden bg-black text-white font-mono">
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
            // In real flow: Go to Transition -> Game
            // For now: Direct to Game
            navigateTo('GAME');
          }}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameScreen onReset={() => {
          resetGame();
          navigateTo('TITLE'); // or LOADING
        }} />
      )}
    </main>
  );
}
