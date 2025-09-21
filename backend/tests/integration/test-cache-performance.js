const request = require('supertest');
const app = require('../../src/app');

describe('Cache Performance Tests', () => {
  test('cache hit should be faster than cache miss', async () => {
    // First request - cache miss
    const startMiss = Date.now();
    const missResponse = await request(app)
      .get('/api/models');
    const missTime = Date.now() - startMiss;

    expect(missResponse.status).toBe(200);

    // Second request - cache hit
    const startHit = Date.now();
    const hitResponse = await request(app)
      .get('/api/models');
    const hitTime = Date.now() - startHit;

    expect(hitResponse.status).toBe(200);

    // Cache hit should be significantly faster
    expect(hitTime).toBeLessThan(missTime * 0.5);

    // Both should return same data
    expect(missResponse.body.data.length).toBe(hitResponse.body.data.length);
  });

  test('should handle multiple concurrent requests efficiently', async () => {
    const startTime = Date.now();

    // Make 5 concurrent requests
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(request(app).get('/api/models'));
    }

    const responses = await Promise.all(requests);
    const totalTime = Date.now() - startTime;

    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    // Average response time should be reasonable
    const avgTime = totalTime / 5;
    expect(avgTime).toBeLessThan(1000); // Less than 1 second average
  });

  test('cache should not degrade performance over time', async () => {
    const times = [];

    // Make 10 requests
    for (let i = 0; i < 10; i++) {
      const start = Date.now();
      const response = await request(app)
        .get('/api/models');
      const time = Date.now() - start;

      expect(response.status).toBe(200);
      times.push(time);
    }

    // Performance should not degrade significantly
    const firstTime = times[0];
    const lastTime = times[times.length - 1];

    // Last request should not be more than 2x slower than first
    expect(lastTime).toBeLessThan(firstTime * 2);
  });

  test('memory usage should remain stable', async () => {
    // This is a basic test - in production, you'd monitor actual memory usage
    const initialStats = process.memoryUsage();

    // Make several requests
    for (let i = 0; i < 20; i++) {
      await request(app)
        .get('/api/models');
    }

    const finalStats = process.memoryUsage();

    // Memory usage should not increase dramatically
    const memoryIncrease = finalStats.heapUsed - initialStats.heapUsed;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
  });
});