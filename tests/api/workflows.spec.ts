import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

interface User {
    id: number;
    email: string;
    username: string;
    password: string;
}

interface Cart {
    id: number;
    userId: number;
    date: string;
    products: { productId: number; quantity: number }[];
}

test.describe.serial('Product CRUD Workflow API Tests', () => {

    const BASE_URL = Routes.BASE_URL;

    test('POST -> PUT -> DELETE Product Workflow @master @regression @end-to-end @api', async ({ request }) => {

        // ---------------------------------------------------------
        // POST - Create Product
        // ---------------------------------------------------------

        const createPayload = RandomDataUtil.generateProductPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createPayload });

        expect(createResponse.status(), 'Creating a product should return HTTP 201').toBe(201);

        const created = await createResponse.json() as Product;
        const productId = created.id;

        expect(productId, 'Created product should have an id for the workflow').toBeTruthy();

        // ---------------------------------------------------------
        // PUT - Update Product
        // ---------------------------------------------------------

        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
        const updateUrl = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`;

        const updateResponse = await request.put(updateUrl, { data: updatePayload });

        expect(updateResponse.status(), 'Updating the created product should return HTTP 200').toBe(200);

        const updated = await updateResponse.json() as Product;

        expect(updated.id, 'Updated product id should match the created id').toBe(productId);
        expect(updated.title, 'Updated product should reflect the new title').toBe(updatePayload.title);

        // ---------------------------------------------------------
        // DELETE - Delete Product
        // ---------------------------------------------------------

        const deleteUrl = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`;

        const deleteResponse = await request.delete(deleteUrl);

        expect(deleteResponse.status(), 'Deleting the created product should return HTTP 200').toBe(200);
    });
});

test.describe.serial('User CRUD Workflow API Tests', () => {

    const BASE_URL = Routes.BASE_URL;

    test('POST -> PUT -> DELETE User Workflow @master @regression @end-to-end @api', async ({ request }) => {

        // ---------------------------------------------------------
        // POST - Create User
        // ---------------------------------------------------------

        const createPayload = RandomDataUtil.generateUserPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createPayload });

        expect(createResponse.status(), 'Creating a user should return HTTP 201').toBe(201);

        const created = await createResponse.json() as User;
        const userId = created.id;

        expect(userId, 'Created user should have an id for the workflow').toBeTruthy();

        // ---------------------------------------------------------
        // PUT - Update User
        // ---------------------------------------------------------

        const updatePayload = RandomDataUtil.generateUserUpdatePayload();
        const updateUrl = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`;

        const updateResponse = await request.put(updateUrl, { data: updatePayload });

        expect(updateResponse.status(), 'Updating the created user should return HTTP 200').toBe(200);

        const updated = await updateResponse.json() as User;

        expect(updated.id, 'Updated user id should match the created id').toBe(userId);
        expect(updated.username, 'Updated user should reflect the new username').toBe(updatePayload.username);

        // ---------------------------------------------------------
        // DELETE - Delete User
        // ---------------------------------------------------------

        const deleteUrl = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`;

        const deleteResponse = await request.delete(deleteUrl);

        expect(deleteResponse.status(), 'Deleting the created user should return HTTP 200').toBe(200);
    });
});

test.describe.serial('Cart CRUD Workflow API Tests', () => {

    const BASE_URL = Routes.BASE_URL;
    const USER_ID = 1;

    test('POST -> PUT -> DELETE Cart Workflow @master @regression @end-to-end @api', async ({ request }) => {

        // ---------------------------------------------------------
        // POST - Create Cart
        // ---------------------------------------------------------

        const createPayload = RandomDataUtil.generateCartPayload(USER_ID);

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });

        expect(createResponse.status(), 'Creating a cart should return HTTP 201').toBe(201);

        const created = await createResponse.json() as Cart;
        const cartId = created.id;

        expect(cartId, 'Created cart should have an id for the workflow').toBeTruthy();
        expect(created.userId, 'Created cart should belong to the requested user').toBe(USER_ID);
        expect(created.products.length, 'Created cart should contain the submitted products').toBe(createPayload.products.length);

        // ---------------------------------------------------------
        // PUT - Update Cart
        // ---------------------------------------------------------

        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const updateUrl = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`;

        const updateResponse = await request.put(updateUrl, { data: updatePayload });

        expect(updateResponse.status(), 'Updating the created cart should return HTTP 200').toBe(200);

        const updated = await updateResponse.json() as Cart;

        expect(updated.id, 'Updated cart id should match the created id').toBe(cartId);
        expect(updated.products[0].quantity, 'Updated cart should reflect the changed quantity').toBe(updatePayload.products[0].quantity);

        // ---------------------------------------------------------
        // DELETE - Delete Cart
        // ---------------------------------------------------------

        const deleteUrl = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`;

        const deleteResponse = await request.delete(deleteUrl);

        expect(deleteResponse.status(), 'Deleting the created cart should return HTTP 200').toBe(200);
    });
});
