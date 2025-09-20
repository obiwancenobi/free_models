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

describe('Theme Icon Button Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  test('should render theme toggle button in top-right corner', () => {
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    expect(toggleButton).toBeInTheDocument();

    // Check positioning (assuming fixed positioning)
    const styles = window.getComputedStyle(toggleButton);
    expect(styles.position).toBe('fixed');
    expect(styles.top).toBe('20px'); // or appropriate value
    expect(styles.right).toBe('20px'); // or appropriate value
  });

  test('should have proper accessibility attributes', () => {
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    expect(toggleButton).toHaveAttribute('aria-label');
    expect(toggleButton.getAttribute('aria-label')).toMatch(/theme/i);
  });

  test('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Focus the button
    toggleButton.focus();
    expect(toggleButton).toHaveFocus();

    // Press Enter to activate
    await user.keyboard('{Enter}');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    // Press Space to activate
    await user.keyboard(' ');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  test('should have appropriate icon for current theme', () => {
    render(<App />);

    // Light theme - should show dark mode icon or moon icon
    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toBeInTheDocument();

    // Could also check for sun icon when in dark mode
    // This depends on the actual icon implementation
  });

  test('should maintain visibility on different screen sizes', () => {
    // Mock different viewport sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // mobile width
    });

    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Button should still be visible and accessible
    expect(toggleButton).toBeVisible();

    // Check that it doesn't overflow or get cut off
    const rect = toggleButton.getBoundingClientRect();
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);
  });

  test('should have hover and focus states', () => {
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Check for CSS classes or styles that indicate interactive states
    expect(toggleButton).toHaveClass('theme-toggle'); // or appropriate class
  });

  test('should not interfere with other UI elements', () => {
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Check z-index is high enough
    const styles = window.getComputedStyle(toggleButton);
    expect(parseInt(styles.zIndex)).toBeGreaterThan(1000);
  });
});