import type { Photo } from '../data/types';

/**
 * PhotoGrid — Responsive masonry-style photo grid for the gallery page.
 *
 * Renders photos in a CSS columns layout for a masonry effect.
 * Each photo is clickable and opens in a lightbox.
 */
interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <p className="empty-message">No photos in the gallery yet. Check back soon!</p>
    );
  }

  return (
    <div className="photo-grid" role="list">
      {photos.map((photo, index) => (
        <button
          key={index}
          className="photo-grid-item"
          onClick={() => onPhotoClick(index)}
          aria-label={photo.caption || `Gallery photo ${index + 1}`}
          type="button"
          role="listitem"
        >
          <img
            src={photo.url}
            alt={photo.caption || `Gallery photo ${index + 1}`}
            className="photo-grid-image"
            loading="lazy"
          />
          {photo.caption && (
            <span className="photo-grid-caption">{photo.caption}</span>
          )}
        </button>
      ))}
    </div>
  );
}
