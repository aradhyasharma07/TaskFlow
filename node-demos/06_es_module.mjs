// ==============================================================================
// Lecture 32: ES Modules (import / export)
// File: node-demos/06_es_module.mjs
// 
// HOW TO RUN:
//   node node-demos/06_es_module.mjs
// 
// PURPOSE FOR VIVA:
//   Demonstrates the modern ECMAScript module standard (ESM):
//   - 'export' and 'import' instead of 'module.exports' and 'require()'
//   - Static analysis at compile time vs runtime evaluation in CommonJS
// ==============================================================================

// Named Export
export function formatStudentId(id) {
    return `STU-${String(id).padStart(5, '0')}`;
}

// Default Export
export default function generateSessionToken() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Self-demonstration test
console.log("=== ES Module (ESM) Demonstration ===");
console.log("Formatted Student ID:", formatStudentId(42));
console.log("Generated Token:", generateSessionToken());
console.log("✓ ES Module executed successfully with native import/export semantics!");
