import { useState } from 'react';
import { Cat } from '../data/types';
import { calculateAge } from '../utils/ageCalculator';

interface CatProfilePageProps {
  cat: Cat;
  onBack: () => void;
}

/**
 * CatProfilePage - Detailed view for individual cat
 * Shows full information about a cat including:
 * - Large hero photo
 * - Basic info (name, breed, gender, age)
 * - Personality description
 * - Photo gallery
 * - Status (owned/planned)
 * - Parent lineage (if applicable)
 */
export const CatProfilePage = ({ cat, onBack }: CatProfilePageProps) => {
  const isOwned = cat.status === 'owned';
  const [imageError, setImageError] = useState(false);
  const age = isOwned && cat.birthDate
    ? calculateAge(cat.birthDate)
    : null;

  const hasValidPhoto = cat.photoUrl && cat.photoUrl.startsWith('http');

  // Handle contact button click
  const handleContactClick = () => {
    window.location.href = 'mailto:contact@example.com?subject=Interest in ' + cat.name;
  };

  // Build alt text without undefined fields
  const altParts = [cat.name, cat.breed, cat.gender].filter(Boolean);

  return (
    <article className="cat-profile">
      {/* Back button */}
      <button
        onClick={onBack}
        className="back-button"
        aria-label="Go back to cat list"
        type="button"
      >
        ← Back to Cats
      </button>

      {/* Hero Section with large photo */}
      <header className="cat-profile-hero">
        <div className={`hero-image-container ${imageError || !hasValidPhoto ? 'no-image' : ''}`}>
          {!imageError && hasValidPhoto ? (
            <img
              src={cat.photoUrl}
              alt={altParts.join(', ')}
              className="hero-image"
              loading="eager"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="image-placeholder hero-placeholder">
              <span>🐱</span>
            </div>
          )}
          <span className={`status-badge ${cat.status}`}>
            {isOwned ? 'Owned' : 'Coming Soon'}
          </span>
        </div>
      </header>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Basic Info */}
        <section className="profile-header">
          <h1 className="cat-name">{cat.name}</h1>
          <p className="cat-breed">{cat.breed}</p>

          <div className="cat-meta">
            {cat.gender && (
              <span className="meta-item">
                <strong>Gender:</strong> {cat.gender}
              </span>
            )}
            {age && (
              <span className="meta-item">
                <strong>Age:</strong> {age}
              </span>
            )}
            {!isOwned && cat.expectedDate && (
              <span className="meta-item expected">
                <strong>Expected:</strong> {cat.expectedDate}
              </span>
            )}
          </div>
        </section>

        {/* Personality Section */}
        {cat.personality && (
          <section className="profile-section">
            <h2>Personality</h2>
            <p className="personality-text">{cat.personality}</p>
          </section>
        )}

        {/* Photo Gallery */}
        {cat.gallery && cat.gallery.length > 0 && (
          <section className="profile-section">
            <h2>Photo Gallery</h2>
            <div className="photo-gallery">
              {cat.gallery.map((photo) => (
                <div key={photo.url} className="gallery-item">
                  <img
                    src={photo.url}
                    alt={photo.caption || `${cat.name} photo`}
                    loading="lazy"
                  />
                  {photo.caption && (
                    <span className="photo-caption">{photo.caption}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Parent Information (if available) */}
        {(cat.father || cat.mother) && (
          <section className="profile-section">
            <h2>Parents</h2>
            <div className="parents-info">
              {cat.father && (
                <div className="parent-card">
                  <strong>Father:</strong> {cat.father}
                </div>
              )}
              {cat.mother && (
                <div className="parent-card">
                  <strong>Mother:</strong> {cat.mother}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact CTA for planned cats */}
        {!isOwned && (
          <section className="profile-section cta-section">
            <h2>Interested in {cat.name}?</h2>
            <p>
              {cat.expectedDate 
                ? `This kitten is expected to arrive around ${cat.expectedDate}.`
                : 'This kitten is coming soon. Contact us for updates.'
              }
            </p>
            <button 
              className="contact-button"
              onClick={handleContactClick}
              type="button"
            >
              Contact Us for Updates
            </button>
          </section>
        )}
      </div>
    </article>
  );
};
