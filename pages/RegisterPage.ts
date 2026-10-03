import { Page, Locator } from '@playwright/test';
import { AccountPage } from './AccountPage';

/**
 * Customer details required to register a new account
 */
export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class RegisterPage {
  readonly page: Page;

  // Locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly privacyPolicyCheckbox: Locator;
  private readonly continueButton: Locator;
  private readonly registerHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with label and role selectors
    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.emailInput = page.getByLabel('E-Mail');
    this.passwordInput = page.getByLabel('Password');
    this.privacyPolicyCheckbox = page.locator('input[name="agree"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.registerHeading = page.getByRole('heading', { name: 'Register Account', level: 1 });
  }

  /**
   * Enters the customer first name
   * @param firstName - First name to enter
   */
  async setFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Enters the customer last name
   * @param lastName - Last name to enter
   */
  async setLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Enters the customer email address
   * @param email - Email address to enter
   */
  async setEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Enters the customer password
   * @param password - Password to enter
   */
  async setPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Accepts the Privacy Policy checkbox
   */
  async acceptPrivacyPolicy(): Promise<void> {
    await this.privacyPolicyCheckbox.check();
  }

  /**
   * Submits the registration form
   * @returns Promise<AccountPage> - Instance of the account page
   */
  async clickContinue(): Promise<AccountPage> {
    await this.continueButton.click();
    await this.page.waitForURL(/route=account\/success/i, { timeout: 15000 });
    return new AccountPage(this.page);
  }

  /**
   * Registers a new customer by filling the form and submitting it
   * @param customer - Customer details to register
   * @returns Promise<AccountPage> - Instance of the account page
   */
  async completeRegistration(customer: CustomerData): Promise<AccountPage> {
    try {
      await this.setFirstName(customer.firstName);
      await this.setLastName(customer.lastName);
      await this.setEmail(customer.email);
      await this.setPassword(customer.password);
      await this.acceptPrivacyPolicy();
      return await this.clickContinue();
    } catch (error) {
      console.log(`Error completing registration: ${error}`);
      throw error;
    }
  }

  /**
   * Registers a new customer (composite registration action)
   * @param firstName - First name to enter
   * @param lastName - Last name to enter
   * @param email - Email address to enter
   * @param password - Password to enter
   */
  async registerCustomer(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    await this.completeRegistration({ firstName, lastName, email, password });
  }

  /**
   * Verifies the registration page exists
   * @returns Promise<boolean> - true if the register page is displayed
   */
  async isRegisterPageExists(): Promise<boolean> {
    try {
      return await this.registerHeading.isVisible();
    } catch (error) {
      console.log(`Error checking register page: ${error}`);
      return false;
    }
  }
}
