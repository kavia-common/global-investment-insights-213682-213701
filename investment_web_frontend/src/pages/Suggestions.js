import React, { useEffect, useState } from 'react';
import { SuggestionsAPI } from '../services/endpoints';
import '../components/ui.css';

// PUBLIC_INTERFACE
export default function Suggestions() {
  const [amount, setAmount] = useState(1000);
  const [market, setMarket] = useState('US');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState('');

  const fetchSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await SuggestionsAPI.getSuggestions({ amount, market });
      setIdeas(Array.isArray(data) ? data : (data?.items || []));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <h1>Investment Suggestions</h1>
      <div className="card">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr auto', alignItems: 'end' }}>
          <div className="form-row">
            <label className="label">Amount</label>
            <input className="input" type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))}/>
          </div>
          <div className="form-row">
            <label className="label">Market</label>
            <select className="input" value={market} onChange={(e)=>setMarket(e.target.value)}>
              <option value="US">US</option>
              <option value="India">India</option>
            </select>
          </div>
          <button className="btn" onClick={fetchSuggestions} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
        </div>
      </div>
      {error && <div style={{ color: 'var(--error)', marginTop: 8 }}>{error}</div>}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 16 }}>
        {ideas.map((idea, idx) => (
          <div key={idx} className="card">
            <h3>{idea.symbol || idea.name || 'Asset'}</h3>
            <p className="label">{idea.summary || idea.description || 'No description'}</p>
            {idea.score != null && <p>Score: {idea.score}</p>}
          </div>
        ))}
        {!loading && ideas.length === 0 && (
          <div className="card">
            <p>No suggestions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
