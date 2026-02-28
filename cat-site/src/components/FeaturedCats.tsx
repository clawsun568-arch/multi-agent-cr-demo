import { Link } from 'react-router-dom';
import { CatCard } from './CatCard';
import type { Cat } from '../data/types';

interface FeaturedCatsProps {
  cats: Cat[];
  onCatClick: (catId: string) => void;
}

/**
 * FeaturedCats — Grid of featured cat cards for the homepage.
 *
 * Shows up to 3 cats, prioritizing owned cats over planned.
 * Includes a "View All Cats" link to the /our-cats page.
 */
export function FeaturedCats({ cats, onCatClick }: FeaturedCatsProps) {
  // Prioritize owned cats, then planned, limit to 3
  const featured = [...cats]
    .sort((a, b) => {
      if (a.status === 'owned' && b.status !== 'owned') return -1;
      if (a.status !== 'owned' && b.status === 'owned') return 1;
      return 0;
    })
    .slice(0, 3);

  return (
    <section className="featured-cats">
      <h2 className="featured-cats-title">Meet Our Cats</h2>

      <div className="cat-grid">
        {featured.map(cat => (
          <CatCard
            key={cat.id}
            cat={cat}
            onClick={() => onCatClick(cat.id)}
          />
        ))}
      </div>

      <div className="featured-cats-footer">
        <Link to="/our-cats" className="view-all-link">
          View All Cats &rarr;
        </Link>
      </div>
    </section>
  );
}
