// Imports
import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { ThemeValue } from '../types/theme';

// Re-export theme hooks from context for convenience
export {
  useTheme,
  useThemeValue,
  useThemeType,
  useIsFollowingSystem,
} from '../contexts/ThemeContext';

// Additional theme-related hooks can be added here

/**
 * Hook that returns theme information and utilities
 * This is a convenience wrapper around the theme context
 */
export const useThemeInfo = () => {
  const { theme, setThemeType, toggleTheme } = useThemeContext();

  return {
    // Current theme state
    themeType: theme.type,
    currentTheme: theme.current,
    systemPreference: theme.systemPreference,
    isFollowingSystem: theme.type === 'system',

    // Actions
    setThemeType,
    toggleTheme,

    // Computed values
    isDark: theme.current === 'dark',
    isLight: theme.current === 'light',
  };
};

/**
 * Hook for conditional rendering based on theme
 * @param theme Theme to check for
 * @returns True if current theme matches
 */
export const useIsTheme = (theme: ThemeValue): boolean => {
  const currentTheme = useThemeContext().theme.current;
  return currentTheme === theme;
};

/**
 * Hook for theme-aware styling
 * @returns Object with theme-aware style functions
 */
export const useThemeStyles = () => {
  const { theme } = useThemeContext();

  return {
    backgroundColor: `var(--theme-background)`,
    color: `var(--theme-foreground)`,
    borderColor: `var(--theme-border)`,
    isDark: theme.current === 'dark',
    isLight: theme.current === 'light',
  };
};