/**
 * Gallery Page E2E Tests
 *
 * Tests the /gallery page which shows a masonry-style photo grid and a
 * full-screen lightbox modal for viewing photos.
 *
 * Photo Grid:
 * - Displays all 12 gallery images from siteConfig.galleryImages
 * - Each item is a clickable button containing an <img>
 * - CSS columns create the masonry layout
 *
 * Lightbox Modal:
 * - Opens when clicking any photo in the grid
 * - Shows the photo full-screen with a dark overlay
 * - Navigation: prev/next buttons, arrow keys, dot clicking
 * - Closing: X button, Escape key, clicking the overlay background
 * - Counter shows position like "3 / 12"
 * - Wraps around (going prev from photo 1 → photo 12)
 *
 * Key Playwright concepts:
 * - page.keyboard.press('Escape') — simulates a keyboard key press
 * - .click({ position: { x, y } }) — clicks at specific coordinates within
 *   an element (used to click the overlay background, not the content)
 * - not.toBeVisible() — asserts an element is hidden/removed
 */
import { test, expect } from '@playwright/test';
import { lightbox, photoGrid } from './helpers/selectors';

test.describe('Gallery Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gallery');
  });

  test('displays the hero banner', async ({ page }) => {
    await expect(page.locator('.hero-banner-title')).toHaveText('Gallery');
  });

  test('displays photo grid with images', async ({ page }) => {
    await expect(page.locator(photoGrid.grid)).toBeVisible();
    const items = page.locator(photoGrid.item);
    // cat-data.json has 12 gallery images
    await expect(items).toHaveCount(12);
  });

  test('photo grid items have images', async ({ page }) => {
    const firstItem = page.locator(photoGrid.item).first();
    await expect(firstItem.locator('img')).toBeVisible();
  });

  test.describe('Lightbox', () => {
    test('opens lightbox when clicking a photo', async ({ page }) => {
      // Click the first photo in the grid
      await page.locator(photoGrid.item).first().click();
      // Lightbox should appear as a dialog (role="dialog", aria-modal="true")
      await expect(page.locator(lightbox.dialog)).toBeVisible();
      await expect(page.locator(lightbox.image)).toBeVisible();
    });

    test('lightbox shows counter', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      // Counter format is "currentIndex / totalCount"
      const counter = page.locator(lightbox.counter);
      await expect(counter).toHaveText('1 / 12');
    });

    test('close button closes lightbox', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.dialog)).toBeVisible();

      // Click the X button in the top-right corner
      await page.click(lightbox.closeBtn);
      await expect(page.locator(lightbox.dialog)).not.toBeVisible();
    });

    test('next button advances to next image', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.counter)).toHaveText('1 / 12');

      await page.click(lightbox.nextBtn);
      await expect(page.locator(lightbox.counter)).toHaveText('2 / 12');
    });

    test('previous button goes to previous image', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      // Go forward first, then back
      await page.click(lightbox.nextBtn);
      await expect(page.locator(lightbox.counter)).toHaveText('2 / 12');

      await page.click(lightbox.prevBtn);
      await expect(page.locator(lightbox.counter)).toHaveText('1 / 12');
    });

    test('wraps from first to last image using prev button', async ({ page }) => {
      // When on photo 1 and clicking prev, it should wrap to photo 12
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.counter)).toHaveText('1 / 12');

      await page.click(lightbox.prevBtn);
      await expect(page.locator(lightbox.counter)).toHaveText('12 / 12');
    });

    test('Escape key closes lightbox', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.dialog)).toBeVisible();

      // The LightboxModal component listens for keydown events
      await page.keyboard.press('Escape');
      await expect(page.locator(lightbox.dialog)).not.toBeVisible();
    });

    test('ArrowRight key advances to next image', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.counter)).toHaveText('1 / 12');

      await page.keyboard.press('ArrowRight');
      await expect(page.locator(lightbox.counter)).toHaveText('2 / 12');
    });

    test('ArrowLeft key goes to previous image', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator(lightbox.counter)).toHaveText('2 / 12');

      await page.keyboard.press('ArrowLeft');
      await expect(page.locator(lightbox.counter)).toHaveText('1 / 12');
    });

    test('clicking overlay closes lightbox', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.dialog)).toBeVisible();

      // Click the semi-transparent overlay at coordinates near the edge,
      // which is outside the lightbox content area. This triggers the
      // overlay's onClick handler to close the lightbox.
      await page.locator('.lightbox-overlay').click({ position: { x: 10, y: 10 } });
      await expect(page.locator(lightbox.dialog)).not.toBeVisible();
    });
  });
});
