import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

// Mock matchMedia for consistent system theme
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

describe('Theme Switching Integration Tests', () => {
  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();
    // Mock system light theme
    mockMatchMedia(false);
  });

  test('should start with system theme (light)', () => {
    render(<App />);

    const root = document.documentElement;
    expect(root).toHaveAttribute('data-theme', 'light');
  });

  test('should switch to dark theme when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Find the theme toggle button (assuming it has a specific aria-label or test id)
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    // Or if it has an icon: screen.getByTestId('theme-toggle');

    // Initial state should be light
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    // Click the toggle button
    await user.click(toggleButton);

    // Should switch to dark
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  test('should switch back to light theme when toggle is clicked again', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Click to dark
    await user.click(toggleButton);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    // Click again to light
    await user.click(toggleButton);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  test('should cycle through themes: light -> dark -> light', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Start: light
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    // First click: dark
    await user.click(toggleButton);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    // Second click: light
    await user.click(toggleButton);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  test('should have accessible theme toggle button', () => {
    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-label', expect.stringContaining('theme'));
  });
});