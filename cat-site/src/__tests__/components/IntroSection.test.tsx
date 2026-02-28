/**
 * Tests for the IntroSection component.
 *
 * IntroSection is a simple presentational component that renders
 * the cattery name, tagline, and introductory text.
 *
 * We test:
 * - Renders the cattery name as a heading
 * - Renders the tagline
 * - Renders the intro text
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntroSection } from '../../components/IntroSection';

describe('IntroSection', () => {
  const defaultProps = {
    catteryName: 'My Cattery',
    tagline: 'Raising beautiful cats with love',
    introText: 'Welcome to our cattery where we care for the finest cats.',
  };

  it('renders the cattery name as a heading', () => {
    render(<IntroSection {...defaultProps} />);

    const heading = screen.getByRole('heading', { name: 'My Cattery' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders the tagline', () => {
    render(<IntroSection {...defaultProps} />);

    expect(
      screen.getByText('Raising beautiful cats with love')
    ).toBeInTheDocument();
  });

  it('renders the intro text', () => {
    render(<IntroSection {...defaultProps} />);

    expect(
      screen.getByText(
        'Welcome to our cattery where we care for the finest cats.'
      )
    ).toBeInTheDocument();
  });

  it('renders with correct CSS classes', () => {
    const { container } = render(<IntroSection {...defaultProps} />);

    expect(container.querySelector('.intro-section')).toBeInTheDocument();
    expect(container.querySelector('.intro-name')).toBeInTheDocument();
    expect(container.querySelector('.intro-tagline')).toBeInTheDocument();
    expect(container.querySelector('.intro-text')).toBeInTheDocument();
  });
});
