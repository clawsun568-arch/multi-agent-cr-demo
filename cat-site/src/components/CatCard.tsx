import { useState } from 'react';
import { Cat, isValidPhotoUrl } from '../data/types';
import { calculateAge } from '../utils/ageCalculator';

interface CatCardProps {
  cat: Cat;
}

export function CatCard({ cat }: CatCardProps) {
  const isOwned = cat.status === 'owned';
  const [imageError, setImageError] = useState(false);
  
  return (
    <article 
      className="cat-card"
      aria-label={`${cat.name}, ${isOwned ? (cat.birthDate ? calculateAge(cat.birthDate) : 'age unknown') : 'planned cat'}`}
    >
      <div className={`cat-image-container ${imageError || !isValidPhotoUrl(cat.photoUrl) ? 'no-image' : ''}`}>
        {!imageError && isValidPhotoUrl(cat.photoUrl) && (
          <img 
            src={cat.photoUrl} 
            alt={`Photo of ${cat.name}${isOwned ? '' : ' (placeholder)'}`}
            className="cat-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
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
        
        <p className="cat-age">
          {isOwned && cat.birthDate 
            ? calculateAge(cat.birthDate)
            : `Expected: ${cat.expectedDate ?? 'Unknown'}`
          }
        </p>
        
        {cat.personality && (
          <p className="cat-personality">{cat.personality}</p>
        )}
        
        {cat.notes && (
          <p className="cat-notes">{cat.notes}</p>
        )}
      </div>
    </article>
  );
}
