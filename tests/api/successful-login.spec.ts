import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';

dotenv.config();

test('POST - Successful Login @master @sanity @api', async ({ request }) => {
    const username = process.env.FAKESTORE_USERNAME;
    const password = process.env.FAKESTORE_PASSWORD;

    expect(username, 'FAKESTORE_USERNAME must be configured').toBeTruthy();
    expect(password, 'FAKESTORE_PASSWORD must be configured').toBeTruthy();

    const response = await request.post(`${Routes.BASE_URL}${Routes.AUTH_LOGIN}`, {
        data: { username, password }
    });

    expect(response.status(), 'Login should return HTTP 201').toBe(201);

    const responseBody = await response.json() as { token?: unknown };

    expect(responseBody, 'Login response should include a token property').toHaveProperty('token');
    expect(responseBody.token, 'Token should be a string').toEqual(expect.any(String));
    expect((responseBody.token as string).trim().length, 'Token should not be empty').toBeGreaterThan(0);
});