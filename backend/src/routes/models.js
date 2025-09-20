const express = require('express');
const router = express.Router();
const modelService = require('../services/modelService');

// GET /api/models - Retrieve all free AI models
router.get('/', async (req, res) => {
  try {
    const models = await modelService.fetchAllModels();
    res.json(models);
  } catch (error) {
    console.error('Error in GET /api/models:', error.message);
    res.status(500).json({
      error: {
        message: 'Failed to fetch models',
        type: 'api_error'
      }
    });
  }
});

// GET /api/models/:id - Retrieve a specific model by ID
router.get('/:id', async (req, res) => {
  try {
    const model = await modelService.getModelById(req.params.id);
    res.json({ data: model });
  } catch (error) {
    console.error(`Error in GET /api/models/${req.params.id}:`, error.message);

    if (error.message === 'Model not found') {
      return res.status(404).json({
        error: {
          message: 'Model not found',
          type: 'not_found'
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Failed to fetch model',
        type: 'api_error'
      }
    });
  }
});

module.exports = router;