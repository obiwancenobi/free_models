const cacheService = require('../services/cacheService');

/**
 * Cache middleware for Express routes
 * Caches GET responses based on URL
 * @param {number} ttl - Time to live in seconds (default: 300)
 */
function cacheMiddleware(ttl = 300) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `route:${req.originalUrl}`;

    // Check cache
    const cachedResponse = cacheService.get(cacheKey);
    if (cachedResponse) {
      console.log(`Serving cached response for ${req.originalUrl}`);
      return res.json(cachedResponse);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data) {
      // Cache the response data
      cacheService.set(cacheKey, data, ttl);
      console.log(`Response cached for ${req.originalUrl}, TTL: ${ttl}s`);

      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
}

/**
 * Cache invalidation middleware
 * Clears cache when specific routes are called
 * @param {string[]} routes - Array of route patterns to invalidate on
 */
function cacheInvalidationMiddleware(routes = []) {
  return (req, res, next) => {
    // Store original end method
    const originalEnd = res.end;

    res.end = function(...args) {
      // Check if this route should trigger cache invalidation
      const shouldInvalidate = routes.some(route => {
        return req.originalUrl.includes(route);
      });

      if (shouldInvalidate) {
        console.log(`Invalidating cache due to route: ${req.originalUrl}`);
        cacheService.clear();
      }

      // Call original end method
      originalEnd.apply(this, args);
    };

    next();
  };
}

module.exports = {
  cacheMiddleware,
  cacheInvalidationMiddleware
};