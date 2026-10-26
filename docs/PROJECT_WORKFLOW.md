# TaskFlow — System Architecture & Workflow

This document illustrates the complete architectural workflow of **TaskFlow — Student Task Management System**, detailing how client requests travel across the Vanilla UI, React SPA, Express Backend, and Database layers.

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["Frontend Layer"]
        V[Vanilla Frontend\nindex.html + script.js]
        R[React SPA Frontend\nVite + React 19]
        D[CHO FA2 Demos\ndemo-advanced-js.html]
    end

    subgraph Server["Express 5 Server (Port 3000)"]
        MW[Middleware Pipeline\nCORS, JSON BodyParser, Static]
        VAL[Validation & Auth Middleware\nvalidateTaskInput, verifyToken]
        
        subgraph Routes["API Routes"]
            TR["/api/tasks (Task CRUD)"]
            AR["/api/auth (JWT & Bcrypt)"]
            TIR["/api/tips (Study Tips)"]
            UR["/api/tasks/:id/upload (Multer)"]
        end
        
        ERR[Centralized Error Handler]
    end

    subgraph Storage["Dual-Mode Data Storage"]
        MDB[(MongoDB / Mongoose\nTask & User Models)]
        JSONFile[(Fallback Storage\ndata/tasks.json)]
    end

    V -->|REST Fetch| MW
    R -->|REST Fetch / Proxy| MW
    D -->|Fetch & Demos| MW

    MW --> VAL
    VAL --> Routes
    
    TR -->|If DB Connected| MDB
    TR -.->|If DB Offline| JSONFile
    AR -->|User Auth| MDB
    UR -->|Upload File| UploadDir[uploads/ Directory]
    
    Routes -.->|Errors| ERR
```

---

## 2. Request-Response Lifecycle Flowchart

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Browser
    participant Express as Express App (server.js)
    participant Auth as Auth / Validation Middleware
    participant Controller as Task Route Handler
    participant DB as MongoDB / JSON Fallback
    participant ErrorMW as Centralized Error Handler

    Student->>Express: POST /api/tasks (Title, Priority, DueDate)
    Express->>Auth: validateTaskInput(req, res, next)
    
    alt Validation Fails (Empty Title)
        Auth-->>Student: 400 Bad Request { success: false, error: "Task title required" }
    else Validation Passes
        Auth->>Controller: next() called
        Controller->>DB: Task.create() or write to tasks.json
        alt Database Operation Succeeds
            DB-->>Controller: Saved Task Object
            Controller-->>Student: 201 Created { id, title, completed: false, ... }
        else Database Throws Error
            DB-->>Controller: Exception
            Controller->>ErrorMW: next(err)
            ErrorMW-->>Student: 500 Server Error { success: false, error: "..." }
        end
    end
```

---

## 3. JWT Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant AuthRoute as /api/auth/login
    participant Bcrypt as Bcrypt Utility
    participant JWT as jsonwebtoken
    participant Protected as /api/auth/me (Protected Route)

    User->>AuthRoute: POST { email, password }
    AuthRoute->>Bcrypt: bcrypt.compare(plainPassword, hashedPassword)
    alt Password Invalid
        Bcrypt-->>AuthRoute: false
        AuthRoute-->>User: 401 Unauthorized { error: "Invalid credentials" }
    else Password Valid
        Bcrypt-->>AuthRoute: true
        AuthRoute->>JWT: jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '7d' })
        JWT-->>AuthRoute: Signed Token String
        AuthRoute-->>User: 200 OK { token: "eyJhbG...", user: {...} }
    end

    Note over User,Protected: Subsequent Authenticated Requests
    User->>Protected: GET /api/auth/me with Header Authorization: Bearer <token>
    Protected->>JWT: jwt.verify(token, JWT_SECRET)
    JWT-->>Protected: Decoded Payload { id, email, name }
    Protected-->>User: 200 OK { user: decoded }
```

---

## 4. Dual-Mode Storage Architecture

TaskFlow features a unique **Dual-Mode Persistence Architecture** designed specifically for academic evaluations:

1. **MongoDB Mode (Primary)**:
   - Activates when MongoDB (local or Atlas) is available.
   - Leverages Mongoose Schemas, validation rules, and `populate('user')` relationship queries.
2. **JSON File Fallback Mode (Fail-Safe)**:
   - Activates automatically if MongoDB server is offline or unreachable.
   - Persists all task data into `data/tasks.json`.
   - **Benefit for Viva**: The examiner's laptop might not have MongoDB installed or running; TaskFlow will still run 100% smoothly without crashing!
