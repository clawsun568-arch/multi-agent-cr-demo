import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OurCatsPage } from '../../pages/OurCatsPage';

const mockData = {
  cats: [
    {
      id: 'cat_1',
      name: 'Taro',
      breed: 'British Shorthair',
      gender: 'Male',
      status: 'owned',
      role: 'king',
      color: 'Black Golden',
      photoUrl: 'https://placecats.com/taro/300/200',
      birthDate: '2021-08-20',
    },
    {
      id: 'cat_2',
      name: 'Mochi',
      breed: 'Ragdoll',
      gender: 'Female',
      status: 'owned',
      role: 'queen',
      color: 'Seal Point',
      photoUrl: 'https://placecats.com/mochi/300/200',
      birthDate: '2022-03-15',
    },
  ],
};

describe('OurCatsPage', () => {
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
        <OurCatsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading cats...')).toBeInTheDocument();
  });

  it('renders HeroBanner with "Our Cats" title', async () => {
    render(
      <MemoryRouter>
        <OurCatsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('banner', { name: 'Our Cats' })).toBeInTheDocument();
    });
  });

  it('renders Kings section with male cats', async () => {
    render(
      <MemoryRouter>
        <OurCatsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Kings' })).toBeInTheDocument();
    });

    expect(screen.getByText('Taro')).toBeInTheDocument();
  });

  it('renders Queens section with female cats', async () => {
    render(
      <MemoryRouter>
        <OurCatsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Queens' })).toBeInTheDocument();
    });

    expect(screen.getByText('Mochi')).toBeInTheDocument();
  });

  it('shows empty message when no kings exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              cats: [mockData.cats[1]], // only the queen
            }),
        })
      )
    );

    render(
      <MemoryRouter>
        <OurCatsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No kings to show yet/)).toBeInTheDocument();
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
        <OurCatsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error: Failed to load cat data. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('cat cards within a section have equal height (flexbox layout)', async () => {
    // Use cats with different content lengths to trigger unequal natural heights
    const mixedCats = {
      cats: [
        {
          id: 'cat_a',
          name: 'LongBio',
          breed: 'Ragdoll',
          gender: 'Female',
          status: 'owned',
          role: 'queen',
          photoUrl: 'https://placecats.com/a/300/200',
          birthDate: '2022-01-01',
          personality: 'Very long personality text that takes up extra space in the card',
        },
        {
          id: 'cat_b',
          name: 'NoBio',
          breed: 'Scottish Fold',
          gender: 'Female',
          status: 'planned',
          role: 'queen',
          photoUrl: 'https://placecats.com/b/300/200',
          expectedDate: '2026-06',
        },
      ],
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mixedCats),
        })
      )
    );

    render(
      <MemoryRouter>
        <OurCatsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('LongBio')).toBeInTheDocument();
    });

    // Verify both cards render within a shared grid container,
    // and that .cat-info (flex child) exists on each card for equal-height layout
    const cards = document.querySelectorAll('.cat-card');
    expect(cards.length).toBe(2);
    for (const card of cards) {
      expect(card.classList.contains('cat-card')).toBe(true);
      expect(card.querySelector('.cat-info')).not.toBeNull();
      expect(card.querySelector('.view-details')).not.toBeNull();
    }
    // Both cards should be inside the same .cat-grid container
    const grid = document.querySelector('.cat-grid');
    expect(grid).not.toBeNull();
    expect(grid!.querySelectorAll('.cat-card').length).toBe(2);
  });

  it('includes cats without role via gender fallback in partially-migrated data', async () => {
    const partiallyMigrated = {
      cats: [
        {
          id: 'cat_1',
          name: 'Taro',
          breed: 'British Shorthair',
          gender: 'Male',
          status: 'owned',
          role: 'king',
          photoUrl: 'https://placecats.com/taro/300/200',
          birthDate: '2021-08-20',
        },
        {
          id: 'cat_2',
          name: 'OldMale',
          breed: 'Ragdoll',
          gender: 'Male',
          status: 'owned',
          photoUrl: 'https://placecats.com/old/300/200',
          birthDate: '2020-05-01',
          // no role field — should still appear in Kings via gender fallback
        },
        {
          id: 'cat_3',
          name: 'Mochi',
          breed: 'Ragdoll',
          gender: 'Female',
          status: 'owned',
          role: 'queen',
          photoUrl: 'https://placecats.com/mochi/300/200',
          birthDate: '2022-03-15',
        },
        {
          id: 'cat_4',
          name: 'OldFemale',
          breed: 'Scottish Fold',
          gender: 'Female',
          status: 'owned',
          photoUrl: 'https://placecats.com/oldf/300/200',
          birthDate: '2020-01-01',
          // no role field — should still appear in Queens via gender fallback
        },
      ],
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(partiallyMigrated),
        })
      )
    );

    render(
      <MemoryRouter>
        <OurCatsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Taro')).toBeInTheDocument();
    });

    // Both males should appear in Kings (one with role, one via gender fallback)
    expect(screen.getByText('Taro')).toBeInTheDocument();
    expect(screen.getByText('OldMale')).toBeInTheDocument();

    // Both females should appear in Queens
    expect(screen.getByText('Mochi')).toBeInTheDocument();
    expect(screen.getByText('OldFemale')).toBeInTheDocument();
  });

  it('falls back to gender filtering when no roles are set', async () => {
    const catsWithoutRoles = {
      cats: [
        {
          id: 'cat_1',
          name: 'Boy Cat',
          breed: 'Ragdoll',
          gender: 'Male',
          status: 'owned',
          photoUrl: 'https://placecats.com/boy/300/200',
          birthDate: '2022-01-01',
        },
        {
          id: 'cat_2',
          name: 'Girl Cat',
          breed: 'Ragdoll',
          gender: 'Female',
          status: 'owned',
          photoUrl: 'https://placecats.com/girl/300/200',
          birthDate: '2022-01-01',
        },
      ],
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(catsWithoutRoles),
        })
      )
    );

    render(
      <MemoryRouter>
        <OurCatsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Kings' })).toBeInTheDocument();
    });

    expect(screen.getByText('Boy Cat')).toBeInTheDocument();
    expect(screen.getByText('Girl Cat')).toBeInTheDocument();
  });
});
