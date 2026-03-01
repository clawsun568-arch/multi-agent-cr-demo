/**
 * Navigation E2E Tests
 *
 * Tests the NavBar component which appears on every page. Verifies:
 * - All 6 navigation links are present and correctly labeled
 * - Clicking a link navigates to the right page (URL changes)
 * - The active page link is visually highlighted (aria-current="page")
 * - The logo always links back to the homepage
 * - Unknown URLs show the 404 page with a "Back to Home" link
 * - On mobile, the hamburger menu opens/closes and auto-closes after navigation
 *
 * IMPORTANT: These tests run in BOTH desktop and mobile viewports (defined in
 * playwright.config.ts). On mobile, nav links are hidden behind a hamburger
 * menu, so we use openMenuIfMobile() to handle both cases transparently.
 *
 * Key Playwright concepts used:
 * - page.goto(url)      — navigate the browser to a URL
 * - page.click(selector) — click an element matching the CSS/ARIA selector
 * - expect(page).toHaveURL(url) — assert the browser navigated to the right URL
 * - expect(locator).toHaveText(text) — assert an element contains specific text
 * - expect(locator).toHaveClass(regex) — assert an element has a CSS class
 */
import { test, expect, Page } from '@playwright/test';
import { nav, routes } from './helpers/selectors';

/**
 * Helper: Open the hamburger menu if we're on a mobile viewport.
 *
 * On desktop, the hamburger button is hidden via CSS (display: none),
 * so isVisible() returns false and we skip the click.
 * On mobile, we click the hamburger to reveal the nav links.
 *
 * The catch(() => false) handles the case where the hamburger doesn't
 * exist at all (e.g., if the page hasn't loaded yet).
 */
async function openMenuIfMobile(page: Page) {
  const hamburger = page.locator(nav.hamburgerOpen);
  if (await hamburger.isVisible({ timeout: 500 }).catch(() => false)) {
    await hamburger.click();
    // Wait for the menu to actually open (CSS class toggles)
    await expect(page.locator(nav.menu)).toHaveClass(/navbar-links--open/);
  }
}

test.describe('Navigation', () => {
  // Before each test, start from the homepage
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders all 6 navigation links', async ({ page }) => {
    await openMenuIfMobile(page);
    const links = page.locator(`${nav.main} a.navbar-link`);
    await expect(links).toHaveCount(6);
    await expect(links.nth(0)).toHaveText('Home');
    await expect(links.nth(1)).toHaveText('About');
    await expect(links.nth(2)).toHaveText('Our Cats');
    await expect(links.nth(3)).toHaveText('Kittens');
    await expect(links.nth(4)).toHaveText('Gallery');
    await expect(links.nth(5)).toHaveText('Contact');
  });

  test('highlights the active link for the current page', async ({ page }) => {
    // On homepage, "Home" should be the active link
    await openMenuIfMobile(page);
    const activeLink = page.locator(nav.activeLink);
    await expect(activeLink).toHaveText('Home');

    // Navigate to About — now "About" should be active
    await page.click('a.navbar-link:has-text("About")');
    await openMenuIfMobile(page);
    await expect(page.locator(nav.activeLink)).toHaveText('About');

    // Navigate to Gallery — now "Gallery" should be active
    await page.click('a.navbar-link:has-text("Gallery")');
    await openMenuIfMobile(page);
    await expect(page.locator(nav.activeLink)).toHaveText('Gallery');
  });

  test('logo navigates to home page', async ({ page }) => {
    // Start on the About page, then click the logo
    await page.goto(routes.about);
    await page.click(nav.logo);
    await expect(page).toHaveURL('/');
  });

  // Parameterized test: verify each nav link navigates to the correct URL.
  // The for-loop generates 6 separate test cases, one per route.
  const navRoutes = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Our Cats', path: '/our-cats' },
    { label: 'Kittens', path: '/kittens' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  for (const { label, path } of navRoutes) {
    test(`navigates to ${label} page`, async ({ page }) => {
      await openMenuIfMobile(page);
      await page.click(`a.navbar-link:has-text("${label}")`);
      await expect(page).toHaveURL(path);
    });
  }

  test('shows 404 page for unknown routes', async ({ page }) => {
    // Navigate directly to a URL that doesn't match any route
    await page.goto('/nonexistent-page');
    await expect(page.locator('h1')).toHaveText('Page Not Found');
    await expect(page.locator('a.back-button')).toBeVisible();
  });

  test('404 back button returns to home', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await page.click('a.back-button');
    await expect(page).toHaveURL('/');
  });
});

/**
 * Mobile-specific hamburger menu tests.
 *
 * test.use({ viewport: ... }) overrides the viewport for ALL tests in this
 * describe block, regardless of which Playwright project is running.
 * This ensures the hamburger button is visible (it's hidden on desktop via CSS).
 */
test.describe('Mobile hamburger menu', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('hamburger menu opens and closes', async ({ page }) => {
    await page.goto('/');

    // Menu should start closed (no --open modifier class)
    const menu = page.locator(nav.menu);
    await expect(menu).not.toHaveClass(/navbar-links--open/);

    // Click hamburger to open
    await page.click(nav.hamburgerOpen);
    await expect(menu).toHaveClass(/navbar-links--open/);

    // Click hamburger again to close (aria-label changes to "Close...")
    await page.click(nav.hamburgerClose);
    await expect(menu).not.toHaveClass(/navbar-links--open/);
  });

  test('menu closes after clicking a link', async ({ page }) => {
    await page.goto('/');
    await page.click(nav.hamburgerOpen);

    const menu = page.locator(nav.menu);
    await expect(menu).toHaveClass(/navbar-links--open/);

    // Clicking a nav link should close the menu AND navigate
    await page.click('a.navbar-link:has-text("About")');
    await expect(menu).not.toHaveClass(/navbar-links--open/);
    await expect(page).toHaveURL('/about');
  });
});
