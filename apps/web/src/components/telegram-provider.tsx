'use client';

import { useEffect, useState } from 'react';
import {
  getTelegramWebApp,
  isTelegramMiniApp,
  initTelegramWebApp,
  applyTelegramTheme,
  getTelegramUser,
  type TelegramUser,
} from '@/lib/telegram/telegram-webapp';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if running in Telegram
    const checkTelegram = () => {
      const miniApp = isTelegramMiniApp();

      if (miniApp) {
        // Initialize Telegram WebApp
        const webApp = initTelegramWebApp();
        if (webApp) {
          // Apply Telegram theme
          applyTelegramTheme();

          // Get user data
          const userData = getTelegramUser();

          // Enable haptic feedback on interactions
          const handleClick = () => {
            webApp.HapticFeedback.selectionChanged();
          };
          document.addEventListener('click', handleClick);

          console.log('✅ Telegram Mini App initialized', {
            platform: webApp.platform,
            version: webApp.version,
            user: userData,
          });

          // Cleanup function
          return () => {
            document.removeEventListener('click', handleClick);
          };
        }
      }

      setIsReady(true);
    };

    // Wait for Telegram SDK to load
    let cleanup: (() => void) | undefined;
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        cleanup = checkTelegram();
      } else {
        // Wait for script to load
        const timer = setTimeout(() => {
          cleanup = checkTelegram();
        }, 500);
        return () => {
          clearTimeout(timer);
          cleanup?.();
        };
      }
    }

    return () => {
      cleanup?.();
    };
  }, []);

  // Show loading state while initializing
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-foreground/60">Yuklanmoqda...</div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook to access Telegram WebApp
 */
export function useTelegramWebApp() {
  const [webApp] = useState(getTelegramWebApp);
  const [user] = useState<TelegramUser | null>(getTelegramUser);
  const [isMiniApp] = useState(() => !!getTelegramWebApp());

  return {
    webApp,
    user,
    isMiniApp,
  };
}
