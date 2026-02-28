/**
 * Tests for the HeroCarousel component.
 *
 * HeroCarousel displays a full-width image carousel with:
 * - Fade transitions between slides
 * - Auto-advance every 5 seconds
 * - Prev/Next arrow buttons
 * - Dot indicators for each slide
 * - Pause on hover
 *
 * We test:
 * - Renders images and alt text
 * - Shows dot indicators matching slide count
 * - Next/Prev buttons change the active slide
 * - Auto-advances after 5 seconds
 * - Pauses auto-advance on hover
 * - Returns null when no images are provided
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { HeroCarousel } from '../../components/HeroCarousel';
import type { HeroImage } from '../../data/types';

const mockImages: HeroImage[] = [
  { url: 'https://placecats.com/bella/1200/500', alt: 'Cat one' },
  { url: 'https://placecats.com/millie/1200/500', alt: 'Cat two' },
  { url: 'https://placecats.com/neo/1200/500', alt: 'Cat three' },
];

describe('HeroCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders all images with correct alt text', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    expect(screen.getByAltText('Cat one')).toBeInTheDocument();
    expect(screen.getByAltText('Cat two')).toBeInTheDocument();
    expect(screen.getByAltText('Cat three')).toBeInTheDocument();
  });

  it('shows dot indicators matching the number of slides', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
  });

  it('first slide is active by default', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    expect(dots[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('next button advances to the next slide', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    const nextBtn = screen.getByLabelText('Next slide');
    fireEvent.click(nextBtn);

    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('prev button goes to the previous slide (wraps around)', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    const prevBtn = screen.getByLabelText('Previous slide');
    fireEvent.click(prevBtn);

    // Should wrap to the last slide
    const dots = screen.getAllByRole('tab');
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('clicking a dot navigates to that slide', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    const dots = screen.getAllByRole('tab');
    fireEvent.click(dots[2]);

    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('auto-advances after 5 seconds', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    // Initially on slide 0
    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');

    // Advance time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('pauses auto-advance on mouse enter', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    const carousel = screen.getByRole('region');
    fireEvent.mouseEnter(carousel);

    // Advance time — should NOT change slide
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('resumes auto-advance on mouse leave', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    const carousel = screen.getByRole('region');
    fireEvent.mouseEnter(carousel);
    fireEvent.mouseLeave(carousel);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('returns null when heroImages is empty', () => {
    const { container } = render(<HeroCarousel heroImages={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('does not show controls for a single image', () => {
    render(<HeroCarousel heroImages={[mockImages[0]]} />);

    expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<HeroCarousel heroImages={mockImages} />);

    const carousel = screen.getByRole('region');
    expect(carousel).toHaveAttribute('aria-label', 'Hero image carousel');
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
  });
});
