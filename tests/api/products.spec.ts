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
    rating: { rate: number; count: number };
}

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = Routes.BASE_URL;
    const PRODUCT_ID = 1;
    const LIMIT = 5;
    const CATEGORY = 'electronics';

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'Fetching all products should return HTTP 200').toBe(200);

        const products = await response.json() as Product[];

        expect(Array.isArray(products), 'Products response should be an array').toBeTruthy();
        expect(products.length, 'Products array should contain at least one product').toBeGreaterThan(0);

        products.forEach((product) => {
            expect(typeof product.id, 'Each product should have a numeric id').toBe('number');
            expect(product.title, 'Each product should have a title').toBeTruthy();
            expect(typeof product.price, 'Each product should have a numeric price').toBe('number');
            expect(product.category, 'Each product should have a category').toBeTruthy();
            expect(product.image, 'Each product should have an image').toBeTruthy();
        });
    });

    // ---------------------------------------------------------
    // GET - Product By Id
    // ---------------------------------------------------------

    test('GET - Product By Id @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching a product by id should return HTTP 200').toBe(200);

        const product = await response.json() as Product;

        expect(product.id, 'Returned product id should match the requested id').toBe(PRODUCT_ID);
        expect(product.title, 'Product should have a title').toBeTruthy();
        expect(typeof product.price, 'Product should have a numeric price').toBe('number');
        expect(product.category, 'Product should have a category').toBeTruthy();
        expect(product.image, 'Product should have an image').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Products With Limit
    // ---------------------------------------------------------

    test('GET - Products With Limit @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching products with a limit should return HTTP 200').toBe(200);

        const products = await response.json() as Product[];

        expect(Array.isArray(products), 'Limited products response should be an array').toBeTruthy();
        expect(products.length, 'Returned product count should match the requested limit').toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Products Sorted (Ascending)
    // ---------------------------------------------------------

    test('GET - Products Sorted Ascending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching ascending sorted products should return HTTP 200').toBe(200);

        const products = await response.json() as Product[];
        const ids = products.map((product) => product.id);

        const isAscending = ids.every((id, index) => index === 0 || ids[index - 1] <= id);
        expect(isAscending, 'Product ids should be in ascending order').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Products Sorted (Descending)
    // ---------------------------------------------------------

    test('GET - Products Sorted Descending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching descending sorted products should return HTTP 200').toBe(200);

        const products = await response.json() as Product[];
        const ids = products.map((product) => product.id);

        const isDescending = ids.every((id, index) => index === 0 || ids[index - 1] >= id);
        expect(isDescending, 'Product ids should be in descending order').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - All Categories
    // ---------------------------------------------------------

    test('GET - All Categories @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'Fetching all categories should return HTTP 200').toBe(200);

        const categories = await response.json() as string[];

        expect(Array.isArray(categories), 'Categories response should be an array').toBeTruthy();
        expect(categories.length, 'Categories array should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Products By Category
    // ---------------------------------------------------------

    test('GET - Products By Category @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY)}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching products by category should return HTTP 200').toBe(200);

        const products = await response.json() as Product[];

        expect(Array.isArray(products), 'Products by category response should be an array').toBeTruthy();
        expect(products.length, 'Category should contain at least one product').toBeGreaterThan(0);

        products.forEach((product) => {
            expect(product.category, 'Every product should belong to the requested category').toBe(CATEGORY);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), 'Creating a product should return HTTP 201').toBe(201);

        const created = await response.json() as Product;

        expect(created.id, 'Created product should have an id').toBeTruthy();
        expect(created.title, 'Created product should echo the submitted title').toBe(payload.title);
        expect(created.price, 'Created product should echo the submitted price').toBe(payload.price);
        expect(created.category, 'Created product should echo the submitted category').toBe(payload.category);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Updating a product should return HTTP 200').toBe(200);

        const updated = await response.json() as Product;

        expect(updated.id, 'Updated product id should match the requested id').toBe(PRODUCT_ID);
        expect(updated.title, 'Updated product should reflect the new title').toBe(payload.title);
        expect(updated.price, 'Updated product should reflect the new price').toBe(payload.price);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Deleting a product should return HTTP 200').toBe(200);

        const deleted = await response.json() as Product;

        expect(deleted.id, 'Deleted product response should reference the requested id').toBe(PRODUCT_ID);
    });
});
