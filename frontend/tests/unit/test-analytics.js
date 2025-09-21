import { trackEvent, trackPageView, isGAAvailable } from '../../src/utils/analytics';
import ReactGA from 'react-ga4';

// Mock react-ga4
jest.mock('react-ga4', () => ({
  event: jest.fn(),
  send: jest.fn(),
}));

describe('Analytics Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('trackEvent calls ReactGA.event with correct parameters', () => {
    trackEvent('test_action', { param: 'value' });

    expect(ReactGA.event).toHaveBeenCalledWith('test_action', { param: 'value' });
  });

  test('trackEvent handles GA errors gracefully', () => {
    ReactGA.event.mockImplementation(() => {
      throw new Error('GA error');
    });

    // Should not throw
    expect(() => trackEvent('test')).not.toThrow();
  });

  test('trackPageView calls ReactGA.send with pageview', () => {
    trackPageView('/test');

    expect(ReactGA.send).toHaveBeenCalledWith({ hitType: 'pageview', page: '/test' });
  });

  test('isGAAvailable returns false when gtag is not available', () => {
    // In test environment, window.gtag is not set
    expect(isGAAvailable()).toBe(false);
  });
});