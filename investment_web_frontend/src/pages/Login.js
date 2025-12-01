import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components/ui.css';

// PUBLIC_INTERFACE
export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h1>Welcome back</h1>
      <p className="label">Sign in to continue</p>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-row">
          <label className="label" htmlFor="login-email">Email</label>
          <input id="login-email" className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div className="form-row">
          <label className="label" htmlFor="login-password">Password</label>
          <input id="login-password" className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: 'var(--error)', marginBottom: 8 }}>{error}</div>}
        <div className="actions">
          <button className="btn" type="submit">Login</button>
          <Link to="/register" className="btn-outline">Create account</Link>
        </div>
      </form>
    </div>
  );
}
