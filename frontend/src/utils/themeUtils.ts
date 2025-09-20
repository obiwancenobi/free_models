import { ThemeValue, ThemeType } from '../types/theme';

/**
 * Detects the user's system theme preference
 * @returns 'light' or 'dark'
 */
export const getSystemThemePreference = (): ThemeValue => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // fallback
};

/**
 * Listens for system theme changes
 * @param callback Function to call when system theme changes
 * @returns Cleanup function
 */
export const watchSystemThemeChanges = (callback: (theme: ThemeValue) => void): (() => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {}; // no-op
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (event: MediaQueryListEvent) => {
    callback(event.matches ? 'dark' : 'light');
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }

  // Legacy browsers
  mediaQuery.addListener(handleChange);
  return () => mediaQuery.removeListener(handleChange);
};

/**
 * Determines the actual theme to apply based on type and system preference
 * @param type Theme type
 * @param systemPreference Current system preference
 * @returns Actual theme value
 */
export const resolveThemeValue = (type: ThemeType, systemPreference: ThemeValue): ThemeValue => {
  switch (type) {
    case 'light':
      return 'light';
    case 'dark':
      return 'dark';
    case 'system':
    default:
      return systemPreference;
  }
};

/**
 * Validates if a string is a valid theme type
 * @param value String to validate
 * @returns True if valid theme type
 */
export const isValidThemeType = (value: string): value is ThemeType => {
  return ['light', 'dark', 'system'].includes(value);
};

/**
 * Validates if a string is a valid theme value
 * @param value String to validate
 * @returns True if valid theme value
 */
export const isValidThemeValue = (value: string): value is ThemeValue => {
  return ['light', 'dark'].includes(value);
};

/**
 * Gets the opposite theme value
 * @param theme Current theme
 * @returns Opposite theme
 */
export const getOppositeTheme = (theme: ThemeValue): ThemeValue => {
  return theme === 'light' ? 'dark' : 'light';
};

/**
 * Applies theme CSS variables to the document root
 * @param theme Theme value to apply
 */
export const applyThemeToDocument = (theme: ThemeValue): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.style.setProperty('--theme-background', '#121212');
    root.style.setProperty('--theme-foreground', '#ffffff');
    root.style.setProperty('--theme-primary', '#0d6efd');
    root.style.setProperty('--theme-secondary', '#6c757d');
    root.style.setProperty('--theme-text-primary', '#ffffff');
    root.style.setProperty('--theme-text-secondary', '#adb5bd');
  } else {
    root.setAttribute('data-theme', 'light');
    root.style.setProperty('--theme-background', '#ffffff');
    root.style.setProperty('--theme-foreground', '#000000');
    root.style.setProperty('--theme-primary', '#007bff');
    root.style.setProperty('--theme-secondary', '#6c757d');
    root.style.setProperty('--theme-text-primary', '#000000');
    root.style.setProperty('--theme-text-secondary', '#6c757d');
  }
};