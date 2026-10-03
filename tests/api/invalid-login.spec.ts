import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = Routes.BASE_URL;
    const EXPECTED_ERROR = 'username or password is incorrect';

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Invalid Login @master @sanity @api', async ({ request }) => {

        const payload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, { data: payload });

        expect(response.status(), 'Invalid login should return HTTP 401').toBe(401);

        const rawMessage = (await response.text()).trim();
        const message = rawMessage.replace(/^"|"$/g, '');

        expect(message, 'Invalid login should return the expected authentication error').toContain(EXPECTED_ERROR);
    });
});
