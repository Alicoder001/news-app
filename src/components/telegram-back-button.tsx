'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from './telegram-provider';

export function TelegramBackButton() {
  const router = useRouter();
  const { webApp, isMiniApp } = useTelegramWebApp();

  useEffect(() => {
    if (!isMiniApp || !webApp) return;

    const handleBack = () => {
      router.back();
    };

    // Show back button
    webApp.BackButton.show();
    webApp.BackButton.onClick(handleBack);

    // Cleanup
    return () => {
      webApp.BackButton.hide();
      webApp.BackButton.offClick(handleBack);
    };
  }, [isMiniApp, webApp, router]);

  return null;
}
