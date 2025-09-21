import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import ReactGA from 'react-ga4';

// Mock react-ga4
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
}));

describe('GA Theme Toggle Event Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-TEST123';
    localStorage.clear();
  });

  afterEach(() => {
    delete process.env.REACT_APP_GA_MEASUREMENT_ID;
  });

  test('should track theme toggle event when user clicks theme toggle button', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Find theme toggle button
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });

    // Click to toggle to dark
    await user.click(toggleButton);

    // Check that theme_toggle event was tracked with 'dark'
    expect(ReactGA.event).toHaveBeenCalledWith('theme_toggle', {
      theme: 'dark',
    });
  });
});