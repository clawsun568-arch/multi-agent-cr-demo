import { Link } from 'react-router-dom';

/**
 * NotFoundPage — Shown when the URL doesn't match any defined route.
 *
 * This is the "catch-all" page for 404 errors. In the route config
 * (App.tsx), it's rendered by: <Route path="*" element={<NotFoundPage />} />
 *
 * The path="*" means "match anything that hasn't been matched already."
 * So if a user visits /nonexistent-page, they'll see this page instead
 * of a blank screen.
 */
export function NotFoundPage() {
  return (
    <div className="stub-page">
      <h1>Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="back-button">
        &larr; Back to Home
      </Link>
    </div>
  );
}
