import {
  getSystemThemePreference,
  resolveThemeValue,
  isValidThemeType,
  isValidThemeValue,
  getOppositeTheme,
  applyThemeToDocument
} from '../../src/utils/themeUtils';

// Mock document and window for testing
const mockDocument = () => {
  const mockElement = {
    setAttribute: jest.fn(),
    style: {
      setProperty: jest.fn(),
    },
  };

  Object.defineProperty(document, 'documentElement', {
    value: mockElement,
    writable: true,
  });

  return mockElement;
};

describe('Theme Utilities', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('getSystemThemePreference', () => {
    test('should return dark when system prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({ matches: true })),
      });

      expect(getSystemThemePreference()).toBe('dark');
    });

    test('should return light when system prefers light', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({ matches: false })),
      });

      expect(getSystemThemePreference()).toBe('light');
    });

    test('should return light when matchMedia is not available', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      });

      expect(getSystemThemePreference()).toBe('light');
    });
  });

  describe('resolveThemeValue', () => {
    test('should return light for light type', () => {
      expect(resolveThemeValue('light', 'dark')).toBe('light');
    });

    test('should return dark for dark type', () => {
      expect(resolveThemeValue('dark', 'light')).toBe('dark');
    });

    test('should return system preference for system type', () => {
      expect(resolveThemeValue('system', 'dark')).toBe('dark');
      expect(resolveThemeValue('system', 'light')).toBe('light');
    });
  });

  describe('isValidThemeType', () => {
    test('should return true for valid theme types', () => {
      expect(isValidThemeType('light')).toBe(true);
      expect(isValidThemeType('dark')).toBe(true);
      expect(isValidThemeType('system')).toBe(true);
    });

    test('should return false for invalid theme types', () => {
      expect(isValidThemeType('invalid')).toBe(false);
      expect(isValidThemeType('')).toBe(false);
      expect(isValidThemeType(null)).toBe(false);
    });
  });

  describe('isValidThemeValue', () => {
    test('should return true for valid theme values', () => {
      expect(isValidThemeValue('light')).toBe(true);
      expect(isValidThemeValue('dark')).toBe(true);
    });

    test('should return false for invalid theme values', () => {
      expect(isValidThemeValue('system')).toBe(false);
      expect(isValidThemeValue('invalid')).toBe(false);
      expect(isValidThemeValue('')).toBe(false);
    });
  });

  describe('getOppositeTheme', () => {
    test('should return dark for light', () => {
      expect(getOppositeTheme('light')).toBe('dark');
    });

    test('should return light for dark', () => {
      expect(getOppositeTheme('dark')).toBe('light');
    });
  });

  describe('applyThemeToDocument', () => {
    test('should apply light theme to document', () => {
      const mockElement = mockDocument();

      applyThemeToDocument('light');

      expect(mockElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--theme-background', '#ffffff');
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--theme-foreground', '#000000');
    });

    test('should apply dark theme to document', () => {
      const mockElement = mockDocument();

      applyThemeToDocument('dark');

      expect(mockElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--theme-background', '#121212');
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--theme-foreground', '#ffffff');
    });

    test('should not throw when document is not available', () => {
      // Temporarily remove document
      const originalDocument = global.document;
      delete global.document;

      expect(() => applyThemeToDocument('light')).not.toThrow();

      // Restore document
      global.document = originalDocument;
    });
  });
});