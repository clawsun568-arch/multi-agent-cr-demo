import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * NavBar — Persistent navigation bar shown at the top of every page.
 *
 * FEATURES:
 * - Logo/cattery name on the left — links to the home page
 * - Navigation links to all 6 pages on the right
 * - Active page is visually highlighted based on the current URL
 * - On mobile (< 640px), links collapse into a hamburger menu
 *
 * REACT ROUTER CONCEPTS:
 * - <Link> renders an <a> tag that navigates WITHOUT a full page reload.
 *   Unlike a regular <a href="...">, clicking a Link only re-renders the
 *   parts of the page that change (the route content), not the entire page.
 *
 * - useLocation() returns an object with the current URL path. We use it
 *   to figure out which nav link should be highlighted as "active".
 *   For example, if the URL is "/about", the About link gets styled.
 *
 * ACCESSIBILITY:
 * - The <nav> element has aria-label="Main navigation"
 * - The hamburger button has aria-expanded (true/false) and aria-controls
 * - The active link has aria-current="page" to announce to screen readers
 */
export function NavBar() {
  // Track whether the mobile hamburger menu is open or closed.
  // On desktop, this state is ignored because the links are always visible.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useLocation gives us the current URL path (e.g., "/our-cats").
  // We use this to highlight the matching navigation link.
  const location = useLocation();

  // All navigation links in one array — makes it easy to add/remove pages.
  // Each object has a `to` (URL path) and `label` (display text).
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/our-cats', label: 'Our Cats' },
    { to: '/kittens', label: 'Kittens' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  /**
   * Check if a navigation link matches the current URL.
   *
   * Special case for "/" (Home): we use exact match (===) because
   * every URL starts with "/", and we don't want the Home link
   * highlighted on every page.
   *
   * For other links: we check if the URL matches exactly OR starts
   * with the path followed by "/". This way "/our-cats/cat_001"
   * highlights "Our Cats", but a hypothetical "/our-cats-special"
   * would NOT (because the character after "/our-cats" isn't "/").
   */
  function isActive(path: string): boolean {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  // When a nav link is clicked, close the mobile menu
  function handleLinkClick() {
    setIsMenuOpen(false);
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      {/* Logo / site name — always links to home page */}
      <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
        My Cattery
      </Link>

      {/* Hamburger button — only visible on mobile (hidden via CSS on desktop).
          Three <span> elements render the three horizontal lines. */}
      <button
        className="navbar-hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-controls="navbar-menu"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        type="button"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Navigation links list.
          On mobile, this is hidden by default and shown when isMenuOpen is true.
          The CSS class "navbar-links--open" makes it visible. */}
      <ul
        id="navbar-menu"
        className={`navbar-links${isMenuOpen ? ' navbar-links--open' : ''}`}
      >
        {navLinks.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`navbar-link${isActive(link.to) ? ' navbar-link--active' : ''}`}
              onClick={handleLinkClick}
              aria-current={isActive(link.to) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
