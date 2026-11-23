import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { DefaultTheme } from 'styled-components';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { themes } from '../styles/theme';
import type { ThemeName, ThemePreference } from '../styles/theme';

const STORAGE_KEY = 'nord-market-theme';

interface ThemeContextValue {
  preference: ThemePreference;
  activeTheme: ThemeName;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark' || value === 'berry';
}

function readInitialPreference(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isThemePreference(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

function readSystemTheme(): ThemeName {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(readInitialPreference);
  const [systemTheme, setSystemTheme] = useState<ThemeName>(readSystemTheme);
  const activeTheme: ThemeName = preference === 'system' ? systemTheme : preference;
  const theme: DefaultTheme = themes[activeTheme];

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = activeTheme;
    document.documentElement.style.colorScheme = themes[activeTheme].colorScheme;

    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // The app remains usable when storage is blocked by the browser.
    }
  }, [activeTheme, preference]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ preference, activeTheme, setPreference }),
    [preference, activeTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useThemeMode must be used inside ThemeProvider');
  }
  return value;
}
