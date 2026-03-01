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
    // 12 gallery images in data
    await expect(items).toHaveCount(12);
  });

  test('photo grid items have images', async ({ page }) => {
    const firstItem = page.locator(photoGrid.item).first();
    await expect(firstItem.locator('img')).toBeVisible();
  });

  test.describe('Lightbox', () => {
    test('opens lightbox when clicking a photo', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.dialog)).toBeVisible();
      await expect(page.locator(lightbox.image)).toBeVisible();
    });

    test('lightbox shows counter', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      const counter = page.locator(lightbox.counter);
      await expect(counter).toHaveText('1 / 12');
    });

    test('close button closes lightbox', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.dialog)).toBeVisible();

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
      await page.click(lightbox.nextBtn);
      await expect(page.locator(lightbox.counter)).toHaveText('2 / 12');

      await page.click(lightbox.prevBtn);
      await expect(page.locator(lightbox.counter)).toHaveText('1 / 12');
    });

    test('wraps from first to last image using prev button', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.counter)).toHaveText('1 / 12');

      await page.click(lightbox.prevBtn);
      await expect(page.locator(lightbox.counter)).toHaveText('12 / 12');
    });

    test('Escape key closes lightbox', async ({ page }) => {
      await page.locator(photoGrid.item).first().click();
      await expect(page.locator(lightbox.dialog)).toBeVisible();

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

      // Click the overlay (outside the content area)
      await page.locator('.lightbox-overlay').click({ position: { x: 10, y: 10 } });
      await expect(page.locator(lightbox.dialog)).not.toBeVisible();
    });
  });
});
