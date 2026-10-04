import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';

dotenv.config();

test.describe('Authentication API Tests', () => {
  test.skip('POST - Successful Login @master @sanity @api', async ({ request }) => {
    test.fixme(true, 'FakeStore currently returns HTTP 522 instead of the documented login response');

    const username = process.env.FAKESTORE_USERNAME;
    const password = process.env.FAKESTORE_PASSWORD;

    if (!username || !password) {
      throw new Error('Set FAKESTORE_USERNAME and FAKESTORE_PASSWORD in .env');
    }

    // FakeStore is returning an upstream 522 HTML timeout page instead of HTTP 201.
    const response = await request.post(`${Routes.BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: { username, password }
    });

    expect(response.status(), 'Login should return HTTP 201').toBe(201);

    const responseBody = await response.json() as { token?: unknown };

    expect(responseBody, 'Login response should include a token property').toHaveProperty('token');
    expect(typeof responseBody.token, 'Token should be a string').toBe('string');
    expect((responseBody.token as string).trim().length, 'Token should not be empty').toBeGreaterThan(0);
  });
});