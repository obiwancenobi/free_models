const axios = require('axios');

class ModelService {
  constructor() {
    this.openRouterBaseUrl = 'https://openrouter.ai/api/v1';
    this.apiKey = process.env.OPENROUTER_API_KEY;
  }

  async fetchAllModels() {
    try {
      const response = await axios.get(`${this.openRouterBaseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Filter only free models (pricing.prompt === 0 && pricing.completion === 0)
      const freeModels = response.data.data.filter(model =>
        model.pricing &&
        model.pricing.prompt == '0' &&
        model.pricing.completion == '0'
      );

      return {
        data: freeModels
      };
    } catch (error) {
      console.error('Error fetching models from OpenRouter:', error.message);
      throw new Error('Failed to fetch models from OpenRouter API');
    }
  }

  async getModelById(id) {
    try {
      const allModels = await this.fetchAllModels();
      const model = allModels.data.find(model => model.id === id);

      if (!model) {
        throw new Error('Model not found');
      }

      return model;
    } catch (error) {
      console.error(`Error fetching model ${id}:`, error.message);
      throw error;
    }
  }
}

module.exports = new ModelService();