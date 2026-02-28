import { useState } from 'react';
import type { Photo } from '../data/types';

/**
 * ImageCarousel — Prev/next image slider for kitten cards.
 *
 * Shows one image at a time with arrow controls to cycle through photos.
 * Displays dot indicators and a counter (e.g. "1 / 3").
 */
interface ImageCarouselProps {
  photos: Photo[];
  altPrefix: string;
}

export function ImageCarousel({ photos, altPrefix }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (photos.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(i => (i === 0 ? photos.length - 1 : i - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(i => (i === photos.length - 1 ? 0 : i + 1));
  };

  const current = photos[currentIndex];

  return (
    <div className="image-carousel" aria-label={`${altPrefix} photo gallery`}>
      <img
        src={current.url}
        alt={current.caption || `${altPrefix} photo ${currentIndex + 1}`}
        className="image-carousel-img"
        loading="lazy"
      />

      {photos.length > 1 && (
        <>
          <button
            className="carousel-control carousel-control--prev"
            onClick={handlePrev}
            aria-label="Previous photo"
            type="button"
          >
            &#8249;
          </button>
          <button
            className="carousel-control carousel-control--next"
            onClick={handleNext}
            aria-label="Next photo"
            type="button"
          >
            &#8250;
          </button>
          <div className="carousel-dots">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`carousel-dot ${i === currentIndex ? 'carousel-dot--active' : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
