import { useNavigate } from 'react-router-dom';
import { useCatData } from '../hooks/useCatData';
import { usePageTitle } from '../hooks/usePageTitle';
import { HeroBanner } from '../components/HeroBanner';
import { KittenCard } from '../components/KittenCard';

/**
 * AvailableKittensPage — Grid of kittens with image carousels and status badges.
 *
 * Filters cats by role === 'kitten'. Each kitten is displayed in a KittenCard
 * with a mini image carousel, name/gender, color, personality, and Available/Sold badge.
 */
export function AvailableKittensPage() {
  const { cats, loading, error } = useCatData();
  const navigate = useNavigate();
  usePageTitle('Available Kittens');

  if (loading) {
    return <div className="loading">Loading kittens...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const kittens = cats.filter(c => c.role === 'kitten');

  const handleKittenClick = (kittenId: string) => {
    navigate(`/our-cats/${kittenId}`);
  };

  return (
    <div className="kittens-page">
      <HeroBanner
        title="Available Kittens"
        backgroundImage="/images/matcha-1-banner.jpg"
      />

      <div className="kittens-content">
        {kittens.length === 0 ? (
          <p className="empty-message">
            No kittens available right now. Check back soon!
          </p>
        ) : (
          <div className="kitten-grid" role="list">
            {kittens.map(kitten => (
              <div key={kitten.id} role="listitem">
                <KittenCard
                  kitten={kitten}
                  onClick={() => handleKittenClick(kitten.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
