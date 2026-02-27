import { useNavigate } from 'react-router-dom';
import { useCatData } from '../hooks/useCatData';
import { CatSection } from '../components/CatSection';

/**
 * HomePage — Landing page rendered at the "/" route.
 *
 * For PR 1, this page replicates the original App.tsx list view:
 * 1. Fetches cat data using the useCatData() hook
 * 2. Splits cats into "owned" and "planned" groups
 * 3. Renders them in two CatSection components
 *
 * In PR 2, this will be redesigned with a hero carousel, cattery
 * intro section, and featured cats grid.
 *
 * REACT ROUTER CONCEPT: useNavigate()
 * When a user clicks a cat card, we want to go to that cat's profile
 * page at `/our-cats/:id`. useNavigate() gives us a function that
 * programmatically changes the URL — like clicking a Link, but
 * triggered by code instead of a user click on a link element.
 */
export function HomePage() {
  const { cats, loading, error } = useCatData();

  // useNavigate returns a function that lets us change the URL from code.
  // We use it to navigate to a cat's profile when their card is clicked.
  const navigate = useNavigate();

  // When a cat card is clicked, navigate to its detail page.
  // The URL will be something like "/our-cats/cat_001".
  function handleCatClick(catId: string) {
    navigate(`/our-cats/${catId}`);
  }

  // Split cats into two groups based on their status.
  // "owned" = cats we currently have, "planned" = future cats.
  const ownedCats = cats.filter(c => c.status === 'owned');
  const plannedCats = cats.filter(c => c.status === 'planned');

  // Show a loading indicator while data is being fetched
  if (loading) {
    return <div className="loading">Loading cats...</div>;
  }

  // Show an error message if the fetch failed
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      {/* Page header with welcome message */}
      <header className="page-header">
        <h1>Welcome to My Cattery</h1>
        <p className="tagline">Our furry family members</p>
      </header>

      {/* Owned cats section */}
      <CatSection
        title="Our Cats"
        cats={ownedCats}
        emptyMessage="No cats yet! Add one to cat-data.json."
        onCatClick={handleCatClick}
      />

      {/* Planned/future cats section */}
      <CatSection
        title="Future Cats"
        cats={plannedCats}
        emptyMessage="No planned cats. Add expected kittens to cat-data.json."
        onCatClick={handleCatClick}
      />
    </>
  );
}
