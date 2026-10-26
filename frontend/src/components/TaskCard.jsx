// ==============================================================================
// Lecture 44: Reusable Component & Prop Drilling
// File: frontend/src/components/TaskCard.jsx
// ==============================================================================

import React, { useRef } from 'react';

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete, onUploadAttachment }) {
  const fileInputRef = useRef(null);

  const priorityClass = `priority-${task.priority || 'medium'}`;
  const isCompleted = Boolean(task.completed);

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'No due date';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUploadAttachment) {
      onUploadAttachment(task.id, file);
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <div>
          <h3
            className="task-title"
            style={{ textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.7 : 1 }}
          >
            {task.title}
          </h3>
          <span className={`priority-badge ${priorityClass}`}>
            {(task.priority || 'medium').toUpperCase()}
          </span>
        </div>

        <div>
          <button className="btn-edit" onClick={() => onEdit(task)}>
            ✏️ Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(task.id)}>
            🗑️ Delete
          </button>
        </div>
      </div>

      <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0', fontSize: '0.95rem' }}>
        {task.description || 'No description provided'}
      </p>

      {task.attachment && (
        <div style={{ margin: '8px 0' }}>
          <a
            href={`/uploads/${task.attachment}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'underline' }}
          >
            📎 View Attachment ({task.attachment.split('_').slice(2).join('_') || 'File'})
          </a>
        </div>
      )}

      <div className="task-meta">
        <span>📌 {isCompleted ? 'Completed' : 'Pending'}</span>
        <span>📅 Due: {formattedDate}</span>
        {task.user && <span>👤 Student: {task.user.name || task.user.email}</span>}
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn-complete"
          onClick={() => onToggleComplete(task.id, !isCompleted)}
          style={{ background: isCompleted ? '#6b7280' : 'var(--color-success)' }}
        >
          {isCompleted ? '↩️ Mark Pending' : '✓ Mark Complete'}
        </button>

        {/* Upload attachment trigger (Lecture 40) */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
        />
        <button
          className="btn"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}
        >
          📎 {task.attachment ? 'Replace File' : 'Attach File'}
        </button>
      </div>
    </div>
  );
}
