// Theme-related type definitions

export type ThemeType = 'light' | 'dark' | 'system';

export type ThemeValue = 'light' | 'dark';

export interface Theme {
  type: ThemeType;
  current: ThemeValue;
  systemPreference: ThemeValue;
}

export interface UserPreference {
  themeType: ThemeType;
  lastUpdated: Date;
}

export interface ThemeContextType {
  theme: Theme;
  setThemeType: (type: ThemeType) => void;
  toggleTheme: () => void;
  updateSystemPreference: (preference: ThemeValue) => void;
}

// CSS Custom Properties interface for theme values
export interface ThemeVariables {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  // Add more as needed
}

export const LIGHT_THEME_VARS: ThemeVariables = {
  background: '#ffffff',
  foreground: '#000000',
  primary: '#007bff',
  secondary: '#6c757d',
};

export const DARK_THEME_VARS: ThemeVariables = {
  background: '#121212',
  foreground: '#ffffff',
  primary: '#0d6efd',
  secondary: '#6c757d',
};