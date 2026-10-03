import { Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.getByRole('link', { name: 'Shopping Cart' }).click();
  }

  async expectProduct(productName: string) {
    await expect(this.page.locator('table').filter({ hasText: productName }).first()).toContainText(productName);
  }

  async expectQuantity(quantity: string) {
    const qtyField = this.page.locator('input[name*="quantity"]').first();
    await expect(qtyField).toHaveValue(quantity);
  }

  async expectPrice(price: string) {
    await expect(this.page.locator('tbody tr').first()).toContainText(price);
  }

  async expectTotal(total: string) {
    await expect(this.page.locator('tfoot tr:last-child td:last-child')).toContainText(total);
  }
}
