import React, { useEffect, useState } from 'react';
import { PricingAPI } from '../services/endpoints';
import '../components/ui.css';

// PUBLIC_INTERFACE
export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await PricingAPI.getPlans();
        setPlans(Array.isArray(data) ? data : (data?.plans || []));
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load plans');
      }
    })();
  }, []);

  return (
    <div className="container">
      <h1>Pricing</h1>
      {error && <div style={{ color: 'var(--error)', marginBottom: 8 }}>{error}</div>}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {plans.map((plan) => (
          <div className="card" key={plan.id || plan.name}>
            <h3>{plan.name}</h3>
            <p className="label">{plan.description || '—'}</p>
            <p style={{ fontSize: 24, fontWeight: 700 }}>${plan.price || 0}/mo</p>
            <button className="btn">Choose</button>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="card">
            <p>No plans available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
