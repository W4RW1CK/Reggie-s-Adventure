import { useState } from 'react';
import { RegenmonData, AppConfig } from '@/lib/types';

export type ScreenState = 'LOADING' | 'TITLE' | 'STORY' | 'CREATION' | 'TRANSITION' | 'GAME';

interface UseScreenManagerProps {
    regenmon: RegenmonData | null;
    config: AppConfig;
}

export function useScreenManager({ regenmon, config }: UseScreenManagerProps) {
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
    };
}
