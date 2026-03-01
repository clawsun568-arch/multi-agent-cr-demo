import { test, expect } from '@playwright/test';
import { catCard } from './helpers/selectors';

test.describe('Our Cats Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/our-cats');
    // Wait for data to load
    await expect(page.locator('.hero-banner-title')).toHaveText('Our Cats');
  });

  test('displays the hero banner', async ({ page }) => {
    await expect(page.locator('[role="banner"]')).toBeVisible();
  });

  test('displays Kings section', async ({ page }) => {
    await expect(page.locator('#kings-heading')).toBeVisible();
  });

  test('displays Queens section', async ({ page }) => {
    await expect(page.locator('#queens-heading')).toBeVisible();
  });

  test('Kings section has cat cards', async ({ page }) => {
    const kingsSection = page.locator('section[aria-labelledby="kings-heading"]');
    const cards = kingsSection.locator(catCard.card);
    // Wait for first card to appear (data loads async)
    await expect(cards.first()).toBeVisible();
    // Taro and Kenzo are kings
    expect(await cards.count()).toBeGreaterThanOrEqual(2);
  });

  test('Queens section has cat cards', async ({ page }) => {
    const queensSection = page.locator('section[aria-labelledby="queens-heading"]');
    const cards = queensSection.locator(catCard.card);
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test('cat cards display name and breed', async ({ page }) => {
    const firstCard = page.locator(catCard.card).first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator(catCard.name)).toBeVisible();
    await expect(firstCard.locator('.cat-breed')).toBeVisible();
  });

  test('cat cards have status badges', async ({ page }) => {
    const firstCard = page.locator(catCard.card).first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator(catCard.badge)).toBeVisible();
  });

  test('clicking a cat card navigates to profile', async ({ page }) => {
    const firstCard = page.locator(catCard.card).first();
    await expect(firstCard).toBeVisible();
    const catName = await firstCard.locator(catCard.name).textContent();
    await firstCard.click();
    await expect(page).toHaveURL(/\/our-cats\/cat_/);
    await expect(page.locator('h1.cat-name')).toHaveText(catName!);
  });
});

test.describe('Cat Profile Page', () => {
  test('displays cat profile details', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toHaveText('Mochi');
    await expect(page.locator('.cat-breed')).toHaveText('Ragdoll');
    await expect(page.locator('text=Gender:')).toBeVisible();
    await expect(page.locator('text=Female')).toBeVisible();
  });

  test('displays personality section', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toBeVisible();
    await expect(page.locator('.personality-text')).toBeVisible();
  });

  test('displays photo gallery when available', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toBeVisible();
    const gallery = page.locator('.photo-gallery');
    if (await gallery.isVisible()) {
      const images = gallery.locator('img');
      expect(await images.count()).toBeGreaterThan(0);
    }
  });

  test('displays parent information when available', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toBeVisible();
    const parentsSection = page.locator('text=Parents');
    if (await parentsSection.isVisible()) {
      await expect(page.locator('.parents-info')).toBeVisible();
    }
  });

  test('back button returns to Our Cats page', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toBeVisible();
    await page.click('[aria-label="Go back to cat list"]');
    await expect(page).toHaveURL('/our-cats');
  });

  test('shows "Cat Not Found" for invalid ID', async ({ page }) => {
    await page.goto('/our-cats/invalid_id');
    await expect(page.locator('h1')).toHaveText('Cat Not Found');
  });

  test('planned cat shows "Coming Soon" badge and CTA', async ({ page }) => {
    await page.goto('/our-cats/cat_002');
    await expect(page.locator('.status-badge')).toHaveText('Coming Soon');
    await expect(page.locator('.contact-button')).toBeVisible();
  });
});
