/**
 * Tests for the FeaturedCats component.
 *
 * FeaturedCats renders a grid of up to 3 cat cards with a heading
 * and a "View All Cats" link. It prioritizes owned cats over planned.
 *
 * We test:
 * - Renders the "Meet Our Cats" heading
 * - Renders cat cards with names
 * - Shows "View All Cats" link pointing to /our-cats
 * - Limits display to 3 cats
 * - Prioritizes owned cats over planned
 * - Calls onCatClick when a card is clicked
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeaturedCats } from '../../components/FeaturedCats';
import type { Cat } from '../../data/types';

function makeCat(overrides: Partial<Cat> = {}): Cat {
  return {
    id: 'cat_test',
    name: 'TestCat',
    breed: 'Ragdoll',
    gender: 'Female',
    status: 'owned',
    photoUrl: '/images/test.jpg',
    birthDate: '2022-03-15',
    personality: 'Playful and cuddly',
    ...overrides,
  };
}

// Wrap in MemoryRouter since FeaturedCats uses <Link>
function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('FeaturedCats', () => {
  const twoCats: Cat[] = [
    makeCat({ id: 'machi', name: 'Machi', status: 'owned' }),
    makeCat({ id: 'matcha', name: 'Matcha', status: 'owned' }),
  ];

  it('renders the "Meet Our Cats" heading', () => {
    renderWithRouter(<FeaturedCats cats={twoCats} onCatClick={() => {}} />);

    expect(
      screen.getByRole('heading', { name: 'Meet Our Cats' })
    ).toBeInTheDocument();
  });

  it('renders cat cards with names', () => {
    renderWithRouter(<FeaturedCats cats={twoCats} onCatClick={() => {}} />);

    expect(screen.getByText('Machi')).toBeInTheDocument();
    expect(screen.getByText('Matcha')).toBeInTheDocument();
  });

  it('shows "View All Cats" link to /our-cats', () => {
    renderWithRouter(<FeaturedCats cats={twoCats} onCatClick={() => {}} />);

    const link = screen.getByRole('link', { name: /View All Cats/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/our-cats');
  });

  it('limits display to 3 cats', () => {
    const fourCats: Cat[] = [
      makeCat({ id: 'c1', name: 'Cat1' }),
      makeCat({ id: 'c2', name: 'Cat2' }),
      makeCat({ id: 'c3', name: 'Cat3' }),
      makeCat({ id: 'c4', name: 'Cat4' }),
    ];

    renderWithRouter(<FeaturedCats cats={fourCats} onCatClick={() => {}} />);

    // Should only show 3 cat cards (buttons)
    const cards = screen.getAllByRole('button');
    expect(cards).toHaveLength(3);
  });

  it('prioritizes owned cats over planned', () => {
    const mixedCats: Cat[] = [
      makeCat({ id: 'c1', name: 'Planned1', status: 'planned', birthDate: undefined }),
      makeCat({ id: 'c2', name: 'Owned1', status: 'owned' }),
      makeCat({ id: 'c3', name: 'Planned2', status: 'planned', birthDate: undefined }),
      makeCat({ id: 'c4', name: 'Owned2', status: 'owned' }),
    ];

    renderWithRouter(<FeaturedCats cats={mixedCats} onCatClick={() => {}} />);

    // Should show both owned cats and only 1 planned (3 total)
    expect(screen.getByText('Owned1')).toBeInTheDocument();
    expect(screen.getByText('Owned2')).toBeInTheDocument();
    // Only 3 cards total
    const cards = screen.getAllByRole('button');
    expect(cards).toHaveLength(3);
  });

  it('calls onCatClick with the cat ID when a card is clicked', () => {
    const handleClick = vi.fn();
    renderWithRouter(<FeaturedCats cats={twoCats} onCatClick={handleClick} />);

    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);

    expect(handleClick).toHaveBeenCalledWith('machi');
  });
});
