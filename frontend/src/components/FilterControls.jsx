// ==============================================================================
// Lecture 46: Controlled Inputs & Parent-Child Communication
// File: frontend/src/components/FilterControls.jsx
// ==============================================================================

import React from 'react';

export default function FilterControls({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy
}) {
  return (
    <section className="card">
      <h2 className="section-title">🔍 Search & Filter</h2>

      <div className="controls-container">
        <div>
          <label className="form-label" htmlFor="reactSearch">Search Tasks</label>
          <input
            id="reactSearch"
            type="text"
            className="form-input"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="reactFilter">Filter by Status</label>
          <select
            id="reactFilter"
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="reactSort">Sort by</label>
          <select
            id="reactSort"
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
            <option value="alphabetical">A - Z</option>
          </select>
        </div>
      </div>
    </section>
  );
}
