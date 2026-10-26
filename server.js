const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, "data", "tasks.json");

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Read tasks from JSON file
function readTasks() {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

// Save tasks into JSON file
function saveTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// GET - Fetch all tasks
app.get("/api/tasks", (req, res) => {
    res.json(readTasks());
});

// POST - Add a new task
app.post("/api/tasks", (req, res) => {
    // Check if task title is empty
if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({
        error: "Task title is required"
    });
}
    let tasks = readTasks();

    let newTask = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        completed: false
    };

    tasks.push(newTask);
    saveTasks(tasks);

    res.status(201).json(newTask);
});

// DELETE - Remove a task by ID
app.delete("/api/tasks/:id", (req, res) => {
    
    // Read all tasks from the file
    let tasks = readTasks();
    
    // Convert the ID from the URL to a number
    const taskId = Number(req.params.id);
    
    // Store the original count to check if task was found
    const originalCount = tasks.length;
    
    // Filter out the task with matching ID (keep all tasks that don't match)
    tasks = tasks.filter((task) => task.id !== taskId);
    
    // Check if a task was actually removed
    if (tasks.length === originalCount) {
        // No task was removed, ID not found
        return res.status(404).json({ error: "Task not found" });
    }
    
    // Save the updated tasks array back to the file
    saveTasks(tasks);
    
    // Return success message
    res.json({ message: "Task deleted successfully" });
});

// PUT - Update a task by ID
app.put("/api/tasks/:id", (req, res) => {
    
    // Read all tasks from the file
    let tasks = readTasks();
    
    // Convert the ID from the URL to a number
    const taskId = Number(req.params.id);
    
    // Find the task with matching ID
    const task = tasks.find((t) => t.id === taskId);
    
    // If task not found, return 404 error
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    
    // Update only the editable fields
    // Keep the original id and createdAt
    task.title = req.body.title;
    task.description = req.body.description;
    task.priority = req.body.priority;
    task.dueDate = req.body.dueDate;
    task.completed = req.body.completed;
    
    // Save the updated tasks array back to the file
    saveTasks(tasks);
    
    // Return the updated task
    res.json(task);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});