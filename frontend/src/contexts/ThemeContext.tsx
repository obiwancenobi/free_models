import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Theme, ThemeType, ThemeValue, ThemeContextType } from '../types/theme';
import {
  getSystemThemePreference,
  watchSystemThemeChanges,
  resolveThemeValue,
  applyThemeToDocument,
  getOppositeTheme
} from '../utils/themeUtils';
import { loadThemeType, saveThemeType } from '../utils/storageUtils';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [systemPreference, setSystemPreference] = useState<ThemeValue>(() =>
    getSystemThemePreference()
  );

  const [themeType, setThemeTypeState] = useState<ThemeType>(() =>
    loadThemeType() || 'system'
  );

  const currentTheme: ThemeValue = resolveThemeValue(themeType, systemPreference);

  const theme: Theme = {
    type: themeType,
    current: currentTheme,
    systemPreference,
  };

  // Apply theme to document when it changes
  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme]);

  // Watch for system theme changes
  useEffect(() => {
    const cleanup = watchSystemThemeChanges((newPreference) => {
      setSystemPreference(newPreference);
    });

    return cleanup;
  }, []);

  // Save theme type to localStorage when it changes
  const setThemeType = useCallback((type: ThemeType) => {
    setThemeTypeState(type);
    saveThemeType(type);
  }, []);

  // Toggle between light and dark (only when not in system mode)
  const toggleTheme = useCallback(() => {
    if (themeType === 'system') {
      // If in system mode, toggle to opposite of current system preference
      const opposite = getOppositeTheme(systemPreference);
      setThemeType(opposite === 'light' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      const newType = themeType === 'light' ? 'dark' : 'light';
      setThemeType(newType);
    }
  }, [themeType, systemPreference, setThemeType]);

  // Update system preference (called by system theme change listener)
  const updateSystemPreference = useCallback((preference: ThemeValue) => {
    setSystemPreference(preference);
  }, []);

  const value: ThemeContextType = {
    theme,
    setThemeType,
    toggleTheme,
    updateSystemPreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for getting current theme value
export const useThemeValue = (): ThemeValue => {
  const { theme } = useTheme();
  return theme.current;
};

// Hook for getting theme type
export const useThemeType = (): ThemeType => {
  const { theme } = useTheme();
  return theme.type;
};

// Hook for checking if following system theme
export const useIsFollowingSystem = (): boolean => {
  const { theme } = useTheme();
  return theme.type === 'system';
};