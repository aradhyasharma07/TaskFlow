// ==============================================================================
// Automated Backend Verification Test Suite
// File: scripts/testBackend.js
// 
// HOW TO RUN:
//   node scripts/testBackend.js
// ==============================================================================

const http = require('http');

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (postData) {
            req.write(JSON.stringify(postData));
        }
        req.end();
    });
}

async function runTests() {
    console.log("=== Running TaskFlow Backend Verification Suite ===\n");
    let passed = 0;
    let failed = 0;

    // Test 1: System Status
    try {
        const res = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/status',
            method: 'GET'
        });
        if (res.status === 200 && res.data.success) {
            console.log("✓ PASS: GET /api/status - Status UP, DB:", res.data.database.provider);
            passed++;
        } else {
            console.error("✗ FAIL: GET /api/status returned status", res.status);
            failed++;
        }
    } catch (e) {
        console.error("✗ FAIL: GET /api/status error:", e.message);
        failed++;
    }

    // Test 2: GET /api/tasks
    try {
        const res = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/tasks',
            method: 'GET'
        });
        if (res.status === 200 && Array.isArray(res.data)) {
            console.log(`✓ PASS: GET /api/tasks - Loaded ${res.data.length} task(s)`);
            passed++;
        } else {
            console.error("✗ FAIL: GET /api/tasks returned status", res.status);
            failed++;
        }
    } catch (e) {
        console.error("✗ FAIL: GET /api/tasks error:", e.message);
        failed++;
    }

    // Test 3: POST /api/tasks (Validation Check)
    try {
        const res = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/tasks',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { title: "" }); // Empty title should be rejected with 400

        if (res.status === 400) {
            console.log("✓ PASS: POST /api/tasks - Input validation rejected empty title with 400 Bad Request");
            passed++;
        } else {
            console.error("✗ FAIL: POST /api/tasks empty title returned status", res.status);
            failed++;
        }
    } catch (e) {
        console.error("✗ FAIL: POST /api/tasks validation test error:", e.message);
        failed++;
    }

    // Test 4: POST /api/tasks (Create Valid Task)
    let createdTaskId = null;
    try {
        const res = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/tasks',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            title: "Automated Test Task",
            description: "Testing CRUD operations",
            priority: "high",
            dueDate: "2026-12-31"
        });

        if (res.status === 201 && res.data.title === "Automated Test Task") {
            createdTaskId = res.data.id;
            console.log(`✓ PASS: POST /api/tasks - Created task #${createdTaskId}`);
            passed++;
        } else {
            console.error("✗ FAIL: POST /api/tasks creation returned status", res.status);
            failed++;
        }
    } catch (e) {
        console.error("✗ FAIL: POST /api/tasks creation test error:", e.message);
        failed++;
    }

    // Test 5: PUT /api/tasks/:id (Update Task)
    if (createdTaskId) {
        try {
            const res = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/tasks/${createdTaskId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            }, {
                title: "Automated Test Task (Updated)",
                description: "Updated description",
                priority: "medium",
                completed: true
            });

            if (res.status === 200 && res.data.completed === true) {
                console.log(`✓ PASS: PUT /api/tasks/${createdTaskId} - Task marked completed`);
                passed++;
            } else {
                console.error("✗ FAIL: PUT /api/tasks update returned status", res.status);
                failed++;
            }
        } catch (e) {
            console.error("✗ FAIL: PUT /api/tasks update test error:", e.message);
            failed++;
        }

        // Test 6: DELETE /api/tasks/:id
        try {
            const res = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/tasks/${createdTaskId}`,
                method: 'DELETE'
            });

            if (res.status === 200) {
                console.log(`✓ PASS: DELETE /api/tasks/${createdTaskId} - Deleted successfully`);
                passed++;
            } else {
                console.error("✗ FAIL: DELETE /api/tasks returned status", res.status);
                failed++;
            }
        } catch (e) {
            console.error("✗ FAIL: DELETE /api/tasks error:", e.message);
            failed++;
        }
    }

    // Test 7: Auth Register & Login
    const testEmail = `student_${Date.now()}@college.edu`;
    let userToken = null;
    try {
        // Register
        const regRes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: "Viva Student",
            email: testEmail,
            password: "password123"
        });

        if (regRes.status === 201 && regRes.data.token) {
            console.log("✓ PASS: POST /api/auth/register - Registered student and generated JWT");
            passed++;
        } else {
            console.error("✗ FAIL: POST /api/auth/register returned", regRes.status);
            failed++;
        }

        // Login
        const loginRes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            email: testEmail,
            password: "password123"
        });

        if (loginRes.status === 200 && loginRes.data.token) {
            userToken = loginRes.data.token;
            console.log("✓ PASS: POST /api/auth/login - Verified bcrypt password & returned JWT");
            passed++;
        } else {
            console.error("✗ FAIL: POST /api/auth/login returned", loginRes.status);
            failed++;
        }

        // Test 8: Protected Route /api/auth/me
        if (userToken) {
            const meRes = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: '/api/auth/me',
                method: 'GET',
                headers: { 'Authorization': `Bearer ${userToken}` }
            });

            if (meRes.status === 200 && meRes.data.user.email === testEmail) {
                console.log("✓ PASS: GET /api/auth/me - Protected route successfully decoded JWT");
                passed++;
            } else {
                console.error("✗ FAIL: GET /api/auth/me returned", meRes.status);
                failed++;
            }
        }
    } catch (e) {
        console.error("✗ FAIL: Auth test error:", e.message);
        failed++;
    }

    // Test 9: Study Tips API
    try {
        const res = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/tips/daily',
            method: 'GET'
        });
        if (res.status === 200 && res.data.data && res.data.data.tip) {
            console.log(`✓ PASS: GET /api/tips/daily - Returned tip: "${res.data.data.tip}"`);
            passed++;
        } else {
            console.error("✗ FAIL: GET /api/tips/daily returned status", res.status);
            failed++;
        }
    } catch (e) {
        console.error("✗ FAIL: GET /api/tips/daily error:", e.message);
        failed++;
    }

    console.log(`\n=========================================`);
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log(`=========================================\n`);
    process.exit(failed > 0 ? 1 : 0);
}

runTests();
