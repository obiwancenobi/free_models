import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';
import ReactGA from 'react-ga4';

// Mock react-ga4
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
}));

describe('GA Page View Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Set up environment variable
    process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-TEST123';
  });

  afterEach(() => {
    delete process.env.REACT_APP_GA_MEASUREMENT_ID;
  });

  test('should initialize GA and send pageview on app load', () => {
    render(<App />);

    // Check that GA was initialized with the measurement ID
    expect(ReactGA.initialize).toHaveBeenCalledWith('G-TEST123');

    // Check that pageview was sent
    expect(ReactGA.send).toHaveBeenCalledWith({
      hitType: 'pageview',
      page: '/',
    });
  });

  test('should not initialize GA if measurement ID is not set', () => {
    delete process.env.REACT_APP_GA_MEASUREMENT_ID;

    render(<App />);

    // GA should not be initialized
    expect(ReactGA.initialize).not.toHaveBeenCalled();
    expect(ReactGA.send).not.toHaveBeenCalled();
  });
});