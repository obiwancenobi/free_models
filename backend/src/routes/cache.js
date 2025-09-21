const express = require('express');
const router = express.Router();
const cacheService = require('../services/cacheService');

// Simple authentication middleware (replace with proper auth)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  // For demo purposes, accept any token
  // In production, validate the token properly
  if (!token) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  next();
};

// POST /api/cache/invalidate
router.post('/invalidate', authenticate, (req, res) => {
  try {
    const { key } = req.body;

    let invalidatedKeys = [];

    if (key) {
      // Invalidate specific key
      const deleted = cacheService.delete(key);
      if (deleted) {
        invalidatedKeys = [key];
      }
    } else {
      // Invalidate all cache
      cacheService.clear();
      invalidatedKeys = cacheService.getKeys();
    }

    res.json({
      success: true,
      message: 'Cache invalidated successfully',
      invalidated_keys: invalidatedKeys
    });
  } catch (error) {
    console.error('Error invalidating cache:', error);
    res.status(500).json({
      error: 'Failed to invalidate cache'
    });
  }
});

// GET /api/cache/stats
router.get('/stats', authenticate, (req, res) => {
  try {
    const stats = cacheService.getStats();

    res.json(stats);
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({
      error: 'Failed to get cache statistics'
    });
  }
});

module.exports = router;