import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    name: { firstname: string; lastname: string };
    address: {
        city: string;
        street: string;
        number: number;
        zipcode: string;
        geolocation: { lat: string; long: string };
    };
    phone: string;
    __v: number;
}

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = Routes.BASE_URL;
    const USER_ID = 1;
    const LIMIT = 5;

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'Fetching all users should return HTTP 200').toBe(200);

        const users = await response.json() as User[];

        expect(Array.isArray(users), 'Users response should be an array').toBeTruthy();
        expect(users.length, 'Users array should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - User By Id
    // ---------------------------------------------------------

    test('GET - User By Id @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching a user by id should return HTTP 200').toBe(200);

        const user = await response.json() as User;

        expect(user.id, 'Returned user id should match the requested id').toBe(USER_ID);
        expect(user.email, 'User should have an email').toBeTruthy();
        expect(user.username, 'User should have a username').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Users With Limit
    // ---------------------------------------------------------

    test('GET - Users With Limit @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching users with a limit should return HTTP 200').toBe(200);

        const users = await response.json() as User[];

        expect(Array.isArray(users), 'Limited users response should be an array').toBeTruthy();
        expect(users.length, 'Returned user count should match the requested limit').toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Users Sorted (Ascending)
    // ---------------------------------------------------------

    test('GET - Users Sorted Ascending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching ascending sorted users should return HTTP 200').toBe(200);

        const users = await response.json() as User[];
        const ids = users.map((user) => user.id);

        const isAscending = ids.every((id, index) => index === 0 || ids[index - 1] <= id);
        expect(isAscending, 'User ids should be in ascending order').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Users Sorted (Descending)
    // ---------------------------------------------------------

    test('GET - Users Sorted Descending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching descending sorted users should return HTTP 200').toBe(200);

        const users = await response.json() as User[];
        const ids = users.map((user) => user.id);

        const isDescending = ids.every((id, index) => index === 0 || ids[index - 1] >= id);
        expect(isDescending, 'User ids should be in descending order').toBeTruthy();
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status(), 'Creating a user should return HTTP 201').toBe(201);

        const created = await response.json() as User;

        expect(created.id, 'Created user should have a generated id').toBeTruthy();
        expect(created.username, 'Created user should echo the submitted username').toBe(payload.username);
        expect(created.email, 'Created user should echo the submitted email').toBe(payload.email);
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();
        const url = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Updating a user should return HTTP 200').toBe(200);

        const updated = await response.json() as User;

        expect(updated.username, 'Updated user should reflect the new username').toBe(payload.username);
        expect(updated.email, 'Updated user should reflect the new email').toBe(payload.email);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Deleting a user should return HTTP 200').toBe(200);

        const deleted = await response.json() as User;

        expect(deleted.id, 'Deleted user response should reference the requested id').toBe(USER_ID);
    });
});
