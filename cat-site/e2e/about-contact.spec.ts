import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
    // Wait for data to load
    await expect(page.locator('.hero-banner-title')).toHaveText('About Us');
  });

  test('displays the hero banner', async ({ page }) => {
    await expect(page.locator('[role="banner"]')).toBeVisible();
  });

  test('displays philosophy section', async ({ page }) => {
    await expect(page.locator('.about-philosophy h2')).toHaveText('Our Philosophy');
    await expect(page.locator('.about-philosophy p')).toBeVisible();
  });

  test('displays breed cards', async ({ page }) => {
    await expect(page.locator('.about-breeds h2')).toHaveText('Our Breeds');
    const breedCards = page.locator('.breed-card');
    await expect(breedCards).toHaveCount(2);
  });

  test('breed cards have images', async ({ page }) => {
    // Wait for breed cards to appear first
    await expect(page.locator('.breed-card').first()).toBeVisible();
    const breedImages = page.locator('.breed-card-image img');
    await expect(breedImages.first()).toBeVisible();
  });

  test('breed cards show name and description', async ({ page }) => {
    const firstBreed = page.locator('.breed-card').first();
    await expect(firstBreed).toBeVisible();
    await expect(firstBreed.locator('h3')).toBeVisible();
    await expect(firstBreed.locator('.breed-description')).toBeVisible();
  });

  test('breed cards show traits', async ({ page }) => {
    // Wait for breed cards to render
    await expect(page.locator('.breed-card').first()).toBeVisible();
    const traits = page.locator('.breed-traits li');
    await expect(traits.first()).toBeVisible();
  });
});

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    // Wait for data to load
    await expect(page.locator('.hero-banner-title')).toHaveText('Contact Us');
  });

  test('displays the hero banner', async ({ page }) => {
    await expect(page.locator('[role="banner"]')).toBeVisible();
  });

  test('displays "Get in Touch" heading', async ({ page }) => {
    await expect(page.locator('.contact-card h2')).toHaveText('Get in Touch');
  });

  test('shows email contact with mailto link', async ({ page }) => {
    const emailLink = page.locator('.contact-details a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
  });

  test('shows phone contact with tel link', async ({ page }) => {
    const phoneLink = page.locator('.contact-details a[href^="tel:"]');
    await expect(phoneLink).toBeVisible();
  });

  test('shows WeChat contact info', async ({ page }) => {
    await expect(page.locator('text=WeChat')).toBeVisible();
  });

  test('shows Instagram contact with external link', async ({ page }) => {
    const instagramLink = page.locator('.contact-details a[href*="instagram.com"]');
    await expect(instagramLink).toBeVisible();
    await expect(instagramLink).toHaveAttribute('target', '_blank');
  });

  test('displays social icons on contact page', async ({ page }) => {
    // Scope to the main content area to avoid matching footer social icons
    const mainSocialIcons = page.locator('main [aria-label="Social media links"]');
    await expect(mainSocialIcons).toBeVisible();
  });

  test('displays contact note', async ({ page }) => {
    await expect(page.locator('.contact-note')).toBeVisible();
  });
});
