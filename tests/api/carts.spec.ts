import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

interface Cart {
    id: number;
    userId: number;
    date: string;
    products: { productId: number; quantity: number }[];
    __v?: number;
}

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = Routes.BASE_URL;
    const CART_ID = 1;
    const USER_ID = 1;
    const LIMIT = 5;
    const START_DATE = '2019-01-01';
    const END_DATE = '2022-12-31';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'Fetching all carts should return HTTP 200').toBe(200);

        const carts = await response.json() as Cart[];

        expect(Array.isArray(carts), 'Carts response should be an array').toBeTruthy();
        expect(carts.length, 'Carts array should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Cart By Id
    // ---------------------------------------------------------

    test('GET - Cart By Id @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching a cart by id should return HTTP 200').toBe(200);

        const cart = await response.json() as Cart;

        expect(cart.id, 'Returned cart id should match the requested id').toBe(CART_ID);
        expect(Array.isArray(cart.products), 'Cart should contain a products array').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts By Date Range
    // ---------------------------------------------------------

    test('GET - Carts By Date Range @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE)}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching carts by date range should return HTTP 200').toBe(200);

        const carts = await response.json() as Cart[];

        expect(Array.isArray(carts), 'Carts by date range response should be an array').toBeTruthy();

        const rangeStart = new Date(START_DATE).getTime();
        const rangeEnd = new Date(`${END_DATE}T23:59:59.999Z`).getTime();

        carts.forEach((cart) => {
            const cartDate = new Date(cart.date).getTime();
            expect(cartDate, 'Each cart date should fall within the requested range').toBeGreaterThanOrEqual(rangeStart);
            expect(cartDate, 'Each cart date should fall within the requested range').toBeLessThanOrEqual(rangeEnd);
        });
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User Cart @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching a user cart should return HTTP 200').toBe(200);

        const carts = await response.json() as Cart[];

        expect(Array.isArray(carts), 'User cart response should be an array').toBeTruthy();

        carts.forEach((cart) => {
            expect(cart.userId, 'Returned carts should belong to the requested user').toBe(USER_ID);
        });
    });

    // ---------------------------------------------------------
    // GET - Carts With Limit
    // ---------------------------------------------------------

    test('GET - Carts With Limit @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching carts with a limit should return HTTP 200').toBe(200);

        const carts = await response.json() as Cart[];

        expect(Array.isArray(carts), 'Limited carts response should be an array').toBeTruthy();
        expect(carts.length, 'Returned cart count should match the requested limit').toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted (Ascending)
    // ---------------------------------------------------------

    test('GET - Carts Sorted Ascending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching ascending sorted carts should return HTTP 200').toBe(200);

        const carts = await response.json() as Cart[];
        const ids = carts.map((cart) => cart.id);

        const isAscending = ids.every((id, index) => index === 0 || ids[index - 1] <= id);
        expect(isAscending, 'Cart ids should be in ascending order').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted (Descending)
    // ---------------------------------------------------------

    test('GET - Carts Sorted Descending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching descending sorted carts should return HTTP 200').toBe(200);

        const carts = await response.json() as Cart[];
        const ids = carts.map((cart) => cart.id);

        const isDescending = ids.every((id, index) => index === 0 || ids[index - 1] >= id);
        expect(isDescending, 'Cart ids should be in descending order').toBeTruthy();
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), 'Creating a cart should return HTTP 201').toBe(201);

        const created = await response.json() as Cart;

        expect(created.id, 'Created cart should have an id').toBeTruthy();
        expect(created.userId, 'Created cart should echo the submitted user id').toBe(payload.userId);
        expect(created.products[0].productId, 'Created cart should echo the submitted product id').toBe(payload.products[0].productId);
        expect(created.products[0].quantity, 'Created cart should echo the submitted quantity').toBe(payload.products[0].quantity);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Updating a cart should return HTTP 200').toBe(200);

        const updated = await response.json() as Cart;

        expect(updated.userId, 'Updated cart should reflect the submitted user id').toBe(payload.userId);
        expect(updated.products[0].productId, 'Updated cart should reflect the submitted product id').toBe(payload.products[0].productId);
        expect(updated.products[0].quantity, 'Updated cart should reflect the changed quantity').toBe(payload.products[0].quantity);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Deleting a cart should return HTTP 200').toBe(200);

        const deleted = await response.json() as Cart;

        expect(deleted.id, 'Deleted cart response should reference the requested id').toBe(CART_ID);
    });
});
