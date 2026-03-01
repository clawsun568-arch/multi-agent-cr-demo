import { test, expect, Page } from '@playwright/test';
import { nav, routes } from './helpers/selectors';

/** Open hamburger menu if we're on a narrow viewport where it's visible */
async function openMenuIfMobile(page: Page) {
  const hamburger = page.locator(nav.hamburgerOpen);
  if (await hamburger.isVisible({ timeout: 500 }).catch(() => false)) {
    await hamburger.click();
    await expect(page.locator(nav.menu)).toHaveClass(/navbar-links--open/);
  }
}

test.describe('Navigation', () => {
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
    await openMenuIfMobile(page);
    const activeLink = page.locator(nav.activeLink);
    await expect(activeLink).toHaveText('Home');

    await page.click('a.navbar-link:has-text("About")');
    await openMenuIfMobile(page);
    await expect(page.locator(nav.activeLink)).toHaveText('About');

    await page.click('a.navbar-link:has-text("Gallery")');
    await openMenuIfMobile(page);
    await expect(page.locator(nav.activeLink)).toHaveText('Gallery');
  });

  test('logo navigates to home page', async ({ page }) => {
    await page.goto(routes.about);
    await page.click(nav.logo);
    await expect(page).toHaveURL('/');
  });

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

test.describe('Mobile hamburger menu', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('hamburger menu opens and closes', async ({ page }) => {
    await page.goto('/');

    const menu = page.locator(nav.menu);
    await expect(menu).not.toHaveClass(/navbar-links--open/);

    await page.click(nav.hamburgerOpen);
    await expect(menu).toHaveClass(/navbar-links--open/);

    await page.click(nav.hamburgerClose);
    await expect(menu).not.toHaveClass(/navbar-links--open/);
  });

  test('menu closes after clicking a link', async ({ page }) => {
    await page.goto('/');
    await page.click(nav.hamburgerOpen);

    const menu = page.locator(nav.menu);
    await expect(menu).toHaveClass(/navbar-links--open/);

    await page.click('a.navbar-link:has-text("About")');
    await expect(menu).not.toHaveClass(/navbar-links--open/);
    await expect(page).toHaveURL('/about');
  });
});
