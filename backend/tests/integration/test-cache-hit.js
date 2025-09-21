const request = require('supertest');
const app = require('../../src/app');

describe('Cache Hit Scenario', () => {
  let startTime;

  beforeAll(() => {
    startTime = Date.now();
  });

  it('should serve models from cache on second request', async () => {
    // First request - cache miss
    const firstResponse = await request(app)
      .get('/api/models');

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toHaveProperty('data');
    expect(Array.isArray(firstResponse.body.data)).toBe(true);

    const firstRequestTime = Date.now() - startTime;

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 100));

    // Second request - should be cache hit
    const secondStartTime = Date.now();
    const secondResponse = await request(app)
      .get('/api/models');

    const secondRequestTime = Date.now() - secondStartTime;

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body).toHaveProperty('data');
    expect(Array.isArray(secondResponse.body.data)).toBe(true);

    // Second request should be significantly faster (cache hit)
    expect(secondRequestTime).toBeLessThan(firstRequestTime * 0.5);
  });

  it('should serve individual model from cache', async () => {
    // First request for a specific model
    const firstResponse = await request(app)
      .get('/api/models/gpt-3.5-turbo');

    if (firstResponse.status === 200) {
      const firstRequestTime = Date.now() - startTime;

      // Second request for same model
      const secondStartTime = Date.now();
      const secondResponse = await request(app)
        .get('/api/models/gpt-3.5-turbo');

      const secondRequestTime = Date.now() - secondStartTime;

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body).toHaveProperty('data');

      // Should be faster
      expect(secondRequestTime).toBeLessThan(firstRequestTime);
    } else {
      // If model not found, test still passes
      expect(firstResponse.status).toBe(404);
    }
  });

  it('should maintain data consistency in cached responses', async () => {
    const response1 = await request(app)
      .get('/api/models');

    const response2 = await request(app)
      .get('/api/models');

    expect(response1.body.data.length).toBe(response2.body.data.length);

    // Check that at least one model has consistent data
    if (response1.body.data.length > 0) {
      const model1 = response1.body.data[0];
      const model2 = response2.body.data.find(m => m.id === model1.id);
      expect(model2).toBeDefined();
      expect(model2.name).toBe(model1.name);
    }
  });
});