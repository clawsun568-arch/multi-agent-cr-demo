/**
 * About Page + Contact Page E2E Tests
 *
 * About Page (/about):
 * - Hero banner with "About Us" title
 * - Philosophy section — cattery mission statement
 * - Breed cards — one per breed (British Shorthair, Ragdoll) with:
 *   - Photo, breed name, description, list of traits
 *
 * Contact Page (/contact):
 * - Hero banner with "Contact Us" title
 * - Contact card with email (mailto: link), phone (tel: link), WeChat, Instagram
 * - Social media icon links (Instagram, Facebook, Email)
 * - Contact note (preferred contact method text)
 *
 * Both pages fetch data from cat-data.json async, so beforeEach waits for
 * the hero banner title to confirm the page and data have loaded.
 *
 * Key selectors:
 * - a[href^="mailto:"] — selects links whose href starts with "mailto:"
 * - a[href^="tel:"]    — selects links whose href starts with "tel:"
 * - a[href*="instagram.com"] — selects links whose href contains "instagram.com"
 * - main [aria-label="..."] — scopes to the <main> element to avoid matching
 *   the same component in the footer (SocialIcons appears in both)
 */
import { test, expect } from '@playwright/test';
import { breedCount } from './helpers/test-data';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
    // Wait for data to load — hero banner renders from static JSX,
    // but breed data comes from async fetch
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
    await expect(breedCards).toHaveCount(breedCount);
  });

  test('breed cards have images', async ({ page }) => {
    // Wait for breed cards to appear first (async data)
    await expect(page.locator('.breed-card').first()).toBeVisible();
    const breedImages = page.locator('.breed-card-image img');
    await expect(breedImages.first()).toBeVisible();
  });

  test('breed cards show name and description', async ({ page }) => {
    const firstBreed = page.locator('.breed-card').first();
    await expect(firstBreed).toBeVisible();
    // Each breed card has an h3 (breed name) and p.breed-description
    await expect(firstBreed.locator('h3')).toBeVisible();
    await expect(firstBreed.locator('.breed-description')).toBeVisible();
  });

  test('breed cards show traits', async ({ page }) => {
    // Wait for breed cards to render
    await expect(page.locator('.breed-card').first()).toBeVisible();
    // Traits are rendered as <li> items inside a <ul class="breed-traits">
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
    // Email is rendered as <a href="mailto:email@example.com">
    // The ^= selector means "starts with"
    const emailLink = page.locator('.contact-details a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
  });

  test('shows phone contact with tel link', async ({ page }) => {
    // Phone is rendered as <a href="tel:+1234567890">
    const phoneLink = page.locator('.contact-details a[href^="tel:"]');
    await expect(phoneLink).toBeVisible();
  });

  test('shows WeChat contact info', async ({ page }) => {
    // WeChat is shown as plain text (not a link), so we just check for the label
    await expect(page.locator('text=WeChat')).toBeVisible();
  });

  test('shows Instagram contact with external link', async ({ page }) => {
    // Instagram link opens in a new tab (target="_blank")
    const instagramLink = page.locator('.contact-details a[href*="instagram.com"]');
    await expect(instagramLink).toBeVisible();
    await expect(instagramLink).toHaveAttribute('target', '_blank');
  });

  test('displays social icons on contact page', async ({ page }) => {
    // SocialIcons component appears twice on the page: once in the contact card
    // (large size) and once in the footer (small size). Both have the same
    // aria-label="Social media links". We scope to <main> to only match the
    // contact page's version, avoiding a "strict mode violation" (2 matches).
    const mainSocialIcons = page.locator('main [aria-label="Social media links"]');
    await expect(mainSocialIcons).toBeVisible();
  });

  test('displays contact note', async ({ page }) => {
    // The contact note explains preferred contact methods
    await expect(page.locator('.contact-note')).toBeVisible();
  });
});
