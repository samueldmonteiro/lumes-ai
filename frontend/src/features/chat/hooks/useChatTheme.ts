'use client';

import { useState, useCallback } from 'react';
import { Theme, UseChatThemeReturn } from '@/types/chat';

// Hook que gerencia o tema (claro/escuro) com persistência em localStorage
export function useChatTheme(): UseChatThemeReturn {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumes_theme') as Theme | null;
      return saved === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('lumes_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('lumes_theme', 'light');
      }
      return nextTheme;
    });
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  };
}
