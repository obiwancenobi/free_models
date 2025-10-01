const express = require('express');
const router = express.Router();
const databaseService = require('../services/databaseService');
const cacheService = require('../services/cacheService');

// GET /health - Overall application health
router.get('/', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };

  res.json(health);
});

// GET /health/database - Database connectivity health
router.get('/database', async (req, res) => {
  try {
    const dbHealth = await databaseService.healthCheck();

    res.json({
      service: 'database',
      ...dbHealth
    });
  } catch (error) {
    res.status(503).json({
      service: 'database',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /health/cache - Cache system health
router.get('/cache', (req, res) => {
  try {
    const cacheStats = cacheService.getStats();

    res.json({
      service: 'cache',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      stats: cacheStats
    });
  } catch (error) {
    res.status(503).json({
      service: 'cache',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /health/models - Models service health (cache + database + API)
router.get('/models', async (req, res) => {
  try {
    const startTime = Date.now();

    // Test cache
    const cacheHealth = { status: 'healthy' };
    try {
      cacheService.get('health_check');
    } catch (error) {
      cacheHealth.status = 'unhealthy';
      cacheHealth.error = error.message;
    }

    // Test database
    const dbHealth = await databaseService.healthCheck();

    // Test overall response time
    const responseTime = Date.now() - startTime;

    const isHealthy = cacheHealth.status === 'healthy' &&
                     dbHealth.status === 'healthy' &&
                     responseTime < 1000; // Should respond within 1 second

    res.json({
      service: 'models',
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      cache: cacheHealth,
      database: dbHealth
    });
  } catch (error) {
    res.status(503).json({
      service: 'models',
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;