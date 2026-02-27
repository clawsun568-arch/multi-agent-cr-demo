/**
 * Tests for the CatCard component.
 *
 * CatCard is a clickable card that shows a cat's summary info:
 * photo, name, breed, age (or expected date), personality preview.
 *
 * We test:
 * - Renders the cat's name, breed, and personality
 * - Shows computed age for owned cats
 * - Shows expected date for planned cats
 * - Calls onClick when clicked
 * - Shows placeholder when image fails to load
 * - Has correct accessibility attributes (aria-label)
 *
 * Key testing concepts used here:
 * - `render()` from @testing-library/react — renders a component into a
 *   virtual DOM so we can query and interact with it.
 * - `screen` — provides query methods (getByText, getByRole, etc.) to
 *   find elements in the rendered output.
 * - `fireEvent` — simulates user interactions like click, error events.
 * - `vi.fn()` — creates a mock function that tracks if/how it was called.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatCard } from './CatCard';
import type { Cat } from '../data/types';

// A helper function that creates a fake cat object for testing.
// You can override any field by passing partial data.
// Example: makeCat({ name: 'Fluffy' }) → cat with name "Fluffy" and defaults for everything else
function makeCat(overrides: Partial<Cat> = {}): Cat {
  return {
    id: 'cat_test',
    name: 'TestCat',
    breed: 'Ragdoll',
    gender: 'Female',
    status: 'owned',
    photoUrl: 'https://placecats.com/test/300/200',
    birthDate: '2022-03-15',
    personality: 'Playful and cuddly',
    ...overrides,
  };
}

describe('CatCard', () => {
  it('renders cat name and breed', () => {
    const cat = makeCat({ name: 'Mochi', breed: 'Ragdoll' });

    // render() puts the component into a virtual DOM
    render(<CatCard cat={cat} onClick={() => {}} />);

    // screen.getByText() finds an element containing that text.
    // If no element is found, the test fails immediately with a helpful error.
    expect(screen.getByText('Mochi')).toBeInTheDocument();
    expect(screen.getByText('Ragdoll')).toBeInTheDocument();
  });

  it('shows personality preview (truncated to 80 chars)', () => {
    const longPersonality =
      'This is a very long personality description that should be truncated after eighty characters to keep the card compact';
    const cat = makeCat({ personality: longPersonality });

    render(<CatCard cat={cat} onClick={() => {}} />);

    // The component truncates at 80 chars and adds "..."
    expect(screen.getByText(/This is a very long personality/)).toBeInTheDocument();
  });

  it('shows age for owned cats with birthDate', () => {
    // Freeze time so age calculation is predictable
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));

    const cat = makeCat({ status: 'owned', birthDate: '2024-01-01' });
    render(<CatCard cat={cat} onClick={() => {}} />);

    // Born 2024-01-01, now is 2026-02-26 → 2 years old
    expect(screen.getByText('2 years old')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('shows expected date for planned cats', () => {
    const cat = makeCat({
      status: 'planned',
      birthDate: undefined,
      expectedDate: '2026-06',
    });

    render(<CatCard cat={cat} onClick={() => {}} />);

    expect(screen.getByText('Expected: 2026-06')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    const cat = makeCat();
    // vi.fn() creates a "spy" function that records when it's called
    const handleClick = vi.fn();

    render(<CatCard cat={cat} onClick={handleClick} />);

    // Find the card button and click it
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Verify onClick was called exactly once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has an accessible aria-label with cat name', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00Z'));

    const cat = makeCat({ name: 'Mochi', birthDate: '2022-03-15' });
    render(<CatCard cat={cat} onClick={() => {}} />);

    // The button should have an aria-label describing the cat
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute(
      'aria-label',
      'View details for Mochi, 3 years old'
    );

    vi.useRealTimers();
  });

  it('shows "Owned" badge for owned cats', () => {
    const cat = makeCat({ status: 'owned' });
    render(<CatCard cat={cat} onClick={() => {}} />);
    expect(screen.getByText('Owned')).toBeInTheDocument();
  });

  it('shows "Planned" badge for planned cats', () => {
    const cat = makeCat({ status: 'planned', birthDate: undefined });
    render(<CatCard cat={cat} onClick={() => {}} />);
    expect(screen.getByText('Planned')).toBeInTheDocument();
  });

  it('shows placeholder emoji when photo URL is not http', () => {
    // CatCard checks if photoUrl starts with "http" — local paths get placeholder
    const cat = makeCat({ photoUrl: '/images/local.jpg' });
    render(<CatCard cat={cat} onClick={() => {}} />);

    // The placeholder container should have the 'no-image' class
    const container = document.querySelector('.cat-image-container');
    expect(container).toHaveClass('no-image');
  });
});
