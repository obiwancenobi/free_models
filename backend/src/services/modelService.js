const axios = require('axios');
const cacheService = require('./cacheService');

class ModelService {
  constructor() {
    this.openRouterBaseUrl = 'https://openrouter.ai/api/v1';
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.cacheKey = 'models';
  }

  async fetchAllModels() {
    try {
      // Check cache first
      const cachedData = cacheService.get(this.cacheKey);
      if (cachedData) {
        console.log('Serving models from cache');
        return cachedData;
      }

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

      // Cache the result
      cacheService.set(this.cacheKey, result);
      console.log('Models cached successfully');

      return result;
    } catch (error) {
      console.error('Error fetching models from OpenRouter:', error.message);
      throw new Error('Failed to fetch models from OpenRouter API');
    }
  }

  async getModelById(id) {
    try {
      const cacheKey = `model:${id}`;

      // Check cache first
      const cachedModel = cacheService.get(cacheKey);
      if (cachedModel) {
        console.log(`Serving model ${id} from cache`);
        return cachedModel;
      }

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