import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

// Mock matchMedia for system theme detection
const mockMatchMedia = (matches) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('Theme Detection Integration Tests', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();
  });

  test('should detect and apply system dark theme by default', () => {
    // Mock system preference for dark theme
    mockMatchMedia(true); // matches: prefers-color-scheme: dark

    render(<App />);

    // The app should have dark theme applied
    const root = document.documentElement;
    expect(root).toHaveAttribute('data-theme', 'dark');

    // Check for dark theme CSS variables
    const computedStyle = getComputedStyle(root);
    expect(computedStyle.getPropertyValue('--theme-background')).toBe('#121212');
    expect(computedStyle.getPropertyValue('--theme-text-primary')).toBe('#ffffff');
    expect(computedStyle.getPropertyValue('--theme-text-secondary')).toBe('#adb5bd');
  });

  test('should detect and apply system light theme by default', () => {
    // Mock system preference for light theme
    mockMatchMedia(false); // matches: prefers-color-scheme: light

    render(<App />);

    // The app should have light theme applied
    const root = document.documentElement;
    expect(root).toHaveAttribute('data-theme', 'light');

    // Check for light theme CSS variables
    const computedStyle = getComputedStyle(root);
    expect(computedStyle.getPropertyValue('--theme-background')).toBe('#ffffff');
    expect(computedStyle.getPropertyValue('--theme-text-primary')).toBe('#000000');
    expect(computedStyle.getPropertyValue('--theme-text-secondary')).toBe('#6c757d');
  });

  test('should update theme when system preference changes', () => {
    // Start with light theme
    mockMatchMedia(false);
    const { rerender } = render(<App />);

    // Change to dark theme
    mockMatchMedia(true);
    // Trigger change event
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryList.onchange({ matches: true });

    rerender(<App />);

    const root = document.documentElement;
    expect(root).toHaveAttribute('data-theme', 'dark');
  });
});