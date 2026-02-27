/**
 * Tests for the HomePage component.
 *
 * HomePage fetches cat data via useCatData(), splits cats into
 * "owned" and "planned" groups, and renders them in CatSection
 * components. Clicking a cat card navigates to /our-cats/:id.
 *
 * We test:
 * - Shows loading state while data is being fetched
 * - Renders cat sections after data loads
 * - Shows error message when fetch fails
 *
 * KEY TESTING PATTERN: Mocking fetch()
 * HomePage calls useCatData(), which calls fetch('/cat-data.json').
 * In tests, we mock `fetch` using vi.stubGlobal() to return fake data
 * without making real HTTP requests. This makes tests fast, reliable,
 * and independent of the actual cat-data.json file.
 *
 * We also need to wrap in MemoryRouter because HomePage uses
 * useNavigate() from React Router.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';

// Test cat data that our mock fetch will return
const mockCatData = {
  cats: [
    {
      id: 'cat_1',
      name: 'Mochi',
      breed: 'Ragdoll',
      gender: 'Female',
      status: 'owned',
      photoUrl: 'https://placecats.com/mochi/300/200',
      birthDate: '2022-01-01',
    },
    {
      id: 'cat_2',
      name: 'Sakura',
      breed: 'Ragdoll',
      gender: 'Female',
      status: 'planned',
      photoUrl: 'https://placecats.com/sakura/300/200',
      expectedDate: '2026-06',
    },
  ],
};

describe('HomePage', () => {
  beforeEach(() => {
    // Mock fetch to return our test data.
    // vi.stubGlobal replaces the global `fetch` function with our mock.
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCatData),
        })
      )
    );
  });

  afterEach(() => {
    // Restore the original fetch after each test
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // The loading message should appear before data loads
    expect(screen.getByText('Loading cats...')).toBeInTheDocument();
  });

  it('renders cat sections after data loads', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // waitFor retries the assertion until it passes (or times out).
    // This is needed because the data fetching is asynchronous —
    // the component starts in a loading state and re-renders once
    // the mock fetch resolves.
    await waitFor(() => {
      // Section headings should appear
      expect(
        screen.getByRole('heading', { name: 'Our Cats' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Future Cats' })
      ).toBeInTheDocument();
    });

    // Cat names should appear in their respective sections
    expect(screen.getByText('Mochi')).toBeInTheDocument();
    expect(screen.getByText('Sakura')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    // Override the mock to simulate a failed fetch
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      )
    );

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error: Failed to load cat data. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('renders the welcome header', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Welcome to My Cattery' })
      ).toBeInTheDocument();
    });
  });
});
