import { useState, useEffect, useCallback } from 'react';
import type { HeroImage } from '../data/types';

interface HeroCarouselProps {
  heroImages: HeroImage[];
}

/**
 * HeroCarousel — Full-width image carousel for the homepage hero section.
 *
 * Features:
 * - Auto-advances every 5 seconds
 * - Pauses on hover so users can view an image longer
 * - Prev/Next arrow buttons for manual navigation
 * - Dot indicators showing the current slide
 * - Fade transition between slides
 * - Accessible with aria-label, aria-live, and role="region"
 */
export function HeroCarousel({ heroImages }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = heroImages.length;

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % slideCount);
  }, [slideCount]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-advance every 5 seconds, pause on hover
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, goToNext, slideCount]);

  if (slideCount === 0) return null;

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-label="Hero image carousel"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-carousel-track" aria-live="polite">
        {heroImages.map((image, index) => (
          <div
            key={image.url}
            className={`hero-slide ${index === currentIndex ? 'hero-slide--active' : ''}`}
            aria-hidden={index !== currentIndex}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="hero-slide-image"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {slideCount > 1 && (
        <>
          <button
            className="hero-control hero-control--prev"
            onClick={goToPrev}
            aria-label="Previous slide"
            type="button"
          >
            &#8249;
          </button>
          <button
            className="hero-control hero-control--next"
            onClick={goToNext}
            aria-label="Next slide"
            type="button"
          >
            &#8250;
          </button>

          <div className="hero-dots" role="tablist" aria-label="Slide indicators">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentIndex ? 'hero-dot--active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
