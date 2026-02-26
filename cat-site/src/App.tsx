import { useState, useEffect, useRef } from 'react';
import { Cat } from './data/types';
import { CatSection } from './components/CatSection';
import './App.css';

function App() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
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
        if (isMounted.current) {
          setCats(data.cats);
          setLoading(false);
        }
      })
      .catch(err => {
        clearTimeout(timeout);
        if (isMounted.current) {
          if (err.name === 'AbortError') {
            setError('Request timed out. Please try again.');
          } else {
            setError('Failed to load cat data. Please try again.');
          }
          setLoading(false);
        }
      });
    
    return () => {
      isMounted.current = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

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
        <CatSection title="Our Cats" cats={ownedCats} emptyMessage="No cats yet! Add one to cat-data.json." />
        <CatSection title="Future Cats" cats={plannedCats} emptyMessage="No planned cats. Add expected kittens to cat-data.json." />
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
      </footer>
    </div>
  );
}

export default App;
