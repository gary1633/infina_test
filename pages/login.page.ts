import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly phoneInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.phoneInput = page.getByPlaceholder('0912 345 678');
    this.submitButton = page.getByRole('button', { name: 'Gửi mã OTP' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(phone: string) {
    await this.phoneInput.fill(phone);
    await this.submitButton.click();
  }
}
