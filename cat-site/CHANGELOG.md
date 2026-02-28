# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-02-27

### Added
- **Our Cats page** — fully implemented with Kings (males) and Queens (females) sections
- **HeroBanner component** — reusable full-width banner for interior pages with background image and gradient fallback
- **Cat data model** — added `role` (king/queen/kitten) and `color` fields to the Cat interface
- **New sample cats** — added Taro (British Shorthair king) and Kenzo (Ragdoll king) to cat-data.json
- Unit tests for HeroBanner and OurCatsPage

### Changed
- CatProfilePage now displays coat `color` in the meta section
- CatProfilePage "Back to Cats" link now navigates to `/our-cats` instead of `/`
- Updated existing cats (Mochi, Sakura) with `role` and `color` fields
- Removed OurCatsPage from stub page tests (moved to dedicated test file)
