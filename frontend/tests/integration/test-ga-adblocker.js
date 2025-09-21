import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';
import ReactGA from 'react-ga4';

// Mock react-ga4
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
}));

describe('GA Ad Blocker Handling Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-TEST123';
  });

  afterEach(() => {
    delete process.env.REACT_APP_GA_MEASUREMENT_ID;
  });

  test('should gracefully handle GA initialization failure', () => {
    // Mock GA initialize to throw error
    ReactGA.initialize.mockImplementation(() => {
      throw new Error('GA blocked');
    });

    // Should not throw error
    expect(() => render(<App />)).not.toThrow();

    // App should still render normally
    // (This is a basic check; in real scenario, check for console warnings)
  });

  test('should continue functioning when GA send fails', () => {
    // Mock GA send to throw error
    ReactGA.send.mockImplementation(() => {
      throw new Error('GA send failed');
    });

    // Should not throw error
    expect(() => render(<App />)).not.toThrow();

    // App should still render and function
  });
});