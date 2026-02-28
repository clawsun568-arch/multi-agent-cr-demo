import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoGrid } from '../../components/PhotoGrid';
import type { Photo } from '../../data/types';

const photos: Photo[] = [
  { url: 'https://example.com/1.jpg', caption: 'Cat one' },
  { url: 'https://example.com/2.jpg', caption: 'Cat two' },
  { url: 'https://example.com/3.jpg' },
];

describe('PhotoGrid', () => {
  it('renders all photos as clickable items', () => {
    render(<PhotoGrid photos={photos} onPhotoClick={vi.fn()} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/1.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Cat one');
  });

  it('renders captions when present', () => {
    render(<PhotoGrid photos={photos} onPhotoClick={vi.fn()} />);

    expect(screen.getByText('Cat one')).toBeInTheDocument();
    expect(screen.getByText('Cat two')).toBeInTheDocument();
  });

  it('uses fallback alt text for photos without captions', () => {
    render(<PhotoGrid photos={photos} onPhotoClick={vi.fn()} />);

    const images = screen.getAllByRole('img');
    expect(images[2]).toHaveAttribute('alt', 'Gallery photo 3');
  });

  it('calls onPhotoClick with correct index when photo is clicked', () => {
    const onPhotoClick = vi.fn();
    render(<PhotoGrid photos={photos} onPhotoClick={onPhotoClick} />);

    fireEvent.click(screen.getByLabelText('Cat two'));
    expect(onPhotoClick).toHaveBeenCalledWith(1);
  });

  it('shows empty message when no photos provided', () => {
    render(<PhotoGrid photos={[]} onPhotoClick={vi.fn()} />);

    expect(screen.getByText(/No photos in the gallery yet/)).toBeInTheDocument();
  });

  it('has role="list" on container and role="listitem" on items', () => {
    render(<PhotoGrid photos={photos} onPhotoClick={vi.fn()} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});
