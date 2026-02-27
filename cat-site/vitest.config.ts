/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Vitest configuration for the cat-site project.
 *
 * Vitest is a test runner built on top of Vite — it reuses Vite's config
 * and transformation pipeline, so your tests can import .tsx files, CSS, etc.
 * just like your app code does.
 *
 * Key settings:
 * - environment: 'jsdom' — simulates a browser DOM in Node.js so React
 *   components can render during tests (without a real browser).
 * - setupFiles — runs before each test file. We use it to add custom
 *   matchers like `toBeInTheDocument()` from @testing-library/jest-dom.
 * - globals: true — makes `describe`, `it`, `expect` available without
 *   importing them in every test file (like Jest does by default).
 */
export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom to simulate browser APIs (document, window, etc.)
    environment: 'jsdom',

    // Run this setup file before every test suite
    setupFiles: ['./src/test/setup.ts'],

    // Make test functions (describe, it, expect) globally available
    // so you don't need to import them in every test file
    globals: true,

    // Include test files matching these patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
