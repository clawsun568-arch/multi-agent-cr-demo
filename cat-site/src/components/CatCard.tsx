import { useState } from 'react';
import { Cat } from '../data/types';
import { calculateAge } from '../utils/ageCalculator';

interface CatCardProps {
  cat: Cat;
  onClick: () => void;
}

/**
 * CatCard - Clickable card showing cat summary
 * Opens detailed profile view when clicked
 */
export function CatCard({ cat, onClick }: CatCardProps) {
  const isOwned = cat.status === 'owned';
  const [imageError, setImageError] = useState(false);
  
  // Check if photo URL is valid (not empty and starts with http)
  const hasValidPhoto = cat.photoUrl && cat.photoUrl.startsWith('http');
  
  return (
    <article 
      className="cat-card"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${cat.name}, ${isOwned ? (cat.birthDate ? calculateAge(cat.birthDate) : 'age unknown') : 'planned cat'}`}
    >
      <div className={`cat-image-container ${imageError || !hasValidPhoto ? 'no-image' : ''}`}>
        {!imageError && hasValidPhoto ? (
          <img 
            src={cat.photoUrl} 
            alt={`${cat.name}${isOwned ? '' : ' (placeholder)'}`}
            className="cat-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">
            <span>🐱</span>
          </div>
        )}
        <span className={`status-badge ${cat.status}`}>
          {isOwned ? 'Owned' : 'Planned'}
        </span>
      </div>
      
      <div className="cat-info">
        <h3 className="cat-name">{cat.name}</h3>
        
        {cat.breed && (
          <p className="cat-breed">{cat.breed}</p>
        )}
        
        <p className="cat-meta">
          {isOwned 
            ? (cat.birthDate ? calculateAge(cat.birthDate) : 'Age unknown')
            : `Expected: ${cat.expectedDate ?? 'TBD'}`
          }
        </p>
        
        {cat.personality && (
          <p className="cat-personality-preview">
            {cat.personality.substring(0, 80)}
            {cat.personality.length > 80 ? '...' : ''}
          </p>
        )}
        
        <span className="view-details">View Details →</span>
      </div>
    </article>
  );
}
