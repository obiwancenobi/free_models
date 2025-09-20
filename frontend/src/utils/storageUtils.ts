import { ThemeType, UserPreference } from '../types/theme';

const THEME_STORAGE_KEY = 'theme';
const PREFERENCES_STORAGE_KEY = 'theme-preferences';

/**
 * Saves theme type to localStorage
 * @param themeType Theme type to save
 */
export const saveThemeType = (themeType: ThemeType): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeType);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

/**
 * Loads theme type from localStorage
 * @returns Saved theme type or null if not found
 */
export const loadThemeType = (): ThemeType | null => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && isValidThemeType(saved)) {
      return saved;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return null;
};

/**
 * Saves complete user preferences to localStorage
 * @param preferences User preferences object
 */
export const saveUserPreferences = (preferences: UserPreference): void => {
  try {
    const serialized = JSON.stringify({
      ...preferences,
      lastUpdated: preferences.lastUpdated.toISOString(),
    });
    localStorage.setItem(PREFERENCES_STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('Failed to save user preferences to localStorage:', error);
  }
};

/**
 * Loads user preferences from localStorage
 * @returns User preferences or null if not found/invalid
 */
export const loadUserPreferences = (): UserPreference | null => {
  try {
    const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (isValidUserPreferences(parsed)) {
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
        };
      }
    }
  } catch (error) {
    console.warn('Failed to load user preferences from localStorage:', error);
  }
  return null;
};

/**
 * Clears all theme-related data from localStorage
 */
export const clearThemeStorage = (): void => {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear theme storage:', error);
  }
};

/**
 * Checks if localStorage is available
 * @returns True if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates theme type string
 * @param value String to validate
 * @returns True if valid theme type
 */
function isValidThemeType(value: string): value is ThemeType {
  return ['light', 'dark', 'system'].includes(value);
}

/**
 * Validates user preferences object structure
 * @param obj Object to validate
 * @returns True if valid user preferences
 */
function isValidUserPreferences(obj: any): obj is Omit<UserPreference, 'lastUpdated'> & { lastUpdated: string } {
  return (
    obj &&
    typeof obj === 'object' &&
    isValidThemeType(obj.themeType) &&
    typeof obj.lastUpdated === 'string' &&
    !isNaN(Date.parse(obj.lastUpdated))
  );
}

/**
 * Gets storage usage information
 * @returns Object with storage usage details
 */
export const getStorageInfo = () => {
  if (!isStorageAvailable()) {
    return { available: false, used: 0, remaining: 0 };
  }

  try {
    // Estimate used space (rough approximation)
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // localStorage typically has 5-10MB limit
    const limit = 5 * 1024 * 1024; // 5MB
    const remaining = Math.max(0, limit - used);

    return {
      available: true,
      used,
      remaining,
      limit,
    };
  } catch (error) {
    return { available: false, used: 0, remaining: 0 };
  }
};