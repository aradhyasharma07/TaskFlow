# CHO FA2 Syllabus to Codebase Mapping (Lectures 25–48)

This document maps every single topic in the **CHO FA2 Evaluation Syllabus** directly to the source code files and demonstration modules implemented in **TaskFlow — Student Task Management System**.

---

## Summary Status Table

| Lecture Block | Topics Covered | Implementation Status | Primary File(s) |
|---|---|---|---|
| **Lec 25–26** | Callbacks, Asynchronous JS, Non-blocking I/O | **Implemented & Demo** | `script.js`, `demo-advanced-js.html`, `node-demos/01_event_loop.js` |
| **Lec 27** | Promises & Promise Chaining | **Implemented & Demo** | `script.js` (`fetchDailyStudyTipWithPromiseChain`), `demo-advanced-js.html` |
| **Lec 28** | Async/Await & Try/Catch Error Handling | **Implemented** | `script.js` (`addTask`, `loadTasks`, `fetchDailyStudyTip`), `frontend/src/App.jsx` |
| **Lec 29** | Fetch API, REST APIs, JSON Parsing, Error Responses | **Implemented** | `script.js`, `routes/taskRoutes.js`, `routes/tipRoutes.js` |
| **Lec 30** | LocalStorage, SessionStorage, Form Validation | **Implemented** | `script.js` (`initTheme`, `updateSessionActions`, `validateTaskForm`) |
| **Lec 31** | Node.js Intro, V8 Engine, Architecture | **Demonstrated** | `node-demos/01_event_loop.js`, `docs/VIVA_NOTES.md` |
| **Lec 32** | Event Loop, Call Stack, CommonJS vs ES Modules | **Implemented & Demo** | `node-demos/01_event_loop.js`, `node-demos/06_commonjs_helper.js`, `node-demos/06_es_module.mjs` |
| **Lec 33** | File System (fs), Path Module, Buffers, Streams | **Implemented & Demo** | `node-demos/02_buffers_streams.js`, `node-demos/04_fs_path.js`, `routes/taskRoutes.js` |
| **Lec 34** | EventEmitter & Event-driven Architecture | **Demonstrated** | `node-demos/03_event_emitter.js` |
| **Lec 35** | Native Node.js HTTP Module & Routing | **Demonstrated** | `node-demos/05_native_http_server.js` |
| **Lec 36** | NPM, Package.json, Scripts, Nodemon, Dotenv | **Implemented** | `package.json`, `.env`, `.env.example`, `server.js` |
| **Lec 37** | Express Server Setup, Routing, Req/Res Lifecycle | **Implemented** | `server.js`, `routes/taskRoutes.js` |
| **Lec 38** | Express Middleware, Body Parsing, Centralized Error Handling | **Implemented** | `middleware/errorHandler.js`, `middleware/validate.js`, `server.js` |
| **Lec 39** | REST API Principles, CRUD Operations, Bcrypt Hashing | **Implemented** | `routes/taskRoutes.js`, `routes/authRoutes.js`, `models/User.js` |
| **Lec 40** | JWT Authentication, Protected Routes, Multer Uploads | **Implemented** | `middleware/auth.js`, `middleware/upload.js`, `routes/authRoutes.js` |
| **Lec 41** | MongoDB, Mongoose Schemas, Validation, populate(), Dual Mode | **Implemented** | `config/db.js`, `models/Task.js`, `models/User.js`, `scripts/migrateTasks.js` |
| **Lec 42** | React Introduction, SPA Concept, JSX, Vite Setup | **Implemented** | `frontend/vite.config.js`, `frontend/index.html`, `frontend/src/main.jsx` |
| **Lec 43** | Functional Components & Reusable UI | **Implemented** | `frontend/src/components/Header.jsx`, `frontend/src/components/StatsCard.jsx` |
| **Lec 44** | Props & Parent-to-Child Communication | **Implemented** | `frontend/src/components/StatsCard.jsx`, `frontend/src/components/TaskCard.jsx` |
| **Lec 45** | useState Hook with Multiple State Variables | **Implemented** | `frontend/src/App.jsx`, `frontend/src/components/TaskForm.jsx` |
| **Lec 46** | Event Handling, Controlled Forms, Form Validation | **Implemented** | `frontend/src/components/TaskForm.jsx`, `frontend/src/components/FilterControls.jsx` |
| **Lec 47** | useEffect Hook & Backend Synchronization | **Implemented** | `frontend/src/App.jsx`, `frontend/src/components/StudyTip.jsx` |
| **Lec 48** | Loading States, Error States, and Empty States | **Implemented** | `frontend/src/App.jsx` |

---

## Detailed Topic-by-Topic Breakdown

### 1. Advanced JavaScript & API Integration (Lectures 25–30)
- **Callbacks (Lec 25)**:
  - Demo: [demo-advanced-js.html](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/demo-advanced-js.html#L70) — `simulateFetchTaskCallback` runs with an asynchronous timer callback demonstrating non-blocking control flow.
- **Promises & Promise Chaining (Lec 26–27)**:
  - Demo: [demo-advanced-js.html](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/demo-advanced-js.html#L90) — sequential `.then().then().catch()` chains.
  - In Core App: [script.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/script.js#L235) — `fetchDailyStudyTipWithPromiseChain()` demonstrates chained resolution and error rejection.
- **Async/Await & Try/Catch (Lec 28)**:
  - In Core App: [script.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/script.js#L190) (`loadTasks`, `addTask`, `updateTask`, `deleteTask`, `fetchDailyStudyTip`).
  - In React App: [App.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/App.jsx#L58).
- **Fetch API & REST API Consumption (Lec 29)**:
  - Endpoints consumed: GET `/api/tasks`, POST `/api/tasks`, PUT `/api/tasks/:id`, DELETE `/api/tasks/:id`, GET `/api/tips/daily`, and external `https://api.adviceslip.com/advice`.
  - Proper status checking: `if (!response.ok) throw new Error(...)`.
- **LocalStorage & SessionStorage (Lec 30)**:
  - LocalStorage: [script.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/script.js#L95) (`taskflow_theme`) persists the dark/light mode across browser restarts.
  - SessionStorage: [script.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/script.js#L130) (`taskflow_actions`) tracks student interactions during the current tab session.
- **Form Handling & Validation (Lec 30)**:
  - Client-side validation in [script.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/script.js#L270) (`validateTaskForm`) and React [TaskForm.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/TaskForm.jsx#L40).

### 2. Node.js Fundamentals (Lectures 31–36)
- **Event Loop, Call Stack & Microtasks (Lec 31–32)**:
  - Demo: [01_event_loop.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/node-demos/01_event_loop.js) — runs `process.nextTick`, `Promise.then`, `setTimeout`, and `setImmediate` with full output logging.
- **CommonJS vs ES Modules (Lec 32)**:
  - CommonJS: [06_commonjs_helper.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/node-demos/06_commonjs_helper.js) using `module.exports` and `require()`.
  - ES Modules: [06_es_module.mjs](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/node-demos/06_es_module.mjs) using `export` and `import`.
- **Buffers & Streams (Lec 33)**:
  - Demo: [02_buffers_streams.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/node-demos/02_buffers_streams.js) — demonstrates raw memory buffers, readable/writable streams, and stream piping (`pipe()`).
- **File System & Path (Lec 33)**:
  - Demo: [04_fs_path.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/node-demos/04_fs_path.js) — `path.join`, `path.resolve`, `path.extname`, and non-blocking `fs.promises.writeFile/readFile`.
- **EventEmitter (Lec 34)**:
  - Demo: [03_event_emitter.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/node-demos/03_event_emitter.js) — custom `TaskEventManager` emitting `taskCreated` and `taskCompleted` events with `.on()` and `.once()`.
- **Native HTTP Module (Lec 35)**:
  - Demo: [05_native_http_server.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/node-demos/05_native_http_server.js) — native HTTP server without Express showing raw `http.createServer`, headers, and request routing.
- **Environment Variables & NPM (Lec 36)**:
  - Config: [.env](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/.env), [.env.example](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/.env.example), [package.json](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/package.json) with nodemon and custom demo scripts.

### 3. Express and Backend Development (Lectures 37–40)
- **Express Server & Routing (Lec 37)**:
  - Implementation: [server.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/server.js), [taskRoutes.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/routes/taskRoutes.js).
- **Middleware & Error Handling (Lec 38)**:
  - Centralized error handler: [errorHandler.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/middleware/errorHandler.js).
  - Validation middleware: [validate.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/middleware/validate.js).
- **REST CRUD Operations & Bcrypt (Lec 39)**:
  - Implementation: [taskRoutes.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/routes/taskRoutes.js), [authRoutes.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/routes/authRoutes.js), and password hashing via `bcrypt.hash()` / `compare()`.
- **JWT Authentication & Multer Uploads (Lec 40)**:
  - JWT verification & token generation: [auth.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/middleware/auth.js).
  - Multer attachment uploads: [upload.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/middleware/upload.js) with file type filtering and 2MB limits.

### 4. MongoDB & Mongoose (Lecture 41)
- **Connection Configuration & Dual Mode**:
  - Implementation: [config/db.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/config/db.js).
  - Dual Mode: Automatically uses MongoDB if running, or gracefully falls back to `data/tasks.json` so the app is guaranteed to run on any machine.
- **Mongoose Schemas & Validation**:
  - Implementation: [models/Task.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/models/Task.js) (enum validation, required fields, timestamps).
  - Implementation: [models/User.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/models/User.js) (email regex, password hashing pre-save hook).
- **Relationships & `populate()`**:
  - Implemented in [taskRoutes.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/routes/taskRoutes.js#L50): `Task.find().populate('user', 'name email')`.
- **Migration Script**:
  - Tool: [scripts/migrateTasks.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/scripts/migrateTasks.js).

### 5. React Frontend with Vite (Lectures 42–48)
- **Vite Setup & SPA (Lec 42)**: [frontend/vite.config.js](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/vite.config.js), [frontend/src/main.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/main.jsx).
- **Functional Components (Lec 43)**: [Header.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/Header.jsx).
- **Props & Parent-Child Communication (Lec 44)**: [StatsCard.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/StatsCard.jsx), [TaskCard.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/TaskCard.jsx).
- **useState Hook (Lec 45)**: [App.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/App.jsx#L25).
- **Event Handling & Controlled Components (Lec 46)**: [TaskForm.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/TaskForm.jsx), [FilterControls.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/FilterControls.jsx).
- **useEffect Hook & API Sync (Lec 47)**: [App.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/App.jsx#L58), [StudyTip.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/components/StudyTip.jsx).
- **Loading, Error, & Empty States (Lec 48)**: [App.jsx](file:///c:/Users/aradhya/OneDrive/Desktop/TaskFlow-main/frontend/src/App.jsx#L210-L240).
