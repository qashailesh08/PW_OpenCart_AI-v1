import { Page, Locator } from '@playwright/test';

export class AccountPage {
  readonly page: Page;

  // Locators
  private readonly successHeading: Locator;
  private readonly continueLink: Locator;
  private readonly myAccountHeading: Locator;
  private readonly accountNavigation: Locator;
  private readonly myAccountNavLink: Locator;
  private readonly logoutNavLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with role selectors
    this.successHeading = page.getByRole('heading', { name: /Your Account Has Been Created/i, level: 1 });
    this.continueLink = page.getByRole('link', { name: 'Continue' });
    this.myAccountHeading = page.getByRole('heading', { name: 'My Account', level: 1 });
    this.accountNavigation = page.locator('#column-right');
    this.myAccountNavLink = this.accountNavigation.getByRole('link', { name: 'My Account', exact: true });
    this.logoutNavLink = this.accountNavigation.getByRole('link', { name: 'Logout', exact: true });
  }

  /**
   * Verifies the registration success confirmation is displayed
   * @returns Promise<boolean> - true if "Your Account Has Been Created!" is visible
   */
  async isRegistrationSuccessVisible(): Promise<boolean> {
    try {
      return await this.successHeading.isVisible();
    } catch (error) {
      console.log(`Error checking registration success: ${error}`);
      return false;
    }
  }

  /**
   * Clicks the Continue link on the registration success page
   * @returns Promise<AccountPage> - Instance of the account page
   */
  async clickContinue(): Promise<AccountPage> {
    await this.continueLink.click();
    await this.page.waitForURL(/route=account\/account/i, { timeout: 15000 });
    return new AccountPage(this.page);
  }

  /**
   * Verifies the My Account dashboard exists
   * @returns Promise<boolean> - true if the My Account page is displayed
   */
  async isMyAccountPageExists(): Promise<boolean> {
    try {
      return await this.myAccountHeading.isVisible();
    } catch (error) {
      console.log(`Error checking My Account page: ${error}`);
      return false;
    }
  }

  /**
   * Verifies the authenticated account navigation is available
   * @returns Promise<boolean> - true if the account navigation links are visible
   */
  async isAccountNavigationVisible(): Promise<boolean> {
    try {
      return (await this.myAccountHeading.isVisible())
        && (await this.myAccountNavLink.isVisible())
        && (await this.logoutNavLink.isVisible());
    } catch (error) {
      console.log(`Error checking account navigation: ${error}`);
      return false;
    }
  }

  /**
   * Logs the customer out
   */
  async logout(): Promise<void> {
    await this.logoutNavLink.click();
    await this.page.waitForURL(/route=account\/logout/i, { timeout: 15000 });
  }
}
