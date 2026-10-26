// ==============================================================================
// Lecture 45-46: Controlled Components, useState, & Event Handling
// File: frontend/src/components/TaskForm.jsx
// ==============================================================================

import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSaveTask, editingTask, onCancelEdit }) {
  // Multiple useState variables for form fields (Lecture 45)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Synchronize state when editingTask prop changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setDueDate(editingTask.dueDate || '');
      setError('');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side Validation (Lecture 46)
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (title.trim().length < 2) {
      setError('Task title must be at least 2 characters long');
      return;
    }

    setError('');

    // Call parent handler
    onSaveTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate
    });

    if (!editingTask) {
      resetForm();
    }
  };

  return (
    <section className="card">
      <h2 className="section-title">
        {editingTask ? '✏️ Edit Task' : '➕ Add New Task'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="taskTitle">
            Task Title <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            id="taskTitle"
            type="text"
            className="form-input"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
          />
          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>
              {error}
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="taskDescription">Description</label>
          <textarea
            id="taskDescription"
            className="form-textarea"
            placeholder="Add task description (optional)"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="taskPriority">Priority</label>
            <select
              id="taskPriority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="taskDueDate">Due Date</label>
            <input
              id="taskDueDate"
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button type="submit" className="btn btn-primary">
            {editingTask ? '✓ Update Task' : '+ Add Task'}
          </button>
          {editingTask && (
            <button type="button" className="btn btn-cancel" onClick={onCancelEdit}>
              ✕ Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
