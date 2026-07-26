import request from 'supertest';
import app from '../src/app.js';

describe('System Integration API Tests', () => {
  test('GET /health should return HTTP 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toEqual('UP');
  });

  test('GET /api-docs/ should serve Swagger UI', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.statusCode).toEqual(200);
  });
});
