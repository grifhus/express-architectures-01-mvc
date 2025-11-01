import request from 'supertest';
import { app } from '../src/app';

describe('Root Endpoint', () => {
  it('should return 200 OK for the root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Welcome to the Base Project API!');
  });
});
