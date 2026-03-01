/**
 * Our Cats Page + Cat Profile Page E2E Tests
 *
 * Tests two related pages:
 *
 * 1. /our-cats — Lists all breeding cats split into "Kings" (males) and
 *    "Queens" (females). Each cat is shown as a clickable CatCard.
 *
 * 2. /our-cats/:id — Individual cat profile page (e.g., /our-cats/cat_001).
 *    Shows detailed info: hero photo, breed, age, personality, gallery, parents.
 *
 * Data comes from cat-data.json (fetched async), so we wait for elements
 * to appear before asserting on counts or content.
 *
 * Key test patterns:
 * - beforeEach waits for the hero banner title to confirm data has loaded
 * - expect(cards.first()).toBeVisible() — auto-retrying wait for data
 * - page.goto('/our-cats/cat_001') — direct deep-link navigation
 * - Conditional checks (gallery, parents) using if(isVisible) for optional sections
 */
import { test, expect } from '@playwright/test';
import { catCard } from './helpers/selectors';

test.describe('Our Cats Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/our-cats');
    // Wait for data to load — the hero banner renders immediately from static props,
    // but cat cards require async data from cat-data.json
    await expect(page.locator('.hero-banner-title')).toHaveText('Our Cats');
  });

  test('displays the hero banner', async ({ page }) => {
    await expect(page.locator('[role="banner"]')).toBeVisible();
  });

  test('displays Kings section', async ({ page }) => {
    // CatSection generates heading IDs from the title: "Kings" → "kings-heading"
    await expect(page.locator('#kings-heading')).toBeVisible();
  });

  test('displays Queens section', async ({ page }) => {
    await expect(page.locator('#queens-heading')).toBeVisible();
  });

  test('Kings section has cat cards', async ({ page }) => {
    // aria-labelledby links the section to its heading for accessibility
    const kingsSection = page.locator('section[aria-labelledby="kings-heading"]');
    const cards = kingsSection.locator(catCard.card);
    // Wait for async data to load before counting
    await expect(cards.first()).toBeVisible();
    // Taro (cat_003) and Kenzo (cat_004) are kings in the test data
    expect(await cards.count()).toBeGreaterThanOrEqual(2);
  });

  test('Queens section has cat cards', async ({ page }) => {
    const queensSection = page.locator('section[aria-labelledby="queens-heading"]');
    const cards = queensSection.locator(catCard.card);
    await expect(cards.first()).toBeVisible();
    // Mochi (cat_001) is a queen; Sakura (cat_002) is a planned queen
    expect(await cards.count()).toBeGreaterThanOrEqual(1);
  });

  test('cat cards display name and breed', async ({ page }) => {
    const firstCard = page.locator(catCard.card).first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator(catCard.name)).toBeVisible();
    await expect(firstCard.locator('.cat-breed')).toBeVisible();
  });

  test('cat cards have status badges', async ({ page }) => {
    // Each card shows "Owned" or "Coming Soon" badge
    const firstCard = page.locator(catCard.card).first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator(catCard.badge)).toBeVisible();
  });

  test('clicking a cat card navigates to profile', async ({ page }) => {
    const firstCard = page.locator(catCard.card).first();
    await expect(firstCard).toBeVisible();
    // Remember the cat's name so we can verify it on the profile page
    const catName = await firstCard.locator(catCard.name).textContent();
    await firstCard.click();
    // URL should be /our-cats/cat_XXX
    await expect(page).toHaveURL(/\/our-cats\/cat_/);
    // Profile page h1 should show the same cat name
    await expect(page.locator('h1.cat-name')).toHaveText(catName!);
  });
});

test.describe('Cat Profile Page', () => {
  test('displays cat profile details', async ({ page }) => {
    // Navigate directly to Mochi's profile (cat_001)
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toHaveText('Mochi');
    await expect(page.locator('.cat-breed')).toHaveText('Ragdoll');
    await expect(page.locator('text=Gender:')).toBeVisible();
    await expect(page.locator('text=Female')).toBeVisible();
  });

  test('displays personality section', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    // Wait for profile to load before checking personality
    await expect(page.locator('h1.cat-name')).toBeVisible();
    await expect(page.locator('.personality-text')).toBeVisible();
  });

  test('displays photo gallery when available', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toBeVisible();
    // Gallery is optional — only some cats have additional photos
    const gallery = page.locator('.photo-gallery');
    if (await gallery.isVisible()) {
      const images = gallery.locator('img');
      expect(await images.count()).toBeGreaterThan(0);
    }
  });

  test('displays parent information when available', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toBeVisible();
    // Parents section is optional — only shown if father/mother data exists
    const parentsSection = page.locator('text=Parents');
    if (await parentsSection.isVisible()) {
      await expect(page.locator('.parents-info')).toBeVisible();
    }
  });

  test('back button returns to Our Cats page', async ({ page }) => {
    await page.goto('/our-cats/cat_001');
    await expect(page.locator('h1.cat-name')).toBeVisible();
    // The back button is a <Link to="/our-cats"> with aria-label
    await page.click('[aria-label="Go back to cat list"]');
    await expect(page).toHaveURL('/our-cats');
  });

  test('shows "Cat Not Found" for invalid ID', async ({ page }) => {
    // Navigate to a cat ID that doesn't exist in the data
    await page.goto('/our-cats/invalid_id');
    await expect(page.locator('h1')).toHaveText('Cat Not Found');
  });

  test('planned cat shows "Coming Soon" badge and CTA', async ({ page }) => {
    // Sakura (cat_002) is a planned cat — not yet owned
    await page.goto('/our-cats/cat_002');
    await expect(page.locator('.status-badge')).toHaveText('Coming Soon');
    // Planned cats show a "Contact Us for Updates" button
    await expect(page.locator('.contact-button')).toBeVisible();
  });
});
