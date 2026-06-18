import { Page, Locator } from '@playwright/test';

export class OtpPage {
  readonly page: Page;
  readonly submitButton: Locator;
  readonly errorToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Xác thực ·' });
    this.errorToast = page.getByRole('alertdialog');
  }

  async fillOtp(otp: string) {
    for (let i = 0; i < otp.length; i++) {
      const digitInput = this.page.getByRole('textbox', { name: `Chữ số thứ ${i + 1}` });
      await digitInput.fill(otp[i]);
    }
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async verifyOtp(otp: string) {
    await this.fillOtp(otp);
    await this.clickSubmit();
  }

  async getErrorMessage(): Promise<string | null> {
    await this.errorToast.waitFor({ state: 'visible' });
    return await this.errorToast.textContent();
  }
}
