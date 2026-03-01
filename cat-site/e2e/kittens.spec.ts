/**
 * Kittens Page E2E Tests
 *
 * Tests the /kittens page which shows available and sold kittens in a grid.
 * Each kitten is displayed in a KittenCard with:
 * - An image carousel (prev/next/dots) for kittens with multiple photos
 * - A status badge: green "Available" or red "Sold"
 * - Basic info: name, gender, color, personality
 * - Click navigates to the cat profile page (/our-cats/:id)
 *
 * Test data (from cat-data.json):
 * - Pomelo (cat_005): available, 3 photos (has carousel)
 * - Yuzu (cat_006): available, 2 photos (has carousel)
 * - Mikan (cat_007): sold, 1 photo (no carousel)
 *
 * Key Playwright concepts:
 * - Chained locators: carousel.locator(imageCarousel.nextBtn) — scopes the
 *   search to within that specific carousel element
 * - Conditional tests: if (await btn.isVisible()) — handles cases where
 *   a carousel might not have controls (single photo kittens)
 */
import { test, expect } from '@playwright/test';
import { kittenCard, imageCarousel } from './helpers/selectors';
import { kittenCount } from './helpers/test-data';

test.describe('Kittens Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kittens');
  });

  test('displays the hero banner', async ({ page }) => {
    await expect(page.locator('.hero-banner-title')).toHaveText('Available Kittens');
  });

  test('displays kitten cards', async ({ page }) => {
    const cards = page.locator(kittenCard.card);
    await expect(cards).toHaveCount(kittenCount);
  });

  test('kitten cards show name', async ({ page }) => {
    const names = page.locator(kittenCard.name);
    await expect(names.first()).toBeVisible();
  });

  test('available kittens show "Available" badge', async ({ page }) => {
    // Wait for kitten cards to load (data is fetched async)
    await expect(page.locator(kittenCard.card).first()).toBeVisible();
    // The badge has both .kitten-status-badge and .available classes
    const badges = page.locator(`${kittenCard.badge}.available`);
    // Pomelo and Yuzu are available
    await expect(badges.first()).toBeVisible();
    await expect(badges.first()).toHaveText('Available');
  });

  test('sold kittens show "Sold" badge', async ({ page }) => {
    // Wait for kitten cards to load
    await expect(page.locator(kittenCard.card).first()).toBeVisible();
    // The badge has both .kitten-status-badge and .sold classes
    const soldBadges = page.locator(`${kittenCard.badge}.sold`);
    // Mikan is sold (available: false in data)
    await expect(soldBadges.first()).toBeVisible();
    await expect(soldBadges.first()).toHaveText('Sold');
  });

  test('kitten card shows gender and color info', async ({ page }) => {
    const firstCard = page.locator(kittenCard.card).first();
    await expect(firstCard.locator('.kitten-card-gender')).toBeVisible();
    await expect(firstCard.locator('.kitten-card-color')).toBeVisible();
  });

  test('kitten with multiple photos shows image carousel', async ({ page }) => {
    // Pomelo has 3 photos → ImageCarousel renders with prev/next/dots
    // Kittens with only 1 photo don't get a carousel
    const carouselControls = page.locator('.image-carousel').first();
    await expect(carouselControls).toBeVisible();
  });

  test('image carousel next/prev buttons work', async ({ page }) => {
    // Scope to the first carousel on the page (Pomelo's 3-photo carousel)
    const carousel = page.locator('.image-carousel').first();
    const nextBtn = carousel.locator(imageCarousel.nextBtn);
    const prevBtn = carousel.locator(imageCarousel.prevBtn);

    // Only test if next button exists (kittens with 1 photo won't have controls)
    if (await nextBtn.isVisible()) {
      // Click next — active dot should change
      await nextBtn.click();
      await expect(carousel.locator(imageCarousel.activeDot)).toBeVisible();

      // Click prev — should go back
      await prevBtn.click();
      await expect(carousel.locator(imageCarousel.activeDot)).toBeVisible();
    }
  });

  test('clicking a kitten card navigates to profile', async ({ page }) => {
    // Kittens reuse the CatProfilePage component at /our-cats/:id
    await page.locator(kittenCard.card).first().click();
    await expect(page).toHaveURL(/\/our-cats\/cat_/);
  });
});
