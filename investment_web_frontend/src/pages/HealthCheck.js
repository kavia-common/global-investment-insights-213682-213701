import React, { useEffect, useState } from 'react';
import api from '../services/apiClient';

// PUBLIC_INTERFACE
export default function HealthCheck() {
  const [status, setStatus] = useState('checking...');
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/');
        setStatus(JSON.stringify(data));
      } catch (e) {
        setStatus('Backend not reachable');
      }
    })();
  }, []);
  return (
    <div className="container">
      <h1>Backend Health</h1>
      <div className="card">
        <p>{status}</p>
      </div>
    </div>
  );
}
