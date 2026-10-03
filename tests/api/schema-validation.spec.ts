import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import * as path from 'path';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import { SchemaValidator } from '../../utils/schemaValidator';

dotenv.config();

test.describe('JSON Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = Routes.BASE_URL;
    const PRODUCT_ID = 1;
    const USER_ID = 1;
    const CART_ID = 1;

    const productSchema = DataProvider.readJson(path.join(__dirname, '../../api/schemas/product_api_schema.json'));
    const userSchema = DataProvider.readJson(path.join(__dirname, '../../api/schemas/user_api_schema.json'));
    const cartSchema = DataProvider.readJson(path.join(__dirname, '../../api/schemas/cart_api_schema.json'));

    // ---------------------------------------------------------
    // GET - Product Response Schema
    // ---------------------------------------------------------

    test('GET - Product Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching a product by id should return HTTP 200').toBe(200);

        const product = await response.json();

        const isValid = SchemaValidator.validateSchema(productSchema, product);

        expect(isValid, 'Product response should conform to the expected JSON schema').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - User Response Schema
    // ---------------------------------------------------------

    test('GET - User Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching a user by id should return HTTP 200').toBe(200);

        const user = await response.json();

        const isValid = SchemaValidator.validateSchema(userSchema, user);

        expect(isValid, 'User response should conform to the expected JSON schema').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Cart Response Schema
    // ---------------------------------------------------------

    test('GET - Cart Response Schema @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Fetching a cart by id should return HTTP 200').toBe(200);

        const cart = await response.json();

        const isValid = SchemaValidator.validateSchema(cartSchema, cart);

        expect(isValid, 'Cart response should conform to the expected JSON schema').toBeTruthy();
    });
});
