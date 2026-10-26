# TaskFlow — Comprehensive Viva Questions & Explanations

This document provides clear, simple English explanations and the top viva questions with concise answers for your CHO FA2 evaluation.

---

## 1. Advanced JavaScript & APIs (Lectures 25–30)

### Concept Overview
- **Callbacks**: A function passed as an argument into another function that gets invoked once an asynchronous action completes.
- **Promises**: Objects representing the eventual completion (`resolve`) or failure (`reject`) of an asynchronous operation.
- **Async/Await**: Syntactic sugar over Promises. `async` makes a function return a Promise; `await` pauses execution until that Promise settles.
- **Fetch API**: Modern browser interface for making HTTP requests (`GET`, `POST`, `PUT`, `DELETE`). Always verify `response.ok` before calling `response.json()`.
- **LocalStorage vs SessionStorage**: Both store key-value strings in the browser. `localStorage` persists indefinitely (e.g., dark theme); `sessionStorage` vanishes when the tab closes.

### Top Viva Questions & Answers

**Q1: What is the difference between synchronous and asynchronous code in JavaScript?**  
> *Answer:* Synchronous code executes sequentially line-by-line, blocking execution until each task finishes. Asynchronous code initiates a task (like fetching an API or reading a file) and allows the rest of the program to continue running without waiting.

**Q2: Why do we prefer `async/await` over callbacks or `.then()` chains?**  
> *Answer:* `async/await` avoids "callback hell" (deeply nested callbacks) and makes asynchronous code look and behave like readable, synchronous code, while simplifying error handling using standard `try/catch` blocks.

**Q3: What does `response.ok` check in the Fetch API?**  
> *Answer:* `response.ok` is a boolean that is `true` if the HTTP status code is in the range 200–299. The Fetch API only rejects a Promise on network failure, NOT on HTTP 404 or 500 errors, so checking `response.ok` is necessary.

**Q4: How does TaskFlow remember the user's Dark Mode preference?**  
> *Answer:* In `script.js`, when the student clicks the theme button, we save the string `'dark'` or `'light'` into `localStorage.setItem('taskflow_theme', theme)`. On page load, `initTheme()` reads it using `localStorage.getItem()` and applies `data-theme` to the `<html>` root.

**Q5: What is the difference between `localStorage` and `sessionStorage`?**  
> *Answer:* `localStorage` has no expiration date and persists across browser closes and computer reboots. `sessionStorage` is cleared automatically as soon as the user closes the browser tab.

---

## 2. Node.js Fundamentals (Lectures 31–36)

### Concept Overview
- **Node.js**: A cross-platform runtime environment built on Google Chrome's V8 engine that executes JavaScript on the server.
- **Event Loop**: The mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.
- **CommonJS vs ES Modules**: CommonJS uses `require()` and `module.exports`; ES Modules (ESM) use `import` and `export`.
- **Buffers & Streams**: Buffers hold raw binary data in memory outside the V8 heap. Streams process data chunk-by-chunk without loading entire files into RAM.
- **EventEmitter**: An object that emits named events which cause registered listener functions to be called.

### Top Viva Questions & Answers

**Q1: Is Node.js multi-threaded or single-threaded?**  
> *Answer:* JavaScript execution in Node.js runs on a single main thread (the Event Loop). However, heavy I/O tasks (file system, network, crypto) are handled by a multi-threaded C library called `libuv` in the background.

**Q2: What is the execution order between `process.nextTick`, `Promise.then`, and `setTimeout`?**  
> *Answer:* `process.nextTick` executes first (it has the highest priority microtask queue), followed by `Promise.then` (standard microtask queue), followed by `setTimeout(..., 0)` (macrotask timers phase of the Event Loop). Demonstrated in `node-demos/01_event_loop.js`.

**Q3: Why are Streams better than `fs.readFile()` for large files?**  
> *Answer:* `fs.readFile()` reads the entire file into RAM at once, which can crash the server if a file is hundreds of megabytes. Streams read and pipe data in small chunks (e.g. 64KB), keeping RAM usage tiny and constant.

**Q4: What is the purpose of `path.join()` vs string concatenation?**  
> *Answer:* Windows uses backslashes (`\`) for file paths while Linux and macOS use forward slashes (`/`). `path.join()` automatically uses the correct separator for the host operating system, preventing cross-platform bugs.

**Q5: What is `dotenv` and why do we use `.env.example`?**  
> *Answer:* `dotenv` loads environment variables from a `.env` file into `process.env`. We commit `.env.example` to Git so other developers know which variables are required without exposing secret keys or database passwords.

---

## 3. Express & Backend Development (Lectures 37–40)

### Concept Overview
- **Express**: A minimal, flexible Node.js web application framework providing routing and middleware.
- **Middleware**: A function with access to `(req, res, next)`. It can modify request objects, execute logic, end responses, or call `next()`.
- **JWT (JSON Web Token)**: A compact, URL-safe token containing a Header, Payload, and Signature, used for stateless authentication.
- **Bcrypt**: A cryptographic hashing function with salting used to securely hash passwords before database storage.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads.

### Top Viva Questions & Answers

**Q1: How does Express know a function is an Error-Handling Middleware?**  
> *Answer:* Express identifies error-handling middleware by its **four** function parameters: `(err, req, res, next)`. When an error occurs or `next(err)` is called, Express skips normal middleware and jumps straight to this handler.

**Q2: Why should passwords never be stored in plain text? How does bcrypt protect them?**  
> *Answer:* If a database is breached, plain text passwords expose user accounts across multiple services. `bcrypt` adds a random salt and runs a slow one-way mathematical hashing algorithm that prevents rainbow table and brute-force attacks.

**Q3: How does JWT authentication work in TaskFlow?**  
> *Answer:* 
> 1. User registers or logs in with email and password.
> 2. Backend verifies credentials and signs a JWT token using `jwt.sign(payload, JWT_SECRET)`.
> 3. Frontend receives the token and sends it in the `Authorization: Bearer <token>` header on subsequent requests.
> 4. `verifyToken` middleware validates the signature using `jwt.verify()`.

**Q4: How does Multer secure file uploads in TaskFlow?**  
> *Answer:* In `middleware/upload.js`, Multer enforces:
> 1. File type whitelisting (`.pdf`, `.png`, `.jpg`, `.docx`, `.txt`).
> 2. File size limit of 2MB (`limits: { fileSize: 2 * 1024 * 1024 }`).
> 3. Filename sanitization and unique timestamps to prevent directory traversal and collisions.

---

## 4. MongoDB & Mongoose (Lecture 41)

### Concept Overview
- **MongoDB**: A NoSQL document-oriented database that stores data in flexible, JSON-like BSON documents.
- **Mongoose**: An Object Data Modeling (ODM) library for Node.js and MongoDB that provides schemas, validations, and query building.
- **Dual-Mode Architecture**: TaskFlow connects to MongoDB if available, but if offline, gracefully falls back to `data/tasks.json` so the evaluation never crashes.
- **`populate()`**: Replaces a referenced ObjectId with the actual referenced document from another collection (similar to a SQL JOIN).

### Top Viva Questions & Answers

**Q1: What is the difference between a Schema and a Model in Mongoose?**  
> *Answer:* A **Schema** is the blueprint that defines the structure, data types, and validation rules of a document. A **Model** is the compiled constructor compiled from the schema that provides methods to create, query, update, and delete documents (`Task.find()`, `Task.create()`).

**Q2: How does `populate()` work in TaskFlow?**  
> *Answer:* In `models/Task.js`, the `user` field has `type: mongoose.Schema.Types.ObjectId, ref: 'User'`. When executing `Task.find().populate('user', 'name email')`, Mongoose automatically fetches the associated User's name and email and embeds it into the task object.

**Q3: How does TaskFlow ensure high availability if MongoDB is not running?**  
> *Answer:* In `config/db.js`, `connectDB()` catches connection failures with a 3-second timeout and sets `isMongoConnected = false`. The routes in `taskRoutes.js` check this flag; if false, they read and write to `data/tasks.json` instead of throwing an unhandled exception.

---

## 5. React Frontend (Lectures 42–48)

### Concept Overview
- **SPA (Single Page Application)**: A web application that loads a single HTML page and dynamically updates the view as the user interacts without reloading the page.
- **JSX**: JavaScript XML, a syntax extension allowing HTML-like code inside JavaScript.
- **Props**: Read-only data passed from parent component to child component.
- **useState**: React Hook that adds state variables to functional components.
- **useEffect**: React Hook that handles side effects (data fetching, timers, DOM manipulation) after rendering.

### Top Viva Questions & Answers

**Q1: What is a controlled component in React?**  
> *Answer:* A component where form inputs derive their values from React state and update that state via an `onChange` handler (e.g., `<input value={title} onChange={e => setTitle(e.target.value)} />`). React is the "single source of truth".

**Q2: Why must the dependency array in `useEffect` be chosen carefully?**  
> *Answer:* 
> - `[]` (empty): Effect runs only once when the component mounts.
> - `[dep1, dep2]`: Effect runs on mount and whenever `dep1` or `dep2` changes.
> - No array: Effect runs on every single render, which can cause infinite fetch loops.

**Q3: What are the three states handled in `App.jsx` for task fetching?**  
> *Answer:* 
> 1. **Loading state**: Displays `"⏳ Loading tasks..."` while the Promise is pending.
> 2. **Error state**: Displays an error alert with a "Retry" button if the fetch fails.
> 3. **Empty state**: Displays `"📝 No tasks found"` when tasks array is empty.

**Q4: How does TaskFlow's React app communicate with the Express backend?**  
> *Answer:* In `frontend/vite.config.js`, a proxy is configured forwarding `/api` requests to `http://localhost:3000`. In `App.jsx`, standard `fetch('/api/tasks')` requests send and receive JSON data.
