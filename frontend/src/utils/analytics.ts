import ReactGA from 'react-ga4';

export const trackEvent = (action: string, parameters?: Record<string, any>) => {
  try {
    if (ReactGA && typeof ReactGA.event === 'function') {
      ReactGA.event(action, parameters);
    }
  } catch (error) {
    // Silently fail if GA is blocked or unavailable
    console.warn('Analytics tracking failed:', error);
  }
};

export const trackPageView = (page: string) => {
  try {
    if (ReactGA && typeof ReactGA.send === 'function') {
      ReactGA.send({ hitType: 'pageview', page });
    }
  } catch (error) {
    console.warn('Page view tracking failed:', error);
  }
};

export const isGAAvailable = () => {
  try {
    return typeof window !== 'undefined' && !!(window as any).gtag;
  } catch {
    return false;
  }
};