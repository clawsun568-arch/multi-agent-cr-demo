import { useNavigate } from 'react-router-dom';
import { useCatData } from '../hooks/useCatData';
import { HeroCarousel } from '../components/HeroCarousel';
import { IntroSection } from '../components/IntroSection';
import { FeaturedCats } from '../components/FeaturedCats';

/**
 * HomePage — Landing page rendered at the "/" route.
 *
 * Displays:
 * 1. HeroCarousel — full-width image slideshow from siteConfig
 * 2. IntroSection — cattery name, tagline, and intro text
 * 3. FeaturedCats — grid of up to 3 featured cats with "View All" link
 */
export function HomePage() {
  const { cats, siteConfig, loading, error } = useCatData();
  const navigate = useNavigate();

  function handleCatClick(catId: string) {
    navigate(`/our-cats/${catId}`);
  }

  if (loading) {
    return <div className="loading">Loading cats...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      {siteConfig && (
        <>
          <HeroCarousel heroImages={siteConfig.heroImages} />
          <IntroSection
            catteryName={siteConfig.catteryName}
            tagline={siteConfig.tagline}
            introText={siteConfig.introText}
          />
        </>
      )}

      <FeaturedCats cats={cats} onCatClick={handleCatClick} />
    </>
  );
}
