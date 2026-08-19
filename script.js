// ===================================
// TaskFlow - JavaScript Foundation
// Student Task Management System
// ===================================

// ===== GLOBAL VARIABLES =====

// Array to store all tasks
let tasks = [];

// Object to cache DOM elements for easy access
let domElements = {};

// Note: initializeApp will be called by DOMContentLoaded event below

// Counter for generating unique task IDs
let taskIdCounter = 1;

// Store the ID of the task currently being edited (null if adding new task)
let editingTaskId = null;


// ===== DOM CACHING FUNCTION =====

/**
 * cacheDOMElements()
 * 
 * Purpose: Select and store all required DOM elements in an object
 * This avoids repeated DOM queries and improves performance
 * 
 * Returns: Nothing (stores elements in 'domElements' object)
 */
function cacheDOMElements() {
    domElements = {
        // Form elements
        taskForm: document.getElementById('taskForm'),
        taskTitle: document.getElementById('taskTitle'),
        taskDescription: document.getElementById('taskDescription'),
        taskPriority: document.getElementById('taskPriority'),
        taskDueDate: document.getElementById('taskDueDate'),
        
        // Search and filter elements
        searchInput: document.getElementById('searchInput'),
        filterStatus: document.getElementById('filterStatus'),
        sortBy: document.getElementById('sortBy'),
        
        // Statistics elements
        statTotal: document.getElementById('statTotal'),
        statCompleted: document.getElementById('statCompleted'),
        statPending: document.getElementById('statPending'),
        statPercentage: document.getElementById('statPercentage'),
        
        // Task list elements
        taskListContainer: document.getElementById('taskListContainer'),
        taskCount: document.getElementById('taskCount'),
        
        // Theme toggle
        themeToggle: document.getElementById('themeToggle'),
    };
    
    console.log('✓ DOM Elements Cached Successfully');
}


// ===== TASK ID GENERATOR =====

/**
 * generateTaskId()
 * 
 * Purpose: Generate a unique ID for each task
 * Simple implementation: increment a counter
 * 
 * Returns: Unique numeric ID (Number)
 */
function generateTaskId() {
    return taskIdCounter++;
}


// ===== TASK OBJECT CREATOR =====

/**
 * createTaskObject(title, description, priority, dueDate)
 * 
 * Purpose: Create a task object with the required structure
 * Each task is an object with: id, title, description, priority, dueDate, completed, createdAt
 * 
 * Parameters:
 * - title (String): Task title
 * - description (String): Task description
 * - priority (String): Priority level (low, medium, high)
 * - dueDate (String): Due date in YYYY-MM-DD format
 * 
 * Returns: Task object (Object)
 */
function createTaskObject(title, description, priority, dueDate) {
    const taskObject = {
        id: generateTaskId(),
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date().toISOString(), // Store current timestamp
    };
    
    return taskObject;
}


// ===== EMPTY STATE FUNCTIONS =====

/**
 * showEmptyState()
 * 
 * Purpose: Display the empty state message when no tasks exist
 * Shows a friendly message encouraging the user to add their first task
 * 
 * Returns: Nothing
 */
function showEmptyState() {
    const emptyStateHTML = `
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3 class="empty-title">No tasks available</h3>
            <p class="empty-message">Add your first task to get started</p>
        </div>
    `;
    
    domElements.taskListContainer.innerHTML = emptyStateHTML;
    console.log('✓ Empty State Displayed');
}


/**
 * hideEmptyState()
 * 
 * Purpose: Remove the empty state when tasks are added
 * Clears the task list container to prepare for task rendering
 * 
 * Returns: Nothing
 */
function hideEmptyState() {
    domElements.taskListContainer.innerHTML = '';
    console.log('✓ Empty State Hidden');
}


// ===== FORM VALIDATION =====

/**
 * validateTaskForm(title)
 * 
 * Purpose: Validate the task form before submission
 * Currently checks if title is not empty
 * 
 * Parameters:
 * - title (String): The task title to validate
 * 
 * Returns: Boolean (true if valid, false if invalid)
 */
function validateTaskForm(title) {
    // Check if title is empty or contains only whitespace
    if (title.trim() === '') {
        showFormError('Task title cannot be empty');
        return false;
    }
    
    // Clear any previous error messages
    clearFormError();
    return true;
}


/**
 * showFormError(message)
 * 
 * Purpose: Display an error message below the task title input
 * 
 * Parameters:
 * - message (String): Error message to display
 * 
 * Returns: Nothing
 */
function showFormError(message) {
    // Remove existing error message if present
    clearFormError();
    
    // Create error element
    const errorElement = document.createElement('p');
    errorElement.className = 'form-error';
    errorElement.id = 'formErrorMessage';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-danger)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--spacing-xs)';
    errorElement.style.fontWeight = 'var(--font-weight-semibold)';
    
    // Insert error message after the task title input
    domElements.taskTitle.parentElement.appendChild(errorElement);
    
    // Highlight the input field with error styling
    domElements.taskTitle.style.borderColor = 'var(--color-danger)';
    domElements.taskTitle.style.boxShadow = '0 0 0 3px var(--color-danger-light)';
    
    console.log('✗ Form Error:', message);
}


/**
 * clearFormError()
 * 
 * Purpose: Remove error message and styling from the form
 * 
 * Returns: Nothing
 */
function clearFormError() {
    const errorElement = document.getElementById('formErrorMessage');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    // Reset input field styling
    domElements.taskTitle.style.borderColor = '';
    domElements.taskTitle.style.boxShadow = '';
}


// ===== EVENT HANDLERS =====

/**
 * addTask()
 * 
 * Purpose: Add a new task to the backend using a POST request
 * 
 * Process:
 * 1. Get form input values
 * 2. Validate the task title
 * 3. Create a task object with form data
 * 4. Send POST request to /api/tasks
 * 5. If successful: add returned task to array, render, update stats, clear form
 * 6. If error: show error message
 * 
 * Returns: Nothing
 */
function addTask() {
    // Get form input values
    const title = domElements.taskTitle.value;
    const description = domElements.taskDescription.value;
    const priority = domElements.taskPriority.value;
    const dueDate = domElements.taskDueDate.value;
    
    // Validate the form - if title is empty, show error and stop
    if (!validateTaskForm(title)) {
        return; // Exit function if validation fails
    }
    
    // Create a task object with only the form data
    const newTask = {
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        dueDate: dueDate,
        completed: false
    };
    
    // Send the new task to the backend using POST request
    fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(data => {
        // Add the returned task (with server-generated ID and timestamp) to the array
        tasks.push(data);
        console.log(`✓ Task added successfully. Total tasks: ${tasks.length}`);
        
        // Hide the empty state since we now have tasks
        hideEmptyState();
        
        // Render all tasks on the page
        renderTasks();
        
        // Update the statistics cards
        updateStatistics();
        
        // Clear the form inputs for the next task
        clearForm();
        
        // Focus back on the title input field for convenience
        domElements.taskTitle.focus();
    })
    .catch(error => {
        console.error("❌ Error adding task:", error);
        showFormError("Failed to add task. Please try again.");
    });
}


/**
 * renderTasks()
 * 
 * Purpose: Render all tasks from the tasks array to the page
 * 
 * Process:
 * 1. Clear the task list container
 * 2. Loop through each task in the tasks array using forEach()
 * 3. Create a task card for each task
 * 4. Add the task card to the container
 * 5. Attach event listeners to edit buttons
 * 
 * Returns: Nothing
 */
function renderTasks() {
    // Clear the task list container to remove old tasks
    domElements.taskListContainer.innerHTML = '';
    
    // Check if there are no tasks - show empty state
    if (tasks.length === 0) {
        showEmptyState();
        return;
    }
    
    // Loop through each task in the tasks array
    tasks.forEach((task) => {
        // Create HTML for this task card
        const taskCardHTML = createTaskCard(task);
        
        // Add the task card HTML to the container
        domElements.taskListContainer.innerHTML += taskCardHTML;
    });
    
    // Attach event listeners to all Edit buttons after rendering
    attachEditButtonListeners();
    
    console.log(`✓ Rendered ${tasks.length} task(s) on the page`);
}


/**
 * createTaskCard(task)
 * 
 * Purpose: Create HTML for a single task card using template literals
 * 
 * Parameters:
 * - task (Object): The task object containing all task properties
 * 
 * Returns: String (HTML template for the task card)
 */
function createTaskCard(task) {
    // Format the created date to be more readable
    const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Format the due date to be more readable
    let dueDateDisplay = 'No due date';
    if (task.dueDate) {
        dueDateDisplay = new Date(task.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Determine status text based on completed boolean
    const statusText = task.completed ? 'Completed' : 'Pending';
    const statusClass = task.completed ? 'task-status-completed' : 'task-status-pending';
    
    // Create priority badge with appropriate color class
    const priorityClass = `priority-${task.priority}`;
    
    // Create a button or badge based on completion status
    let statusButton = '';
    if (task.completed) {
        // Show a green completed badge for completed tasks
        statusButton = `<span class="task-status ${statusClass}" style="padding: 6px 12px; border-radius: 4px; background-color: #4caf50; color: white;">✓ Completed</span>`;
    } else {
        // Show a complete button for pending tasks
        statusButton = `<button class="btn-complete" data-task-id="${task.id}" aria-label="Mark task as complete">
            ✓ Complete
        </button>`;
    }
    
    // Return HTML template string for the task card
    const taskCardHTML = `
        <div class="task-card" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-title-section">
                    <h3 class="task-title">${task.title}</h3>
                    <span class="priority-badge ${priorityClass}">
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                </div>
                <div class="task-actions">
                    <button class="btn-edit" data-task-id="${task.id}" aria-label="Edit task">
                        ✏️ Edit
                    </button>
                    <button class="btn-delete" data-task-id="${task.id}" aria-label="Delete task">
                        🗑️ Delete
                    </button>
                </div>
            </div>
            
            <p class="task-description">${task.description || 'No description provided'}</p>
            
            <div class="task-meta">
                <span class="task-status ${statusClass}">
                    📌 ${statusText}
                </span>
                <span class="task-date">
                    📅 Due: ${dueDateDisplay}
                </span>
                <span class="task-created">
                    🕐 Created: ${createdDate}
                </span>
            </div>
            
            <div class="task-complete-section">
                ${statusButton}
            </div>
        </div>
    `;
    
    return taskCardHTML;
}


/**
 * clearForm()
 * 
 * Purpose: Clear all form inputs and error messages
 * Prepare the form for the next task entry
 * 
 * Returns: Nothing
 */
function clearForm() {
    // Reset all form inputs to their default values
    domElements.taskForm.reset();
    
    // Clear any error messages from validation
    clearFormError();
    
    console.log('✓ Form cleared');
}


/**
 * updateStatistics()
 * 
 * Purpose: Calculate and update the statistics cards
 * 
 * Calculations:
 * - Total Tasks: Count of all tasks
 * - Completed: Count of tasks with completed = true
 * - Pending: Count of tasks with completed = false
 * - Completion %: (Completed / Total) * 100
 * 
 * Returns: Nothing
 */
function updateStatistics() {
    // Calculate total number of tasks
    const totalTasks = tasks.length;
    
    // Calculate completed tasks by filtering for completed: true
    const completedTasks = tasks.filter((task) => task.completed === true).length;
    
    // Calculate pending tasks by filtering for completed: false
    const pendingTasks = tasks.filter((task) => task.completed === false).length;
    
    // Calculate completion percentage
    // Avoid division by zero: if no tasks, percentage is 0
    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    // Update the DOM elements with calculated values
    domElements.statTotal.textContent = totalTasks;
    domElements.statCompleted.textContent = completedTasks;
    domElements.statPending.textContent = pendingTasks;
    domElements.statPercentage.textContent = `${completionPercentage}%`;
    
    // Update task count display
    const taskCountText = totalTasks === 1 ? '1 task' : `${totalTasks} tasks`;
    domElements.taskCount.textContent = taskCountText;
    
    console.log(`📊 Statistics Updated - Total: ${totalTasks}, Completed: ${completedTasks}, Pending: ${pendingTasks}, %: ${completionPercentage}%`);
}


// ===== EDIT & UPDATE FUNCTIONS =====

/**
 * getTaskById(id)
 * 
 * Purpose: Find and return a task object by its ID using find() method
 * 
 * Parameters:
 * - id (Number): The ID of the task to find
 * 
 * Returns: Task object if found, undefined if not found
 */
function getTaskById(id) {
    // Use find() to return the first task that matches the ID
    return tasks.find((task) => task.id === id);
}


/**
 * editTask(id)
 * 
 * Purpose: Enter edit mode for a specific task
 * 
 * Process:
 * 1. Find the task by ID using find()
 * 2. Store the task ID in editingTaskId variable
 * 3. Populate the form with the task's current data
 * 4. Change the submit button text to "Update Task"
 * 5. Scroll to the form
 * 
 * Parameters:
 * - id (Number): The ID of the task to edit
 * 
 * Returns: Nothing
 */
function editTask(id) {
    // Find the task object using the ID
    const task = getTaskById(id);
    
    // If task not found, stop execution
    if (!task) {
        console.error(`❌ Task with ID ${id} not found`);
        return;
    }
    
    // Store the ID of the task being edited
    editingTaskId = id;
    
    // Populate the form with the task's current data
    populateForm(task);
    
    // Change the submit button text to indicate we're updating
    const submitButton = domElements.taskForm.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<span class="btn-icon">✓</span>Update Task';
    submitButton.classList.add('btn-update');
    
    // Scroll to the form so user can see it
    domElements.taskForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Focus on the title input
    domElements.taskTitle.focus();
    
    console.log(`✏️ Editing task with ID: ${id}`);
}


/**
 * populateForm(task)
 * 
 * Purpose: Fill the form fields with a task's data
 * 
 * Parameters:
 * - task (Object): The task object containing data to fill into the form
 * 
 * Returns: Nothing
 */
function populateForm(task) {
    // Set the title field value
    domElements.taskTitle.value = task.title;
    
    // Set the description field value
    domElements.taskDescription.value = task.description;
    
    // Set the priority dropdown value
    domElements.taskPriority.value = task.priority;
    
    // Set the due date field value
    domElements.taskDueDate.value = task.dueDate;
    
    // Clear any validation error messages
    clearFormError();
    
    console.log('✓ Form populated with task data');
}


/**
 * updateTask(id)
 * 
 * Purpose: Update an existing task on the backend
 * 
 * Process:
 * 1. Get the new values from the form
 * 2. Validate the new title
 * 3. Send PUT request to /api/tasks/:id with updated data
 * 4. If successful: update array, render, update stats, reset form
 * 5. If error: show error message
 * 
 * Parameters:
 * - id (Number): The ID of the task to update
 * 
 * Returns: Nothing
 */
function updateTask(id) {
    // Get the new values from the form
    const newTitle = domElements.taskTitle.value;
    const newDescription = domElements.taskDescription.value;
    const newPriority = domElements.taskPriority.value;
    const newDueDate = domElements.taskDueDate.value;
    
    // Validate the new title
    if (!validateTaskForm(newTitle)) {
        return; // Stop if validation fails
    }
    
    // Create an object with the data to send to the backend
    const updatedTaskData = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        dueDate: newDueDate,
        completed: false
    };
    
    // Send PUT request to update the task on the backend
    fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTaskData)
    })
    .then(response => response.json())
    .then(data => {
        // Find and replace the task in the array with the updated one from backend
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = data;
        }
        
        console.log(`✓ Task with ID ${id} updated successfully`);
        
        // Re-render the task list with updated data
        renderTasks();
        
        // Update statistics
        updateStatistics();
        
        // Exit edit mode and reset the form
        resetForm();
    })
    .catch(error => {
        console.error(`❌ Error updating task with ID ${id}:`, error);
        showFormError("Failed to update task. Please try again.");
    });
}


/**
 * resetForm()
 * 
 * Purpose: Clear the form and exit edit mode
 * 
 * Process:
 * 1. Clear all form inputs
 * 2. Set editingTaskId back to null
 * 3. Change submit button text back to "Add Task"
 * 4. Clear any error messages
 * 
 * Returns: Nothing
 */
function resetForm() {
    // Clear all form inputs to default values
    domElements.taskForm.reset();
    
    // Set the editing task ID to null (no task is being edited)
    editingTaskId = null;
    
    // Get the submit button and change text back to "Add Task"
    const submitButton = domElements.taskForm.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<span class="btn-icon">+</span>Add Task';
    submitButton.classList.remove('btn-update');
    
    // Clear any validation error messages
    clearFormError();
    
    console.log('✓ Form reset - exited edit mode');
}


/**
 * attachEditButtonListeners()
 * 
 * Purpose: Attach click event listeners to all Edit, Delete, and Complete buttons on the page
 * This is called after rendering tasks to bind events to dynamically created elements
 * 
 * Process:
 * 1. Select all Edit buttons and add listeners
 * 2. Select all Delete buttons and add listeners
 * 3. Select all Complete buttons and add listeners
 * 
 * Returns: Nothing
 */
function attachEditButtonListeners() {
    // Select all Edit buttons on the page
    const editButtons = document.querySelectorAll('.btn-edit');
    
    // Add click event listener to each Edit button
    editButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            // Prevent any default button behavior
            event.preventDefault();
            
            // Get the task ID from the button's data attribute
            const taskId = parseInt(button.getAttribute('data-task-id'));
            
            // Call editTask with the task ID
            editTask(taskId);
        });
    });
    
    // Select all Delete buttons on the page
    const deleteButtons = document.querySelectorAll('.btn-delete');
    
    // Add click event listener to each Delete button
    deleteButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            // Prevent any default button behavior
            event.preventDefault();
            
            // Get the task ID from the button's data attribute
            const taskId = parseInt(button.getAttribute('data-task-id'));
            
            // Call deleteTask with the task ID
            deleteTask(taskId);
        });
    });
    
    // Select all Complete buttons on the page
    const completeButtons = document.querySelectorAll('.btn-complete');
    
    // Add click event listener to each Complete button
    completeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            // Prevent any default button behavior
            event.preventDefault();
            
            // Get the task ID from the button's data attribute
            const taskId = parseInt(button.getAttribute('data-task-id'));
            
            // Call completeTask with the task ID
            completeTask(taskId);
        });
    });
    
    console.log(`✓ Attached listeners to ${editButtons.length} edit button(s), ${deleteButtons.length} delete button(s), and ${completeButtons.length} complete button(s)`);
}


// ===== DELETE TASK FUNCTION =====

/**
 * deleteTask(id)
 * 
 * Purpose: Delete a task from the backend and update the UI
 * 
 * Process:
 * 1. Ask the user for confirmation using confirm()
 * 2. If user cancels: stop and do nothing
 * 3. If user confirms: send DELETE request to /api/tasks/:id
 * 4. If successful: remove task from array, render, update stats
 * 5. If error: show message in console
 * 
 * Parameters:
 * - id (Number): The ID of the task to delete
 * 
 * Returns: Nothing
 */
function deleteTask(id) {
    // Ask the user for confirmation before deleting
    const confirmDelete = confirm("Do you want to delete this task?");
    
    // If user clicked Cancel, stop and do nothing
    if (!confirmDelete) {
        return;
    }
    
    // Send DELETE request to the backend
    fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        // Remove the task from the tasks array using filter()
        // Keep only tasks that don't match the deleted ID
        tasks = tasks.filter((task) => task.id !== id);
        
        console.log(`✓ Task with ID ${id} deleted successfully`);
        
        // Render all remaining tasks on the page
        renderTasks();
        
        // Update the statistics cards
        updateStatistics();
    })
    .catch(error => {
        console.error(`❌ Error deleting task with ID ${id}:`, error);
    });
}


// ===== COMPLETE TASK FUNCTION =====

/**
 * completeTask(id)
 * 
 * Purpose: Mark a task as complete using the PUT API
 * 
 * Process:
 * 1. Find the task from the tasks array
 * 2. Send PUT request to /api/tasks/:id with completed: true
 * 3. Keep all other task values the same
 * 4. If successful: update array, render, update stats
 * 5. If error: show message in console
 * 
 * Parameters:
 * - id (Number): The ID of the task to mark as complete
 * 
 * Returns: Nothing
 */
function completeTask(id) {
    // Find the task from the tasks array
    const task = tasks.find((t) => t.id === id);
    
    // If task not found, stop execution
    if (!task) {
        console.error(`❌ Task with ID ${id} not found`);
        return;
    }
    
    // Create an object with all task data but set completed to true
    const updatedTaskData = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        completed: true
    };
    
    // Send PUT request to mark the task as complete
    fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTaskData)
    })
    .then(response => response.json())
    .then(data => {
        // Find and replace the task in the array with the updated one from backend
        const taskIndex = tasks.findIndex((t) => t.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = data;
        }
        
        console.log(`✓ Task with ID ${id} marked as complete`);
        
        // Render all tasks on the page to show updated status
        renderTasks();
        
        // Update the statistics cards
        updateStatistics();
    })
    .catch(error => {
        console.error(`❌ Error completing task with ID ${id}:`, error);
    });
}


// ===== EVENT HANDLERS =====

/**
 * handleFormSubmit(event)
 * 
 * Purpose: Handle the form submission (Add or Update)
 * 
 * Process:
 * 1. Prevent default form behavior
 * 2. Check if we're in edit mode (editingTaskId exists)
 * 3. If editing: call updateTask()
 * 4. If adding: call addTask()
 * 
 * Parameters:
 * - event (Event): The form submit event
 * 
 * Returns: Nothing
 */
function handleFormSubmit(event) {
    // Prevent the default form submission behavior (page refresh)
    event.preventDefault();
    
    // Check if we're in edit mode by checking if editingTaskId is set
    if (editingTaskId !== null) {
        // We're updating an existing task
        updateTask(editingTaskId);
    } else {
        // We're adding a new task
        addTask();
    }
}


// ===== EVENT BINDING =====

/**
 * bindEvents()
 * 
 * Purpose: Attach event listeners to DOM elements
 * This centralizes all event binding in one function for easy maintenance
 * 
 * Current Events:
 * - Task form submission
 * 
 * Returns: Nothing
 */
function bindEvents() {
    // Bind the Add Task form submit event
    domElements.taskForm.addEventListener('submit', handleFormSubmit);
    
    console.log('✓ Events Bound Successfully');
}


// ===== APP INITIALIZATION =====

/**
 * initializeApp()
 * 
 * Purpose: Initialize the entire application
 * 
 * Process:
 * 1. Cache all required DOM elements
 * 2. Bind event listeners
 * 3. Load tasks from the backend
 * 4. Display empty state (shown until tasks load)
 * 
 * Returns: Nothing
 */
function initializeApp() {
    console.log('🚀 Initializing TaskFlow...');
    
    // Step 1: Cache all DOM elements
    cacheDOMElements();
    
    // Step 2: Bind event listeners
    bindEvents();
    
    // Step 3: Show empty state initially
    showEmptyState();
    
    // Step 4: Load tasks from backend
    loadTasks();
    
    console.log('✓ TaskFlow Initialized Successfully');
}


// ===== APPLICATION STARTUP =====

/**
 * Wait for the DOM to be fully loaded before running the application
 * 
 * The DOMContentLoaded event fires when the HTML document has been completely parsed
 * This ensures all DOM elements are available before we try to access them
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Alternative method (runs when all resources are loaded):
// window.addEventListener('load', () => {
//     initializeApp();
// });



// ===== LOAD TASKS FROM BACKEND =====

/**
 * loadTasks()
 * 
 * Purpose: Fetch tasks from the backend when the page loads
 * 
 * Process:
 * 1. Make a GET request to /api/tasks
 * 2. Convert the response to JSON
 * 3. Store the data in the tasks array
 * 4. Call renderTasks() to display them on the page
 * 5. Call updateStatistics() to update the stats
 * 6. If error: show message in console
 * 
 * Returns: Nothing
 */
function loadTasks() {
    // Send GET request to fetch all tasks from the backend
    fetch("/api/tasks")
        .then(response => response.json())
        .then(data => {
            // Store the fetched tasks in the global tasks array
            tasks = data;
            
            // Render the tasks on the page
            renderTasks();
            
            // Update the statistics cards
            updateStatistics();
            
            console.log(`✓ Loaded ${tasks.length} task(s) from backend`);
        })
        .catch(error => {
            // Show error message if the request fails
            console.error("❌ Error loading tasks from backend:", error);
            showEmptyState();
        });
}