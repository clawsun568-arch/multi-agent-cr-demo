import { useNavigate } from 'react-router-dom';
import { useCatData } from '../hooks/useCatData';
import { HeroBanner } from '../components/HeroBanner';
import { CatSection } from '../components/CatSection';

/**
 * OurCatsPage — Displays all breeding cats split into Kings (males) and Queens (females).
 *
 * Uses the `role` field on each cat to determine which section it belongs to.
 * For cats without a `role`, falls back to `gender` (Male → king, Female → queen).
 * This per-cat fallback handles partially migrated datasets correctly.
 */
export function OurCatsPage() {
  const { cats, loading, error } = useCatData();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">Loading cats...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Per-cat fallback: use role if set, otherwise fall back to gender
  const kings = cats.filter(c => c.role === 'king' || (!c.role && c.gender === 'Male'));
  const queens = cats.filter(c => c.role === 'queen' || (!c.role && c.gender === 'Female'));

  const handleCatClick = (catId: string) => {
    navigate(`/our-cats/${catId}`);
  };

  return (
    <div className="our-cats-page">
      <HeroBanner
        title="Our Cats"
        backgroundImage="https://placecats.com/bella/1200/500"
      />

      <div className="our-cats-content">
        <CatSection
          title="Kings"
          cats={kings}
          emptyMessage="No kings to show yet. Check back soon!"
          onCatClick={handleCatClick}
        />

        <CatSection
          title="Queens"
          cats={queens}
          emptyMessage="No queens to show yet. Check back soon!"
          onCatClick={handleCatClick}
        />
      </div>
    </div>
  );
}
