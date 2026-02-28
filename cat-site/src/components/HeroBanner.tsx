/**
 * HeroBanner — Full-width banner for interior pages.
 *
 * Displays a large banner with a background image (or gradient fallback),
 * a dark overlay for readability, and centered white title text.
 *
 * Used by OurCatsPage and later by About, Kittens, Gallery, Contact pages.
 */
interface HeroBannerProps {
  title: string;
  backgroundImage?: string;
}

export function HeroBanner({ title, backgroundImage }: HeroBannerProps) {
  const style: React.CSSProperties = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <div
      className={`hero-banner ${backgroundImage ? '' : 'hero-banner--gradient'}`}
      style={style}
      role="banner"
      aria-label={title}
    >
      <div className="hero-banner-overlay" />
      <h1 className="hero-banner-title">{title}</h1>
    </div>
  );
}
