// ==============================================================================
// Lecture 35: Native Node.js HTTP Module & Request-Response Lifecycle
// File: node-demos/05_native_http_server.js
// 
// HOW TO RUN:
//   node node-demos/05_native_http_server.js
// 
// PURPOSE FOR VIVA:
//   Shows how Node.js creates a web server WITHOUT Express using the built-in 'http' module.
//   Demonstrates req.method, req.url, res.writeHead, res.end, and manual JSON serialization.
// ==============================================================================

const http = require('http');

const PORT = 4000; // Running on port 4000 so it doesn't conflict with main TaskFlow port 3000

// In-memory demo tasks for native HTTP routing
const demoTasks = [
    { id: 1, title: "Native HTTP module learning", completed: true },
    { id: 2, title: "Understand req and res streams", completed: false }
];

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`[Native HTTP] Received ${req.method} request for: ${req.url}`);

    // Set CORS headers so it can be called from browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Basic Routing
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h2>TaskFlow - Native Node.js HTTP Server Demo (Lec 35)</h2>
            <p>This server is created using Node's built-in <code>http.createServer()</code> without Express.</p>
            <ul>
                <li><a href="/api/tasks">/api/tasks</a> - View raw JSON response</li>
                <li><a href="/health">/health</a> - Health check</li>
            </ul>
        `);
    } else if (req.url === '/api/tasks' && req.method === 'GET') {
        // Return JSON response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            source: "Native Node.js HTTP Module",
            data: demoTasks
        }));
    } else if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "UP", uptimeSeconds: process.uptime() }));
    } else {
        // 404 Route Not Found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Route not found on native HTTP server" }));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Native Node.js HTTP server running at: http://localhost:${PORT}`);
    console.log("Press Ctrl+C to stop.");
});
