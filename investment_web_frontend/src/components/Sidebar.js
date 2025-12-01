import React from 'react';
import { NavLink } from 'react-router-dom';
import './ui.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="sidebar-link">Overview</NavLink>
      <NavLink to="/suggestions" className="sidebar-link">Suggestions</NavLink>
      <NavLink to="/portfolio" className="sidebar-link">Portfolio</NavLink>
      <NavLink to="/pricing" className="sidebar-link">Pricing</NavLink>
      <NavLink to="/settings" className="sidebar-link">Settings</NavLink>
    </aside>
  );
}
