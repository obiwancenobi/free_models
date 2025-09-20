import React from 'react';
import { ThemeProvider as ThemeContextProvider } from '../contexts/ThemeContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme Provider Component
 *
 * This component provides theme context to the entire application.
 * It handles:
 * - System theme detection
 * - Theme persistence in localStorage
 * - Dynamic theme switching
 * - CSS custom property application
 *
 * Usage:
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContextProvider>
      {children}
    </ThemeContextProvider>
  );
};

export default ThemeProvider;