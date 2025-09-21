const NodeCache = require('node-cache');

// Cache TTL: 5 minutes = 300 seconds
const CACHE_TTL = 300;

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: CACHE_TTL,
      checkperiod: 60, // Check for expired keys every 60 seconds
      maxKeys: 1000, // Maximum number of keys
    });

    // Statistics tracking
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
    };

    // Event listeners for statistics
    this.cache.on('set', () => {
      this.stats.sets++;
    });

    this.cache.on('expired', (key, value) => {
      console.log(`Cache key expired: ${key}`);
    });
  }

  /**
   * Get data from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if not found
   */
  get(key) {
    const data = this.cache.get(key);
    if (data !== undefined) {
      this.stats.hits++;
      console.log(`Cache hit for key: ${key}`);
      return data;
    } else {
      this.stats.misses++;
      console.log(`Cache miss for key: ${key}`);
      return null;
    }
  }

  /**
   * Set data in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in seconds (optional, defaults to CACHE_TTL)
   */
  set(key, data, ttl = CACHE_TTL) {
    const success = this.cache.set(key, data, ttl);
    if (success) {
      console.log(`Cache set for key: ${key}, TTL: ${ttl}s`);
    } else {
      console.error(`Failed to set cache for key: ${key}`);
    }
    return success;
  }

  /**
   * Delete specific cache entry
   * @param {string} key - Cache key to delete
   * @returns {boolean} True if deleted, false if not found
   */
  delete(key) {
    const deleted = this.cache.del(key);
    if (deleted) {
      console.log(`Cache deleted for key: ${key}`);
    }
    return deleted > 0;
  }

  /**
   * Clear all cache entries
   * @returns {boolean} True if successful
   */
  clear() {
    this.cache.flushAll();
    console.log('All cache cleared');
    return true;
  }

  /**
   * Get cache statistics
   * @returns {object} Cache statistics
   */
  getStats() {
    const keys = this.cache.keys();
    const cacheStats = {
      total_entries: keys.length,
      total_size: this._estimateSize(),
      hit_ratio: this._calculateHitRatio(),
      entries: keys.map(key => ({
        key,
        hits: 0, // Would need per-key tracking for accurate hits
        misses: 0, // Would need per-key tracking for accurate misses
        last_accessed: new Date().toISOString(), // Simplified
      })),
    };
    return cacheStats;
  }

  /**
   * Get all cache keys
   * @returns {string[]} Array of cache keys
   */
  getKeys() {
    return this.cache.keys();
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean} True if exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Estimate cache size (simplified)
   * @returns {number} Estimated size in bytes
   */
  _estimateSize() {
    const keys = this.cache.keys();
    let size = 0;
    keys.forEach(key => {
      const value = this.cache.get(key);
      if (value) {
        size += JSON.stringify(value).length;
      }
    });
    return size;
  }

  /**
   * Calculate hit ratio
   * @returns {number} Hit ratio between 0 and 1
   */
  _calculateHitRatio() {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? this.stats.hits / total : 0;
  }
}

module.exports = new CacheService();