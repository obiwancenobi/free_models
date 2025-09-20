import {
  saveThemeType,
  loadThemeType,
  saveUserPreferences,
  loadUserPreferences,
  clearThemeStorage,
  isStorageAvailable,
  getStorageInfo
} from '../../src/utils/storageUtils';

// Mock localStorage
const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
  };
};

describe('Storage Utilities', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = mockLocalStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveThemeType', () => {
    test('should save theme type to localStorage', () => {
      saveThemeType('dark');

      expect(mockStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(() => saveThemeType('light')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save theme to localStorage:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('loadThemeType', () => {
    test('should load theme type from localStorage', () => {
      mockStorage.getItem.mockReturnValue('dark');

      const result = loadThemeType();

      expect(result).toBe('dark');
      expect(mockStorage.getItem).toHaveBeenCalledWith('theme');
    });

    test('should return null when no theme is saved', () => {
      mockStorage.getItem.mockReturnValue(null);

      const result = loadThemeType();

      expect(result).toBeNull();
    });

    test('should return null for invalid theme type', () => {
      mockStorage.getItem.mockReturnValue('invalid');

      const result = loadThemeType();

      expect(result).toBeNull();
    });

    test('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockStorage.getItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = loadThemeType();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load theme from localStorage:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('saveUserPreferences', () => {
    test('should save user preferences with serialized date', () => {
      const preferences = {
        themeType: 'dark',
        lastUpdated: new Date('2023-01-01T00:00:00Z'),
      };

      saveUserPreferences(preferences);

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'theme-preferences',
        JSON.stringify({
          ...preferences,
          lastUpdated: '2023-01-01T00:00:00.000Z',
        })
      );
    });

    test('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => saveUserPreferences({ themeType: 'light', lastUpdated: new Date() })).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save user preferences to localStorage:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('loadUserPreferences', () => {
    test('should load and parse user preferences', () => {
      const preferences = {
        themeType: 'dark',
        lastUpdated: '2023-01-01T00:00:00.000Z',
      };
      mockStorage.getItem.mockReturnValue(JSON.stringify(preferences));

      const result = loadUserPreferences();

      expect(result).toEqual({
        themeType: 'dark',
        lastUpdated: new Date('2023-01-01T00:00:00.000Z'),
      });
    });

    test('should return null when no preferences are saved', () => {
      mockStorage.getItem.mockReturnValue(null);

      const result = loadUserPreferences();

      expect(result).toBeNull();
    });

    test('should return null for invalid JSON', () => {
      mockStorage.getItem.mockReturnValue('invalid json');

      const result = loadUserPreferences();

      expect(result).toBeNull();
    });

    test('should return null for invalid preferences structure', () => {
      mockStorage.getItem.mockReturnValue(JSON.stringify({ invalid: 'data' }));

      const result = loadUserPreferences();

      expect(result).toBeNull();
    });
  });

  describe('clearThemeStorage', () => {
    test('should clear all theme-related data', () => {
      clearThemeStorage();

      expect(mockStorage.removeItem).toHaveBeenCalledWith('theme');
      expect(mockStorage.removeItem).toHaveBeenCalledWith('theme-preferences');
    });

    test('should handle localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => clearThemeStorage()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear theme storage:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('isStorageAvailable', () => {
    test('should return true when localStorage is available', () => {
      const result = isStorageAvailable();

      expect(result).toBe(true);
    });

    test('should return false when localStorage throws error', () => {
      mockStorage.setItem.mockImplementation(() => {
        throw new Error('Storage disabled');
      });

      const result = isStorageAvailable();

      expect(result).toBe(false);
    });
  });

  describe('getStorageInfo', () => {
    test('should return storage information when available', () => {
      mockStorage.getItem.mockImplementation((key) => {
        if (key === 'theme') return 'dark';
        if (key === 'theme-preferences') return '{"themeType":"dark","lastUpdated":"2023-01-01T00:00:00.000Z"}';
        return null;
      });

      const result = getStorageInfo();

      expect(result).toEqual({
        available: true,
        used: expect.any(Number),
        remaining: expect.any(Number),
        limit: 5000000, // 5MB
      });
    });

    test('should return unavailable when storage is not available', () => {
      mockStorage.getItem.mockImplementation(() => {
        throw new Error('Storage disabled');
      });

      const result = getStorageInfo();

      expect(result).toEqual({
        available: false,
        used: 0,
        remaining: 0,
      });
    });
  });
});