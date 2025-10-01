const axios = require('axios');
const cacheService = require('./cacheService');
const databaseService = require('./databaseService');

class ModelService {
  constructor() {
    this.openRouterBaseUrl = 'https://openrouter.ai/api/v1';
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.cacheKey = 'models';
  }

  async fetchAllModels() {
    try {
      // 1. Check cache first (fastest)
      const cachedData = cacheService.get(this.cacheKey);
      if (cachedData) {
        console.log('Serving models from cache');
        return cachedData;
      }

      // 2. Try database (persistent)
      try {
        const databaseModels = await databaseService.getAllModels();
        if (databaseModels && databaseModels.length > 0) {
          const result = { data: databaseModels };
          // Refresh cache with database data
          cacheService.set(this.cacheKey, result);
          console.log('Serving models from database');
          return result;
        }
      } catch (error) {
        console.warn('Database unavailable, falling back to API:', error.message);
      }

      // 3. Fetch from API (fresh data)
      console.log('Fetching models from OpenRouter API');
      const response = await axios.get(`${this.openRouterBaseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Filter only free models (pricing.prompt === 0 && pricing.completion === 0)
      const allModels = response.data.data || [];
      const freeModels = allModels.filter(model =>
        model.pricing &&
        model.pricing.prompt == '0' &&
        model.pricing.completion == '0'
      );

      const result = {
        data: freeModels
      };

      // 4. Store in database and cache for future requests
      try {
        await databaseService.storeModels(freeModels);
        console.log('Models stored in database');
      } catch (error) {
        console.warn('Failed to store models in database:', error.message);
      }

      // Cache the result
      cacheService.set(this.cacheKey, result);
      console.log('Models cached successfully');

      return result;
    } catch (error) {
      console.error('Error in fetchAllModels:', error.message);
      throw new Error('Failed to fetch models from all sources');
    }
  }

  async getModelById(id) {
    try {
      const cacheKey = `model:${id}`;

      // 1. Check cache first (fastest)
      const cachedModel = cacheService.get(cacheKey);
      if (cachedModel) {
        console.log(`Serving model ${id} from cache`);
        return cachedModel;
      }

      // 2. Try database (persistent)
      try {
        const databaseModel = await databaseService.getModelById(id);
        if (databaseModel) {
          // Refresh cache with database data
          cacheService.set(cacheKey, databaseModel);
          console.log(`Serving model ${id} from database`);
          return databaseModel;
        }
      } catch (error) {
        console.warn(`Database lookup failed for model ${id}:`, error.message);
      }

      // 3. Fetch from API (fresh data)
      console.log(`Fetching model ${id} from API`);
      const allModels = await this.fetchAllModels();
      const model = allModels.data.find(model => model.id === id);

      if (!model) {
        throw new Error('Model not found');
      }

      // Cache individual model
      cacheService.set(cacheKey, model);
      console.log(`Model ${id} cached successfully`);

      return model;
    } catch (error) {
      console.error(`Error fetching model ${id}:`, error.message);
      throw error;
    }
  }
}

module.exports = new ModelService();