import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroBanner } from '../../components/HeroBanner';

describe('HeroBanner', () => {
  it('renders the title text', () => {
    render(<HeroBanner title="Our Cats" />);
    expect(
      screen.getByRole('heading', { name: 'Our Cats' })
    ).toBeInTheDocument();
  });

  it('applies background image when provided', () => {
    render(<HeroBanner title="Test" backgroundImage="https://example.com/bg.jpg" />);
    const banner = screen.getByRole('banner');
    expect(banner).toHaveStyle({
      backgroundImage: 'url(https://example.com/bg.jpg)',
    });
  });

  it('uses gradient fallback when no backgroundImage', () => {
    render(<HeroBanner title="Test" />);
    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('hero-banner--gradient');
  });

  it('does not use gradient class when backgroundImage is provided', () => {
    render(<HeroBanner title="Test" backgroundImage="https://example.com/bg.jpg" />);
    const banner = screen.getByRole('banner');
    expect(banner).not.toHaveClass('hero-banner--gradient');
  });

  it('has accessibility attributes', () => {
    render(<HeroBanner title="Gallery" />);
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-label', 'Gallery');
  });
});
