import { useCatData } from '../hooks/useCatData';
import { HeroBanner } from '../components/HeroBanner';

/**
 * AboutPage — Cattery philosophy and breed information.
 *
 * Displays a hero banner, cattery philosophy text, and breed info
 * sections with descriptions, traits lists, and featured photos.
 */
export function AboutPage() {
  const { siteConfig, loading, error } = useCatData();

  if (loading) {
    return <div className="loading">Loading about info...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const about = siteConfig?.about;

  return (
    <div className="about-page">
      <HeroBanner
        title="About Us"
        backgroundImage="https://placecats.com/poppy/1200/500"
      />

      <div className="about-content">
        {about?.philosophy && (
          <section className="about-philosophy">
            <h2>Our Philosophy</h2>
            <p>{about.philosophy}</p>
          </section>
        )}

        {about?.breeds && about.breeds.length > 0 && (
          <section className="about-breeds">
            <h2>Our Breeds</h2>
            {about.breeds.map(breed => (
              <div key={breed.breedName} className="breed-card">
                {breed.photoUrl && (
                  <div className="breed-card-image">
                    <img
                      src={breed.photoUrl}
                      alt={breed.breedName}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="breed-card-content">
                  <h3>{breed.breedName}</h3>
                  <p className="breed-description">{breed.description}</p>
                  {breed.traits.length > 0 && (
                    <ul className="breed-traits">
                      {breed.traits.map(trait => (
                        <li key={trait}>{trait}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {!about && (
          <p className="empty-message">
            About information coming soon. Check back later!
          </p>
        )}
      </div>
    </div>
  );
}
