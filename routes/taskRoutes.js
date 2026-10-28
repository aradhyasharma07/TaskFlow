//GUNIT KI DOCUMENTS




const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Task = require('../models/Task');
const upload = require('../middleware/upload');
const { validateTaskInput } = require('../middleware/validate');
const { optionalAuth } = require('../middleware/auth');
const { isMongoConnected } = require('../config/db');

// Path to JSON file storage
const jsonFilePath = path.join(__dirname, '..', 'data', 'tasks.json');

// --- JSON File Helpers for Fallback Mode ---
function readTasksFromFile() {
    try {
        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error("Error reading JSON file:", err.message);
        return [];
    }
}

function saveTasksToFile(tasks) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(tasks, null, 2), 'utf8');
}


// ===== 1. GET ALL TASKS (CRUD: Read) =====
router.get('/', async (req, res, next) => {
    try {
        if (isMongoConnected()) {
            // Lecture 41: MongoDB find() with populate() to link User info
            const dbTasks = await Task.find().populate('user', 'name email').sort({ createdAt: -1 });
            return res.json(dbTasks);
        }

        // Fallback: Read from tasks.json
        const fileTasks = readTasksFromFile();
        return res.json(fileTasks);
    } catch (error) {
        next(error);
    }
});


// ===== 2. GET SINGLE TASK BY ID =====
router.get('/:id', async (req, res, next) => {
    try {
        const taskId = Number(req.params.id);

        if (isMongoConnected()) {
            // Check both numeric id and MongoDB _id
            let task = await Task.findOne({ id: taskId }).populate('user', 'name email');
            if (!task && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                task = await Task.findById(req.params.id).populate('user', 'name email');
            }
            if (!task) {
                return res.status(404).json({ success: false, error: "Task not found" });
            }
            return res.json(task);
        }

        const tasks = readTasksFromFile();
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }
        return res.json(task);
    } catch (error) {
        next(error);
    }
});


// ===== 3. CREATE TASK (CRUD: Create) =====
router.post('/', optionalAuth, validateTaskInput, async (req, res, next) => {
    try {
        const { title, description = '', priority = 'medium', dueDate = '' } = req.body;
        const newId = Date.now();

        if (isMongoConnected()) {
            const newTask = new Task({
                id: newId,
                title,
                description,
                priority,
                dueDate,
                completed: false,
                user: req.user ? req.user.id : null // Link student if authenticated
            });

            const savedTask = await newTask.save();
            return res.status(201).json(savedTask);
        }

        // Fallback Mode: JSON file
        const tasks = readTasksFromFile();
        const newTask = {
            id: newId,
            title,
            description,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        saveTasksToFile(tasks);

        return res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
});


// ===== 4. UPDATE TASK (CRUD: Update) =====
router.put('/:id', validateTaskInput, async (req, res, next) => {
    try {
        const taskId = Number(req.params.id);
        const { title, description, priority, dueDate, completed } = req.body;

        if (isMongoConnected()) {
            let task = await Task.findOne({ id: taskId });
            if (!task && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                task = await Task.findById(req.params.id);
            }

            if (!task) {
                return res.status(404).json({ success: false, error: "Task not found" });
            }

            task.title = title;
            if (description !== undefined) task.description = description;
            if (priority !== undefined) task.priority = priority;
            if (dueDate !== undefined) task.dueDate = dueDate;
            if (completed !== undefined) task.completed = completed;

            const updatedTask = await task.save();
            return res.json(updatedTask);
        }

        // Fallback Mode: JSON file
        const tasks = readTasksFromFile();
        const task = tasks.find(t => t.id === taskId);

        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        task.title = title;
        task.description = description !== undefined ? description : task.description;
        task.priority = priority !== undefined ? priority : task.priority;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
        task.completed = completed !== undefined ? completed : task.completed;

        saveTasksToFile(tasks);
        return res.json(task);
    } catch (error) {
        next(error);
    }
});


// ===== 5. DELETE TASK (CRUD: Delete) =====
router.delete('/:id', async (req, res, next) => {
    try {
        const taskId = Number(req.params.id);

        if (isMongoConnected()) {
            let deleted = await Task.findOneAndDelete({ id: taskId });
            if (!deleted && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                deleted = await Task.findByIdAndDelete(req.params.id);
            }

            if (!deleted) {
                return res.status(404).json({ success: false, error: "Task not found" });
            }

            return res.json({ success: true, message: "Task deleted successfully" });
        }

        // Fallback Mode: JSON file
        let tasks = readTasksFromFile();
        const originalCount = tasks.length;
        tasks = tasks.filter(t => t.id !== taskId);

        if (tasks.length === originalCount) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        saveTasksToFile(tasks);
        return res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        next(error);
    }
});


// ===== 6. UPLOAD ATTACHMENT TO TASK (Lecture 40: Multer) =====
router.post('/:id/upload', upload.single('attachment'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No file was uploaded" });
        }

        const taskId = Number(req.params.id);
        const attachmentUrl = `/uploads/${req.file.filename}`;

        if (isMongoConnected()) {
            let task = await Task.findOne({ id: taskId });
            if (!task && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                task = await Task.findById(req.params.id);
            }

            if (!task) {
                return res.status(404).json({ success: false, error: "Task not found" });
            }

            task.attachment = req.file.filename;
            await task.save();

            return res.json({
                success: true,
                message: "Attachment uploaded successfully",
                file: req.file.filename,
                url: attachmentUrl,
                task
            });
        }

        // Fallback Mode: JSON file
        const tasks = readTasksFromFile();
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            return res.status(404).json({ success: false, error: "Task not found" });
        }

        task.attachment = req.file.filename;
        saveTasksToFile(tasks);

        return res.json({
            success: true,
            message: "Attachment uploaded successfully",
            file: req.file.filename,
            url: attachmentUrl,
            task
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;