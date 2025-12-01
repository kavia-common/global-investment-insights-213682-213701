import React, { useEffect, useState } from 'react';
import { PortfolioAPI } from '../services/endpoints';
import '../components/ui.css';

// PUBLIC_INTERFACE
export default function Portfolio() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await PortfolioAPI.get();
        setSummary(data);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load portfolio');
      }
    })();
  }, []);

  return (
    <div className="container">
      <h1>Your Portfolio</h1>
      {error && <div style={{ color: 'var(--error)', marginTop: 8 }}>{error}</div>}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div className="card">
          <h3>Summary</h3>
          {/* Explicit element to assert portfolio name in tests */}
          <div data-testid="portfolio-name">{summary?.name || ''}</div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{summary ? JSON.stringify(summary, null, 2) : 'Loading...'}</pre>
        </div>
      </div>
    </div>
  );
}
