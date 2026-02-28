# My Cattery Website

A cat cattery website built with React + TypeScript + Vite.

## Managing Cat Data

All cat and site content lives in one file: `public/cat-data.json`. No code changes needed to add, edit, or remove cats.

You can edit it manually or use the CLI tool: `npm run cats`

### Image files

Put all images in `public/images/`. Use JPEG format (convert HEIC first if needed).

There are two types of images:

| Type | Size | Used for |
|------|------|----------|
| Regular photo | ~1200px wide | Cat cards, gallery, profile pages |
| Banner photo | ~1400x600px (landscape crop) | Hero banners at the top of pages |

### Where each image field shows up

#### `siteConfig.heroImages` — Homepage carousel

The sliding image carousel on the homepage. Use wide banner-cropped images.

```json
"heroImages": [
  { "url": "/images/machi-1-banner.jpg", "alt": "Machi relaxing at home" },
  { "url": "/images/matcha-1-banner.jpg", "alt": "Matcha posing elegantly" }
]
```

#### `siteConfig.galleryImages` — Gallery page grid

The photo grid on the /gallery page. Use regular-sized images.

```json
"galleryImages": [
  { "url": "/images/machi-1.jpg", "caption": "Machi relaxing at home" },
  { "url": "/images/matcha-1.jpg", "caption": "Matcha looking elegant" }
]
```

#### `siteConfig.about.breeds[].photoUrl` — About page breed card

The photo shown next to the breed description on the /about page.

```json
"breeds": [
  {
    "breedName": "British Shorthair",
    "photoUrl": "/images/machi-1.jpg",
    ...
  }
]
```

#### `cats[].photoUrl` — Cat card main photo

The primary photo shown on cat cards (Our Cats page, Featured Cats on homepage, profile page header).

```json
{
  "id": "machi",
  "name": "Machi",
  "photoUrl": "/images/machi-1.jpg",
  ...
}
```

#### `cats[].gallery` — Cat profile extra photos

Additional photos shown on a cat's individual profile page (/our-cats/machi).

```json
{
  "id": "machi",
  "gallery": [
    { "url": "/images/machi-2.jpg", "caption": "Machi looking handsome" }
  ],
  ...
}
```

### Adding a new cat — step by step

1. Put the cat's photo(s) in `public/images/` (e.g. `public/images/newcat-1.jpg`)
2. Optionally create a banner crop for hero use (~1400x600px)
3. Run `npm run cats` and select "Add cat", or edit `public/cat-data.json` directly
4. Set the `role` field to control where the cat appears:
   - `"king"` — shows under Kings on the Our Cats page
   - `"queen"` — shows under Queens on the Our Cats page
   - `"kitten"` — shows on the Available Kittens page
5. Optionally add the new images to `heroImages` and/or `galleryImages` in `siteConfig`
6. Deploy

No code changes needed. The site reads from `cat-data.json` and renders everything automatically.

### Interior page hero banners

Each page has a hardcoded banner image path. To change which banner shows on a specific page, edit the `backgroundImage` prop in:

| Page | File | Current banner |
|------|------|----------------|
| Our Cats | `src/pages/OurCatsPage.tsx` | `/images/machi-1-banner.jpg` |
| Kittens | `src/pages/AvailableKittensPage.tsx` | `/images/matcha-1-banner.jpg` |
| Gallery | `src/pages/GalleryPage.tsx` | `/images/machi-2-banner.jpg` |
| About | `src/pages/AboutPage.tsx` | `/images/matcha-1-banner.jpg` |
| Contact | `src/pages/ContactPage.tsx` | `/images/machi-2-banner.jpg` |

## Development

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm test         # Run all tests
npm run cats     # Interactive CLI to manage cat-data.json
```
