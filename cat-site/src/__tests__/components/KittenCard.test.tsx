import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KittenCard } from '../../components/KittenCard';
import type { Cat } from '../../data/types';

function makeKitten(overrides: Partial<Cat> = {}): Cat {
  return {
    id: 'kit_1',
    name: 'Pomelo',
    breed: 'British Longhair',
    gender: 'Female',
    status: 'owned',
    role: 'kitten',
    color: 'Black Golden Longhair',
    available: true,
    photoUrl: '/images/pomelo.jpg',
    birthDate: '2025-12-01',
    personality: 'Very smart, loves to cuddle',
    gallery: [
      { url: '/images/pomelo-2.jpg', caption: 'Playing' },
    ],
    ...overrides,
  };
}

describe('KittenCard', () => {
  it('renders kitten name and gender', () => {
    render(<KittenCard kitten={makeKitten()} onClick={() => {}} />);
    expect(screen.getByText('Pomelo')).toBeInTheDocument();
    expect(screen.getByText('(Female)')).toBeInTheDocument();
  });

  it('renders color description', () => {
    render(<KittenCard kitten={makeKitten()} onClick={() => {}} />);
    expect(screen.getByText('Black Golden Longhair')).toBeInTheDocument();
  });

  it('renders personality text', () => {
    render(<KittenCard kitten={makeKitten()} onClick={() => {}} />);
    expect(screen.getByText('Very smart, loves to cuddle')).toBeInTheDocument();
  });

  it('shows "Available" badge when available is true', () => {
    render(<KittenCard kitten={makeKitten({ available: true })} onClick={() => {}} />);
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('shows "Sold" badge when available is false', () => {
    render(<KittenCard kitten={makeKitten({ available: false })} onClick={() => {}} />);
    expect(screen.getByText('Sold')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<KittenCard kitten={makeKitten()} onClick={handleClick} />);
    const card = screen.getByLabelText('View details for Pomelo, available');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has accessible aria-label with name and availability', () => {
    render(<KittenCard kitten={makeKitten()} onClick={() => {}} />);
    const card = screen.getByLabelText('View details for Pomelo, available');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('role', 'button');
  });

  it('includes image carousel with main photo and gallery', () => {
    render(<KittenCard kitten={makeKitten()} onClick={() => {}} />);
    // Main photo is shown first
    expect(screen.getByAltText('Pomelo')).toBeInTheDocument();
  });
});
