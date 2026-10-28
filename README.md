# TaskFlow — Student Task Management System
### Comprehensive Full-Stack Web Application for CHO FA2 Evaluation & Viva (Lectures 25–48)

TaskFlow is a modern, student-centric task management platform engineered to organize academic assignments, track productivity statistics, and provide **ONE Unified Evaluation Platform** demonstrating all core topics from **CHO Lectures 25 through 48** (Advanced JavaScript, Node.js fundamentals, Express backend, MongoDB/Mongoose, and React with Vite).

---

## 👥 Team Members

- **Aradhya Sharma** — Team Leader, Architecture & Full-Stack Integration
- **Aaryan** — Frontend Functionality, Styling & Responsive UI
- **Gunit** — Backend Development, Database & APIs

---

## 🎯 The Unified Dashboard Layout (`http://localhost:3000/`)

The website organizes the entire CHO FA2 syllabus into **6 intuitive tabs** located directly under the header:

| Tab Name | Syllabus Coverage | Interactive Demonstrations Included |
|---|---|---|
| **📋 Task Manager** *(Default)* | Core System | Task CRUD, Priority Badges, Due Dates, Live Search, Status Filter, Sorting, Statistics Progress, and Daily Study Tip with external API & local fallback. |
| **⚡ Advanced JS** | Lectures 25–30 | Live browser demos: Callbacks, Promise Chaining (`.then().catch()`), Async/Await with `try/catch`, Fetch API with status checking (`response.ok`), and LocalStorage vs SessionStorage inspector. |
| **🟢 Node.js Core** | Lectures 31–36 | In-browser script execution & terminal reference for Event Loop microtasks (`process.nextTick`, `Promise`), Buffers & Stream piping, EventEmitter, File System (`fs.promises`) & `path`, and native HTTP server without Express. |
| **🚂 Express & Auth** | Lectures 37–40 | Live Express laboratory: Input validation rejection (400), Centralized Error Handler (4-parameter middleware), JWT Student Registration & Login (bcrypt hashing), Protected Profile query (`/api/auth/me`), and Multer file attachment upload. |
| **🍃 MongoDB** | Lecture 41 | Real-time database connection health monitor (`/api/status`), Mongoose Schema code inspector (`Task` & `User`), live `populate('user')` relationship query, and fail-safe dual-mode storage fallback. |
| **⚛️ React SPA** | Lectures 42–48 | Seamlessly embedded live React 19 Single Page Application interacting with the Express backend, accompanied by explanations of JSX, Functional Components, Props, `useState`, Controlled Forms, `useEffect`, and Loading/Error/Empty states. |

---

## 🛠️ Installation & Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended; verified on Node v26)
- **NPM** (v9 or higher)
- *(Optional)* **MongoDB** (If MongoDB is running, TaskFlow automatically uses it; if not installed or offline, TaskFlow automatically falls back to `data/tasks.json` so the app never crashes!)

### 2. Install Dependencies & Build React
Run from the root directory:
```bash
npm install
npm run build:react
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Default `.env` is pre-configured with secure environment variable names and local database URIs. `.env` is ignored by Git and never committed).*

### 4. Start the Unified Server
```bash
npm start
```
*(Or run `npm run dev` for Nodemon auto-reloading)*

Open your browser to: **`http://localhost:3000/`**

---

## 🧪 Automated Verification & Testing

TaskFlow includes two automated test suites ensuring zero regressions:

```bash
# 1. Run Core Backend Test Suite (10 Tests)
node scripts/testBackend.js

# 2. Run Full E2E & React Integration Test Suite (12 Tests)
node scripts/testFullE2E.js
```

### All Tests Verified:
- `GET /api/status` — Server UP, Database connection reported.
- `GET /api/tasks` — Task array retrieved.
- `POST /api/tasks` validation — Empty title rejected with `400 Bad Request`.
- `POST /api/tasks` creation — Created task with server-assigned ID.
- `PUT /api/tasks/:id` update — Task fields updated and completion toggled.
- `DELETE /api/tasks/:id` — Task removed.
- `POST /api/tasks/:id/upload` — Multer uploaded attachment file.
- Static attachment serving — `/uploads/:filename` served with `HTTP 200`.
- `POST /api/auth/register` — Bcrypt hashed password & generated JWT.
- `POST /api/auth/login` — Password verified & returned JWT.
- `GET /api/auth/me` — Protected route verified Bearer token.
- `GET /api/tips/daily` — Academic study tip returned.
- `GET /api/demos/node/event-loop` — Node.js script executed and output returned.
- Static routes — `/`, `/app/` returned `HTTP 200`.

---

## 💻 Terminal Demonstrations for Viva

Every topic that can be demonstrated from the terminal has dedicated scripts in `package.json`:

```bash
# Lectures 31-32: Event Loop, Call Stack, Microtasks & Timers
npm run demo:event-loop

# Lecture 33: Buffers & Stream Piping
npm run demo:streams

# Lecture 34: EventEmitter with Custom Event Listeners
npm run demo:emitter

# Lecture 33: Async File System (fs.promises) & Path Module
npm run demo:fs

# Lecture 35: Native Node.js HTTP Server on Port 4000 (without Express)
npm run demo:http

# Lecture 32: ES Modules (import/export) Demonstration
npm run demo:modules

# Run All Node.js Demos Sequentially
npm run demo:all

# Lecture 41: MongoDB Migration Tool (Copies data/tasks.json to MongoDB)
node scripts/migrateTasks.js

# Lectures 42-48: Start Independent React Vite Dev Server (Port 5173)
npm run dev:react
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required? |
|---|---|---|---|
| `GET` | `/api/status` | Server health and database connection status | No |
| `GET` | `/api/tasks` | Fetch all tasks (populates User if MongoDB) | No |
| `GET` | `/api/tasks/:id` | Fetch single task by ID | No |
| `POST` | `/api/tasks` | Create task (validated via middleware) | Optional (links User) |
| `PUT` | `/api/tasks/:id` | Update task fields / toggle completion | No |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | No |
| `POST` | `/api/tasks/:id/upload` | Upload attachment file via Multer | No |
| `POST` | `/api/auth/register` | Register student (hashes password with bcrypt) | No |
| `POST` | `/api/auth/login` | Login student (returns signed JWT token) | No |
| `GET` | `/api/auth/me` | Protected route: Decodes JWT payload | **Yes (`Bearer <token>`)** |
| `GET` | `/api/tips/daily` | Get random study tip with category | No |
| `GET` | `/api/demos/node/:topic` | Execute Node.js fundamental script & return output | No |

---
