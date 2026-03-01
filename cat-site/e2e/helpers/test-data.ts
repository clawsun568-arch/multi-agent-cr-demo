/**
 * Test Data Helper
 *
 * Reads cat-data.json at module load time and exports derived values
 * so E2E tests don't hardcode counts, names, or IDs that change when
 * the data file is updated.
 *
 * Playwright runs in Node, so we can use fs.readFileSync here.
 * process.cwd() resolves to `cat-site/` since that's where Playwright
 * is configured to run from.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

interface Cat {
  id: string;
  name: string;
  status: 'owned' | 'planned';
  breed: string;
  gender: string;
  role: 'king' | 'queen' | 'kitten';
}

interface SiteConfig {
  heroImages: unknown[];
  galleryImages: unknown[];
  about: {
    breeds: unknown[];
  };
}

interface CatData {
  siteConfig: SiteConfig;
  cats: Cat[];
}

const dataPath = join(process.cwd(), 'public', 'cat-data.json');
const catData: CatData = JSON.parse(readFileSync(dataPath, 'utf-8'));

/** Number of images in the gallery grid */
export const galleryImageCount = catData.siteConfig.galleryImages.length;

/** Number of hero carousel slides */
export const heroImageCount = catData.siteConfig.heroImages.length;

/** Number of breed cards on the About page */
export const breedCount = catData.siteConfig.about.breeds.length;

/** Number of king (male breeding) cats */
export const kingCount = catData.cats.filter((c) => c.role === 'king').length;

/** Number of queen (female breeding) cats — includes both owned and planned */
export const queenCount = catData.cats.filter((c) => c.role === 'queen').length;

/** Number of kittens */
export const kittenCount = catData.cats.filter((c) => c.role === 'kitten').length;

/** First non-kitten owned cat — used for profile page tests */
export const firstOwnedCat = catData.cats.find(
  (c) => c.status === 'owned' && c.role !== 'kitten'
)!;

/** First planned cat — used for "Coming Soon" tests */
export const firstPlannedCat = catData.cats.find((c) => c.status === 'planned')!;
