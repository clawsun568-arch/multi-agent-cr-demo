import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — Scrolls the window to the top when the route changes.
 *
 * Without this, navigating between pages preserves the scroll position,
 * which means clicking a link in the footer takes you to the new page
 * but scrolled to the bottom.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
