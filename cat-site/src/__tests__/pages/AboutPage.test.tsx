import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from '../../pages/AboutPage';

const mockData = {
  siteConfig: {
    catteryName: 'Test Cattery',
    tagline: 'Test tagline',
    introText: 'Test intro',
    heroImages: [],
    about: {
      philosophy: 'We believe in raising happy cats.',
      breeds: [
        {
          breedName: 'British Shorthair',
          description: 'A calm and friendly breed.',
          traits: ['Calm temperament', 'Great with kids'],
          photoUrl: 'https://example.com/bsh.jpg',
        },
        {
          breedName: 'Ragdoll',
          description: 'A gentle and docile breed.',
          traits: ['Very affectionate', 'Blue eyes'],
          photoUrl: 'https://example.com/ragdoll.jpg',
        },
      ],
    },
  },
  cats: [],
};

function renderAboutPage() {
  return render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>
  );
}

describe('AboutPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    renderAboutPage();
    expect(screen.getByText('Loading about info...')).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('fail'));
    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('renders HeroBanner with "About Us" title', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'About Us' })).toBeInTheDocument();
    });
  });

  it('displays philosophy section', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText('Our Philosophy')).toBeInTheDocument();
      expect(screen.getByText('We believe in raising happy cats.')).toBeInTheDocument();
    });
  });

  it('displays breed cards with names and descriptions', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'British Shorthair' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Ragdoll' })).toBeInTheDocument();
      expect(screen.getByText('A calm and friendly breed.')).toBeInTheDocument();
      expect(screen.getByText('A gentle and docile breed.')).toBeInTheDocument();
    });
  });

  it('displays breed traits as list items', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText('Calm temperament')).toBeInTheDocument();
      expect(screen.getByText('Great with kids')).toBeInTheDocument();
      expect(screen.getByText('Very affectionate')).toBeInTheDocument();
      expect(screen.getByText('Blue eyes')).toBeInTheDocument();
    });
  });

  it('renders breed photos', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderAboutPage();
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/bsh.jpg');
      expect(images[0]).toHaveAttribute('alt', 'British Shorthair');
    });
  });

  it('shows empty message when no about data', async () => {
    const dataNoAbout = {
      siteConfig: {
        catteryName: 'Test',
        tagline: 'Test',
        introText: 'Test',
        heroImages: [],
      },
      cats: [],
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(dataNoAbout),
    } as Response);

    renderAboutPage();
    await waitFor(() => {
      expect(screen.getByText(/About information coming soon/)).toBeInTheDocument();
    });
  });
});
