# CHO FA2 Syllabus to Unified Codebase Mapping (Lectures 25–48)

This document maps every single topic in the **CHO FA2 Evaluation Syllabus** directly to the **ONE Unified Website (`http://localhost:3000/`)**, its interactive tabs, and the corresponding CLI commands.

---

## Unified Website Navigation Map (`http://localhost:3000/`)

The evaluation platform at `http://localhost:3000/` contains 6 integrated tabs:
1. **📋 Task Manager** — Core CRUD, search, filter, priority sort, stats, and study tip API.
2. **⚡ Advanced JS** — Interactive demonstrations for Lectures 25–30.
3. **🟢 Node.js Core** — In-browser and terminal demonstrations for Lectures 31–36.
4. **🚂 Express & Auth** — Interactive backend API, validation, error handling, and JWT testing for Lectures 37–40.
5. **🍃 MongoDB** — Real database health, schemas, and `populate()` relationship testing for Lecture 41.
6. **⚛️ React SPA** — Embedded live React 19 application and concepts matrix for Lectures 42–48.

---

## Detailed Topic-by-Topic Breakdown

### 1. Advanced JavaScript & API Integration (Lectures 25–30)
- **Demonstration Location**: Tab **⚡ Advanced JS (Lec 25–30)** on `http://localhost:3000/`.
- **Callbacks (Lec 25)**:
  - Code: [`script.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/script.js#L930) — `runJsCallbackDemo()` simulates an asynchronous task fetch with a callback and non-blocking timing.
- **Promises & Promise Chaining (Lec 26–27)**:
  - Code: [`script.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/script.js#L955) — `runJsPromiseDemo()` chains multiple `.then()` stages and `.catch()` rejections.
  - In Task Manager: `fetchDailyStudyTipWithPromiseChain()` demonstrates real API promise chaining.
- **Async/Await & Try/Catch (Lec 28)**:
  - Code: [`script.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/script.js#L990) — `runJsAsyncDemo()` and `runJsAsyncErrorDemo()`.
  - In Task Manager: `addTask`, `loadTasks`, `updateTask`, `deleteTask`.
- **Fetch API & REST API Consumption (Lec 29)**:
  - Interactive tester: Fetches from `/api/tasks` and external `https://api.adviceslip.com/advice` with `response.ok` checks.
- **LocalStorage & SessionStorage (Lec 30)**:
  - Interactive inspector: Displays permanent theme in `localStorage` and tab session interaction counts in `sessionStorage`.
- **Form Handling & Validation (Lec 30)**:
  - Client-side validation in `validateTaskForm(title)` with visual border highlights and error messages.

---

### 2. Node.js Fundamentals (Lectures 31–36)
- **Demonstration Location**: Tab **🟢 Node.js Core (Lec 31–36)** on `http://localhost:3000/`, with one-click in-browser execution AND terminal commands.
- **Event Loop, Call Stack & Microtasks (Lec 31–32)**:
  - In Browser: Click **"Run Script in Browser"** on Card 1.
  - Terminal Command: `npm run demo:event-loop` (or `node node-demos/01_event_loop.js`).
  - Output shows: Synchronous call stack &rarr; `process.nextTick` &rarr; `Promise.then` &rarr; `setImmediate` &rarr; `setTimeout`.
- **Buffers & Streams (Lec 33)**:
  - In Browser: Click **"Run Script in Browser"** on Card 2.
  - Terminal Command: `npm run demo:streams` (or `node node-demos/02_buffers_streams.js`).
  - Output shows: Buffer allocation, string conversion, readable streams, and `.pipe()` execution.
- **EventEmitter (Lec 34)**:
  - In Browser: Click **"Run Script in Browser"** on Card 3.
  - Terminal Command: `npm run demo:emitter` (or `node node-demos/03_event_emitter.js`).
  - Output shows: `TaskEventManager` emitting `taskCreated` and `taskCompleted` to multiple listeners and a `.once()` listener.
- **File System & Path (Lec 33)**:
  - In Browser: Click **"Run Script in Browser"** on Card 4.
  - Terminal Command: `npm run demo:fs` (or `node node-demos/04_fs_path.js`).
  - Output shows: Cross-platform `path.join/resolve/extname` and non-blocking `fs.promises` async file write/read.
- **Native HTTP Module (Lec 35)**:
  - In Browser: Click **"View Native HTTP Implementation Notes"** on Card 5.
  - Terminal Command: `node node-demos/05_native_http_server.js` (launches raw server on port 4000 without Express).
- **CommonJS vs ES Modules (Lec 32)**:
  - In Browser: Card in Node.js tab.
  - Terminal Command: `npm run demo:modules` (executes `node node-demos/06_es_module.mjs`).

---

### 3. Express, Middleware, REST APIs & Security (Lectures 37–40)
- **Demonstration Location**: Tab **🚂 Express & Auth (Lec 37–40)** on `http://localhost:3000/`.
- **Input Validation Middleware (Lec 38)**:
  - Interactive tester: Sends empty title to `POST /api/tasks`; displays real `400 Bad Request` JSON error.
  - Code: [`middleware/validate.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/middleware/validate.js).
- **Centralized Error-Handling Middleware (Lec 38)**:
  - Interactive tester: Sends request to `/api/invalid-endpoint-test-404`; displays structured error response from the 4-parameter error handler `(err, req, res, next)`.
  - Code: [`middleware/errorHandler.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/middleware/errorHandler.js).
- **JWT Authentication & Bcrypt Password Hashing (Lec 39–40)**:
  - Interactive console:
    1. Register student (`POST /api/auth/register`) &rarr; hashes password with `bcryptjs`, issues JWT.
    2. Login student (`POST /api/auth/login`) &rarr; verifies hash with `bcrypt.compare`, issues JWT.
    3. Access protected route (`GET /api/auth/me`) &rarr; passes `Authorization: Bearer <token>`, `verifyToken` middleware decodes user.
  - Code: [`middleware/auth.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/middleware/auth.js), [`routes/authRoutes.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/routes/authRoutes.js).
- **Multer File Upload (Lec 40)**:
  - Interactive tester: Uploads `.pdf`, `.png`, `.jpg`, `.docx`, or `.txt` file with 2MB limit to `POST /api/tasks/:id/upload`, updates task attachment field, and serves it statically at `/uploads/:filename`.
  - Code: [`middleware/upload.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/middleware/upload.js).

---

### 4. MongoDB & Mongoose (Lecture 41)
- **Demonstration Location**: Tab **🍃 MongoDB (Lec 41)** on `http://localhost:3000/`.
- **Real-Time Database Health**:
  - Live button queries `/api/status`: confirms active connection (`readyState = 1`), provider (`MongoDB / Mongoose`), and server uptime.
- **Mongoose Schemas & Validation**:
  - Code inspector shows [`models/Task.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/models/Task.js) (enum validation, required fields, user reference) and [`models/User.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/models/User.js) (email regex, bcrypt pre-save hook).
- **Relationships & `populate()`**:
  - Live tester queries `GET /api/tasks` and displays populated user details (`{ name, email }`) linked to the task.
- **Fail-Safe Dual-Mode Fallback**:
  - Code in [`config/db.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/config/db.js): If MongoDB is offline, automatically uses `data/tasks.json` so the evaluation never crashes.
- **Migration Tool (Terminal Command)**:
  - Command: `node scripts/migrateTasks.js` (imports JSON tasks into MongoDB).

---

### 5. React Frontend with Vite (Lectures 42–48)
- **Demonstration Location**: Tab **⚛️ React SPA (Lec 42–48)** on `http://localhost:3000/`.
- **Embedded Live React Application**:
  - Embedded seamlessly in an `<iframe>` pointing to `/app/` on the same server, allowing direct interaction with the React interface without leaving `http://localhost:3000/`.
- **Topics Demonstrated**:
  - **Lec 42 (SPA & Vite)**: Single Page Application architecture configured in [`frontend/vite.config.js`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/vite.config.js).
  - **Lec 43 (Functional Components)**: [`Header.jsx`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/Header.jsx), [`StatsCard.jsx`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/StatsCard.jsx).
  - **Lec 44 (Props)**: Data passed into `StatsCard` (`icon`, `label`, `value`, `type`) and `TaskCard` (`task`, event handlers).
  - **Lec 45 (useState Hook)**: State variables in [`App.jsx`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/App.jsx) (`tasks`, `loading`, `error`, `editingTask`, `search`, `statusFilter`, `sortBy`, `darkMode`).
  - **Lec 46 (Controlled Forms & Events)**: [`TaskForm.jsx`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/TaskForm.jsx) and [`FilterControls.jsx`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/FilterControls.jsx).
  - **Lec 47 (useEffect Hook)**: Data fetching on mount in [`App.jsx`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/App.jsx#L58) and [`StudyTip.jsx`](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/StudyTip.jsx#L28).
  - **Lec 48 (Loading, Error & Empty States)**: Conditional rendering blocks in `App.jsx`.
- **Terminal Commands**:
  - `npm run build:react` — Compiles the React SPA.
  - `npm run dev:react` — Runs independent Vite development server on port 5173.
