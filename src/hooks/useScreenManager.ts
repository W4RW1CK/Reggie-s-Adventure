import { useState } from 'react';
import { useGameState } from './useGameState';

export type ScreenState = 'LOADING' | 'TITLE' | 'STORY' | 'CREATION' | 'TRANSITION' | 'GAME';

export function useScreenManager() {
    const { regenmon, config, loading: dataLoading } = useGameState();
    const [currentScreen, setCurrentScreen] = useState<ScreenState>('LOADING');


    const navigateTo = (screen: ScreenState) => {
        setCurrentScreen(screen);
    };

    const handleStartGame = () => {
        if (config.isFirstTime) {
            navigateTo('STORY');
        } else if (regenmon) {
            navigateTo('GAME');
        } else {
            navigateTo('CREATION');
        }
    };

    return {
        currentScreen,
        navigateTo,
        handleStartGame,
        isLoading: dataLoading,
    };
}
