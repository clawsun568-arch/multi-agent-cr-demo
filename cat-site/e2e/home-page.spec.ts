/**
 * Home Page E2E Tests
 *
 * Tests the homepage ("/") which has three main sections:
 * 1. HeroCarousel — full-width image slideshow with auto-advance
 * 2. IntroSection — cattery name, tagline, and intro text
 * 3. FeaturedCats — grid of up to 3 featured cat cards with "View All" link
 *
 * Key Playwright concepts used:
 * - toHaveAttribute('aria-selected', 'true') — checks ARIA state of carousel dots
 * - page.waitForTimeout(ms) — waits for a fixed time (used for auto-rotate test)
 * - locator.first() — selects the first element matching a selector
 * - expect(value).toBeGreaterThan(n) — plain Jest assertion (not auto-retrying)
 * - await expect(locator).toBeVisible() — auto-retrying Playwright assertion
 *
 * NOTE on auto-retry: Playwright's expect(locator).toBeVisible() retries until
 * the timeout (default 5s). But expect(await locator.count()).toBe(3) does NOT
 * retry — it evaluates count() once. That's why we use toBeVisible() first to
 * wait for data, then check count.
 */
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
      // Only one slide has the --active class at a time (CSS shows it via opacity:1)
      const activeSlide = page.locator(heroCarousel.activeSlide);
      await expect(activeSlide).toBeVisible();
    });

    test('next button advances to next slide', async ({ page }) => {
      // Dots use aria-selected to indicate which slide is current
      const dot1 = page.locator(heroCarousel.dot(1));
      const dot2 = page.locator(heroCarousel.dot(2));

      await expect(dot1).toHaveAttribute('aria-selected', 'true');
      await page.click(heroCarousel.nextBtn);
      await expect(dot2).toHaveAttribute('aria-selected', 'true');
    });

    test('previous button goes to previous slide', async ({ page }) => {
      // Go forward first, then back — verifies both directions work
      await page.click(heroCarousel.nextBtn);
      const dot2 = page.locator(heroCarousel.dot(2));
      await expect(dot2).toHaveAttribute('aria-selected', 'true');

      await page.click(heroCarousel.prevBtn);
      const dot1 = page.locator(heroCarousel.dot(1));
      await expect(dot1).toHaveAttribute('aria-selected', 'true');
    });

    test('dot indicators navigate to specific slides', async ({ page }) => {
      // Click dot 3 directly (should jump to slide 3 without going through 2)
      await page.click(heroCarousel.dot(3));
      await expect(page.locator(heroCarousel.dot(3))).toHaveAttribute('aria-selected', 'true');

      // Jump back to slide 1
      await page.click(heroCarousel.dot(1));
      await expect(page.locator(heroCarousel.dot(1))).toHaveAttribute('aria-selected', 'true');
    });

    test('renders dot indicators for all slides', async ({ page }) => {
      const dots = page.locator(`${heroCarousel.dots} [role="tab"]`);
      // cat-data.json has 3 hero images, so there should be 3 dots
      await expect(dots).toHaveCount(3);
    });

    test('auto-rotates slides', async ({ page }) => {
      // Verify we start on slide 1
      const dot1 = page.locator(heroCarousel.dot(1));
      await expect(dot1).toHaveAttribute('aria-selected', 'true');

      // The carousel auto-advances every 5 seconds. Use a longer assertion
      // timeout instead of a fixed sleep — more reliable in slow CI environments.
      const dot2 = page.locator(heroCarousel.dot(2));
      await expect(dot2).toHaveAttribute('aria-selected', 'true', { timeout: 7000 });
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
      // Wait for async data to load before counting
      await expect(cards.first()).toBeVisible();
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
      // FeaturedCats component caps at 3 cards max
      expect(count).toBeLessThanOrEqual(3);
    });

    test('cat card shows name and breed', async ({ page }) => {
      const firstCard = page.locator('.cat-card').first();
      await expect(firstCard.locator('.cat-name')).toBeVisible();
      await expect(firstCard.locator('.cat-breed')).toBeVisible();
    });

    test('clicking a cat card navigates to profile', async ({ page }) => {
      // Click the first cat card — should navigate to /our-cats/cat_XXX
      await page.locator('.cat-card').first().click();
      // Use regex because we don't know which cat will be first
      await expect(page).toHaveURL(/\/our-cats\/cat_/);
    });

    test('"View All Cats" link navigates to Our Cats', async ({ page }) => {
      await page.click('.view-all-link');
      await expect(page).toHaveURL('/our-cats');
    });
  });
});
