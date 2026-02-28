interface IntroSectionProps {
  catteryName: string;
  tagline: string;
  introText: string;
}

/**
 * IntroSection — Cattery introduction displayed below the hero carousel.
 *
 * Renders the cattery name as a heading, the tagline as a subtitle,
 * and a paragraph of introductory text. Centered layout with warm styling.
 */
export function IntroSection({ catteryName, tagline, introText }: IntroSectionProps) {
  return (
    <section className="intro-section">
      <h1 className="intro-name">{catteryName}</h1>
      <p className="intro-tagline">{tagline}</p>
      <p className="intro-text">{introText}</p>
    </section>
  );
}
