/**
 * useCatData — Custom hook that fetches cat data and site config from the JSON file.
 *
 * Returns { cats, siteConfig, loading, error }.
 *
 * HOW IT WORKS:
 * 1. On first render, it starts fetching `/cat-data.json`.
 * 2. While fetching, `loading` is true, `cats` is empty, `siteConfig` is null.
 * 3. When the fetch completes, both are populated and `loading` becomes false.
 * 4. If the fetch fails or times out (10 seconds), `error` is set.
 *
 * CLEANUP:
 * If the component using this hook unmounts before the fetch finishes,
 * we cancel the request using AbortController.
 */
import { useState, useEffect } from 'react';
import type { Cat, SiteConfig } from '../data/types';

export function useCatData() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    fetch('/cat-data.json', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load cat data');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data.cats)) {
          throw new Error('Invalid data format');
        }
        clearTimeout(timeout);
        if (!cancelled) {
          setCats(data.cats);
          setSiteConfig(data.siteConfig ?? null);
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

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return { cats, siteConfig, loading, error };
}
