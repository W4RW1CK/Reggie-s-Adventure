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

        // If already logged in, skip auth screen
        if (isLoggedIn) {
            if (config.isFirstTime) {
                navigateTo('STORY');
            } else if (regenmon) {
                navigateTo('GAME');
            } else {
                navigateTo('CREATION');
            }
        } else {
            // Not logged in, show auth choice screen
            navigateTo('AUTH');
        }
    };

    const handleAuthLogin = () => {
        // After login, proceed with normal flow
        if (config.isFirstTime) {
            navigateTo('STORY');
        } else if (regenmon) {
            navigateTo('GAME');
        } else {
            navigateTo('CREATION');
        }
    };

    const handleContinueWithoutAccount = () => {
        // Proceed with normal flow in demo mode
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
        handleAuthLogin,
        handleContinueWithoutAccount,
    };
}
