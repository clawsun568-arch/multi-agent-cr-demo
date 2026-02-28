# Changelog

All notable changes to this project will be documented in this file.

## [1.8.0] - 2026-02-28

### Added
- **Contact page** — fully implemented with contact details (email, phone, WeChat, Instagram), social media links, and inquiry note
- **About page** — fully implemented with cattery philosophy section and breed info cards (photo, description, traits)
- **SocialIcons component** — reusable social media link buttons for Contact page and Footer
- **Contact and About data** — added `contact` and `about` fields to site config in cat-data.json
- **Data model** — added `ContactInfo`, `BreedInfo`, and `AboutInfo` interfaces
- Unit tests for SocialIcons (6), ContactPage (7), and AboutPage (8)

### Changed
- Footer now displays SocialIcons instead of placeholder text when contact data is available
- Removed AboutPage and ContactPage from stub page tests (moved to dedicated test files)

## [1.7.0] - 2026-02-28

### Added
- **Gallery page** — fully implemented with masonry-style photo grid and lightbox modal
- **PhotoGrid component** — responsive CSS columns layout with captions and click-to-enlarge
- **LightboxModal component** — full-screen image viewer with prev/next navigation, keyboard support (Arrow keys, Escape), and overlay click to close
- **Gallery images** — added 12 gallery photos to site config data
- Unit tests for PhotoGrid, LightboxModal, and GalleryPage

### Changed
- Removed GalleryPage from stub page tests (moved to dedicated test file)

## [1.6.0] - 2026-02-28

### Added
- **Available Kittens page** — fully implemented with kitten grid, Available/Sold badges, and per-kitten image carousels
- **KittenCard component** — card with image carousel, name/gender, breed color, personality, and status badge
- **ImageCarousel component** — reusable prev/next image slider with dot indicators
- **Cat data model** — added `available` boolean field for kitten availability status
- **New sample kittens** — added Pomelo, Yuzu, and Mikan with gallery photos
- Unit tests for ImageCarousel, KittenCard, and AvailableKittensPage

### Changed
- Removed AvailableKittensPage from stub page tests (moved to dedicated test file)

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
