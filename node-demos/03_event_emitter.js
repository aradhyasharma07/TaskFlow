// ==============================================================================
// Lecture 34: EventEmitter in Node.js
// File: node-demos/03_event_emitter.js
// 
// HOW TO RUN:
//   node node-demos/03_event_emitter.js
// 
// PURPOSE FOR VIVA:
//   Much of Node.js core architecture is event-driven (HTTP servers, streams).
//   EventEmitter allows custom objects to emit named events that trigger registered listener functions.
// ==============================================================================

const EventEmitter = require('events');

// Create a custom TaskEventManager class extending EventEmitter
class TaskEventManager extends EventEmitter {
    createTask(title, priority) {
        console.log(`\n[Action] Creating task: "${title}"...`);
        const task = {
            id: Date.now(),
            title: title,
            priority: priority,
            createdAt: new Date().toISOString()
        };
        // Emit the 'taskCreated' event and pass the task payload
        this.emit('taskCreated', task);
        return task;
    }

    completeTask(task) {
        console.log(`\n[Action] Completing task: "${task.title}"...`);
        task.completed = true;
        // Emit 'taskCompleted' event
        this.emit('taskCompleted', task);
    }
}

// Instantiate the custom emitter
const taskManager = new TaskEventManager();

// 1. Register listener for 'taskCreated'
taskManager.on('taskCreated', (task) => {
    console.log(`🔔 [Listener 1 - Audit Log] New task logged into system: "${task.title}" (Priority: ${task.priority})`);
});

// 2. Register a second listener on the same event (Multiple listeners pattern)
taskManager.on('taskCreated', (task) => {
    if (task.priority === 'high') {
        console.log(`⚠️ [Listener 2 - Alert] URGENT: High priority task alert triggered!`);
    }
});

// 3. Register a one-time listener using .once()
taskManager.once('taskCreated', () => {
    console.log(`ℹ️ [Listener 3 - Welcome] This .once() listener fires ONLY for the first task created.`);
});

// 4. Register listener for 'taskCompleted'
taskManager.on('taskCompleted', (task) => {
    console.log(`🎉 [Listener - Reward] Congratulations! Task "${task.title}" has been completed!`);
});

// Execute actions to trigger events
console.log("=== Node.js EventEmitter Demonstration ===");

const task1 = taskManager.createTask("CHO FA2 Syllabus Preparation", "high");
const task2 = taskManager.createTask("Submit Lab Record", "medium");

taskManager.completeTask(task1);

console.log("\n✓ All EventEmitter demonstrations completed successfully!");
