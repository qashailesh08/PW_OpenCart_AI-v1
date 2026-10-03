import { Page, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openProduct(productName: string) {
    await this.page.getByRole('link', { name: productName, exact: true }).first().click();
  }

  async expectProductLoaded(productName: string) {
    await expect(this.page.getByRole('heading', { name: productName, level: 1 })).toBeVisible();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to Cart' }).click();
  }
}
