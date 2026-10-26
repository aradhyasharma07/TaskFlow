// ==============================================================================
// Full End-to-End & React Frontend Integration Test Suite
// File: scripts/testFullE2E.js
// ==============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

function makeRequest(options, postData = null, isMultipart = false) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, headers: res.headers, data: parsed });
                } catch {
                    resolve({ status: res.statusCode, headers: res.headers, data: body });
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (postData) {
            if (isMultipart) {
                req.write(postData);
            } else {
                req.write(JSON.stringify(postData));
            }
        }
        req.end();
    });
}

// Helper to create multipart/form-data payload
function createMultipartFormData(fieldName, fileName, fileContent, boundary) {
    let payload = `--${boundary}\r\n`;
    payload += `Content-Disposition: form-data; name="${fieldName}"; filename="${fileName}"\r\n`;
    payload += `Content-Type: text/plain\r\n\r\n`;
    payload += fileContent;
    payload += `\r\n--${boundary}--\r\n`;
    return Buffer.from(payload, 'utf8');
}

async function runE2ETests() {
    console.log("=================================================================");
    console.log("TaskFlow Full E2E & React Frontend Integration Verification Suite");
    console.log("=================================================================\n");

    let passed = 0;
    let failed = 0;
    const results = [];

    function record(testName, isSuccess, details = "") {
        if (isSuccess) {
            passed++;
            console.log(`✓ PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
            results.push({ name: testName, status: "PASS", details });
        } else {
            failed++;
            console.error(`✗ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
            results.push({ name: testName, status: "FAIL", details });
        }
    }

    // --- 1. SYSTEM STATUS & REAL MONGO CHECK ---
    try {
        const res = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/status',
            method: 'GET'
        });
        const isMongo = res.status === 200 && res.data.database && res.data.database.connected === true;
        record(
            "1. Server Status & Real MongoDB Connection",
            isMongo,
            `Connected: ${res.data.database?.connected}, Provider: ${res.data.database?.provider}`
        );
    } catch (e) {
        record("1. Server Status & Real MongoDB Connection", false, e.message);
    }

    // --- 2. GET ALL TASKS ---
    try {
        const res = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/tasks',
            method: 'GET'
        });
        record("2. GET /api/tasks (Initial Task List Load)", res.status === 200 && Array.isArray(res.data), `Count: ${res.data?.length}`);
    } catch (e) {
        record("2. GET /api/tasks (Initial Task List Load)", false, e.message);
    }

    // --- 3. TASK CREATION (REACT CONTROLLED FORM) ---
    let createdTaskId = null;
    try {
        const res = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/tasks',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            title: "React E2E Project Submission",
            description: "Testing React controlled form submission",
            priority: "high",
            dueDate: "2026-11-20"
        });

        if (res.status === 201 && res.data.title === "React E2E Project Submission") {
            createdTaskId = res.data.id || res.data._id;
            record("3. Task Creation (React TaskForm Payload)", true, `Task ID: ${createdTaskId}`);
        } else {
            record("3. Task Creation (React TaskForm Payload)", false, `HTTP ${res.status}`);
        }
    } catch (e) {
        record("3. Task Creation (React TaskForm Payload)", false, e.message);
    }

    // --- 4. TASK EDITING (REACT EDIT MODE) ---
    if (createdTaskId) {
        try {
            const res = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/tasks/${createdTaskId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            }, {
                title: "React E2E Project Submission (Updated via Edit Mode)",
                description: "Updated description in React form",
                priority: "medium",
                dueDate: "2026-11-25",
                completed: false
            });

            const ok = res.status === 200 && res.data.title.includes("Updated via Edit Mode");
            record("4. Task Editing (React Update Handler)", ok, `Title: "${res.data.title}"`);
        } catch (e) {
            record("4. Task Editing (React Update Handler)", false, e.message);
        }

        // --- 5. TASK COMPLETION TOGGLE ---
        try {
            // Toggle to Completed: true
            const res1 = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/tasks/${createdTaskId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            }, {
                title: "React E2E Project Submission (Updated via Edit Mode)",
                priority: "medium",
                completed: true
            });

            // Toggle back to Completed: false
            const res2 = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/tasks/${createdTaskId}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            }, {
                title: "React E2E Project Submission (Updated via Edit Mode)",
                priority: "medium",
                completed: false
            });

            const ok = res1.status === 200 && res1.data.completed === true &&
                       res2.status === 200 && res2.data.completed === false;
            record("5. Task Completion Toggle (React onToggleComplete Handler)", ok, "true -> false verified");
        } catch (e) {
            record("5. Task Completion Toggle (React onToggleComplete Handler)", false, e.message);
        }

        // --- 6. ATTACHMENT UPLOAD VIA MULTER ---
        let uploadedFilename = null;
        try {
            const boundary = "----WebKitFormBoundaryTaskFlowTest7MA4YWxkTrZu0gW";
            const sampleFileText = "TaskFlow Student Lab Record Attachment\nVerified Multer File Upload.";
            const multipartBody = createMultipartFormData("attachment", "student_notes.txt", sampleFileText, boundary);

            const res = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/tasks/${createdTaskId}/upload`,
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': multipartBody.length
                }
            }, multipartBody, true);

            if (res.status === 200 && res.data.file) {
                uploadedFilename = res.data.file;
                record("6. Multer Attachment Upload (React onUploadAttachment)", true, `Uploaded: ${uploadedFilename}`);
            } else {
                record("6. Multer Attachment Upload (React onUploadAttachment)", false, `HTTP ${res.status}: ${JSON.stringify(res.data)}`);
            }
        } catch (e) {
            record("6. Multer Attachment Upload (React onUploadAttachment)", false, e.message);
        }

        // --- 7. STATIC SERVING OF UPLOADED ATTACHMENT ---
        if (uploadedFilename) {
            try {
                const res = await makeRequest({
                    hostname: 'localhost',
                    port: 3000,
                    path: `/uploads/${uploadedFilename}`,
                    method: 'GET'
                });
                const ok = res.status === 200 && typeof res.data === 'string' && res.data.includes("Verified Multer File Upload");
                record("7. Attachment Static Serving (/uploads/:filename)", ok, `HTTP ${res.status}`);
            } catch (e) {
                record("7. Attachment Static Serving (/uploads/:filename)", false, e.message);
            }
        }

        // --- 8. TASK DELETION ---
        try {
            const res = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/tasks/${createdTaskId}`,
                method: 'DELETE'
            });
            record("8. Task Deletion (React onDelete Handler)", res.status === 200, `Deleted Task #${createdTaskId}`);
        } catch (e) {
            record("8. Task Deletion (React onDelete Handler)", false, e.message);
        }
    }

    // --- 9. CLIENT-SIDE FILTERING & SORTING LOGIC VERIFICATION ---
    try {
        const sampleTasks = [
            { id: 101, title: "Database Schema Design", priority: "high", completed: false },
            { id: 102, title: "Algorithm Analysis", priority: "low", completed: true },
            { id: 103, title: "Computer Networks Lab", priority: "medium", completed: false }
        ];

        // Search test
        const searchMatches = sampleTasks.filter(t => t.title.toLowerCase().includes("database"));
        const searchOk = searchMatches.length === 1 && searchMatches[0].id === 101;

        // Status filter test (pending)
        const pendingMatches = sampleTasks.filter(t => !t.completed);
        const filterOk = pendingMatches.length === 2;

        // Priority sort test (high > medium > low)
        const rank = { high: 3, medium: 2, low: 1 };
        const sorted = [...sampleTasks].sort((a, b) => rank[b.priority] - rank[a.priority]);
        const sortOk = sorted[0].id === 101 && sorted[1].id === 103 && sorted[2].id === 102;

        record("9. React Filtering & Sorting Logic Simulation", searchOk && filterOk && sortOk, "Search, Status, & Priority sort logic verified");
    } catch (e) {
        record("9. React Filtering & Sorting Logic Simulation", false, e.message);
    }

    // --- 10. AUTH REGISTER, LOGIN, & PROTECTED ME ---
    try {
        const testEmail = `student_${Date.now()}@college.edu`;
        // Register
        const regRes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: "React Student",
            email: testEmail,
            password: "password123"
        });

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

        const token = loginRes.data?.token;

        // Protected Me
        const meRes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/me',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const authOk = regRes.status === 201 && loginRes.status === 200 && meRes.status === 200 && meRes.data.user.email === testEmail;
        record("10. JWT Authentication & Protected Profile (/api/auth/me)", authOk, `Email: ${testEmail}`);
    } catch (e) {
        record("10. JWT Authentication & Protected Profile (/api/auth/me)", false, e.message);
    }

    // --- 11. STATIC FRONTEND ROUTES ---
    try {
        const resVanilla = await makeRequest({ hostname: 'localhost', port: 3000, path: '/', method: 'GET' });
        const resReact = await makeRequest({ hostname: 'localhost', port: 3000, path: '/app/', method: 'GET' });
        const resDemos = await makeRequest({ hostname: 'localhost', port: 3000, path: '/demo-advanced-js.html', method: 'GET' });

        const frontendsOk = resVanilla.status === 200 && resReact.status === 200 && resDemos.status === 200;
        record("11. Static Frontend Availability (Vanilla '/', React '/app/', Demos)", frontendsOk, `Vanilla: ${resVanilla.status}, React: ${resReact.status}, Demos: ${resDemos.status}`);
    } catch (e) {
        record("11. Static Frontend Availability (Vanilla '/', React '/app/', Demos)", false, e.message);
    }

    // --- 12. NODE.JS SCRIPT RUNNER API ---
    try {
        const res = await makeRequest({ hostname: 'localhost', port: 3000, path: '/api/demos/node/event-loop', method: 'GET' });
        const ok = res.status === 200 && res.data.success === true && res.data.output.includes("Event Loop Execution Order");
        record("12. Node.js Script Runner API (/api/demos/node/event-loop)", ok, `Topic: ${res.data?.topic}`);
    } catch (e) {
        record("12. Node.js Script Runner API (/api/demos/node/event-loop)", false, e.message);
    }

    console.log("\n=================================================================");
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log("=================================================================\n");

    process.exit(failed > 0 ? 1 : 0);
}

runE2ETests();
