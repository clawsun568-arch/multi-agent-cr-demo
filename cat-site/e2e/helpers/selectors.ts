/** Shared selectors for E2E tests */

export const nav = {
  main: 'nav[aria-label="Main navigation"]',
  hamburger: 'button[aria-label="Open navigation menu"], button[aria-label="Close navigation menu"]',
  hamburgerOpen: 'button[aria-label="Open navigation menu"]',
  hamburgerClose: 'button[aria-label="Close navigation menu"]',
  menu: '#navbar-menu',
  activeLink: '[aria-current="page"]',
  logo: '.navbar-logo',
} as const;

export const heroCarousel = {
  region: '[aria-label="Hero image carousel"]',
  prevBtn: '[aria-label="Previous slide"]',
  nextBtn: '[aria-label="Next slide"]',
  dots: '[aria-label="Slide indicators"]',
  dot: (n: number) => `[aria-label="Go to slide ${n}"]`,
  activeSlide: '.hero-slide--active',
} as const;

export const imageCarousel = {
  prevBtn: '[aria-label="Previous photo"]',
  nextBtn: '[aria-label="Next photo"]',
  activeDot: '.carousel-dot--active',
} as const;

export const lightbox = {
  dialog: '[role="dialog"][aria-label="Image lightbox"]',
  closeBtn: '[aria-label="Close lightbox"]',
  prevBtn: '[aria-label="Previous image"]',
  nextBtn: '[aria-label="Next image"]',
  image: '.lightbox-image',
  counter: '.lightbox-counter',
} as const;

export const catCard = {
  card: '.cat-card',
  name: '.cat-name',
  badge: '.status-badge',
} as const;

export const kittenCard = {
  card: '.kitten-card',
  name: '.kitten-card-name',
  badge: '.kitten-status-badge',
} as const;

export const photoGrid = {
  grid: '.photo-grid',
  item: '.photo-grid-item',
} as const;

export const routes = {
  home: '/',
  about: '/about',
  ourCats: '/our-cats',
  kittens: '/kittens',
  gallery: '/gallery',
  contact: '/contact',
} as const;
