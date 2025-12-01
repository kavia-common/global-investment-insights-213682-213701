import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import './ui.css';

export default function Navbar() {
  const { theme, toggle } = React.useContext(ThemeContext);
  const { isAuthenticated, logout } = React.useContext(AuthContext);

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Global Investment Insights</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/suggestions" className="nav-link">Suggestions</Link>
        <Link to="/portfolio" className="nav-link">Portfolio</Link>
        <Link to="/pricing" className="nav-link">Pricing</Link>
        <Link to="/settings" className="nav-link">Settings</Link>
      </div>
      <div className="nav-right">
        <button className="btn-secondary" onClick={toggle} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {isAuthenticated ? (
          <button className="btn-danger" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn-outline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
