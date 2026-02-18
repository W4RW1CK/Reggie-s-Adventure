import { useState } from 'react';
import { RegenmonData, AppConfig } from '@/lib/types';

export type ScreenState = 'LOADING' | 'TITLE' | 'AUTH' | 'STORY' | 'CREATION' | 'TRANSITION' | 'GAME';

interface UseScreenManagerProps {
    regenmon: RegenmonData | null;
    config: AppConfig;
    isLoggedIn?: boolean;
    isAuthReady?: boolean;
}

export function useScreenManager({ 
    regenmon, 
    config, 
    isLoggedIn = false, 
    isAuthReady = false 
}: UseScreenManagerProps) {
    const [currentScreen, setCurrentScreen] = useState<ScreenState>('LOADING');

    const navigateTo = (screen: ScreenState) => {
        setCurrentScreen(screen);
    };

    const handleStartGame = () => {
        // If not ready, can't make auth decisions yet
        if (!isAuthReady) {
            return;
        }

        // Always show story first if first time
        if (config.isFirstTime) {
            navigateTo('STORY');
        } else if (isLoggedIn) {
            if (regenmon) {
                navigateTo('GAME');
            } else {
                navigateTo('CREATION');
            }
        } else {
            // Not logged in, returning user — show auth choice
            navigateTo('AUTH');
        }
    };

    const handleStoryComplete = () => {
        // Story done — now auth if not logged in, otherwise creation/game
        if (!isLoggedIn) {
            navigateTo('AUTH');
        } else if (regenmon) {
            navigateTo('GAME');
        } else {
            navigateTo('CREATION');
        }
    };

    const handleAuthLogin = () => {
        // After login, proceed with normal flow
        if (regenmon) {
            navigateTo('GAME');
        } else {
            navigateTo('CREATION');
        }
    };

    const handleContinueWithoutAccount = () => {
        // Proceed with normal flow in demo mode
        if (regenmon) {
            navigateTo('GAME');
        } else {
            navigateTo('CREATION');
        }
    };

    return {
        currentScreen,
        navigateTo,
        handleStartGame,
        handleStoryComplete,
        handleAuthLogin,
        handleContinueWithoutAccount,
    };
}
