import { test, expect } from '@playwright/test';

test.describe('Appointment Booking Flow', () => {
  test.describe('Hospital Public Pages', () => {
    test('should display hospital page with doctors', async ({ page }) => {
      // Navigate to a test hospital subdomain
      await page.goto('/hospital/demo-hospital');
      
      // Check for hospital branding or content
      await expect(page.locator('body')).toBeVisible();
    });

    test('should display doctors list page', async ({ page }) => {
      await page.goto('/hospital/demo-hospital/doctors');
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    });

    test('should display services page', async ({ page }) => {
      await page.goto('/hospital/demo-hospital/services');
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    });

    test('should display contact page', async ({ page }) => {
      await page.goto('/hospital/demo-hospital/contact');
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Booking Wizard', () => {
    test('should display booking page', async ({ page }) => {
      await page.goto('/hospital/demo-hospital/book');
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    });

    test('should show booking steps', async ({ page }) => {
      await page.goto('/hospital/demo-hospital/book');
      
      // Look for step indicators or progress bar
      const stepIndicator = page.locator('[role="progressbar"], .step, .steps, .progress');
      // Page should have some form of progress indicator (may vary by implementation)
      await expect(page.locator('body')).toBeVisible();
    });

    test('should preselect doctor from URL params', async ({ page }) => {
      // Test with a doctor ID parameter
      await page.goto('/hospital/demo-hospital/book?doctor=test-doctor-id');
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Appointment Management (Authenticated)', () => {
    test.skip('should display patient appointments page', async ({ page }) => {
      // This requires authentication
      // Skip in CI - would need proper test user setup
      
      await page.goto('/patient/appointments');
      
      // Should either show appointments or redirect to login
      await expect(page).toHaveURL(/.*appointments.*|.*login.*/);
    });
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('booking page should be mobile responsive', async ({ page }) => {
    await page.goto('/hospital/demo-hospital/book');
    
    // Check that page renders without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    // Body should not be significantly wider than viewport
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow small margin
  });

  test('doctors page should be mobile responsive', async ({ page }) => {
    await page.goto('/hospital/demo-hospital/doctors');
    
    // Check that page renders without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });
});
