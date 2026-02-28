/**
 * Tests for all stub/placeholder pages.
 *
 * These are the pages that will be fully implemented in later PRs.
 * For now, each one just renders a heading and a "coming soon" message.
 * We test that each page renders correctly so route navigation works.
 *
 * Remaining stub pages are tested in a single file because the tests
 * are simple and follow the same pattern. OurCatsPage (PR 3),
 * AvailableKittensPage (PR 4), and GalleryPage (PR 5) were moved
 * to dedicated test files.
 *
 * Note: These components don't use any React Router hooks, so they
 * don't technically need MemoryRouter. But we include it as a
 * best practice since they'll eventually use router features.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from '../../pages/AboutPage';
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
