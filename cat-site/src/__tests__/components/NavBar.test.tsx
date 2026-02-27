/**
 * Tests for the NavBar component.
 *
 * NavBar is the persistent top navigation bar that:
 * - Shows the cattery name/logo as a link to home
 * - Lists navigation links to all 6 pages
 * - Highlights the currently active page
 * - Collapses into a hamburger menu on mobile
 *
 * We test:
 * - Logo renders and links to "/"
 * - All 6 navigation links render
 * - Active link gets highlighted based on current route
 * - Hamburger button toggles mobile menu open/closed
 * - Accessibility attributes (aria-label, aria-expanded, aria-current)
 *
 * KEY TESTING PATTERN: MemoryRouter
 * Components that use React Router hooks (like useLocation) must be
 * rendered inside a Router. In tests, we use MemoryRouter instead of
 * BrowserRouter because:
 * - MemoryRouter lets us set the initial URL via `initialEntries`
 * - It doesn't need a real browser history
 * - It's faster and more predictable for testing
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';

describe('NavBar', () => {
  it('renders the cattery name as a link to home', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const logo = screen.getByText('My Cattery');
    expect(logo).toBeInTheDocument();
    // The logo should be a link (<a> tag) pointing to "/"
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders all 6 navigation links', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    // Check that each page link is present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Our Cats')).toBeInTheDocument();
    expect(screen.getByText('Kittens')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('highlights the active link based on current route', () => {
    // initialEntries tells MemoryRouter what URL to start at
    render(
      <MemoryRouter initialEntries={['/about']}>
        <NavBar />
      </MemoryRouter>
    );

    // The About link should have the active class
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveClass('navbar-link--active');

    // The About link should have aria-current="page" for screen readers
    expect(aboutLink).toHaveAttribute('aria-current', 'page');

    // Home link should NOT be active
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).not.toHaveClass('navbar-link--active');
  });

  it('highlights Home link only on the exact "/" path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <NavBar />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass('navbar-link--active');
  });

  it('highlights Our Cats for nested routes like /our-cats/cat_001', () => {
    render(
      <MemoryRouter initialEntries={['/our-cats/cat_001']}>
        <NavBar />
      </MemoryRouter>
    );

    const ourCatsLink = screen.getByText('Our Cats').closest('a');
    expect(ourCatsLink).toHaveClass('navbar-link--active');
  });

  it('has a hamburger button with correct aria attributes', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const hamburger = screen.getByLabelText('Open navigation menu');
    expect(hamburger).toBeInTheDocument();
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    expect(hamburger).toHaveAttribute('aria-controls', 'navbar-menu');
  });

  it('toggles the mobile menu when hamburger is clicked', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const hamburger = screen.getByLabelText('Open navigation menu');
    const menu = document.getElementById('navbar-menu');

    // Menu should start closed (no --open class)
    expect(menu).not.toHaveClass('navbar-links--open');

    // Click hamburger to open
    fireEvent.click(hamburger);
    expect(menu).toHaveClass('navbar-links--open');

    // Click again to close
    fireEvent.click(screen.getByLabelText('Close navigation menu'));
    expect(menu).not.toHaveClass('navbar-links--open');
  });

  it('closes the mobile menu when a nav link is clicked', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const hamburger = screen.getByLabelText('Open navigation menu');
    const menu = document.getElementById('navbar-menu');

    // Open the menu
    fireEvent.click(hamburger);
    expect(menu).toHaveClass('navbar-links--open');

    // Click a nav link — menu should close
    fireEvent.click(screen.getByText('About'));
    expect(menu).not.toHaveClass('navbar-links--open');
  });

  it('has aria-label on the nav element', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const nav = screen.getByLabelText('Main navigation');
    expect(nav.tagName).toBe('NAV');
  });
});
