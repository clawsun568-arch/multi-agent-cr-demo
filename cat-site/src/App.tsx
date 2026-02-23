import { useState, useEffect } from 'react';
import { Cat } from './data/types';
import { CatSection } from './components/CatSection';
import './App.css';

/**
 * App - Main application component
 * 
 * Data flow:
 * 1. Component mounts → fetch cat-data.json
 * 2. Parse JSON into Cat[] array
 * 3. Filter into ownedCats and plannedCats
 * 4. Render two CatSection components
 */
function App() {
  // State: store cats array, loading status, and any errors
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch cat data from JSON file on mount
    // This is a static fetch - no backend server needed
    fetch('/cat-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load cat data');
        return res.json();
      })
      .then(data => {
        setCats(data.cats || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Split cats into two groups for display
  const ownedCats = cats.filter(c => c.status === 'owned');
  const plannedCats = cats.filter(c => c.status === 'planned');

  if (loading) return <div className="loading">Loading cats... 🐱</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🐱 My Cats</h1>
        <p className="tagline">Our furry family members</p>
      </header>

      <main>
        <CatSection 
          title="Our Cats" 
          cats={ownedCats}
          emptyMessage="No cats yet! Add one to cat-data.json."
        />

        <CatSection 
          title="Future Cats" 
          cats={plannedCats}
          emptyMessage="No planned cats. Add expected kittens to cat-data.json."
        />
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
      </footer>
    </div>
  );
}

export default App;
