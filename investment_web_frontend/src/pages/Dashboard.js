import React from 'react';
import '../components/ui.css';

// PUBLIC_INTERFACE
export default function Dashboard() {
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div className="card">
          <h3>Suggestions</h3>
          <p className="label">View real-time, compliant ideas</p>
          <a className="btn" href="/suggestions">Open</a>
        </div>
        <div className="card">
          <h3>Portfolio</h3>
          <p className="label">Track your positions</p>
          <a className="btn" href="/portfolio">Open</a>
        </div>
        <div className="card">
          <h3>Pricing</h3>
          <p className="label">Manage your plan</p>
          <a className="btn" href="/pricing">Open</a>
        </div>
      </div>
    </div>
  );
}
