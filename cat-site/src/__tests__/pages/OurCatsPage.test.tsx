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
