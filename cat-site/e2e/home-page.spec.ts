import { test, expect } from '@playwright/test';
import { heroCarousel } from './helpers/selectors';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Hero Carousel', () => {
    test('renders the hero carousel', async ({ page }) => {
      await expect(page.locator(heroCarousel.region)).toBeVisible();
    });

    test('displays the first slide as active', async ({ page }) => {
      const activeSlide = page.locator(heroCarousel.activeSlide);
      await expect(activeSlide).toBeVisible();
    });

    test('next button advances to next slide', async ({ page }) => {
      const dot1 = page.locator(heroCarousel.dot(1));
      const dot2 = page.locator(heroCarousel.dot(2));

      await expect(dot1).toHaveAttribute('aria-selected', 'true');
      await page.click(heroCarousel.nextBtn);
      await expect(dot2).toHaveAttribute('aria-selected', 'true');
    });

    test('previous button goes to previous slide', async ({ page }) => {
      // Go to slide 2 first, then back
      await page.click(heroCarousel.nextBtn);
      const dot2 = page.locator(heroCarousel.dot(2));
      await expect(dot2).toHaveAttribute('aria-selected', 'true');

      await page.click(heroCarousel.prevBtn);
      const dot1 = page.locator(heroCarousel.dot(1));
      await expect(dot1).toHaveAttribute('aria-selected', 'true');
    });

    test('dot indicators navigate to specific slides', async ({ page }) => {
      await page.click(heroCarousel.dot(3));
      await expect(page.locator(heroCarousel.dot(3))).toHaveAttribute('aria-selected', 'true');

      await page.click(heroCarousel.dot(1));
      await expect(page.locator(heroCarousel.dot(1))).toHaveAttribute('aria-selected', 'true');
    });

    test('renders dot indicators for all slides', async ({ page }) => {
      const dots = page.locator(`${heroCarousel.dots} [role="tab"]`);
      // Data has 3 hero images
      await expect(dots).toHaveCount(3);
    });

    test('auto-rotates slides', async ({ page }) => {
      const dot1 = page.locator(heroCarousel.dot(1));
      await expect(dot1).toHaveAttribute('aria-selected', 'true');

      // Wait for auto-advance (5 second interval + buffer)
      await page.waitForTimeout(5500);
      const dot2 = page.locator(heroCarousel.dot(2));
      await expect(dot2).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('Intro Section', () => {
    test('displays cattery name', async ({ page }) => {
      await expect(page.locator('.intro-name')).toHaveText('My Cattery');
    });

    test('displays tagline', async ({ page }) => {
      await expect(page.locator('.intro-tagline')).toBeVisible();
    });

    test('displays intro text', async ({ page }) => {
      await expect(page.locator('.intro-text')).toBeVisible();
    });
  });

  test.describe('Featured Cats', () => {
    test('displays "Meet Our Cats" heading', async ({ page }) => {
      await expect(page.locator('.featured-cats-title')).toHaveText('Meet Our Cats');
    });

    test('shows up to 3 featured cat cards', async ({ page }) => {
      const cards = page.locator('.cat-card');
      await expect(cards.first()).toBeVisible();
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(3);
    });

    test('cat card shows name and breed', async ({ page }) => {
      const firstCard = page.locator('.cat-card').first();
      await expect(firstCard.locator('.cat-name')).toBeVisible();
      await expect(firstCard.locator('.cat-breed')).toBeVisible();
    });

    test('clicking a cat card navigates to profile', async ({ page }) => {
      await page.locator('.cat-card').first().click();
      await expect(page).toHaveURL(/\/our-cats\/cat_/);
    });

    test('"View All Cats" link navigates to Our Cats', async ({ page }) => {
      await page.click('.view-all-link');
      await expect(page).toHaveURL('/our-cats');
    });
  });
});
