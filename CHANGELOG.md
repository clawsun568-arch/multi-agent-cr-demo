# Changelog

All notable changes to the Cat Website project.

## [Unreleased]

### Planned (v2 Roadmap)
- PR 1: React Router + NavBar + Footer + warm earthy color palette
- PR 2: Homepage redesign with hero carousel, intro section, featured cats
- PR 3: Our Cats page (Kings & Queens) + enhanced CatProfilePage + HeroBanner
- PR 4: Available Kittens page with image carousels and sold/available status
- PR 5: Gallery page with masonry grid and lightbox modal
- PR 6: Contact page + About/Breed Info page + social media icons
- PR 7: Real photos, responsive tuning, accessibility audit

## [1.2.0] - 2026-02-26

### Added — Design Doc v2
- Rewrote `docs/cat-website-design.md` from single-page v1 to multi-page v2 architecture
- New architecture: React Router with 7 pages (Home, About, Our Cats, Kittens, Gallery, Contact, Cat Profile)
- New component tree with 15+ components (NavBar, Footer, HeroBanner, HeroCarousel, KittenCard, ImageCarousel, PhotoGrid, LightboxModal, SocialIcons, etc.)
- Updated data model: added `role` (king/queen/kitten), `color`, `available` fields to Cat type
- New `siteConfig` schema for cattery branding, contact info, and hero images
- Color palette specification: warm earthy tones (`#A86A53` primary, cream/tan secondary)
- Typography scale and responsive breakpoint definitions
- 7-PR implementation roadmap with clear feature boundaries
- Expanded future roadmap (subscriptions, pedigree display, CMS, i18n)

### Added — Test Infrastructure
- Installed Vitest + React Testing Library + jest-dom + jsdom
- Created `vitest.config.ts` with jsdom environment and global test functions
- Created `src/test/setup.ts` for jest-dom custom matchers
- Added `npm test` and `npm test:watch` scripts to package.json
- Added `vitest/globals` to TypeScript types config

### Added — Unit Tests (22 tests, all passing)
- `ageCalculator.test.ts` — 7 tests covering years, months, weeks, days, future dates, invalid input
- `CatCard.test.tsx` — 9 tests covering rendering, click handling, accessibility, image placeholder
- `CatSection.test.tsx` — 6 tests covering title, empty state, card count, click callback, ARIA attributes
- All tests use fake timers for deterministic age calculations
- Thorough comments explaining testing concepts for React newcomers

## [1.1.0] - 2026-02-26

### Added
- Cat profile detail pages (PR #5)
  - `CatProfilePage` component with full cat information
  - Photo gallery support in profile view
  - Parent lineage display (father/mother)
  - Enhanced `CatCard` with click-to-view functionality
  - Navigation between list and detail views
  - Updated TypeScript types with Photo interface

### Fixed
- Scoped CSS classes to avoid collision between card and profile styles
- Changed `CatCard` from `article role="button"` to proper `<button>` element
- Fixed gallery key prop to use `photo.url` instead of index
- Removed unnecessary `import React` (React 17+ JSX transform)
- Removed `isMounted` ref anti-pattern (AbortController handles cleanup)
- Added proper null guards for `expectedDate` in CTA section
- Added working `onClick` handler to contact button

## [1.0.0] - 2026-02-26

### Added
- Initial project setup with React + TypeScript + Vite
- ESLint configuration with flat config
- Basic folder structure
- Design document (v1)
- CI/CD workflow with multi-agent code review
- **v1 Cat Website implementation** (PR #3)
  - React components for cat display
  - TypeScript types with comments
  - Age calculator with birthDate
  - Accessibility features (ARIA, keyboard nav)
  - Responsive CSS with grid layout

## Contributors
- Kimi K2.5 (Development)
- Codex (Code Review)
- Sonnet 4.5/4.6 (Code Review)
