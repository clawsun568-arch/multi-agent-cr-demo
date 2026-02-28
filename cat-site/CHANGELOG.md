# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-28

### Changed
- **Real cat photos** — replaced all 7 placeholder cats with 2 real cats: Machi (King) and Matcha (Queen), using actual HEIC→JPEG converted photos
- **Image path validation** — CatCard and KittenCard now accept local `/images/` paths in addition to HTTP URLs
- **Hero banners** — all page hero banners now use real cat photos instead of placecats.com
- **Gallery & hero images** — site config updated with 3 real photos for hero carousel and gallery
- **Breed info** — simplified to British Shorthair only, using real photo
- **cat-data.json** — complete rewrite with Machi and Matcha as the only cats

### Added
- **Cat management CLI** — `npm run cats` interactive script for listing, adding, editing, and removing cats from cat-data.json
- **Content management CLI** — `npm run cats` interactive tool for managing cat-data.json

### Removed
- All placeholder cat data (Mochi, Sakura, Taro, Kenzo, Pomelo, Yuzu, Mikan)
- All placecats.com URL references
- HEIC source images (converted to JPEG)

## [1.9.0] - 2026-02-28

### Fixed
- **KittenCard button nesting** — replaced outer `<button>` with `<div role="button">` to fix `validateDOMNesting` error (carousel buttons inside card button)
- **Hardcoded contact email** — CatProfilePage CTA now uses email from siteConfig instead of `contact@example.com`
- **Layout padding** — removed `max-width` and `padding` from `layout-main` so hero banners render truly full-width; each page handles its own content width

### Added
- **Dynamic page titles** — browser tab now shows page-specific titles (e.g. "About Us | My Cattery", "Pomelo | My Cattery")
- **Scroll to top on navigation** — pages now scroll to the top when navigating between routes
- **usePageTitle hook** — reusable hook for setting `document.title` per page
- **ScrollToTop component** — scrolls window to top on route change

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
