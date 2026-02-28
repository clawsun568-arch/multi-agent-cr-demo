/**
 * Tests for the HomePage component (PR 2 — redesigned layout).
 *
 * HomePage now renders:
 * 1. HeroCarousel — image slideshow from siteConfig.heroImages
 * 2. IntroSection — cattery name, tagline, intro text
 * 3. FeaturedCats — grid of up to 3 cats with "View All" link
 *
 * We test:
 * - Shows loading state while data is being fetched
 * - Renders hero carousel, intro section, and featured cats after data loads
 * - Shows error message when fetch fails
 * - Handles missing siteConfig gracefully
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';

const mockData = {
  siteConfig: {
    catteryName: 'My Cattery',
    tagline: 'Raising beautiful cats with love',
    introText: 'Welcome to our wonderful cattery.',
    heroImages: [
      { url: 'https://placecats.com/bella/1200/500', alt: 'Cat one' },
      { url: 'https://placecats.com/millie/1200/500', alt: 'Cat two' },
    ],
  },
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
      breed: 'Scottish Fold',
      gender: 'Female',
      status: 'planned',
      photoUrl: 'https://placecats.com/sakura/300/200',
      expectedDate: '2026-06',
    },
  ],
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        })
      )
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading cats...')).toBeInTheDocument();
  });

  it('renders hero carousel after data loads', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Hero image carousel' })).toBeInTheDocument();
    });

    expect(screen.getByAltText('Cat one')).toBeInTheDocument();
    expect(screen.getByAltText('Cat two')).toBeInTheDocument();
  });

  it('renders intro section with cattery info', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'My Cattery' })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Raising beautiful cats with love')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our wonderful cattery.')).toBeInTheDocument();
  });

  it('renders featured cats section', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Meet Our Cats' })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Mochi')).toBeInTheDocument();
    expect(screen.getByText('Sakura')).toBeInTheDocument();
  });

  it('shows "View All Cats" link', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /View All Cats/i })).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
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

  it('renders featured cats even without siteConfig', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ cats: mockData.cats }),
        })
      )
    );

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Mochi')).toBeInTheDocument();
    });

    // Hero carousel should not be present without siteConfig
    expect(screen.queryByRole('region', { name: 'Hero image carousel' })).not.toBeInTheDocument();
  });
});
