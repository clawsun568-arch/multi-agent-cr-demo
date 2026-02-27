/**
 * Tests for the useCatData custom hook.
 *
 * useCatData is a React hook that fetches cat data from /cat-data.json
 * and returns { cats, loading, error }.
 *
 * We test:
 * - Returns loading=true initially, then cats after fetch resolves
 * - Returns error message when fetch fails
 * - Returns error on timeout (via AbortController)
 *
 * KEY TESTING PATTERN: renderHook
 * Hooks can't be called outside of React components. The renderHook()
 * utility from @testing-library/react creates a tiny wrapper component
 * that calls the hook, so we can test it in isolation.
 *
 * We mock fetch() to control what data the hook receives, just like
 * in the HomePage tests.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCatData } from '../../hooks/useCatData';

// Test data matching the shape of cat-data.json
const mockCats = {
  cats: [
    {
      id: 'cat_1',
      name: 'Mochi',
      breed: 'Ragdoll',
      gender: 'Female',
      status: 'owned',
      photoUrl: 'https://example.com/mochi.jpg',
      birthDate: '2022-01-01',
    },
  ],
};

describe('useCatData', () => {
  beforeEach(() => {
    // Default mock: successful fetch
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCats),
        })
      )
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with loading=true and empty cats', () => {
    const { result } = renderHook(() => useCatData());

    // On the initial render, before fetch resolves
    expect(result.current.loading).toBe(true);
    expect(result.current.cats).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns cat data after successful fetch', async () => {
    const { result } = renderHook(() => useCatData());

    // Wait for the fetch to resolve and the hook to update
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cats).toHaveLength(1);
    expect(result.current.cats[0].name).toBe('Mochi');
    expect(result.current.error).toBeNull();
  });

  it('returns error message when fetch fails', async () => {
    // Override mock to simulate a failed HTTP response
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      )
    );

    const { result } = renderHook(() => useCatData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(
      'Failed to load cat data. Please try again.'
    );
    expect(result.current.cats).toEqual([]);
  });

  it('returns error when data format is invalid', async () => {
    // Override mock to return data without the expected "cats" array
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ animals: [] }), // wrong shape
        })
      )
    );

    const { result } = renderHook(() => useCatData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(
      'Failed to load cat data. Please try again.'
    );
  });
});
