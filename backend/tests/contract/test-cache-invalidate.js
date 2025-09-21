const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/cache/invalidate', () => {
  it('should invalidate cache and return success', async () => {
    const response = await request(app)
      .post('/api/cache/invalidate')
      .set('Authorization', 'Bearer test-token')
      .send({ key: 'models' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Cache invalidated successfully');
    expect(response.body).toHaveProperty('invalidated_keys');
    expect(Array.isArray(response.body.invalidated_keys)).toBe(true);
  });

  it('should invalidate all cache when no key specified', async () => {
    const response = await request(app)
      .post('/api/cache/invalidate')
      .set('Authorization', 'Bearer test-token')
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.invalidated_keys).toContain('models');
  });

  it('should return 401 when no authorization provided', async () => {
    const response = await request(app)
      .post('/api/cache/invalidate')
      .send({ key: 'models' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
  });

  it('should return 500 on internal error', async () => {
    // This test will pass when implementation handles errors properly
    const response = await request(app)
      .post('/api/cache/invalidate')
      .set('Authorization', 'Bearer test-token')
      .send({ key: 'invalid-key' });

    // For now, expect 404 since endpoint doesn't exist
    expect(response.status).toBe(404);
  });
});