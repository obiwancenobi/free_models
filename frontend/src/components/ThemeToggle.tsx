import React from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeValue, useTheme } from '../hooks/useTheme';
import { trackEvent } from '../utils/analytics';

/**
 * Theme Toggle Button Component
 *
 * A floating action button in the top-right corner that allows users to toggle between light and dark themes.
 * The button shows different icons based on the current theme and provides proper accessibility.
 */
const ThemeToggle: React.FC = () => {
  const currentTheme = useThemeValue();
  const { toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    trackEvent('theme_toggle', { theme: newTheme });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      data-testid="theme-toggle"
      type="button"
    >
      {currentTheme === 'light' ? (
        <Brightness4Icon data-testid="moon-icon" />
      ) : (
        <Brightness7Icon data-testid="sun-icon" />
      )}
    </button>
  );
};

export default ThemeToggle;