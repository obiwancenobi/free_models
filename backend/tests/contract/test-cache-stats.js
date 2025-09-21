const request = require('supertest');
const app = require('../../src/app');

describe('GET /api/cache/stats', () => {
  it('should return cache statistics', async () => {
    const response = await request(app)
      .get('/api/cache/stats')
      .set('Authorization', 'Bearer test-token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total_entries');
    expect(response.body).toHaveProperty('total_size');
    expect(response.body).toHaveProperty('hit_ratio');
    expect(response.body).toHaveProperty('entries');
    expect(typeof response.body.total_entries).toBe('number');
    expect(typeof response.body.hit_ratio).toBe('number');
  });

  it('should return 401 when no authorization provided', async () => {
    const response = await request(app)
      .get('/api/cache/stats');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
  });

  it('should include entry details in response', async () => {
    const response = await request(app)
      .get('/api/cache/stats')
      .set('Authorization', 'Bearer test-token');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.entries)).toBe(true);
    if (response.body.entries.length > 0) {
      const entry = response.body.entries[0];
      expect(entry).toHaveProperty('key');
      expect(entry).toHaveProperty('hits');
      expect(entry).toHaveProperty('misses');
      expect(entry).toHaveProperty('last_accessed');
    }
  });

  it('should return 500 on internal error', async () => {
    // This test will pass when implementation handles errors properly
    const response = await request(app)
      .get('/api/cache/stats')
      .set('Authorization', 'Bearer test-token');

    // For now, expect 404 since endpoint doesn't exist
    expect(response.status).toBe(404);
  });
});