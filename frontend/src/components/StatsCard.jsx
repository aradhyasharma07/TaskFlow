// ==============================================================================
// Lecture 44: Props & Reusable Functional Components
// File: frontend/src/components/StatsCard.jsx
// ==============================================================================

import React from 'react';

export default function StatsCard({ icon, label, value, type }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${type}`}>
        {icon}
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
