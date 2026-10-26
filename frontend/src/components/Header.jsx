// ==============================================================================
// Lecture 43: Functional Components & JSX
// File: frontend/src/components/Header.jsx
// ==============================================================================

import React from 'react';

export default function Header({ darkMode, toggleTheme }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div>
            <h1 className="app-title">TaskFlow (React SPA)</h1>
            <p className="app-description">
              Student Task Management System — Built with React & Vite
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a 
              href="/" 
              style={{ 
                color: 'white', 
                background: 'rgba(255,255,255,0.2)', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                fontSize: '0.85rem',
                textDecoration: 'none' 
              }}
            >
              ← Vanilla UI
            </a>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme} 
              aria-label="Toggle Theme"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
