import { Page, Locator, test } from '@playwright/test';
import { RegisterPage } from './RegisterPage';

const APP_URL = process.env.WEB_APP_URL || 'http://localhost/opencartsite/';

export class HomePage {
  readonly page: Page;

  // Locators
  private readonly myAccountToggle: Locator;
  private readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with role selectors
    this.myAccountToggle = page.getByRole('button', { name: /My Account/i });
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  private async goToUrl(url: string) {
    try {
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    } catch (error) {
      test.skip(true, `OpenCart is not available at ${url}. Start the app or set WEB_APP_URL before running web tests.`);
    }
  }

  async goto() {
    await this.goToUrl(APP_URL);
  }

  async openRegisterPage() {
    await this.goToUrl(`${APP_URL}index.php?route=account/register&language=en-gb`);
  }

  async openLoginPage() {
    await this.goToUrl(`${APP_URL}index.php?route=account/login&language=en-gb`);
  }

  async searchProduct(productName: string) {
    const searchUrl = `${APP_URL}index.php?route=product/search&language=en-gb&search=${encodeURIComponent(productName)}`;
    await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await this.page.waitForURL(/route=product\/search/i, { timeout: 15000 });
  }

  async openShoppingCart() {
    const cartUrl = `${APP_URL}index.php?route=checkout/cart&language=en-gb`;
    await this.page.goto(cartUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  }

  async logout() {
    await this.page.getByRole('link', { name: 'Logout' }).click();
  }

  /**
   * Opens the My Account dropdown in the site header
   */
  async clickMyAccount(): Promise<void> {
    await this.myAccountToggle.click();
  }

  /**
   * Clicks the Register link in the My Account dropdown
   * @returns Promise<RegisterPage> - Instance of the register page
   */
  async clickRegister(): Promise<RegisterPage> {
    await this.registerLink.click();
    return new RegisterPage(this.page);
  }
}
