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

describe('GA Search Event Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-TEST123';
  });

  afterEach(() => {
    delete process.env.REACT_APP_GA_MEASUREMENT_ID;
  });

  test('should track search event when user submits search', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for models to load
    await screen.findByText(/Discover Free AI Models/i);

    // Find search input
    const searchInput = screen.getByPlaceholderText(/search models/i);

    // Type search term
    await user.type(searchInput, 'gpt');

    // Submit search (assuming enter or button)
    await user.keyboard('{Enter}');

    // Check that search event was tracked
    expect(ReactGA.event).toHaveBeenCalledWith('search', {
      search_term: 'gpt',
    });
  });
});