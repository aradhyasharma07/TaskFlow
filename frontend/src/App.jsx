// ==============================================================================
// Lectures 42-48: React Single Page Application (SPA) Root
// File: frontend/src/App.jsx
// 
// TOPICS DEMONSTRATED:
//   - React SPA concepts & JSX syntax (Lecture 42)
//   - Functional and reusable components (Lectures 43-44)
//   - Props & parent-child communication (Lecture 44)
//   - useState hook with multiple state variables (Lecture 45)
//   - Event handling & controlled forms (Lecture 46)
//   - useEffect hook for backend REST API synchronization (Lecture 47)
//   - Loading, Error, and Empty states (Lecture 48)
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import StudyTip from './components/StudyTip';
import TaskForm from './components/TaskForm';
import FilterControls from './components/FilterControls';
import TaskCard from './components/TaskCard';

export default function App() {
  // 1. Multiple State Variables (Lecture 45)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Search, filter, and sorting states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Dark mode state persisted in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('taskflow_theme') === 'dark';
  });

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 2. Synchronize Dark Mode with DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('taskflow_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  // 3. Fetch Tasks from Backend on Mount (Lecture 47: useEffect)
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 4. Save Task (Add or Update)
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update task via PUT /api/tasks/:id
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...taskData, completed: editingTask.completed })
        });
        if (!res.ok) throw new Error('Failed to update task');
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === editingTask.id ? updated : t)));
        setEditingTask(null);
        showToast('Task updated successfully!', 'success');
      } else {
        // Create task via POST /api/tasks
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to create task');
        }
        const created = await res.json();
        setTasks(prev => [created, ...prev]);
        showToast('Task added successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  // 5. Toggle Completion
  const handleToggleComplete = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate,
          completed: newStatus
        })
      });

      if (!res.ok) throw new Error('Failed to update completion status');
      const updated = await res.json();
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      showToast(newStatus ? 'Task completed!' : 'Task marked as pending', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // 6. Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showToast('Task deleted successfully', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // 7. Multer Attachment Upload
  const handleUploadAttachment = async (taskId, file) => {
    const formData = new FormData();
    formData.append('attachment', file);

    try {
      showToast('Uploading attachment...', 'info');
      const res = await fetch(`/api/tasks/${taskId}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to upload attachment');
      }

      const result = await res.json();
      setTasks(prev => prev.map(t => (t.id === taskId ? result.task : t)));
      showToast('Attachment uploaded successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // 8. Filtered & Sorted Tasks (useMemo optimization)
  const filteredTasks = useMemo(() => {
    const searchLower = search.toLowerCase().trim();

    const filtered = tasks.filter(task => {
      const matchesSearch =
        (task.title || '').toLowerCase().includes(searchLower) ||
        (task.description || '').toLowerCase().includes(searchLower);

      let matchesStatus = true;
      if (statusFilter === 'pending') matchesStatus = !task.completed;
      if (statusFilter === 'completed') matchesStatus = Boolean(task.completed);

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
      if (sortBy === 'oldest') return (a.id || 0) - (b.id || 0);
      if (sortBy === 'alphabetical') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'priority') {
        const rank = { high: 3, medium: 2, low: 1 };
        return (rank[b.priority] || 2) - (rank[a.priority] || 2);
      }
      return 0;
    });
  }, [tasks, search, statusFilter, sortBy]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, percentage };
  }, [tasks]);

  return (
    <div>
      {/* Header with Dark Mode Toggle */}
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />

      <main className="main-content">
        <div className="container">

          {/* Daily Study Tip Widget (useEffect demo) */}
          <StudyTip />

          {/* Statistics Grid (Props & Reusable Components Demo) */}
          <section>
            <h2 className="section-title">📊 Task Overview</h2>
            <div className="stats-grid">
              <StatsCard icon="📋" label="Total Tasks" value={stats.total} type="total" />
              <StatsCard icon="✓" label="Completed" value={stats.completed} type="completed" />
              <StatsCard icon="⏳" label="Pending" value={stats.pending} type="pending" />
              <StatsCard icon="📈" label="Completion %" value={`${stats.percentage}%`} type="percentage" />
            </div>
          </section>

          {/* Controlled Form Section */}
          <TaskForm
            onSaveTask={handleSaveTask}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />

          {/* Search, Filter, and Sort Controls */}
          <FilterControls
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Task List Section with Loading, Error, and Empty states (Lecture 48) */}
          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="section-title" style={{ margin: 0 }}>
                📋 Your Tasks ({filteredTasks.length})
              </h2>
              <button 
                className="btn" 
                onClick={fetchTasks} 
                style={{ padding: '4px 10px', fontSize: '0.8rem', background: 'var(--color-bg-tertiary)' }}
              >
                🔄 Refresh
              </button>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <p>⏳ Loading tasks from backend...</p>
              </div>
            )}

            {error && (
              <div style={{ padding: '16px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: '8px' }}>
                <p>⚠️ Error: {error}</p>
                <button className="btn btn-primary" onClick={fetchTasks} style={{ marginTop: '8px', padding: '4px 12px', fontSize: '0.8rem' }}>
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && filteredTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                <span style={{ fontSize: '2.5rem' }}>📝</span>
                <h3 style={{ marginTop: '8px' }}>No tasks found</h3>
                <p>Add a new task above or adjust your search filter.</p>
              </div>
            )}

            {!loading && !error && filteredTasks.map(task => (
              <TaskCard
                key={task.id || task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={(t) => { setEditingTask(t); window.scrollTo({ top: 350, behavior: 'smooth' }); }}
                onDelete={handleDeleteTask}
                onUploadAttachment={handleUploadAttachment}
              />
            ))}
          </section>

          {/* Meet the Team */}
          <section className="card" style={{ marginTop: '10px' }}>
            <h2 className="section-title">Meet Our Team</h2>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/team/aradhya/index.html" style={{ color: 'var(--color-primary)' }}>👤 Aradhya</a>
              <a href="/team/aaryan/index.html" style={{ color: 'var(--color-primary)' }}>👤 Aaryan</a>
              <a href="/team/gunit/index.html" style={{ color: 'var(--color-primary)' }}>👤 Gunit</a>
            </div>
          </section>

        </div>
      </main>

      {/* Toast Notification Popup */}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            borderLeft: `5px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6'}`,
            zIndex: 1000
          }}
        >
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '⚠️' : 'ℹ️'} {toast.message}
        </div>
      )}
    </div>
  );
}
