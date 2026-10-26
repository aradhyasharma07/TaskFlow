// ==============================================================================
// Lecture 32: CommonJS Module Pattern (require & module.exports)
// File: node-demos/06_commonjs_helper.js
// ==============================================================================

function formatTaskTitle(title) {
    if (!title) return '';
    return title.trim().toUpperCase();
}

function calculateTaskUrgency(priority, dueDate) {
    if (priority === 'high') return 'URGENT';
    if (!dueDate) return 'NORMAL';
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 2 ? 'DUE SOON' : 'NORMAL';
}

// CommonJS Export Syntax
module.exports = {
    formatTaskTitle,
    calculateTaskUrgency
};
