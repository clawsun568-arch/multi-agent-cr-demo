import { useState, useEffect } from 'react';
import { Cat } from './data/types';
import { CatSection } from './components/CatSection';
import { CatProfilePage } from './components/CatProfilePage';
import './App.css';

/**
 * Main App Component
 * Handles routing between cat list and individual cat profiles
 */
function App() {
  // Data state
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation state
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  // Load cat data
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    fetch('/cat-data.json', { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load cat data');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data.cats)) throw new Error('Invalid data format');
        clearTimeout(timeout);
        if (!cancelled) {
          setCats(data.cats);
          setLoading(false);
        }
      })
      .catch(err => {
        clearTimeout(timeout);
        if (cancelled) return;
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError('Failed to load cat data. Please try again.');
        }
        setLoading(false);
      });
    
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // Get selected cat object
  const selectedCat = selectedCatId 
    ? cats.find(c => c.id === selectedCatId) 
    : null;

  // Filter cats by status
  const ownedCats = cats.filter(c => c.status === 'owned');
  const plannedCats = cats.filter(c => c.status === 'planned');

  // Loading state
  if (loading) return (
    <div className="app">
      <div className="loading">Loading cats... 🐱</div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="app">
      <div className="error">Error: {error}</div>
    </div>
  );

  // Profile view
  if (selectedCat) {
    return (
      <div className="app">
        <CatProfilePage 
          cat={selectedCat} 
          onBack={() => setSelectedCatId(null)} 
        />
      </div>
    );
  }

  // List view
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
          onCatClick={setSelectedCatId}
        />
        
        <CatSection 
          title="Future Cats" 
          cats={plannedCats} 
          emptyMessage="No planned cats. Add expected kittens to cat-data.json."
          onCatClick={setSelectedCatId}
        />
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
      </footer>
    </div>
  );
}

export default App;
