import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCatData } from '../hooks/useCatData';
import { calculateAge } from '../utils/ageCalculator';

/**
 * CatProfilePage — Detailed view for an individual cat.
 *
 * This component is rendered at the route /our-cats/:id.
 *
 * HOW IT GETS THE CAT DATA:
 * 1. useParams() reads the ":id" part from the URL.
 *    For example, if the URL is "/our-cats/cat_001", then id = "cat_001".
 * 2. useCatData() fetches the full list of cats from cat-data.json.
 * 3. We find the matching cat with cats.find(c => c.id === id).
 * 4. If no cat matches, we show a "not found" message.
 *
 * PREVIOUS DESIGN (before React Router):
 * This component used to receive `cat` and `onBack` as props from App.tsx.
 * Now it manages its own data fetching and uses a <Link> for navigation
 * instead of an onBack callback.
 *
 * Shows:
 * - Large hero photo with status badge
 * - Basic info (name, breed, gender, age)
 * - Personality description
 * - Photo gallery (if available)
 * - Parent lineage (if applicable)
 * - Contact CTA for planned cats
 */
export function CatProfilePage() {
  // Read the cat ID from the URL parameter (e.g., "/our-cats/cat_001" → id = "cat_001")
  const { id } = useParams<{ id: string }>();

  // Fetch all cat data
  const { cats, loading, error } = useCatData();

  // Track whether the hero image failed to load (shows placeholder instead)
  const [imageError, setImageError] = useState(false);

  // Show loading state while data is being fetched
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Show error state if the fetch failed
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Find the cat that matches the URL parameter
  const cat = cats.find(c => c.id === id);

  // If no cat matches the ID, show a friendly "not found" page
  if (!cat) {
    return (
      <div className="stub-page">
        <h1>Cat Not Found</h1>
        <p>Sorry, we couldn't find a cat with that ID.</p>
        <Link to="/" className="back-button">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const isOwned = cat.status === 'owned';
  const age = isOwned && cat.birthDate ? calculateAge(cat.birthDate) : null;
  const hasValidPhoto = Boolean(cat.photoUrl);

  // Handle contact button click — opens the user's email client
  const handleContactClick = () => {
    const subject = encodeURIComponent(`Interest in ${cat.name}`);
    window.location.href = `mailto:contact@example.com?subject=${subject}`;
  };

  // Build descriptive alt text for the hero image
  const altParts = [cat.name, cat.breed, cat.gender].filter(Boolean);

  return (
    <article className="cat-profile">
      {/* Back button — uses <Link> to navigate back via React Router
          instead of the old onBack callback */}
      <Link
        to="/"
        className="back-button"
        aria-label="Go back to cat list"
      >
        &larr; Back to Cats
      </Link>

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
                : 'This kitten is coming soon. Contact us for updates.'}
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
}
