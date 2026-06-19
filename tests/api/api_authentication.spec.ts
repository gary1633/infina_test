import { test, expect } from '@playwright/test';

function generateRandomPhone(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `09${randomDigits}`;
}

const VALID_OTP = process.env.TEST_OTP || '000000';
const INVALID_OTP = process.env.INVALID_OTP || '111111';
const TEST_NAME = process.env.TEST_NAME || 'AutoTest';

async function registerTempUser(request: any): Promise<{ phone: string; name: string }> {
  const phone = generateRandomPhone();
  const name = `${TEST_NAME}Api`;

  const otpResponse = await request.post('/api/proxy/api/auth/otp/send', {
    data: { phone, flow: 'REGISTER' }
  });
  const { requestId } = await otpResponse.json();

  const registerResponse = await request.post('/api/proxy/api/auth/register', {
    headers: {
      'x-otp-phone': phone,
      'x-otp-code': VALID_OTP,
      'x-otp-id': requestId
    },
    data: { phone, name }
  });
  
  if (registerResponse.status() !== 200) {
    throw new Error(`Failed to register temp user. Status: ${registerResponse.status()}`);
  }

  return { phone, name };
}

test.describe('Auth API - Register & Login', () => {

  test.describe('Register API', () => {
    test('Happy Case: Should register a new user successfully with valid OTP', async ({ request }) => {
      const phone = generateRandomPhone();
      const name = `${TEST_NAME}Api`;

      const otpResponse = await request.post('/api/proxy/api/auth/otp/send', {
        data: {
          phone,
          flow: 'REGISTER'
        }
      });
      expect(otpResponse.ok()).toBeTruthy();
      
      const otpData = await otpResponse.json();
      expect(otpData).toHaveProperty('requestId');
      expect(otpData).toHaveProperty('expiresIn');
      const requestId = otpData.requestId;

      const registerResponse = await request.post('/api/proxy/api/auth/register', {
        headers: {
          'x-otp-phone': phone,
          'x-otp-code': VALID_OTP,
          'x-otp-id': requestId
        },
        data: {
          phone,
          name
        }
      });
      
      expect(registerResponse.status()).toBe(200);
      const registerData = await registerResponse.json();
    
      expect(registerData).toHaveProperty('user');
      const user = registerData.user;
      expect(user.phone).toBe(phone);
      expect(user.name).toBe(name);
      expect(user).toHaveProperty('pid');
      expect(user).toHaveProperty('uid');

      const cookies = registerResponse.headers()['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies).toContain('aaa_at');
      expect(cookies).toContain('aaa_rt');
    });

    test('Negative Case: Should fail registration with incorrect OTP code', async ({ request }) => {
      const tempPhone = generateRandomPhone();
      
      const otpResponse = await request.post('/api/proxy/api/auth/otp/send', {
        data: {
          phone: tempPhone,
          flow: 'REGISTER'
        }
      });
      expect(otpResponse.ok()).toBeTruthy();
      const { requestId } = await otpResponse.json();

      const registerResponse = await request.post('/api/proxy/api/auth/register', {
        headers: {
          'x-otp-phone': tempPhone,
          'x-otp-code': INVALID_OTP,
          'x-otp-id': requestId
        },
        data: {
          phone: tempPhone,
          name: 'InvalidOtpUser'
        }
      });

      expect(registerResponse.status()).toBeGreaterThanOrEqual(400);
      const responseBody = await registerResponse.json();
      
      const errorMessage = responseBody.message || (responseBody.error && responseBody.error.message);
      expect(errorMessage).toBeDefined();
      expect(errorMessage).toMatch(/Mã xác thực không hợp lệ/i);
    });
  });

  test.describe('Login API', () => {
    test('Happy Case: Should login successfully with registered phone number', async ({ request }) => {
      const { phone, name } = await registerTempUser(request);

      const otpResponse = await request.post('/api/proxy/api/auth/otp/send', {
        data: {
          phone,
          flow: 'LOGIN'
        }
      });
      expect(otpResponse.ok()).toBeTruthy();
      
      const { requestId } = await otpResponse.json();

      const loginResponse = await request.post('/api/proxy/api/auth/login', {
        headers: {
          'x-otp-phone': phone,
          'x-otp-code': VALID_OTP,
          'x-otp-id': requestId
        },
        data: {
          phone
        }
      });

      expect(loginResponse.status()).toBe(200);
      const loginData = await loginResponse.json();
      console.log('LOGIN RESPONSE BODY:', JSON.stringify(loginData));

      expect(loginData).toHaveProperty('user');
      const user = loginData.user;
      expect(user.phone).toBe(phone);
      expect(user.name).toBe(name);
      expect(user).toHaveProperty('pid');
      expect(user).toHaveProperty('uid');

      const cookies = loginResponse.headers()['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies).toContain('aaa_at');
      expect(cookies).toContain('aaa_rt');
    });

    test('Negative Case: Should fail login with incorrect OTP code', async ({ request }) => {
      const { phone } = await registerTempUser(request);

      const otpResponse = await request.post('/api/proxy/api/auth/otp/send', {
        data: {
          phone,
          flow: 'LOGIN'
        }
      });
      expect(otpResponse.ok()).toBeTruthy();
      
      const { requestId } = await otpResponse.json();

      const loginResponse = await request.post('/api/proxy/api/auth/login', {
        headers: {
          'x-otp-phone': phone,
          'x-otp-code': INVALID_OTP,
          'x-otp-id': requestId
        },
        data: {
          phone
        }
      });

      expect(loginResponse.status()).toBeGreaterThanOrEqual(400);
      const responseBody = await loginResponse.json();
      
      const errorMessage = responseBody.message || (responseBody.error && responseBody.error.message);
      expect(errorMessage).toBeDefined();
      expect(errorMessage).toMatch(/Mã xác thực không hợp lệ/i);
    });

  });
});
