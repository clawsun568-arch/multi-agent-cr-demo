import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AvailableKittensPage } from '../../pages/AvailableKittensPage';

const mockDataWithKittens = {
  cats: [
    {
      id: 'kit_1',
      name: 'Pomelo',
      breed: 'British Longhair',
      gender: 'Female',
      status: 'owned',
      role: 'kitten',
      color: 'Black Golden Longhair',
      available: true,
      photoUrl: '/images/pomelo.jpg',
      birthDate: '2025-12-01',
      personality: 'Very smart and cuddly',
      gallery: [
        { url: '/images/pomelo-2.jpg', caption: 'Playing' },
      ],
    },
    {
      id: 'kit_2',
      name: 'Mikan',
      breed: 'British Shorthair',
      gender: 'Female',
      status: 'owned',
      role: 'kitten',
      color: 'Black Golden Shorthair',
      available: false,
      photoUrl: '/images/mikan.jpg',
      birthDate: '2025-10-15',
      personality: 'Gentle and sweet',
    },
    {
      id: 'machi',
      name: 'Machi',
      breed: 'British Shorthair',
      gender: 'Male',
      status: 'owned',
      role: 'king',
      photoUrl: '/images/machi-1.jpg',
      birthDate: '2023-01-01',
    },
  ],
};

const mockDataNoKittens = {
  cats: [
    {
      id: 'machi',
      name: 'Machi',
      breed: 'British Shorthair',
      gender: 'Male',
      status: 'owned',
      role: 'king',
      photoUrl: '/images/machi-1.jpg',
      birthDate: '2023-01-01',
    },
    {
      id: 'matcha',
      name: 'Matcha',
      breed: 'British Shorthair',
      gender: 'Female',
      status: 'owned',
      role: 'queen',
      photoUrl: '/images/matcha-1.jpg',
      birthDate: '2023-06-01',
    },
  ],
};

describe('AvailableKittensPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDataWithKittens),
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
        <AvailableKittensPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading kittens...')).toBeInTheDocument();
  });

  it('renders HeroBanner with "Available Kittens" title', async () => {
    render(
      <MemoryRouter>
        <AvailableKittensPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('banner', { name: 'Available Kittens' })).toBeInTheDocument();
    });
  });

  it('shows only kittens, not kings or queens', async () => {
    render(
      <MemoryRouter>
        <AvailableKittensPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pomelo')).toBeInTheDocument();
    });

    expect(screen.getByText('Mikan')).toBeInTheDocument();
    // Machi is a king, should not appear
    expect(screen.queryByText('Machi')).not.toBeInTheDocument();
  });

  it('shows Available and Sold badges correctly', async () => {
    render(
      <MemoryRouter>
        <AvailableKittensPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pomelo')).toBeInTheDocument();
    });

    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Sold')).toBeInTheDocument();
  });

  it('shows empty message when no kittens exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDataNoKittens),
        })
      )
    );

    render(
      <MemoryRouter>
        <AvailableKittensPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No kittens available/)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ ok: false, status: 500 })
      )
    );

    render(
      <MemoryRouter>
        <AvailableKittensPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error: Failed to load cat data. Please try again.')
      ).toBeInTheDocument();
    });
  });
});
