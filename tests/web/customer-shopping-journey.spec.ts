import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('Customer shopping journey @master @sanity @web', async ({ homePage, registerPage, loginPage, productPage, cartPage, accountPage }) => {
  const firstName = RandomDataUtil.getFirstName();
  const lastName = RandomDataUtil.getLastName();
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Date.now()}@example.com`;
  const password = 'Test@1234';
  const productName = 'MacBook';
  const quantity = '1';
  const expectedPrice = '$602.00';
  const expectedTotal = '$602.00';

  await test.step('1. Open the application', async () => {
    await homePage.goto();
    await expect(homePage.page).toHaveTitle(/Your Store/i);
  });

  await test.step('2. Register a new customer using dynamically generated unique data', async () => {
    await homePage.openRegisterPage();
    await registerPage.registerCustomer(firstName, lastName, email, password);
  });

  await test.step('3. Verify successful registration', async () => {
    await expect(homePage.page.getByRole('heading', { name: 'Your Account Has Been Created' })).toBeVisible();
  });

  await test.step('4. Log out', async () => {
    await accountPage.logout();
    await expect(homePage.page).toHaveURL(/route=account\/logout/i);
  });

  await test.step('5. Log in again using the newly created credentials', async () => {
    await homePage.openLoginPage();
    await loginPage.login(email, password);
  });

  await test.step('6. Verify successful authentication', async () => {
    await expect(homePage.page).toHaveURL(/route=account\/account/i);
    await expect(homePage.page.getByRole('link', { name: 'Logout' })).toBeVisible();
  });

  await test.step('7. Search for a known product', async () => {
    await homePage.searchProduct(productName);
    await expect(homePage.page.getByRole('heading', { name: /Search - MacBook/i })).toBeVisible();
  });

  await test.step('8. Open the product details page', async () => {
    await productPage.openProduct(productName);
    await productPage.expectProductLoaded(productName);
  });

  await test.step('9. Add the product to the cart', async () => {
    await productPage.addToCart();
    await expect(homePage.page.getByText(/Success: You have added/i)).toBeVisible();
  });

  await test.step('10. Open the shopping cart', async () => {
    await homePage.openShoppingCart();
    await expect(homePage.page).toHaveURL(/route=checkout\/cart/i);
  });

  await test.step('11. Verify the correct product', async () => {
    await cartPage.expectProduct(productName);
  });

  await test.step('12. Verify the quantity', async () => {
    const quantityInput = homePage.page.locator('input[name*="quantity"]').first();
    await expect(quantityInput).toHaveValue(quantity);
  });

  await test.step('13. Verify the product price', async () => {
    await cartPage.expectPrice(expectedPrice);
  });

  await test.step('14. Verify the applicable cart total', async () => {
    await cartPage.expectTotal(expectedTotal);
  });

  await test.step('15. Verify the complete journey finishes without errors', async () => {
    await expect(homePage.page.locator('table').filter({ hasText: productName }).first()).toContainText(productName);
    await expect(homePage.page.locator('body')).not.toContainText('Error');
    console.log('✅ Customer shopping journey completed without errors.');
  });
});
