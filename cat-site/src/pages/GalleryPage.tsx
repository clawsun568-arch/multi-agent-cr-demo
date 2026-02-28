import { useState, useCallback } from 'react';
import { useCatData } from '../hooks/useCatData';
import { usePageTitle } from '../hooks/usePageTitle';
import { HeroBanner } from '../components/HeroBanner';
import { PhotoGrid } from '../components/PhotoGrid';
import { LightboxModal } from '../components/LightboxModal';

/**
 * GalleryPage — Masonry photo grid with lightbox modal.
 *
 * Displays gallery images from siteConfig.galleryImages in a responsive
 * masonry-style grid. Clicking any photo opens a full-screen lightbox
 * with prev/next navigation and keyboard support.
 */
export function GalleryPage() {
  const { siteConfig, loading, error } = useCatData();
  usePageTitle('Gallery');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = siteConfig?.galleryImages ?? [];

  const handlePhotoClick = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setLightboxIndex(i => (i === null || i === 0 ? photos.length - 1 : i - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex(i => (i === null || i === photos.length - 1 ? 0 : i + 1));
  }, [photos.length]);

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="gallery-page">
      <HeroBanner
        title="Gallery"
        backgroundImage="https://placecats.com/bella/1200/500"
      />

      <div className="gallery-content">
        <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
      </div>

      {lightboxIndex !== null && (
        <LightboxModal
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
