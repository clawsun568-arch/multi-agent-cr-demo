import { Link } from 'react-router-dom';

/**
 * Footer — Shown at the bottom of every page.
 *
 * CONTAINS:
 * - Quick links to all main pages (mirrors the NavBar links)
 * - Placeholder for social media icons (will be added in PR 6)
 * - Copyright notice with dynamically computed year
 * - "Built with" credit line
 *
 * This is a "presentational" component — it has no state and no data
 * fetching. It just renders static content and navigation links.
 *
 * ACCESSIBILITY:
 * - <footer> has role="contentinfo" (the default landmark role for footer)
 * - The quick links section is wrapped in a <nav> with aria-label
 */
export function Footer() {
  // Compute the current year dynamically so the copyright stays up to date.
  const currentYear = new Date().getFullYear();

  // Same pages as NavBar — keeps navigation consistent site-wide.
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/our-cats', label: 'Our Cats' },
    { to: '/kittens', label: 'Kittens' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="site-footer" role="contentinfo">
      {/* Quick links section — duplicates NavBar for convenience */}
      <nav className="footer-links" aria-label="Footer navigation">
        <ul>
          {quickLinks.map(link => (
            <li key={link.to}>
              <Link to={link.to} className="footer-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Social media placeholder — SocialIcons component will go here in PR 6 */}
      <div className="footer-social">
        <p>Follow us on social media</p>
      </div>

      {/* Copyright notice */}
      <p className="footer-copyright">
        &copy; {currentYear} My Cattery. All rights reserved.
      </p>
      <p className="footer-built-with">
        Built with React + TypeScript + Vite
      </p>
    </footer>
  );
}
