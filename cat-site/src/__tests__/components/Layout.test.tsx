/**
 * Tests for the Layout component.
 *
 * Layout is a "layout route" wrapper that renders:
 * - NavBar at the top
 * - Page content in the middle (via React Router's <Outlet />)
 * - Footer at the bottom
 *
 * We test:
 * - NavBar is rendered (by checking for the logo text)
 * - Footer is rendered (by checking for the copyright text)
 * - Child route content is rendered via Outlet
 *
 * KEY TESTING PATTERN: Testing Layout Routes
 * To test a layout route, we render it inside a MemoryRouter with a
 * Routes/Route configuration that includes a child route. This simulates
 * how Layout is used in the real App.tsx.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../../components/Layout';

describe('Layout', () => {
  it('renders NavBar, page content via Outlet, and Footer', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          {/* Layout route wraps the child route, just like in App.tsx */}
          <Route element={<Layout />}>
            <Route path="/test" element={<p>Test Page Content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // NavBar should be present (check for the logo text)
    expect(screen.getByText('My Cattery')).toBeInTheDocument();

    // The child route content should be rendered inside the Outlet
    expect(screen.getByText('Test Page Content')).toBeInTheDocument();

    // Footer should be present (check for the copyright text)
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('renders the correct child route based on URL', () => {
    render(
      <MemoryRouter initialEntries={['/page-b']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/page-a" element={<p>Page A</p>} />
            <Route path="/page-b" element={<p>Page B</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Page B should be visible since the URL is "/page-b"
    expect(screen.getByText('Page B')).toBeInTheDocument();
    // Page A should NOT be visible
    expect(screen.queryByText('Page A')).not.toBeInTheDocument();
  });

  it('has a main element wrapping the page content', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/test" element={<p>Content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // The <main> element should exist and contain the page content
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('layout-main');
  });
});
