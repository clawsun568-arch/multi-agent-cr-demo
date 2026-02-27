/**
 * Tests for all stub/placeholder pages.
 *
 * These are the pages that will be fully implemented in later PRs.
 * For now, each one just renders a heading and a "coming soon" message.
 * We test that each page renders correctly so route navigation works.
 *
 * All 5 stub pages are tested in a single file because the tests
 * are simple and follow the same pattern. Once a page gets a full
 * implementation (e.g., PR 3 for OurCatsPage), its tests should
 * move to a dedicated test file.
 *
 * Note: These components don't use any React Router hooks, so they
 * don't technically need MemoryRouter. But we include it as a
 * best practice since they'll eventually use router features.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from '../../pages/AboutPage';
import { OurCatsPage } from '../../pages/OurCatsPage';
import { AvailableKittensPage } from '../../pages/AvailableKittensPage';
import { GalleryPage } from '../../pages/GalleryPage';
import { ContactPage } from '../../pages/ContactPage';
import { NotFoundPage } from '../../pages/NotFoundPage';

describe('Stub Pages', () => {
  it('AboutPage renders heading "About Us"', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'About Us' })
    ).toBeInTheDocument();
  });

  it('OurCatsPage renders heading "Our Cats"', () => {
    render(
      <MemoryRouter>
        <OurCatsPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Our Cats' })
    ).toBeInTheDocument();
  });

  it('AvailableKittensPage renders heading "Available Kittens"', () => {
    render(
      <MemoryRouter>
        <AvailableKittensPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Available Kittens' })
    ).toBeInTheDocument();
  });

  it('GalleryPage renders heading "Gallery"', () => {
    render(
      <MemoryRouter>
        <GalleryPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Gallery' })
    ).toBeInTheDocument();
  });

  it('ContactPage renders heading "Contact Us"', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Contact Us' })
    ).toBeInTheDocument();
  });

  it('NotFoundPage renders heading "Page Not Found" with link to home', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('heading', { name: 'Page Not Found' })
    ).toBeInTheDocument();
    // Should have a link back to home
    const homeLink = screen.getByText(/Back to Home/).closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
