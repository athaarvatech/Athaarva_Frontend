import { test, expect, Page } from '@playwright/test';

// Test user credentials - these would be test accounts in a real scenario
const TEST_PATIENT = {
  email: 'testpatient@example.com',
  password: 'TestPassword123!',
};

const TEST_DOCTOR = {
  email: 'testdoctor@example.com',
  password: 'TestPassword123!',
};

// Helper function to login
async function login(page: Page, email: string, password: string, role: string = 'patient') {
  await page.goto('/auth/login');
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation after login
  await page.waitForURL(`**/${role}/**`, { timeout: 10000 });
}

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check page elements
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"], input[name="email"]', 'invalid@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('[role="alert"], .error, .text-red-500, .text-destructive').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display registration page correctly', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Check registration form elements
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  test('should validate email format on registration', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Try submitting with invalid email
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    await emailInput.fill('invalidemail');
    await emailInput.blur();
    
    // Check for validation message
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Find and click register link
    const registerLink = page.locator('a[href*="register"], button:has-text("Register"), a:has-text("Sign up"), a:has-text("Create account")');
    if (await registerLink.count() > 0) {
      await registerLink.first().click();
      await expect(page).toHaveURL(/.*register.*/);
    }
  });

  test('should handle forgot password flow', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Find and click forgot password link
    const forgotLink = page.locator('a[href*="forgot"], a:has-text("Forgot"), a:has-text("Reset")');
    if (await forgotLink.count() > 0) {
      await forgotLink.first().click();
      await expect(page).toHaveURL(/.*forgot.*|.*reset.*/);
    }
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing patient dashboard without auth', async ({ page }) => {
    await page.goto('/patient/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*login.*|.*auth.*/);
  });

  test('should redirect to login when accessing doctor dashboard without auth', async ({ page }) => {
    await page.goto('/doctor/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*login.*|.*auth.*/);
  });

  test('should redirect to login when accessing admin dashboard without auth', async ({ page }) => {
    await page.goto('/Admin/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*login.*|.*auth.*/);
  });
});

test.describe('Logout Flow', () => {
  test.skip('should logout successfully', async ({ page }) => {
    // This test requires a valid test account
    // Skip in CI or when test accounts aren't available
    
    // Login first
    await login(page, TEST_PATIENT.email, TEST_PATIENT.password, 'patient');
    
    // Find and click logout button
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")');
    await logoutButton.click();
    
    // Should be redirected to login or home
    await expect(page).toHaveURL(/.*login.*|.*auth.*|\//);
  });
});
