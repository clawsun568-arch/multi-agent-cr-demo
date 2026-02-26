import { Cat } from '../data/types';
import { CatCard } from './CatCard';

/**
 * CatSection - Groups cats by status (owned vs planned)
 * 
 * Props:
 *   - title: Section heading (e.g., "Our Cats")
 *   - cats: Array of cats to display
 *   - emptyMessage: What to show when no cats in this section
 */
interface CatSectionProps {
  title: string;
  cats: Cat[];
  emptyMessage: string;
}

export function CatSection({ title, cats, emptyMessage }: CatSectionProps) {
  return (
    <section className="cat-section" aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`}>
      <h2 id={`${title.toLowerCase().replace(/\s+/g, '-')}-heading`} className="section-title">
        {title}
      </h2>
      
      {cats.length === 0 ? (
        /* Show message when no cats in this category */
        <p className="empty-message">{emptyMessage}</p>
      ) : (
        /* Grid layout for cat cards - responsive (1 column mobile, 2+ desktop) */
        <div className="cat-grid" role="list">
          {cats.map(cat => (
            <div key={cat.id} role="listitem">
              <CatCard cat={cat} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
