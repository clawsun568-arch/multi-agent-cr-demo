import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { OurCatsPage } from './pages/OurCatsPage';
import { CatProfilePage } from './components/CatProfilePage';
import { AvailableKittensPage } from './pages/AvailableKittensPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import './App.css';

/**
 * App — Root component that sets up React Router.
 *
 * BEFORE (v1): App.tsx was 120+ lines that handled data fetching,
 * state-based routing (selectedCatId useState), filtering, and rendering.
 * Now all that logic lives in individual pages and the useCatData hook.
 *
 * REACT ROUTER v6 KEY CONCEPTS:
 *
 * <BrowserRouter>
 *   Provides routing context to the entire app. It uses the browser's
 *   History API to keep the URL in sync with what's rendered on screen.
 *   Every <Link> and useNavigate() call depends on BrowserRouter being
 *   an ancestor in the component tree.
 *
 * <Routes>
 *   Looks at the current URL and renders the one <Route> that matches.
 *   It works like a switch statement — only one route matches at a time.
 *
 * <Route>
 *   Maps a URL pattern to a component:
 *   - path="/"          → exact match for the home page
 *   - path="/our-cats"  → exact match for the Our Cats list
 *   - path="/our-cats/:id" → the ":id" part is a URL parameter that
 *     CatProfilePage reads with useParams()
 *
 * LAYOUT ROUTE (the outer <Route element={<Layout />}>):
 *   This is a "layout route" — it doesn't have a path, so it always
 *   matches. It renders the Layout component (NavBar + Footer) around
 *   whichever child route matches. The <Outlet /> inside Layout gets
 *   replaced by the matched child's element.
 *
 *   Result: NavBar and Footer appear on every page without each page
 *   having to include them manually.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout route — wraps all pages with NavBar + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/our-cats" element={<OurCatsPage />} />
          <Route path="/our-cats/:id" element={<CatProfilePage />} />
          <Route path="/kittens" element={<AvailableKittensPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
