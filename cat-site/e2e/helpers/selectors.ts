/**
 * Shared Selectors for E2E Tests
 *
 * This file centralizes all CSS/ARIA selectors used across E2E tests.
 * Instead of hardcoding selectors like '[aria-label="Close lightbox"]'
 * in every test file, we define them once here and import them.
 *
 * Benefits:
 * - If a component's aria-label or class name changes, we update ONE place
 * - Tests are more readable: `lightbox.closeBtn` vs a raw CSS selector string
 * - TypeScript autocomplete helps discover available selectors
 *
 * Selector strategy:
 * - Prefer aria-labels and ARIA roles (accessible, stable, semantic)
 * - Fall back to CSS classes when no ARIA attribute exists
 * - Avoid data-testid where ARIA attributes already exist
 *
 * The "as const" on each object makes TypeScript treat the values as
 * literal string types (not just `string`), enabling better type checking.
 */

/**
 * Navigation bar selectors.
 * The NavBar is rendered on every page via the Layout component.
 * On mobile viewports (<640px), links collapse behind a hamburger menu.
 */
export const nav = {
  /** The <nav> wrapper element */
  main: 'nav[aria-label="Main navigation"]',
  /** Hamburger button (matches either open or close state) */
  hamburger: 'button[aria-label="Open navigation menu"], button[aria-label="Close navigation menu"]',
  /** Hamburger when menu is closed — clicking opens the menu */
  hamburgerOpen: 'button[aria-label="Open navigation menu"]',
  /** Hamburger when menu is open — clicking closes the menu */
  hamburgerClose: 'button[aria-label="Close navigation menu"]',
  /** The <ul> containing all nav links (id-based selector) */
  menu: '#navbar-menu',
  /** The currently active nav link (highlighted for the current page) */
  activeLink: '[aria-current="page"]',
  /** The logo/cattery name link in the top-left — always links to home */
  logo: '.navbar-logo',
} as const;

/**
 * Hero carousel selectors (homepage full-width image slideshow).
 * The carousel auto-advances every 5 seconds, has prev/next buttons,
 * and dot indicators for jumping to specific slides.
 */
export const heroCarousel = {
  /** The outer carousel container (role="region") */
  region: '[aria-label="Hero image carousel"]',
  /** Left arrow button — goes to previous slide */
  prevBtn: '[aria-label="Previous slide"]',
  /** Right arrow button — goes to next slide */
  nextBtn: '[aria-label="Next slide"]',
  /** The dot indicators container (role="tablist") */
  dots: '[aria-label="Slide indicators"]',
  /** A specific dot indicator by 1-based slide number (e.g., dot(1) = first slide) */
  dot: (n: number) => `[aria-label="Go to slide ${n}"]`,
  /** The currently visible slide (CSS controls visibility via opacity) */
  activeSlide: '.hero-slide--active',
} as const;

/**
 * Image carousel selectors (used inside KittenCard for multi-photo kittens).
 * Smaller than the hero carousel — just prev/next buttons and dots.
 */
export const imageCarousel = {
  prevBtn: '[aria-label="Previous photo"]',
  nextBtn: '[aria-label="Next photo"]',
  activeDot: '.carousel-dot--active',
} as const;

/**
 * Lightbox modal selectors (gallery page full-screen image viewer).
 * Opens when clicking a photo in the grid. Supports:
 * - Prev/next navigation (buttons + arrow keys)
 * - Close (button + Escape key + clicking overlay)
 * - Counter showing "3 / 12" position
 */
export const lightbox = {
  /** The modal dialog overlay (role="dialog", aria-modal="true") */
  dialog: '[role="dialog"][aria-label="Image lightbox"]',
  /** X button in the top-right corner */
  closeBtn: '[aria-label="Close lightbox"]',
  /** Left arrow — previous image */
  prevBtn: '[aria-label="Previous image"]',
  /** Right arrow — next image */
  nextBtn: '[aria-label="Next image"]',
  /** The main displayed image inside the lightbox */
  image: '.lightbox-image',
  /** Counter text like "3 / 12" */
  counter: '.lightbox-counter',
} as const;

/**
 * Cat card selectors (used on Our Cats page and Featured Cats on homepage).
 * Each card shows a cat's photo, name, breed, and an Owned/Coming Soon badge.
 */
export const catCard = {
  /** The clickable card container (a <button> element) */
  card: '.cat-card',
  /** The cat's display name */
  name: '.cat-name',
  /** Status badge showing "Owned" or "Coming Soon" */
  badge: '.status-badge',
} as const;

/**
 * Kitten card selectors (used on the Available Kittens page).
 * Similar to cat cards but with Available/Sold badges and image carousels.
 */
export const kittenCard = {
  /** The clickable card container (a <div role="button">) */
  card: '.kitten-card',
  /** The kitten's display name */
  name: '.kitten-card-name',
  /** Status badge showing "Available" (green) or "Sold" (red) */
  badge: '.kitten-status-badge',
} as const;

/**
 * Photo grid selectors (gallery page masonry layout).
 * Clicking any grid item opens the lightbox modal.
 */
export const photoGrid = {
  /** The grid container (CSS columns layout) */
  grid: '.photo-grid',
  /** Individual clickable photo items (buttons with images inside) */
  item: '.photo-grid-item',
} as const;

/**
 * Route paths for all pages in the site.
 * Used with page.goto() in tests (combined with baseURL from config).
 */
export const routes = {
  home: '/',
  about: '/about',
  ourCats: '/our-cats',
  kittens: '/kittens',
  gallery: '/gallery',
  contact: '/contact',
} as const;
