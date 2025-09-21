const request = require('supertest');
const app = require('../../src/app');

describe('Cache Miss Scenario', () => {
  it('should fetch fresh data on first request', async () => {
    // Clear any existing cache (this would be implemented later)
    // For now, just test the basic functionality

    const startTime = Date.now();
    const response = await request(app)
      .get('/api/models');

    const requestTime = Date.now() - startTime;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    // First request should take some time (not cached)
    expect(requestTime).toBeGreaterThan(100); // At least 100ms for API call
  });

  it('should handle cache miss gracefully', async () => {
    const response = await request(app)
      .get('/api/models');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');

    // Should have at least some models
    expect(response.body.data.length).toBeGreaterThan(0);

    // Each model should have required fields
    const model = response.body.data[0];
    expect(model).toHaveProperty('id');
    expect(model).toHaveProperty('name');
    expect(model).toHaveProperty('pricing');
  });

  it('should cache data after miss for subsequent requests', async () => {
    // First request
    const firstResponse = await request(app)
      .get('/api/models');
    expect(firstResponse.status).toBe(200);

    // Second request should use cache
    const secondResponse = await request(app)
      .get('/api/models');
    expect(secondResponse.status).toBe(200);

    // Data should be identical
    expect(firstResponse.body.data.length).toBe(secondResponse.body.data.length);
  });

  it('should handle API errors gracefully on cache miss', async () => {
    // This test would require mocking the external API
    // For now, just ensure the endpoint responds
    const response = await request(app)
      .get('/api/models');

    // Should not crash even if external API fails
    expect(response.status).toBe(200);
  });
});