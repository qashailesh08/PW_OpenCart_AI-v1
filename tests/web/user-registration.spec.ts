/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account -> Register
 * 3) Verify that the registration page is displayed
 * 4) Generate a unique customer email
 * 5) Enter valid customer details, accept the Privacy Policy and submit the form
 * 6) Verify that registration succeeds
 * 7) Verify the "Your Account Has Been Created!" confirmation
 * 8) Verify the new account is available through the account navigation
 */
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration flow @master @sanity @regression @web', async ({ homePage, registerPage, accountPage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const password = RandomDataUtil.getPassword(10);
    let email = '';

    await test.step('1) Open the application', async () => {
        await expect(homePage.page).toHaveTitle(/Your Store/i);
    });

    await test.step('2) Navigate to My Account -> Register', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
    });

    await test.step('3) Verify that the registration page is displayed', async () => {
        await expect(registerPage.page).toHaveURL(/route=account\/register/);
        const isRegisterPage = await registerPage.isRegisterPageExists();
        expect(isRegisterPage).toBeTruthy();
    });

    await test.step('4) Generate a unique customer email', async () => {
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Date.now()}@example.com`;
    });

    await test.step('5) Enter valid customer details, accept the Privacy Policy and submit the form', async () => {
        await registerPage.completeRegistration({ firstName, lastName, email, password });
    });

    await test.step('6) Verify that registration succeeds', async () => {
        await expect(accountPage.page).toHaveURL(/route=account\/success/);
    });

    await test.step('7) Verify the "Your Account Has Been Created!" confirmation', async () => {
        const isSuccess = await accountPage.isRegistrationSuccessVisible();
        expect(isSuccess).toBeTruthy();
    });

    await test.step('8) Verify the new account is available through the account navigation', async () => {
        await accountPage.clickContinue();
        await expect(accountPage.page).toHaveURL(/route=account\/account/);
        const isMyAccountPage = await accountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();
        const isAccountNavigation = await accountPage.isAccountNavigationVisible();
        expect(isAccountNavigation).toBeTruthy();
    });

    console.log('✅ User registration completed successfully!');
});
