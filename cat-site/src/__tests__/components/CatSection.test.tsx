/**
 * Tests for the CatSection component.
 *
 * CatSection is a container that:
 * - Renders a section heading (e.g. "Our Cats", "Future Cats")
 * - Displays a grid of CatCard components for the given cats
 * - Shows an empty message when no cats are provided
 *
 * We test:
 * - Section title renders correctly
 * - Empty state shows the provided message
 * - Correct number of cat cards render
 * - onCatClick is called with the correct cat ID
 * - Accessibility: section has aria-labelledby linking to its heading
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatSection } from '../../components/CatSection';
import type { Cat } from '../../data/types';

// Helper to create test cat data
function makeCat(id: string, name: string): Cat {
  return {
    id,
    name,
    breed: 'Ragdoll',
    gender: 'Female',
    status: 'owned',
    photoUrl: '/images/test.jpg',
    birthDate: '2022-01-01',
  };
}

describe('CatSection', () => {
  it('renders the section title', () => {
    render(
      <CatSection
        title="Our Cats"
        cats={[]}
        emptyMessage="No cats yet"
        onCatClick={() => {}}
      />
    );

    // getByRole('heading') finds the <h2> element
    expect(screen.getByRole('heading', { name: 'Our Cats' })).toBeInTheDocument();
  });

  it('shows empty message when there are no cats', () => {
    render(
      <CatSection
        title="Our Cats"
        cats={[]}
        emptyMessage="No cats yet! Add one to cat-data.json."
        onCatClick={() => {}}
      />
    );

    expect(screen.getByText('No cats yet! Add one to cat-data.json.')).toBeInTheDocument();
  });

  it('does NOT show empty message when cats exist', () => {
    const cats = [makeCat('cat_1', 'Mochi')];

    render(
      <CatSection
        title="Our Cats"
        cats={cats}
        emptyMessage="No cats yet"
        onCatClick={() => {}}
      />
    );

    // queryByText returns null if not found (unlike getByText which throws)
    expect(screen.queryByText('No cats yet')).not.toBeInTheDocument();
  });

  it('renders one CatCard per cat', () => {
    const cats = [
      makeCat('cat_1', 'Mochi'),
      makeCat('cat_2', 'Sakura'),
      makeCat('cat_3', 'Mango'),
    ];

    render(
      <CatSection
        title="Our Cats"
        cats={cats}
        emptyMessage="No cats"
        onCatClick={() => {}}
      />
    );

    // Each cat name should appear in the rendered output
    expect(screen.getByText('Mochi')).toBeInTheDocument();
    expect(screen.getByText('Sakura')).toBeInTheDocument();
    expect(screen.getByText('Mango')).toBeInTheDocument();
  });

  it('calls onCatClick with the correct cat ID when a card is clicked', () => {
    const cats = [makeCat('cat_42', 'Mochi')];
    const handleClick = vi.fn();

    render(
      <CatSection
        title="Our Cats"
        cats={cats}
        emptyMessage="No cats"
        onCatClick={handleClick}
      />
    );

    // Click the cat card button
    fireEvent.click(screen.getByRole('button'));

    // onCatClick should have been called with "cat_42"
    expect(handleClick).toHaveBeenCalledWith('cat_42');
  });

  it('has accessible section with aria-labelledby', () => {
    render(
      <CatSection
        title="Our Cats"
        cats={[]}
        emptyMessage="No cats"
        onCatClick={() => {}}
      />
    );

    // The <section> element should reference the heading via aria-labelledby
    const section = document.querySelector('section');
    expect(section).toHaveAttribute('aria-labelledby', 'our-cats-heading');

    // The heading should have the matching id
    const heading = screen.getByRole('heading', { name: 'Our Cats' });
    expect(heading).toHaveAttribute('id', 'our-cats-heading');
  });
});
