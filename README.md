# TaskFlow — Student Task Management System
### Comprehensive Full-Stack Web Application for CHO FA2 Evaluation & Viva

TaskFlow is a modern, student-centric task management platform engineered to organize academic assignments, track productivity statistics, and demonstrate all core topics from **CHO Lectures 25 through 48** (Advanced JavaScript, Node.js fundamentals, Express backend, MongoDB/Mongoose, and React with Vite).

---

## 👥 Team Members

- **Aradhya Sharma** — Team Leader, Architecture & Full-Stack Integration
- **Aaryan** — Frontend Functionality, Styling & Responsive UI
- **Gunit** — Backend Development, Database & APIs

---

## 🚀 Key Features

1. **Dual Frontend Interfaces**:
   - **Vanilla Frontend** (`http://localhost:3000`): Pure HTML5, CSS3, and modern ES6+ JavaScript (`script.js`).
   - **React SPA** (`http://localhost:3000/app` or `http://localhost:5173`): Fast Vite-powered Single Page Application featuring functional components, hooks (`useState`, `useEffect`), controlled forms, and reactive statistics.
2. **Task Management (Full CRUD)**:
   - Create, Read, Update, Delete, and Toggle Completion for academic tasks.
   - Priority levels (`Low`, `Medium`, `High`) with distinct visual badges.
   - Due date tracking and formatted date displays.
3. **Live Search, Filtering & Sorting**:
   - Real-time case-insensitive search by task title or description.
   - Filter by status (`All`, `Pending`, `Completed`).
   - Sort by `Newest First`, `Oldest First`, `Priority`, or `Alphabetical (A–Z)`.
4. **Real-Time Academic Statistics**:
   - Total tasks, Completed count, Pending count, and completion percentage progress bar.
5. **Study Tips API Integration (External & Local Fallback)**:
   - Fetches motivational and productivity tips from external REST APIs using `async/await` and `fetch()`.
   - Built-in offline fallback tips if internet connectivity is unavailable.
6. **Browser Storage (LocalStorage & SessionStorage)**:
   - Persistent Dark / Light theme toggle stored in `localStorage`.
   - Session activity counter tracking user modifications in `sessionStorage`.
7. **Secure Express Backend**:
   - JWT-based authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
   - Password hashing using `bcryptjs`.
   - Input validation and centralized 4-parameter error-handling middleware.
   - Restrictive file attachments upload via `multer` (PDF, JPG, PNG, DOCX; max 2MB).
8. **Dual-Mode Persistence (MongoDB + JSON Fallback)**:
   - Primary: Connects to MongoDB via Mongoose with Schema validation and `populate('user')`.
   - Fail-Safe: Automatically falls back to `data/tasks.json` if MongoDB is not running, ensuring the application runs smoothly on any machine without errors.

---

## 📂 Project Structure

```text
TaskFlow-main/
├── .env.example                # Safe environment variables template
├── .env                        # Local environment configuration
├── config/
│   └── db.js                   # Mongoose connection with dual-mode fallback
├── data/
│   └── tasks.json              # Local JSON persistence storage
├── docs/
│   ├── CHO_SYLLABUS_MAPPING.md # Exact mapping of Lec 25-48 to codebase
│   ├── VIVA_NOTES.md           # 25+ viva questions with concise answers
│   ├── PROJECT_WORKFLOW.md     # Architecture diagrams & sequence flows
│   └── TaskFlow_API.postman_collection.json # Postman API test collection
├── frontend/                   # React Single Page Application (Vite)
│   ├── src/
│   │   ├── components/         # Header, TaskForm, TaskCard, StatsCard, etc.
│   │   ├── App.jsx             # React root SPA component
│   │   ├── main.jsx            # React DOM mounting
│   │   └── index.css           # Component styles matching Vanilla theme
│   ├── index.html              # React entry HTML
│   ├── vite.config.js          # Vite config with /api proxy
│   └── package.json            # React dependencies
├── middleware/
│   ├── auth.js                 # JWT verification & token generation
│   ├── errorHandler.js         # Centralized Express error handler
│   ├── upload.js               # Multer file upload configuration
│   └── validate.js             # Request body validation middleware
├── models/
│   ├── Task.js                 # Mongoose Task schema with user reference
│   └── User.js                 # Mongoose User schema with bcrypt pre-save
├── node-demos/                 # Runnable Node.js fundamental demos (Lec 31-36)
│   ├── 01_event_loop.js        # Event Loop, Call Stack, Microtask queue
│   ├── 02_buffers_streams.js   # Buffer allocation, Streams, and Piping
│   ├── 03_event_emitter.js     # Custom EventEmitter class and listeners
│   ├── 04_fs_path.js           # Async fs.promises and path utilities
│   ├── 05_native_http_server.js# Raw HTTP server without Express
│   ├── 06_commonjs_helper.js   # CommonJS require/module.exports
│   └── 06_es_module.mjs        # ES Modules import/export
├── routes/
│   ├── authRoutes.js           # Register, Login, Protected Me
│   ├── taskRoutes.js           # Task CRUD & Multer attachment routes
│   └── tipRoutes.js            # Study tips REST endpoint
├── scripts/
│   ├── migrateTasks.js         # Tool to migrate JSON tasks into MongoDB
│   └── testBackend.js          # 10-point automated backend test suite
├── demo-advanced-js.html       # Interactive Viva Playground (Lec 25-30)
├── index.html                  # Vanilla frontend entry point
├── package.json                # Main project scripts & dependencies
├── script.js                   # Vanilla frontend logic
├── server.js                   # Express application entry point
└── style.css                   # Complete responsive CSS styling
```

---

## 🛠️ Installation & Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **NPM** (v9 or higher)
- *(Optional)* **MongoDB** (If MongoDB is not installed, TaskFlow runs automatically using `data/tasks.json` fallback!)

### 2. Install Dependencies
Run from the root directory:
```bash
npm install
cd frontend && npm install && npm run build && cd ..
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` values are pre-configured for local development.

### 4. Start the Application
Start the backend server:
```bash
npm start
```
*(Or use `npm run dev` to start with Nodemon auto-reload)*

---

## 🌐 How to Access the Features

| URL | Description |
|---|---|
| `http://localhost:3000` | **Vanilla Frontend** (Original pure JS UI) |
| `http://localhost:3000/app` | **React SPA Frontend** (Served via Express) |
| `http://localhost:3000/demo-advanced-js.html` | **Interactive Viva Demos** (Lec 25–30) |
| `http://localhost:3000/api/status` | **System Health & DB Mode Inspection** |
| `http://localhost:3000/api/tasks` | **REST API Tasks Endpoint** |
| `http://localhost:5173` | **React Vite Dev Server** (`npm run dev:react`) |

---

## 📜 Available NPM Scripts

```bash
# Start backend server
npm start

# Start backend in development mode with Nodemon
npm run dev

# Run automated backend test suite (10/10 tests)
node scripts/testBackend.js

# Build React frontend
npm run build:react

# Start React Vite dev server
npm run dev:react

# Run Node.js fundamental demonstrations (Lectures 31-36)
npm run demo:all          # Run all demos sequentially
npm run demo:event-loop   # Lecture 31-32 Event Loop execution order
npm run demo:streams      # Lecture 33 Buffers & Streams piping
npm run demo:emitter      # Lecture 34 EventEmitter demo
npm run demo:fs           # Lecture 33 File System & Path
npm run demo:http         # Lecture 35 Native HTTP server without Express
npm run demo:modules      # Lecture 32 ES Modules demonstration
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required? |
|---|---|---|---|
| `GET` | `/api/status` | Server health and database connection status | No |
| `GET` | `/api/tasks` | Fetch all tasks (populates User if MongoDB) | No |
| `GET` | `/api/tasks/:id` | Fetch a single task by ID | No |
| `POST` | `/api/tasks` | Create a new task (validated) | Optional (links User) |
| `PUT` | `/api/tasks/:id` | Update an existing task | No |
| `DELETE` | `/api/tasks/:id` | Delete a task | No |
| `POST` | `/api/tasks/:id/upload` | Upload attachment file via Multer | No |
| `POST` | `/api/auth/register` | Register student (hashes password) | No |
| `POST` | `/api/auth/login` | Login student (returns JWT) | No |
| `GET` | `/api/auth/me` | Get authenticated student profile | **Yes (Bearer JWT)** |
| `GET` | `/api/tips/daily` | Get a random academic study tip | No |

---

## 📚 Viva Preparation Documentation

Make sure to review the accompanying documentation prepared in the `docs/` folder:
- [CHO Syllabus Mapping](docs/CHO_SYLLABUS_MAPPING.md) — Exact lecture-by-lecture checklist from Lec 25 to 48.
- [Viva Notes & Top Questions](docs/VIVA_NOTES.md) — 25+ common viva questions with beginner-friendly model answers.
- [Project Workflow & Architecture](docs/PROJECT_WORKFLOW.md) — Visual Mermaid diagrams of requests and JWT flows.
