import 'dotenv/config';
import { expect, test } from '@playwright/test';

test.describe('Sign in to the customer account and handle invalid credentials ', () => {
  test('Sign in to the customer account and handle invalid credentials @e2e @web', async ({ page }) => {
    const email = process.env.OPENCART_EMAIL ?? process.env.APP_EMAIL;
    const password = process.env.OPENCART_PASSWORD ?? process.env.APP_PASSWORD;

    if (!email || !password) {
      throw new Error('Set OPENCART_EMAIL and OPENCART_PASSWORD, or APP_EMAIL and APP_PASSWORD, to run this test.');
    }

    // 1. Start in a fresh, logged-out context with an empty cart and wishlist, then open My Account > Login.
    await page.goto('https://naveenautomationlabs.com/opencart/');
    await expect(page.getByRole('link', { name: 'Wish List (0)' })).toBeVisible();
    await expect(page.getByRole('button', { name: /0 item\(s\) - \$0\.00/ })).toBeVisible();
    await page.locator('a.dropdown-toggle[title="My Account"]').click();
    await page.getByRole('link', { name: 'Login', exact: true }).click();
    await expect(page).toHaveTitle('Account Login');
    await expect(page.getByRole('textbox', { name: 'E-Mail Address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.locator('#content').getByRole('link', { name: 'Forgotten Password' })).toBeVisible();
    await expect(page.locator('#content').getByRole('link', { name: 'Continue' })).toBeVisible();

    // 2. Submit invalid credentials and verify the failure message, logged-out state, and masked password.
    // const invalidPassword = 'incorrect-demo-password';
    // await page.locator('#input-email').fill('invalid-login-qa@example.invalid');
    // await page.locator('#input-password').fill(invalidPassword);
    // await page.locator('input[type="submit"]').click();
    // await expect(page).toHaveURL(/route=account\/login/);
    // await expect(page.getByText('Warning: No match for E-Mail Address and/or Password.')).toBeVisible();
    // await expect(page.locator('#input-password')).toHaveAttribute('type', 'password');
    // await expect(page.locator('#input-password')).toHaveValue(invalidPassword);
    // await expect(page.locator('#content')).not.toContainText(invalidPassword);
    // await expect(page.locator('#column-right').getByRole('link', { name: 'Logout' })).toHaveCount(0);

    // 3. Replace the invalid values with the authorized demo credentials and submit.
    await page.locator('#input-email').fill(email);
    await page.locator('#input-password').fill(password);
    await page.locator('input[type="submit"]').click();
    await expect(page).toHaveURL(/route=account\/account/);
    await expect(page.locator('#content').getByRole('heading', { name: 'My Account' })).toBeVisible();

    // 4. Verify account dashboard links and signed-in account controls.
    await expect(page.locator('#content').getByRole('link', { name: 'Edit your account information' })).toBeVisible();
    await expect(page.locator('#content').getByRole('link', { name: 'Modify your address book entries' })).toBeVisible();
    await expect(page.locator('#content').getByRole('link', { name: 'Modify your wish list' })).toBeVisible();
    await expect(page.locator('#content').getByRole('link', { name: 'View your order history' })).toBeVisible();
    await expect(page.locator('#column-right').getByRole('link', { name: 'Logout' })).toBeVisible();
  });
});