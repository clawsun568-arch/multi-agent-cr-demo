import { useNavigate } from 'react-router-dom';
import { useCatData } from '../hooks/useCatData';
import { HeroBanner } from '../components/HeroBanner';
import { CatSection } from '../components/CatSection';

/**
 * OurCatsPage — Displays all breeding cats split into Kings (males) and Queens (females).
 *
 * Uses the `role` field on each cat to determine which section it belongs to.
 * Falls back to `gender` filtering if no cats have a `role` set (backward compat).
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

  // Check if any cats have the role field set
  const hasRoles = cats.some(c => c.role);

  const kings = hasRoles
    ? cats.filter(c => c.role === 'king')
    : cats.filter(c => c.gender === 'Male');

  const queens = hasRoles
    ? cats.filter(c => c.role === 'queen')
    : cats.filter(c => c.gender === 'Female');

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
