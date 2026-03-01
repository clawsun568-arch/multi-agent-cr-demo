/**
 * Playwright Configuration
 *
 * This file tells Playwright how to run our E2E (end-to-end) tests.
 * E2E tests open a real browser, navigate the site, click things, and
 * verify the page behaves correctly — unlike unit tests which test
 * individual functions in isolation.
 *
 * Key concepts:
 * - "projects" = different browser/viewport configurations to test against
 * - "webServer" = Playwright auto-starts our site before running tests
 * - "baseURL" = all test URLs are relative to this (e.g., page.goto('/about'))
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Where to find test files (all *.spec.ts files in the e2e/ directory)
  testDir: './e2e',

  // Run test files in parallel for speed (each file gets its own worker)
  fullyParallel: true,

  // In CI, fail the build if someone accidentally left a test.only() in the code.
  // test.only() runs just one test locally for debugging — but in CI we want ALL tests.
  forbidOnly: !!process.env.CI,

  // In CI, retry failed tests up to 2 times to handle flaky network/timing issues.
  // Locally, no retries — we want to see failures immediately.
  retries: process.env.CI ? 2 : 0,

  // In CI, use 1 worker (sequential) to avoid resource contention on shared runners.
  // Locally, use all available CPU cores (undefined = auto-detect).
  workers: process.env.CI ? 1 : undefined,

  // In CI, generate an HTML report (uploaded as artifact on failure).
  // Locally, just print results to the terminal.
  reporter: process.env.CI ? 'html' : 'list',

  // Default settings applied to ALL tests
  use: {
    // The URL where our site is running. Playwright navigates relative to this.
    // Port 4173 is Vite's default preview server port (production build).
    baseURL: 'http://localhost:4173',

    // Record a trace (network requests, DOM snapshots, screenshots) on the first
    // retry of a failed test. Useful for debugging CI failures.
    trace: 'on-first-retry',
  },

  // Projects define which browsers/devices to test against.
  // Each test runs once per project, so 79 tests × 2 projects = 158 total.
  projects: [
    {
      name: 'desktop',
      // Desktop Chrome: 1280×720 viewport, standard user agent
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      // Pixel 5: 393×851 viewport, mobile user agent, touch enabled
      // Tests the responsive/mobile layout (hamburger menu, stacked grids, etc.)
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Automatically start the site before running tests.
  // Playwright runs "npm run preview" (which serves the production build on port 4173),
  // waits for the URL to respond, then starts the tests.
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    // Locally, if the server is already running, reuse it (faster iteration).
    // In CI, always start fresh.
    reuseExistingServer: !process.env.CI,
  },
});
