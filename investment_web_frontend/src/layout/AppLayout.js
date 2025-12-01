import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../components/ui.css';

export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main style={{ padding: 16 }}>
          {children}
        </main>
      </div>
    </>
  );
}
