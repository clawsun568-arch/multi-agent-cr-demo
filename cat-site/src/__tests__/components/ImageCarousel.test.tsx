import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageCarousel } from '../../components/ImageCarousel';

const photos = [
  { url: 'https://example.com/1.jpg', caption: 'Photo one' },
  { url: 'https://example.com/2.jpg', caption: 'Photo two' },
  { url: 'https://example.com/3.jpg', caption: 'Photo three' },
];

describe('ImageCarousel', () => {
  it('renders the first photo', () => {
    render(<ImageCarousel photos={photos} altPrefix="Pomelo" />);
    expect(screen.getByAltText('Photo one')).toBeInTheDocument();
  });

  it('renders nothing when photos is empty', () => {
    const { container } = render(<ImageCarousel photos={[]} altPrefix="Test" />);
    expect(container.innerHTML).toBe('');
  });

  it('shows next photo when next button is clicked', () => {
    render(<ImageCarousel photos={photos} altPrefix="Pomelo" />);
    fireEvent.click(screen.getByLabelText('Next photo'));
    expect(screen.getByAltText('Photo two')).toBeInTheDocument();
  });

  it('shows previous photo when prev button is clicked', () => {
    render(<ImageCarousel photos={photos} altPrefix="Pomelo" />);
    fireEvent.click(screen.getByLabelText('Previous photo'));
    // Wraps to last photo
    expect(screen.getByAltText('Photo three')).toBeInTheDocument();
  });

  it('wraps to first photo when clicking next on last', () => {
    render(<ImageCarousel photos={photos} altPrefix="Pomelo" />);
    fireEvent.click(screen.getByLabelText('Next photo'));
    fireEvent.click(screen.getByLabelText('Next photo'));
    fireEvent.click(screen.getByLabelText('Next photo'));
    expect(screen.getByAltText('Photo one')).toBeInTheDocument();
  });

  it('renders dot indicators matching photo count', () => {
    const { container } = render(<ImageCarousel photos={photos} altPrefix="Pomelo" />);
    const dots = container.querySelectorAll('.carousel-dot');
    expect(dots.length).toBe(3);
    expect(dots[0]).toHaveClass('carousel-dot--active');
  });

  it('does not show controls for single photo', () => {
    render(<ImageCarousel photos={[photos[0]]} altPrefix="Pomelo" />);
    expect(screen.queryByLabelText('Next photo')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous photo')).not.toBeInTheDocument();
  });

  it('has aria-label on container', () => {
    render(<ImageCarousel photos={photos} altPrefix="Pomelo" />);
    expect(screen.getByLabelText('Pomelo photo gallery')).toBeInTheDocument();
  });
});
