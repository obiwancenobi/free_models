const cacheService = require('../../src/services/cacheService');

describe('CacheService', () => {
  beforeEach(() => {
    // Clear cache before each test
    cacheService.clear();
  });

  test('should set and get cache values', () => {
    const key = 'test-key';
    const value = { data: 'test-value' };

    cacheService.set(key, value);
    const retrieved = cacheService.get(key);

    expect(retrieved).toEqual(value);
  });

  test('should return null for non-existent keys', () => {
    const retrieved = cacheService.get('non-existent-key');
    expect(retrieved).toBeNull();
  });

  test('should delete cache entries', () => {
    const key = 'test-key';
    const value = { data: 'test-value' };

    cacheService.set(key, value);
    const deleted = cacheService.delete(key);

    expect(deleted).toBe(true);
    expect(cacheService.get(key)).toBeNull();
  });

  test('should clear all cache entries', () => {
    cacheService.set('key1', 'value1');
    cacheService.set('key2', 'value2');

    cacheService.clear();

    expect(cacheService.get('key1')).toBeNull();
    expect(cacheService.get('key2')).toBeNull();
  });

  test('should return cache statistics', () => {
    cacheService.set('key1', 'value1');
    cacheService.get('key1'); // hit
    cacheService.get('key2'); // miss

    const stats = cacheService.getStats();

    expect(stats).toHaveProperty('total_entries');
    expect(stats).toHaveProperty('hit_ratio');
    expect(stats).toHaveProperty('entries');
    expect(stats.total_entries).toBeGreaterThanOrEqual(1);
  });

  test('should check if key exists', () => {
    const key = 'test-key';
    expect(cacheService.has(key)).toBe(false);

    cacheService.set(key, 'value');
    expect(cacheService.has(key)).toBe(true);
  });

  test('should return all cache keys', () => {
    cacheService.set('key1', 'value1');
    cacheService.set('key2', 'value2');

    const keys = cacheService.getKeys();
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
  });
});