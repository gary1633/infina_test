import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { RegisterPage } from '../../pages/register.page';
import { LoginPage } from '../../pages/login.page';
import { OtpPage } from '../../pages/otp.page';

const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
const testPhone = `09${randomSuffix}`;
const testName = process.env.TEST_NAME || 'AutoTest';
const validOtp = process.env.TEST_OTP || '000000';
const invalidOtp = process.env.INVALID_OTP || '111111';

test.describe.configure({ mode: 'serial' });

test.describe('Infina Test', () => {
  test('Successful registration with valid OTP', async ({ page }) => {
    const homePage = new HomePage(page);
    const registerPage = new RegisterPage(page);
    const otpPage = new OtpPage(page);

    await homePage.goto();
    await homePage.clickRegister();

    await registerPage.register(testPhone, testName);

    await expect(page).toHaveURL(/.*\/otp/);

    await otpPage.verifyOtp(validOtp);

    await expect(page).not.toHaveURL(/.*\/otp/);
    await expect(page).not.toHaveURL(/.*\/signup/);
  });

  test('Successful login with registered credentials', async ({ page }) => {
    await page.context().clearCookies();
    
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const otpPage = new OtpPage(page);

    await homePage.goto();
    await homePage.clickLogin();

    await loginPage.login(testPhone);

    await expect(page).toHaveURL(/.*\/otp/);

    await otpPage.verifyOtp(validOtp);

    await expect(page).not.toHaveURL(/.*\/otp/);
    await expect(page).not.toHaveURL(/.*\/login/);
  });

  test('Login with incorrect credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const otpPage = new OtpPage(page);

    await loginPage.goto();

    await loginPage.login(testPhone);

    await expect(page).toHaveURL(/.*\/otp/);

    await otpPage.verifyOtp(invalidOtp);

    const errorMsg = await otpPage.getErrorMessage();
    expect(errorMsg).not.toBeNull();
    expect(errorMsg).toContain('Mã xác thực không hợp lệ');
  });
});
