import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

/**
 * Layout — Wraps every page with a NavBar at the top and Footer at the bottom.
 *
 * REACT ROUTER CONCEPT: LAYOUT ROUTES
 * In the route configuration (App.tsx), Layout is used as a "layout route":
 *
 *   <Route element={<Layout />}>
 *     <Route path="/" element={<HomePage />} />
 *     <Route path="/about" element={<AboutPage />} />
 *     ...
 *   </Route>
 *
 * The <Outlet /> component is a placeholder that React Router fills in
 * with whichever child route matches the current URL. For example:
 *   - URL is "/" → <Outlet /> renders <HomePage />
 *   - URL is "/about" → <Outlet /> renders <AboutPage />
 *
 * This means NavBar and Footer appear on EVERY page automatically,
 * without each page having to include them manually.
 *
 * CSS LAYOUT:
 * The outer <div className="layout"> uses flexbox with column direction
 * and min-height: 100vh. This ensures the footer stays at the bottom
 * of the viewport even when the page content is short (a "sticky footer"
 * pattern). The <main> element has flex: 1 to fill available space.
 */
export function Layout() {
  return (
    <div className="layout">
      <ScrollToTop />
      <NavBar />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
