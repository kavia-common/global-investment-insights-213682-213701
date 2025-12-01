import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../components/ui.css';

// PUBLIC_INTERFACE
export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/onboarding');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <h1>Create your account</h1>
      <p className="label">Start your investment journey</p>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-row">
          <label className="label" htmlFor="register-full-name">Full Name</label>
          <input id="register-full-name" className="input" name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className="form-row">
          <label className="label" htmlFor="register-email">Email</label>
          <input id="register-email" className="input" type="email" name="email" value={form.email} onChange={onChange} required />
        </div>
        <div className="form-row">
          <label className="label" htmlFor="register-password">Password</label>
          <input id="register-password" className="input" type="password" name="password" value={form.password} onChange={onChange} required />
        </div>
        {error && <div style={{ color: 'var(--error)', marginBottom: 8 }}>{error}</div>}
        <div className="actions">
          <button className="btn" type="submit">Create account</button>
          <Link to="/login" className="btn-outline">I have an account</Link>
        </div>
      </form>
    </div>
  );
}
