import type { Cat } from '../data/types';
import { ImageCarousel } from './ImageCarousel';
import { calculateAge } from '../utils/ageCalculator';

/**
 * KittenCard — Card for the Available Kittens page.
 *
 * Displays a mini image carousel, name with gender, breed/color,
 * personality, age, and an Available/Sold status badge.
 */
interface KittenCardProps {
  kitten: Cat;
  onClick: () => void;
}

export function KittenCard({ kitten, onClick }: KittenCardProps) {
  const isAvailable = kitten.available !== false;
  const hasValidPhoto = kitten.photoUrl && kitten.photoUrl.startsWith('http');
  const age = kitten.birthDate ? calculateAge(kitten.birthDate) : null;

  // Build carousel photos: main photo + gallery
  const photos = [];
  if (hasValidPhoto) {
    photos.push({ url: kitten.photoUrl, caption: kitten.name });
  }
  if (kitten.gallery) {
    photos.push(...kitten.gallery);
  }

  return (
    <button
      className="kitten-card"
      onClick={onClick}
      aria-label={`View details for ${kitten.name}, ${isAvailable ? 'available' : 'sold'}`}
      type="button"
    >
      <div className="kitten-card-image">
        {photos.length > 0 ? (
          <ImageCarousel photos={photos} altPrefix={kitten.name} />
        ) : (
          <div className="kitten-card-placeholder">
            <span>🐱</span>
          </div>
        )}
        <span className={`kitten-status-badge ${isAvailable ? 'available' : 'sold'}`}>
          {isAvailable ? 'Available' : 'Sold'}
        </span>
      </div>

      <div className="kitten-card-info">
        <h3 className="kitten-card-name">
          {kitten.name} <span className="kitten-card-gender">({kitten.gender})</span>
        </h3>

        {kitten.color && (
          <p className="kitten-card-color">{kitten.color}</p>
        )}

        {age && (
          <p className="kitten-card-age">{age}</p>
        )}

        {kitten.personality && (
          <p className="kitten-card-personality">{kitten.personality}</p>
        )}

        <span className="view-details">View Details →</span>
      </div>
    </button>
  );
}
