import { useEffect, useCallback } from 'react';
import type { Photo } from '../data/types';

/**
 * LightboxModal — Full-screen image viewer overlay.
 *
 * Opens over the page with a dark background, showing a large image
 * with prev/next navigation and keyboard support (Arrow keys, Escape).
 */
interface LightboxModalProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function LightboxModal({ photos, currentIndex, onClose, onPrev, onNext }: LightboxModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-label="Image lightbox"
      aria-modal="true"
    >
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close lightbox"
          type="button"
        >
          &times;
        </button>

        <button
          className="lightbox-nav lightbox-nav--prev"
          onClick={onPrev}
          aria-label="Previous image"
          type="button"
        >
          &#8249;
        </button>

        <img
          src={photo.url}
          alt={photo.caption || `Gallery photo ${currentIndex + 1}`}
          className="lightbox-image"
        />

        <button
          className="lightbox-nav lightbox-nav--next"
          onClick={onNext}
          aria-label="Next image"
          type="button"
        >
          &#8250;
        </button>

        {photo.caption && (
          <p className="lightbox-caption">{photo.caption}</p>
        )}

        <p className="lightbox-counter">
          {currentIndex + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}
