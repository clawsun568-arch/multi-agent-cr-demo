/**
 * Tests for the Footer component.
 *
 * Footer is a presentational component shown at the bottom of every page.
 * It contains:
 * - Quick links to all 6 pages (same as NavBar)
 * - Social media placeholder text
 * - Copyright notice with dynamic year
 * - "Built with" credit
 *
 * We test:
 * - Copyright text renders with the current year
 * - All 6 quick links render with correct hrefs
 * - Accessibility: role="contentinfo" and aria-label on nav
 * - "Built with" credit text renders
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../../components/Footer';

describe('Footer', () => {
  it('renders copyright text with the current year', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`\u00A9 ${currentYear} My Cattery. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('renders all 6 quick links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Each page should have a link in the footer
    const links = ['Home', 'About', 'Our Cats', 'Kittens', 'Gallery', 'Contact'];
    for (const label of links) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('quick links have correct href attributes', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const expectedHrefs: Record<string, string> = {
      'Home': '/',
      'About': '/about',
      'Our Cats': '/our-cats',
      'Kittens': '/kittens',
      'Gallery': '/gallery',
      'Contact': '/contact',
    };

    for (const [label, href] of Object.entries(expectedHrefs)) {
      const link = screen.getByText(label).closest('a');
      expect(link).toHaveAttribute('href', href);
    }
  });

  it('has role="contentinfo" on the footer element', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // role="contentinfo" is the landmark role for <footer>
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('has aria-label on the footer navigation', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const footerNav = screen.getByLabelText('Footer navigation');
    expect(footerNav.tagName).toBe('NAV');
  });

  it('renders the "Built with" credit text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Built with React + TypeScript + Vite')
    ).toBeInTheDocument();
  });
});
