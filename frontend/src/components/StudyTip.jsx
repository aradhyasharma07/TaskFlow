// ==============================================================================
// Lecture 47: useEffect Hook & Synchronizing with External APIs
// File: frontend/src/components/StudyTip.jsx
// ==============================================================================

import React, { useState, useEffect } from 'react';

export default function StudyTip() {
  const [tip, setTip] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTip = async () => {
    setLoading(true);
    try {
      // Fetch from local backend tip API or Advice Slip
      const res = await fetch('/api/tips/daily');
      if (!res.ok) throw new Error('Failed to fetch from /api/tips/daily');
      const data = await res.json();
      setTip(data.data.tip);
      setAuthor(`Category: ${data.data.category}`);
    } catch {
      // Fallback
      setTip("Review your lecture notes within 24 hours to boost retention.");
      setAuthor("Cognitive Science (Offline Fallback)");
    } finally {
      setLoading(false);
    }
  };

  // useEffect runs on component mount (empty dependency array [])
  useEffect(() => {
    fetchTip();
  }, []);

  return (
    <div 
      className="card" 
      style={{ 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(59, 130, 246, 0.12) 100%)',
        borderLeft: '5px solid var(--color-primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.75rem' }}>💡</span>
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Daily Study Tip (React useEffect Demo)
          </p>
          <p style={{ fontStyle: 'italic', margin: '4px 0' }}>
            {loading ? 'Fetching study tip...' : `"${tip}"`}
          </p>
          <small style={{ color: 'var(--color-text-secondary)' }}>— {author}</small>
        </div>
      </div>
      <button 
        onClick={fetchTip} 
        disabled={loading}
        className="btn"
        style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
      >
        🔄 New Tip
      </button>
    </div>
  );
}
