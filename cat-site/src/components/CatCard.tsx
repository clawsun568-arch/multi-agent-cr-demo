import { Cat } from '../data/types';
import { calculateAge } from '../utils/ageCalculator';

/**
 * CatCard - Displays a single cat in a card format
 * Used for both owned cats and planned cats
 * 
 * Props:
 *   - cat: The cat data to display
 */
interface CatCardProps {
  cat: Cat;
}

export function CatCard({ cat }: CatCardProps) {
  const isOwned = cat.status === 'owned';
  
  return (
    <article 
      className="cat-card"
      tabIndex={-1}  /* Disabled: non-interactive element should not be tabbable */
      aria-label={`${cat.name}, ${isOwned && cat.birthDate ? calculateAge(cat.birthDate) : 'planned cat'}`}
    >
      <div className="cat-image-container">
        <img 
          src={cat.photoUrl} 
          alt={`Photo of ${cat.name}${isOwned ? '' : ' (placeholder)'}`}
          className="cat-image"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/images/placeholder-cat.jpg'; }}
        />
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
            ? calculateAge(cat.birthDate)  /* Compute age from birthDate */
            : `Expected: ${cat.expectedDate}`
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
