/**
 * Theme Context
 *
 * Provides theme colors based on system or user preference
 *
 * @package @news-app/mobile
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './index';
import { useAppStore } from '../store/useAppStore';

type ThemeColors = typeof colors.light;

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const theme = useAppStore((state) => state.theme);

  const { themeColors, isDark } = useMemo(() => {
    let colorScheme: 'light' | 'dark' = 'light';

    if (theme === 'system') {
      colorScheme = systemScheme === 'dark' ? 'dark' : 'light';
    } else {
      colorScheme = theme;
    }

    return {
      themeColors: colors[colorScheme],
      isDark: colorScheme === 'dark',
    };
  }, [theme, systemScheme]);

  return (
    <ThemeContext.Provider value={{ colors: themeColors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
