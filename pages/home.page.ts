import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly registerButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registerButton = page.getByRole('button', { name: 'Đăng ký', exact: true });
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập', exact: true });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
