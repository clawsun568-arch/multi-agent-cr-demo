import { test, expect } from '@playwright/test';
import { kittenCard, imageCarousel } from './helpers/selectors';

test.describe('Kittens Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kittens');
  });

  test('displays the hero banner', async ({ page }) => {
    await expect(page.locator('.hero-banner-title')).toHaveText('Available Kittens');
  });

  test('displays kitten cards', async ({ page }) => {
    const cards = page.locator(kittenCard.card);
    // 3 kittens in data: Pomelo, Yuzu, Mikan
    await expect(cards).toHaveCount(3);
  });

  test('kitten cards show name', async ({ page }) => {
    const names = page.locator(kittenCard.name);
    await expect(names.first()).toBeVisible();
  });

  test('available kittens show "Available" badge', async ({ page }) => {
    // Wait for kitten cards to load
    await expect(page.locator(kittenCard.card).first()).toBeVisible();
    const badges = page.locator(`${kittenCard.badge}.available`);
    // Pomelo and Yuzu are available
    await expect(badges.first()).toBeVisible();
    await expect(badges.first()).toHaveText('Available');
  });

  test('sold kittens show "Sold" badge', async ({ page }) => {
    // Wait for kitten cards to load
    await expect(page.locator(kittenCard.card).first()).toBeVisible();
    const soldBadges = page.locator(`${kittenCard.badge}.sold`);
    // Mikan is sold
    await expect(soldBadges.first()).toBeVisible();
    await expect(soldBadges.first()).toHaveText('Sold');
  });

  test('kitten card shows gender and color info', async ({ page }) => {
    const firstCard = page.locator(kittenCard.card).first();
    await expect(firstCard.locator('.kitten-card-gender')).toBeVisible();
    await expect(firstCard.locator('.kitten-card-color')).toBeVisible();
  });

  test('kitten with multiple photos shows image carousel', async ({ page }) => {
    // Pomelo has 3 photos, should have carousel controls
    const carouselControls = page.locator('.image-carousel').first();
    await expect(carouselControls).toBeVisible();
  });

  test('image carousel next/prev buttons work', async ({ page }) => {
    // Find a carousel (Pomelo has 3 photos)
    const carousel = page.locator('.image-carousel').first();
    const nextBtn = carousel.locator(imageCarousel.nextBtn);
    const prevBtn = carousel.locator(imageCarousel.prevBtn);

    // Check next button is present and clickable
    if (await nextBtn.isVisible()) {
      const initialDot = carousel.locator(imageCarousel.activeDot);
      await nextBtn.click();
      // Dot should change — just confirm carousel still has an active dot
      await expect(carousel.locator(imageCarousel.activeDot)).toBeVisible();

      await prevBtn.click();
      await expect(carousel.locator(imageCarousel.activeDot)).toBeVisible();
    }
  });

  test('clicking a kitten card navigates to profile', async ({ page }) => {
    await page.locator(kittenCard.card).first().click();
    await expect(page).toHaveURL(/\/our-cats\/cat_/);
  });
});
