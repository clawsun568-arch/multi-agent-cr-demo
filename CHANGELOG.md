# Changelog

All notable changes to the Cat Website project.

## [Unreleased]

### Planned
- Hero section with carousel
- Navigation header
- Cat photo upload functionality
- Subscribe/tips section
- Payment integration
- Mobile responsiveness improvements

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
