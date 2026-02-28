import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GalleryPage } from '../../pages/GalleryPage';

const mockGalleryImages = [
  { url: 'https://example.com/g1.jpg', caption: 'Taro relaxing' },
  { url: 'https://example.com/g2.jpg', caption: 'Mochi playing' },
  { url: 'https://example.com/g3.jpg' },
];

const mockData = {
  siteConfig: {
    catteryName: 'Test Cattery',
    tagline: 'Test tagline',
    introText: 'Test intro',
    heroImages: [],
    galleryImages: mockGalleryImages,
  },
  cats: [],
};

function renderGalleryPage() {
  return render(
    <MemoryRouter>
      <GalleryPage />
    </MemoryRouter>
  );
}

describe('GalleryPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    // Never resolve the fetch
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));

    renderGalleryPage();
    expect(screen.getByText('Loading gallery...')).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    renderGalleryPage();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('renders HeroBanner with "Gallery" title after loading', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderGalleryPage();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument();
    });
  });

  it('renders all gallery photos in a grid', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderGalleryPage();

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      // HeroBanner doesn't render an img element (uses background-image), so all are grid images
      expect(images).toHaveLength(3);
    });
  });

  it('opens lightbox when a photo is clicked', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderGalleryPage();

    await waitFor(() => {
      expect(screen.getByLabelText('Taro relaxing')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Taro relaxing'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('navigates through lightbox with prev/next buttons', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderGalleryPage();

    await waitFor(() => {
      expect(screen.getByLabelText('Taro relaxing')).toBeInTheDocument();
    });

    // Open lightbox on first photo
    fireEvent.click(screen.getByLabelText('Taro relaxing'));
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    // Go to next
    fireEvent.click(screen.getByLabelText('Next image'));
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    // Go to prev
    fireEvent.click(screen.getByLabelText('Previous image'));
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('closes lightbox when close button is clicked', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderGalleryPage();

    await waitFor(() => {
      expect(screen.getByLabelText('Taro relaxing')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Taro relaxing'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close lightbox'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows empty message when no gallery images', async () => {
    const dataNoGallery = {
      ...mockData,
      siteConfig: { ...mockData.siteConfig, galleryImages: [] },
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(dataNoGallery),
    } as Response);

    renderGalleryPage();

    await waitFor(() => {
      expect(screen.getByText(/No photos in the gallery yet/)).toBeInTheDocument();
    });
  });
});
