/**
 * useCatData — Custom hook that fetches cat data from the JSON file.
 *
 * WHY A CUSTOM HOOK?
 * In the old App.tsx, data fetching was mixed in with routing and rendering
 * logic — all in one big component. By extracting the fetch into a hook,
 * any page that needs cat data can simply call `useCatData()`. Pages that
 * don't need cat data (like AboutPage or ContactPage) just skip it.
 *
 * HOW IT WORKS:
 * 1. On first render, it starts fetching `/cat-data.json`.
 * 2. While fetching, `loading` is true and `cats` is an empty array.
 * 3. When the fetch completes, `cats` is populated and `loading` becomes false.
 * 4. If the fetch fails or times out (10 seconds), `error` is set.
 *
 * CLEANUP:
 * If the component using this hook unmounts before the fetch finishes
 * (e.g., the user navigates away), we cancel the request using
 * AbortController. This prevents "state update on unmounted component"
 * warnings.
 *
 * USAGE:
 *   const { cats, loading, error } = useCatData();
 */
import { useState, useEffect } from 'react';
import type { Cat } from '../data/types';

export function useCatData() {
  // cats: the array of Cat objects (empty while loading)
  const [cats, setCats] = useState<Cat[]>([]);
  // loading: true while the fetch is in progress
  const [loading, setLoading] = useState(true);
  // error: error message string, or null if no error
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track whether this effect has been cleaned up.
    // If `cancelled` becomes true, we skip state updates to avoid
    // updating a component that has already unmounted.
    let cancelled = false;

    // AbortController lets us cancel the fetch request if the component
    // unmounts or if the request takes too long (timeout).
    const controller = new AbortController();

    // Abort the fetch if it takes longer than 10 seconds
    const timeout = setTimeout(() => controller.abort(), 10_000);

    fetch('/cat-data.json', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load cat data');
        return res.json();
      })
      .then(data => {
        // Validate that the JSON has the expected shape: { cats: [...] }
        if (!Array.isArray(data.cats)) {
          throw new Error('Invalid data format');
        }
        clearTimeout(timeout);
        if (!cancelled) {
          setCats(data.cats);
          setLoading(false);
        }
      })
      .catch(err => {
        clearTimeout(timeout);
        if (cancelled) return;
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError('Failed to load cat data. Please try again.');
        }
        setLoading(false);
      });

    // Cleanup function — runs when the component unmounts or when
    // the effect re-runs (though with [] deps, it only runs on unmount).
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []); // Empty dependency array = run once on mount

  return { cats, loading, error };
}
