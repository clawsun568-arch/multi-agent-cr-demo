# Changelog

All notable changes to the Cat Website project.

## [Unreleased]

### Planned (v2 Roadmap)
- PR 3: Our Cats page (Kings & Queens) + enhanced CatProfilePage + HeroBanner
- PR 4: Available Kittens page with image carousels and sold/available status
- PR 5: Gallery page with masonry grid and lightbox modal
- PR 6: Contact page + About/Breed Info page + social media icons
- PR 7: Real photos, responsive tuning, accessibility audit

## [1.5.0] - 2026-02-28

### Added — Automated AI Code Review (PR 17)
- **Claude review workflow** (`claude-review.yml`) — uses `anthropics/claude-code-action@v1` with Opus 4.6, triggers on PR open/sync/reopen and `@claude` mentions in comments
- **OpenAI review workflow** (`openai-review.yml`) — gets PR diff, sends to OpenAI o3 for review, posts results as PR comment
- Replaces the previous Cloudboard cron-based polling approach with instant GitHub Actions triggers

### Changed
- **ci.yml** — replaced placeholder `python hello.py` with real `npm ci && npm run build && npm test` pipeline in `cat-site/`

### Removed
- **multi-agent-review.yml** — deprecated; the old OpenClaw-based review gate is replaced by the new automated Claude + OpenAI workflows

## [1.4.0] - 2026-02-27

### Added — Homepage Redesign (PR 2)
- **HeroCarousel** component — full-width image carousel with fade transitions, auto-advance (5s), prev/next arrows, dot indicators, hover-to-pause, and full accessibility (aria-label, aria-live, role="region")
- **IntroSection** component — centered cattery name, tagline, and introductory paragraph
- **FeaturedCats** component — grid of up to 3 featured cats (prioritizing owned), reusing CatCard, with "View All Cats" link to /our-cats
- **SiteConfig** data model — new `siteConfig` object in cat-data.json with catteryName, tagline, introText, and heroImages
- Updated `useCatData` hook to return `siteConfig` alongside `cats`
- New CSS for hero carousel, intro section, and featured cats with responsive adjustments

### Added — Unit Tests (26 new tests, 79 total, all passing)
- `HeroCarousel.test.tsx` — 12 tests: image rendering, dot indicators, next/prev navigation, auto-advance, hover pause/resume, empty state, single image, accessibility attributes
- `IntroSection.test.tsx` — 4 tests: heading, tagline, intro text, CSS classes
- `FeaturedCats.test.tsx` — 6 tests: heading, cat cards, "View All" link, 3-cat limit, owned-first priority, click callback
- `HomePage.test.tsx` — 7 tests (rewritten): loading state, hero carousel, intro section, featured cats, "View All" link, error handling, missing siteConfig fallback

### Changed
- **HomePage** completely rewritten — from header + 2 CatSections to HeroCarousel + IntroSection + FeaturedCats layout
- **types.ts** — added `SiteConfig` and `HeroImage` interfaces
- **cat-data.json** — added `siteConfig` object with cattery branding and 3 hero images

## [1.3.0] - 2026-02-26

### Added — React Router + Layout (PR 1)
- Installed `react-router-dom` v7 for client-side routing (uses v6-compatible API)
- **NavBar** component with logo, 6 navigation links, active page highlighting, and mobile hamburger menu
- **Footer** component with quick links, social media placeholder, and copyright notice
- **Layout** component wrapping all pages with NavBar + `<Outlet />` + Footer (sticky footer pattern)
- **useCatData** custom hook — extracted data fetching logic from App.tsx into a reusable hook
- **HomePage** replicating the original list view (Our Cats + Future Cats sections)
- Stub pages: AboutPage, OurCatsPage, AvailableKittensPage, GalleryPage, ContactPage
- Routes: `/`, `/about`, `/our-cats`, `/our-cats/:id`, `/kittens`, `/gallery`, `/contact`
- New directories: `src/hooks/`, `src/pages/`

### Added — Unit Tests (31 new tests, 53 total, all passing)
- `NavBar.test.tsx` — 9 tests: logo, links, active highlighting, hamburger toggle, accessibility
- `Footer.test.tsx` — 6 tests: copyright year, quick links, hrefs, ARIA roles
- `Layout.test.tsx` — 3 tests: NavBar + Footer + Outlet rendering, correct child route
- `HomePage.test.tsx` — 4 tests: loading state, cat sections render, error handling, header
- `stubPages.test.tsx` — 5 tests: each stub page renders its heading
- `useCatData.test.ts` — 4 tests: loading state, successful fetch, error handling, invalid data

### Changed
- **App.tsx** completely rewritten — from 120-line state-driven router to clean React Router configuration
- **CatProfilePage** refactored from prop-driven (`cat` + `onBack`) to self-contained route component using `useParams()` + `useCatData()`
- Color palette updated to warm earthy tones:
  - Primary: `#ff6b6b` (bright red) → `#A86A53` (warm brown)
  - Background: `#fafafa` → `#FDFBF9` (warm off-white)
  - Border: `#e0e0e0` → `#E8DDD4` (warm gray)
  - Added `--color-primary-hover: #8B5742` and `--color-secondary: #D4A574`
- CTA section gradient updated from teal to warm brown/tan
- Back button hover color updated from hardcoded `#e55a5a` to `var(--color-primary-hover)`
- Profile page h1 font-weight changed to 300 for elegant appearance
- Page title changed from "My Cats" to "My Cattery"

### Removed
- State-based routing (`selectedCatId` useState) from App.tsx
- Direct `cat` and `onBack` props from CatProfilePage (now uses useParams + useCatData)
- Inline header (`<h1>My Cats</h1>`) and footer from App.tsx (replaced by NavBar and Footer components)

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
