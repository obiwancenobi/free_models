import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

// Mock matchMedia
const mockMatchMedia = (matches) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('Theme Persistence Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock system light theme
    mockMatchMedia(false);
  });

  test('should remember manual theme choice after page reload', async () => {
    const user = userEvent.setup();

    // First render - switch to dark theme
    const { unmount } = render(<App />);
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    await user.click(toggleButton);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    // Simulate page reload by unmounting and re-rendering
    unmount();

    // Second render - should remember dark theme
    render(<App />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  test('should persist theme choice in localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Switch to dark
    await user.click(toggleButton);

    // Check localStorage
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('should load theme from localStorage on app start', () => {
    // Pre-set localStorage
    localStorage.setItem('theme', 'dark');

    render(<App />);

    // Should load dark theme
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  test('should prioritize localStorage over system theme', () => {
    // System is light, but localStorage has dark
    mockMatchMedia(false); // system light
    localStorage.setItem('theme', 'dark');

    render(<App />);

    // Should use localStorage value
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  test('should fallback to system theme when localStorage is empty', () => {
    // No localStorage, system dark
    mockMatchMedia(true); // system dark
    localStorage.removeItem('theme');

    render(<App />);

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  test('should handle invalid localStorage values gracefully', () => {
    // Invalid value in localStorage
    localStorage.setItem('theme', 'invalid');

    // System light
    mockMatchMedia(false);

    render(<App />);

    // Should fallback to system theme
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});