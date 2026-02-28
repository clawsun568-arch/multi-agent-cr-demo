import { useEffect } from 'react';

/**
 * usePageTitle — Sets the browser tab title for the current page.
 *
 * Appends "| My Cattery" suffix to the page name, or just shows
 * "My Cattery" for the home page.
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | My Cattery` : 'My Cattery';
  }, [title]);
}
