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
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if running in Telegram
    const checkTelegram = () => {
      const miniApp = isTelegramMiniApp();
      setIsMiniApp(miniApp);

      if (miniApp) {
        // Initialize Telegram WebApp
        const webApp = initTelegramWebApp();
        if (webApp) {
          // Apply Telegram theme
          applyTelegramTheme();

          // Get user data
          const userData = getTelegramUser();
          setUser(userData);

          // Enable haptic feedback on interactions
          document.addEventListener('click', () => {
            webApp.HapticFeedback.selectionChanged();
          });

          console.log('✅ Telegram Mini App initialized', {
            platform: webApp.platform,
            version: webApp.version,
            user: userData,
          });
        }
      }

      setIsReady(true);
    };

    // Wait for Telegram SDK to load
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        checkTelegram();
      } else {
        // Wait for script to load
        const timer = setTimeout(checkTelegram, 500);
        return () => clearTimeout(timer);
      }
    }
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
  const [webApp, setWebApp] = useState(getTelegramWebApp());
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const app = getTelegramWebApp();
    setWebApp(app);
    setIsMiniApp(!!app);
    setUser(getTelegramUser());
  }, []);

  return {
    webApp,
    user,
    isMiniApp,
  };
}
