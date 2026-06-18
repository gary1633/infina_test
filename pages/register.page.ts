import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly phoneInput: Locator;
  readonly nameInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.phoneInput = page.locator('input[placeholder="0912 345 678"]');
    this.nameInput = page.locator('input[placeholder="VD: Trần Ngọc Linh"]');
    this.submitButton = page.locator('button:has-text("Tiếp tục · nhận mã OTP")');
  }

  async goto() {
    await this.page.goto('/signup');
  }

  async register(phone: string, name: string) {
    await this.phoneInput.fill(phone);
    await this.nameInput.fill(name);
    await this.submitButton.click();
  }
}
