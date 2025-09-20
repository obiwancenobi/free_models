const request = require('supertest');
const app = require('../../src/app'); // Assuming the main app is in src/app.js

describe('GET /api/models', () => {
  it('should return an array of AI models', async () => {
    const response = await request(app)
      .get('/api/models')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    // Check structure of first model
    const firstModel = response.body.data[0];
    expect(firstModel).toHaveProperty('id');
    expect(firstModel).toHaveProperty('name');
    expect(firstModel).toHaveProperty('description');
    expect(firstModel).toHaveProperty('pricing');
    expect(firstModel).toHaveProperty('context_length');

    // Check pricing structure
    expect(firstModel.pricing).toHaveProperty('prompt');
    expect(firstModel.pricing).toHaveProperty('completion');

    // Check that models are free (pricing = 0)
    response.body.data.forEach(model => {
      expect(model.pricing.prompt).toBe(0);
      expect(model.pricing.completion).toBe(0);
    });
  });

  it('should handle API errors gracefully', async () => {
    // This test will pass when error handling is implemented
    const response = await request(app)
      .get('/api/models')
      .expect(500); // Expect error since API not implemented yet
  });
});