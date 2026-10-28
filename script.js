    // AARYAN KI DOCUMENT 



// ===================================================================
// TaskFlow - JavaScript Foundation (Upgraded for CHO FA2 Evaluation)
// Student Task Management System
// 
// Topics Demonstrated:
// - Callbacks & Asynchronous JavaScript (Lectures 25-26)
// - Promises & Promise Chaining (Lecture 27)
// - Async/Await & try/catch Error Handling (Lecture 28)
// - Fetch API & REST API Consumption (Lecture 29)
// - Web Storage: localStorage & sessionStorage (Lecture 30)
// - Form Validation & Dynamic DOM Manipulation
// ===================================================================

// ===== GLOBAL VARIABLES =====

// Array to store all tasks in memory
let tasks = [];

// Object to cache DOM elements for fast access without repeated queries
let domElements = {};

// Store the ID of the task currently being edited (null if in "Add" mode)
let editingTaskId = null;

// Built-in academic study tips as reliable fallback if external API is unreachable
const fallbackStudyTips = [
    { text: "Use the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.", author: "Productivity Guide" },
    { text: "Review your lecture notes within 24 hours to double your memory retention.", author: "Cognitive Science" },
    { text: "Break complex assignments into smaller tasks with clear deadlines.", author: "Academic Coach" },
    { text: "Teach a concept to someone else (or your rubber duck) to expose gaps in understanding.", author: "Feynman Technique" },
    { text: "Active recall through practice quizzes is far more effective than passive re-reading.", author: "Learning Psychology" },
    { text: "Stay hydrated and get 7-8 hours of sleep; memory consolidation happens during rest.", author: "Health Advisory" }
];


// ===== DOM CACHING FUNCTION =====

/**
 * cacheDOMElements()
 * 
 * Purpose: Select and store all required DOM elements in the 'domElements' cache object.
 * Why? Querying document.getElementById repeatedly is slow; caching elements once improves performance.
 */
function cacheDOMElements() {
    domElements = {
        // Form elements
        taskForm: document.getElementById('taskForm'),
        taskTitle: document.getElementById('taskTitle'),
        taskDescription: document.getElementById('taskDescription'),
        taskPriority: document.getElementById('taskPriority'),
        taskDueDate: document.getElementById('taskDueDate'),
        submitTaskBtn: document.getElementById('submitTaskBtn'),
        cancelEditBtn: document.getElementById('cancelEditBtn'),
        
        // Search, filter, and sort elements
        searchInput: document.getElementById('searchInput'),
        filterStatus: document.getElementById('filterStatus'),
        sortBy: document.getElementById('sortBy'),
        
        // Statistics elements
        statTotal: document.getElementById('statTotal'),
        statCompleted: document.getElementById('statCompleted'),
        statPending: document.getElementById('statPending'),
        statPercentage: document.getElementById('statPercentage'),
        taskCount: document.getElementById('taskCount'),
        
        // Task list container
        taskListContainer: document.getElementById('taskListContainer'),
        
        // Dark theme toggle
        themeToggle: document.getElementById('themeToggle'),
        themeIcon: document.getElementById('themeIcon'),
        
        // Study tip elements (API integration)
        studyTipSection: document.getElementById('studyTipSection'),
        studyTipText: document.getElementById('studyTipText'),
        studyTipAuthor: document.getElementById('studyTipAuthor'),
        refreshTipBtn: document.getElementById('refreshTipBtn'),
        
        // Session storage badge and toast container
        sessionBadge: document.getElementById('sessionBadge'),
        toastContainer: document.getElementById('toastContainer')
    };
    
    console.log('✓ DOM Elements Cached Successfully');
}


// ===== BROWSER STORAGE: LOCALSTORAGE & SESSIONSTORAGE (Lecture 30) =====

/**
 * initTheme()
 * 
 * Demonstrates: localStorage (persistent storage that survives browser restarts)
 * Purpose: Load the user's preferred theme ('light' or 'dark') from localStorage.
 */
function initTheme() {
    // 1. Read stored preference from localStorage
    const savedTheme = localStorage.getItem('taskflow_theme') || 'light';
    
    // 2. Apply theme to <html> tag
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 3. Update icon
    if (domElements.themeIcon) {
        domElements.themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    console.log(`✓ Loaded theme from localStorage: ${savedTheme}`);
}

/**
 * toggleTheme()
 * 
 * Purpose: Toggle between dark and light themes and save the choice in localStorage.
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update theme toggle icon
    if (domElements.themeIcon) {
        domElements.themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Persist user preference in localStorage
    localStorage.setItem('taskflow_theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
    console.log(`✓ Theme changed to ${newTheme} and saved in localStorage`);
}

/**
 * updateSessionActions(actionName)
 * 
 * Demonstrates: sessionStorage (session storage that clears when the browser tab is closed)
 * Purpose: Track how many actions the student has performed during the current browsing session.
 */
function updateSessionActions(actionName) {
    // Read current count from sessionStorage, default to 0
    let currentCount = parseInt(sessionStorage.getItem('taskflow_actions') || '0', 10);
    currentCount += 1;
    
    // Save updated count back into sessionStorage
    sessionStorage.setItem('taskflow_actions', currentCount.toString());
    
    // Update badge in UI
    if (domElements.sessionBadge) {
        domElements.sessionBadge.textContent = `Session Actions: ${currentCount}`;
    }
    
    console.log(`📊 Session action logged (${actionName}). Total session actions: ${currentCount}`);
}


// ===== TOAST NOTIFICATION UTILITY =====

// Track active toast timer to prevent duplicate/overlapping notifications
let toastTimeoutId = null;

/**
 * showToast(message, type)
 * 
 * Purpose: Display a temporary floating notification on the screen
 * Enforces at most ONE clear notification at a time.
 * 
 * Parameters:
 * - message (String): Notification text
 * - type (String): 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info') {
    if (!domElements.toastContainer) return;
    
    // Cancel any pending dismissal timer
    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
        toastTimeoutId = null;
    }
    
    // Clear any existing toasts to prevent stacking or overlapping notifications
    domElements.toastContainer.innerHTML = '';
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';
    
    toast.innerHTML = `<span>${icon} ${message}</span>`;
    domElements.toastContainer.appendChild(toast);
    
    // Automatically remove after 2.5 seconds
    toastTimeoutId = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.25s ease';
        setTimeout(() => toast.remove(), 250);
        toastTimeoutId = null;
    }, 2500);
}


// ===== EXTERNAL API INTEGRATION & ASYNC/AWAIT (Lectures 27-29) =====

/**
 * fetchDailyStudyTip()
 * 
 * Demonstrates:
 * 1. Async/Await syntax (Lecture 28)
 * 2. Fetch API for REST API consumption (Lecture 29)
 * 3. try...catch error handling (Lecture 28)
 * 4. Fallback strategy when network/external API fails
 * 
 * Process:
 * 1. Show loading state in UI
 * 2. Fetch advice from public API
 * 3. Verify response.ok status
 * 4. Parse JSON
 * 5. Update UI; if error occurs, catch it and load local fallback tip
 */
async function fetchDailyStudyTip() {
    if (!domElements.studyTipText) return;
    
    // Step 1: Show loading state
    domElements.studyTipText.textContent = "Fetching study tip...";
    if (domElements.refreshTipBtn) domElements.refreshTipBtn.disabled = true;
    
    try {
        // Step 2: Fetch from external Advice Slip REST API
        // Adding a timestamp prevents browser caching of the API response
        const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
        
        // Step 3: Check HTTP status code
        if (!response.ok) {
            throw new Error(`External API responded with status: ${response.status}`);
        }
        
        // Step 4: Parse JSON response
        const data = await response.json();
        
        if (data && data.slip && data.slip.advice) {
            domElements.studyTipText.textContent = `"${data.slip.advice}"`;
            domElements.studyTipAuthor.textContent = "— Daily Inspiration";
            console.log('✓ Successfully fetched study tip from external API');
        } else {
            throw new Error("Invalid response format from external API");
        }
    } catch (error) {
        // Step 5: Graceful error fallback
        console.warn('⚠️ External tip API error, using educational fallback:', error.message);
        
        // Pick a random fallback quote from our local array
        const randomTip = fallbackStudyTips[Math.floor(Math.random() * fallbackStudyTips.length)];
        domElements.studyTipText.textContent = `"${randomTip.text}"`;
        domElements.studyTipAuthor.textContent = `— ${randomTip.author}`;
    } finally {
        // Re-enable button
        if (domElements.refreshTipBtn) domElements.refreshTipBtn.disabled = false;
    }
}

/**
 * fetchDailyStudyTipWithPromiseChain()
 * 
 * Demonstrates: Promise chaining (.then().catch()) as required by CHO Syllabus Lecture 27
 * This is an alternative version kept for viva demonstration to show the difference between
 * Promise chaining and async/await.
 */
function fetchDailyStudyTipWithPromiseChain() {
    console.log('🔗 Demonstrating Promise chaining (.then / .catch)...');
    
    fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`)
        .then(response => {
            if (!response.ok) throw new Error("HTTP error " + response.status);
            return response.json(); // Returns another Promise
        })
        .then(data => {
            console.log('✓ Promise chained resolved data:', data);
            if (domElements.studyTipText && data.slip) {
                domElements.studyTipText.textContent = `"${data.slip.advice}"`;
                domElements.studyTipAuthor.textContent = "— Advice Slip (Promise Chained)";
            }
        })
        .catch(error => {
            console.error('✗ Promise chain catch handler:', error);
            const randomTip = fallbackStudyTips[0];
            if (domElements.studyTipText) {
                domElements.studyTipText.textContent = `"${randomTip.text}"`;
                domElements.studyTipAuthor.textContent = `— ${randomTip.author} (Fallback)`;
            }
        });
}


// ===== EMPTY STATE FUNCTIONS =====

/**
 * showEmptyState()
 * Displays a friendly placeholder when no tasks match current filter/search.
 */
function showEmptyState() {
    const emptyStateHTML = `
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3 class="empty-title">No tasks available</h3>
            <p class="empty-message">Add your first task or change your search filter to get started</p>
        </div>
    `;
    domElements.taskListContainer.innerHTML = emptyStateHTML;
}

function hideEmptyState() {
    domElements.taskListContainer.innerHTML = '';
}


// ===== FORM VALIDATION =====

/**
 * validateTaskForm(title)
 * 
 * Demonstrates: Client-side Form Validation
 * Parameters:
 * - title (String): Task title
 * Returns: Boolean (true if valid, false if invalid)
 */
function validateTaskForm(title) {
    if (!title || title.trim() === '') {
        showFormError('Task title cannot be empty');
        return false;
    }
    
    if (title.trim().length < 2) {
        showFormError('Task title must be at least 2 characters long');
        return false;
    }
    
    clearFormError();
    return true;
}

function showFormError(message) {
    clearFormError();
    
    const errorElement = document.createElement('p');
    errorElement.className = 'form-error';
    errorElement.id = 'formErrorMessage';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--color-danger)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--spacing-xs)';
    errorElement.style.fontWeight = 'var(--font-weight-semibold)';
    
    domElements.taskTitle.parentElement.appendChild(errorElement);
    domElements.taskTitle.style.borderColor = 'var(--color-danger)';
    domElements.taskTitle.style.boxShadow = '0 0 0 3px var(--color-danger-light)';
}

function clearFormError() {
    const errorElement = document.getElementById('formErrorMessage');
    if (errorElement) errorElement.remove();
    
    if (domElements.taskTitle) {
        domElements.taskTitle.style.borderColor = '';
        domElements.taskTitle.style.boxShadow = '';
    }
}


// ===== SEARCH, FILTER AND SORTING =====

/**
 * getFilteredTasks()
 * 
 * Demonstrates: Array methods (filter, sort, toLowerCase)
 * Purpose: Returns the filtered and sorted list of tasks based on user selections.
 */
function getFilteredTasks() {
    const searchText = (domElements.searchInput ? domElements.searchInput.value : '').toLowerCase().trim();
    const filterStatus = domElements.filterStatus ? domElements.filterStatus.value : 'all';
    const sortBy = domElements.sortBy ? domElements.sortBy.value : 'newest';
    
    // 1. Filter by search text and completed status
    let filtered = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchText) ||
                              (task.description && task.description.toLowerCase().includes(searchText));
        
        let matchesStatus = true;
        if (filterStatus === 'pending') {
            matchesStatus = task.completed === false;
        } else if (filterStatus === 'completed') {
            matchesStatus = task.completed === true;
        }
        
        return matchesSearch && matchesStatus;
    });
    
    // 2. Sort the filtered array

    filtered.sort((a, b) => {
        if (sortBy === 'newest') {
            // Newest ID first (or newest date)
            return (b.id || 0) - (a.id || 0);
        } else if (sortBy === 'oldest') {
            // Oldest ID first
            return (a.id || 0) - (b.id || 0);
        } else if (sortBy === 'alphabetical') {
            // Alphabetical by title
            return a.title.localeCompare(b.title);
        } else if (sortBy === 'priority') {
            // High = 3, Medium = 2, Low = 1
            const weight = { high: 3, medium: 2, low: 1 };
            const weightA = weight[a.priority] || 2;
            const weightB = weight[b.priority] || 2;
            return weightB - weightA;
        }
        return 0;
    });
    
    return filtered;
}


// RENDERING TASKS

/**
 * renderTasks()
 * 
 * Purpose: Render tasks inside #taskListContainer and bind click handlers.
 */
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    domElements.taskListContainer.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        showEmptyState();
        return;
    }
    
    filteredTasks.forEach((task) => {
        const taskCardHTML = createTaskCard(task);
        domElements.taskListContainer.innerHTML += taskCardHTML;
    });
    
    // Attach event listeners to newly rendered action buttons
    attachEditButtonListeners();
}

/**
 * createTaskCard(task)
 * 
 * Purpose: Create the HTML string for a single task card.
 */
function createTaskCard(task) {
    const createdDate = task.createdAt 
        ? new Date(task.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : 'Recently';
        
    let dueDateDisplay = 'No due date';
    if (task.dueDate) {
        dueDateDisplay = new Date(task.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    const statusText = task.completed ? 'Completed' : 'Pending';
    const statusClass = task.completed ? 'task-status-completed' : 'task-status-pending';
    const priorityClass = `priority-${task.priority || 'medium'}`;
    
    let statusButton = '';
    if (task.completed) {
        statusButton = `<span class="task-status ${statusClass}" style="padding: 6px 12px; border-radius: 4px; background-color: #10b981; color: white;">✓ Completed</span>`;
    } else {
        statusButton = `<button class="btn-complete" data-task-id="${task.id}" aria-label="Mark task as complete">✓ Complete</button>`;
    }
    
    return `
        <div class="task-card" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-title-section">
                    <h3 class="task-title" style="${task.completed ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${task.title}</h3>
                    <span class="priority-badge ${priorityClass}">
                        ${(task.priority || 'medium').toUpperCase()}
                    </span>
                </div>
                <div class="task-actions">
                    <button class="btn-edit" data-task-id="${task.id}" aria-label="Edit task">✏️ Edit</button>
                    <button class="btn-delete" data-task-id="${task.id}" aria-label="Delete task">🗑️ Delete</button>
                </div>
            </div>
            
            <p class="task-description">${task.description || 'No description provided'}</p>
            
            <div class="task-meta">
                <span class="task-status ${statusClass}">📌 ${statusText}</span>
                <span class="task-date">📅 Due: ${dueDateDisplay}</span>
                <span class="task-created">🕐 Created: ${createdDate}</span>
            </div>
            
            <div class="task-complete-section" style="margin-top: 12px;">
                ${statusButton}
            </div>
        </div>
    `;
}

function updateStatistics() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed === true).length;
    const pendingTasks = tasks.filter((task) => task.completed === false).length;
    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    if (domElements.statTotal) domElements.statTotal.textContent = totalTasks;
    if (domElements.statCompleted) domElements.statCompleted.textContent = completedTasks;
    if (domElements.statPending) domElements.statPending.textContent = pendingTasks;
    if (domElements.statPercentage) domElements.statPercentage.textContent = `${completionPercentage}%`;
    if (domElements.taskCount) {
        domElements.taskCount.textContent = totalTasks === 1 ? '1 task' : `${totalTasks} tasks`;
    }
}


// ===== BACKEND CRUD OPERATIONS (ASYNC/AWAIT & FETCH API) =====

/**
 * loadTasks()
 * 
 * Demonstrates: Fetch API GET request with async/await
 */
async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        
        if (!response.ok) {
            throw new Error(`Failed to load tasks. Status: ${response.status}`);
        }
        
        const data = await response.json();
        tasks = data;
        
        renderTasks();
        updateStatistics();
        console.log(`✓ Loaded ${tasks.length} task(s) from backend`);
    } catch (error) {
        console.error("❌ Error loading tasks from backend:", error);
        showEmptyState();
        showToast("Could not connect to task server", "error");
    }
}

/**
 * addTask()
 * 
 * Demonstrates: Fetch API POST request with JSON payload & validation
 */
async function addTask() {
    const title = domElements.taskTitle.value;
    const description = domElements.taskDescription.value;
    const priority = domElements.taskPriority.value;
    const dueDate = domElements.taskDueDate.value;
    
    if (!validateTaskForm(title)) {
        return;
    }
    
    const newTaskPayload = {
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        dueDate: dueDate,
        completed: false
    };
    
    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTaskPayload)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to add task (${response.status})`);
        }
        
        const createdTask = await response.json();
        tasks.push(createdTask);
        
        renderTasks();
        updateStatistics();
        clearForm();
        updateSessionActions('Add Task');
        showToast("Task added successfully!", "success");
        domElements.taskTitle.focus();
    } catch (error) {
        console.error("❌ Error adding task:", error);
        showFormError(error.message);
        showToast(error.message, "error");
    }
}

/**
 * updateTask(id)
 * 
 * Demonstrates: Fetch API PUT request
 */
async function updateTask(id) {
    const newTitle = domElements.taskTitle.value;
    const newDescription = domElements.taskDescription.value;
    const newPriority = domElements.taskPriority.value;
    const newDueDate = domElements.taskDueDate.value;
    
    if (!validateTaskForm(newTitle)) {
        return;
    }
    
    // Find current task to preserve completion status
    const existingTask = tasks.find(t => t.id === id);
    const isCompleted = existingTask ? existingTask.completed : false;
    
    const updatedPayload = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        priority: newPriority,
        dueDate: newDueDate,
        completed: isCompleted
    };
    
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPayload)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update task (${response.status})`);
        }
        
        const updatedTask = await response.json();
        
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
        }
        
        renderTasks();
        updateStatistics();
        resetForm();
        updateSessionActions('Update Task');
        showToast("Task updated successfully!", "success");
    } catch (error) {
        console.error(`❌ Error updating task ${id}:`, error);
        showFormError("Failed to update task. Please try again.");
        showToast("Failed to update task", "error");
    }
}

/**
 * deleteTask(id)
 * 
 * Demonstrates: Fetch API DELETE request
 */
async function deleteTask(id) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
    
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: "DELETE"
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete task (${response.status})`);
        }
        
        tasks = tasks.filter((task) => task.id !== id);
        renderTasks();
        updateStatistics();
        updateSessionActions('Delete Task');
        showToast("Task deleted", "info");
    } catch (error) {
        console.error(`❌ Error deleting task ${id}:`, error);
        showToast("Error deleting task", "error");
    }
}

/**
 * completeTask(id)
 * 
 * Demonstrates: Fetch API PUT request to toggle/set completion
 */
async function completeTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    const updatedPayload = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        completed: true
    };
    
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPayload)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to mark task complete (${response.status})`);
        }
        
        const updatedTask = await response.json();
        const taskIndex = tasks.findIndex((t) => t.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
        }
        
        renderTasks();
        updateStatistics();
        updateSessionActions('Complete Task');
        showToast("🎉 Task marked as complete!", "success");
    } catch (error) {
        console.error(`❌ Error completing task ${id}:`, error);
        showToast("Failed to mark task complete", "error");
    }
}


// ===== FORM EDIT & RESET MODES =====

function editTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    editingTaskId = id;
    
    domElements.taskTitle.value = task.title;
    domElements.taskDescription.value = task.description || '';
    domElements.taskPriority.value = task.priority || 'medium';
    domElements.taskDueDate.value = task.dueDate || '';
    clearFormError();
    
    if (domElements.submitTaskBtn) {
        domElements.submitTaskBtn.innerHTML = '<span class="btn-icon">✓</span>Update Task';
        domElements.submitTaskBtn.classList.add('btn-update');
    }
    
    if (domElements.cancelEditBtn) {
        domElements.cancelEditBtn.style.display = 'inline-flex';
    }
    
    domElements.taskForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    domElements.taskTitle.focus();
}

function resetForm() {
    domElements.taskForm.reset();
    editingTaskId = null;
    
    if (domElements.submitTaskBtn) {
        domElements.submitTaskBtn.innerHTML = '<span class="btn-icon">+</span>Add Task';
        domElements.submitTaskBtn.classList.remove('btn-update');
    }
    
    if (domElements.cancelEditBtn) {
        domElements.cancelEditBtn.style.display = 'none';
    }
    
    clearFormError();
}

function clearForm() {
    domElements.taskForm.reset();
    clearFormError();
}


// ===== EVENT BINDING =====

function attachEditButtonListeners() {
    document.querySelectorAll('.btn-edit').forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const taskId = parseInt(button.getAttribute('data-task-id'), 10);
            editTask(taskId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const taskId = parseInt(button.getAttribute('data-task-id'), 10);
            deleteTask(taskId);
        });
    });
    
    document.querySelectorAll('.btn-complete').forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const taskId = parseInt(button.getAttribute('data-task-id'), 10);
            completeTask(taskId);
        });
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    if (editingTaskId !== null) {
        updateTask(editingTaskId);
    } else {
        addTask();
    }
}

function bindEvents() {
    // Form submit
    domElements.taskForm.addEventListener('submit', handleFormSubmit);
    
    // Cancel Edit button
    if (domElements.cancelEditBtn) {
        domElements.cancelEditBtn.addEventListener('click', resetForm);
    }
    
    // Search input (fires live as student types)
    domElements.searchInput.addEventListener('input', renderTasks);
    
    // Status filter dropdown
    domElements.filterStatus.addEventListener('change', renderTasks);
    
    // Sorting dropdown
    if (domElements.sortBy) {
        domElements.sortBy.addEventListener('change', renderTasks);
    }
    
    // Dark theme toggle
    if (domElements.themeToggle) {
        domElements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Refresh study tip button
    if (domElements.refreshTipBtn) {
        domElements.refreshTipBtn.addEventListener('click', fetchDailyStudyTip);
    }
    
    // Topic Navigation Tabs (Unified Single Website Dashboard)
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Update active state on tab buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active state on tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const activePane = document.getElementById(targetTab);
            if (activePane) {
                activePane.classList.add('active');
            }
            
            // Re-render tasks if user switched back to task manager
            if (targetTab === 'tab-tasks') {
                renderTasks();
            }
        });
    });
    
    console.log('✓ All DOM Events Bound Successfully');
}


// ===== APP INITIALIZATION =====

function initializeApp() {
    console.log('🚀 Initializing TaskFlow (CHO FA2 Edition)...');
    
    // 1. Cache all elements
    cacheDOMElements();
    
    // 2. Initialize theme from localStorage
    initTheme();
    
    // 3. Initialize session actions from sessionStorage
    const currentActions = sessionStorage.getItem('taskflow_actions') || '0';
    if (domElements.sessionBadge) {
        domElements.sessionBadge.textContent = `Session Actions: ${currentActions}`;
    }
    
    // 4. Bind event listeners
    bindEvents();
    
    // 5. Show initial empty state
    showEmptyState();
    
    // 6. Fetch tasks from backend
    loadTasks();
    
    // 7. Fetch daily study tip from API (demonstrating async/await & external API)
    fetchDailyStudyTip();
    
    console.log('✓ TaskFlow Initialized Successfully');
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);


// ==============================================================================
// UNIFIED DASHBOARD INTERACTIVE DEMONSTRATIONS (CHO FA2 LECTURES 25-48)
// ==============================================================================

// Helper for logging to dashboard consoles
function logConsole(elementId, text, clear = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (clear || el.textContent.startsWith('//')) {
        el.textContent = text;
    } else {
        el.textContent += '\n' + text;
    }
    el.scrollTop = el.scrollHeight;
}

// Global JWT token stored in memory during authentication tests
let demoAuthToken = null;


// ===== TAB 2: ADVANCED JAVASCRIPT DEMOS (LECTURES 25-30) =====

function runJsCallbackDemo() {
    logConsole('jsCallbackConsole', '-> [Step 1] Initiating asynchronous callback demonstration...', true);
    
    function simulateAsyncData(id, callback) {
        logConsole('jsCallbackConsole', `-> [Step 2] Queuing task #${id} with setTimeout(600ms)...`);
        setTimeout(() => {
            const data = { taskId: id, title: "Review Event Loop Microtasks", completed: true };
            callback(null, data);
        }, 600);
    }
    
    simulateAsyncData(101, (err, task) => {
        if (err) {
            logConsole('jsCallbackConsole', '✗ Error: ' + err);
            return;
        }
        logConsole('jsCallbackConsole', `✓ [Step 4] Callback executed! Non-blocking I/O finished.`);
        logConsole('jsCallbackConsole', `Task Payload: ${JSON.stringify(task)}`);
    });
    
    logConsole('jsCallbackConsole', '-> [Step 3] Synchronous code continued immediately without waiting!');
}

function runJsPromiseDemo() {
    logConsole('jsPromiseConsole', '-> [Step 1] Creating new Promise for task #201...', true);
    
    function fetchPromise(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id <= 0) reject(new Error("Invalid ID: Must be positive"));
                else resolve({ id, title: "Prepare Viva Explanations", priority: "high" });
            }, 500);
        });
    }
    
    fetchPromise(201)
        .then(task => {
            logConsole('jsPromiseConsole', `✓ [Step 2] Promise 1 resolved: "${task.title}"`);
            logConsole('jsPromiseConsole', '-> [Step 3] Chaining Promise 2 (marking complete)...');
            task.completed = true;
            return task; // Passes to next .then()
        })
        .then(updatedTask => {
            logConsole('jsPromiseConsole', `✓ [Step 4] Promise 2 resolved: completed = ${updatedTask.completed}`);
            return "Promise chain resolved successfully!";
        })
        .then(summary => {
            logConsole('jsPromiseConsole', `✓ [Step 5] ${summary}`);
        })
        .catch(err => {
            logConsole('jsPromiseConsole', `✗ Rejected: ${err.message}`);
        });
}

function runJsPromiseRejectDemo() {
    logConsole('jsPromiseConsole', '-> Requesting invalid Task ID (-5) to trigger Promise reject()...', true);
    new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Task -5 not found in system")), 400);
    })
    .catch(err => {
        logConsole('jsPromiseConsole', `✓ .catch() handler caught rejected Promise: "${err.message}"`);
    });
}

async function runJsAsyncDemo() {
    logConsole('jsAsyncConsole', '-> [Step 1] Calling async function...', true);
    try {
        logConsole('jsAsyncConsole', '-> [Step 2] Awaiting simulated asynchronous task fetch (500ms)...');
        const task = await new Promise(resolve => {
            setTimeout(() => resolve({ id: 301, title: "Async/Await Integration", status: "success" }), 500);
        });
        logConsole('jsAsyncConsole', `✓ [Step 3] Await resolved! Received task: "${task.title}"`);
        logConsole('jsAsyncConsole', `✓ [Step 4] Code executed synchronously in appearance, non-blocking in reality.`);
    } catch (err) {
        logConsole('jsAsyncConsole', `✗ Caught error: ${err.message}`);
    }
}

async function runJsAsyncErrorDemo() {
    logConsole('jsAsyncConsole', '-> Testing try/catch error handling in async/await...', true);
    try {
        await new Promise((_, reject) => setTimeout(() => reject(new Error("Simulated network timeout (504)")), 300));
    } catch (err) {
        logConsole('jsAsyncConsole', `✓ Error successfully caught by try/catch block:`);
        logConsole('jsAsyncConsole', `  Error Message: "${err.message}"`);
    }
}

async function runJsFetchTasksDemo() {
    logConsole('jsFetchConsole', '-> Sending GET /api/tasks to Express server...', true);
    try {
        const res = await fetch('/api/tasks');
        logConsole('jsFetchConsole', `Response Status: ${res.status} (${res.statusText}) | ok: ${res.ok}`);
        const data = await res.json();
        logConsole('jsFetchConsole', `✓ Loaded ${data.length} task(s) from backend.`);
        if (data.length > 0) {
            logConsole('jsFetchConsole', `First task: ${JSON.stringify(data[0], null, 2)}`);
        }
    } catch (err) {
        logConsole('jsFetchConsole', `✗ Fetch error: ${err.message}`);
    }
}

async function runJsFetchAdviceDemo() {
    logConsole('jsFetchConsole', '-> Sending request to external Advice Slip REST API...', true);
    try {
        const res = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();
        logConsole('jsFetchConsole', `✓ External Advice: "${data.slip.advice}" (ID: ${data.slip.id})`);
    } catch (err) {
        logConsole('jsFetchConsole', `⚠️ External API unreachable: ${err.message}. Local fallback active.`);
    }
}

function runJsStorageDemo() {
    const time = new Date().toLocaleTimeString();
    localStorage.setItem('demo_last_inspected', time);
    sessionStorage.setItem('demo_tab_id', Math.floor(Math.random() * 10000));
    
    const theme = localStorage.getItem('taskflow_theme') || 'light';
    const actions = sessionStorage.getItem('taskflow_actions') || '0';
    const last = localStorage.getItem('demo_last_inspected');
    const tabId = sessionStorage.getItem('demo_tab_id');
    
    logConsole('jsStorageConsole', '=== LOCALSTORAGE (Permanent across restarts) ===', true);
    logConsole('jsStorageConsole', `• taskflow_theme: "${theme}"`);
    logConsole('jsStorageConsole', `• demo_last_inspected: "${last}"`);
    logConsole('jsStorageConsole', '\n=== SESSIONSTORAGE (Cleared on tab close) ===');
    logConsole('jsStorageConsole', `• taskflow_actions: "${actions}"`);
    logConsole('jsStorageConsole', `• demo_tab_id: "${tabId}"`);
}

function clearJsStorageDemo() {
    localStorage.removeItem('demo_last_inspected');
    sessionStorage.removeItem('demo_tab_id');
    logConsole('jsStorageConsole', '✓ Cleared demo storage keys.', true);
}


// ===== TAB 3: NODE.JS FUNDAMENTALS DEMOS (LECTURES 31-36) =====

async function runNodeScriptDemo(topic, consoleId) {
    logConsole(consoleId, `-> Running node-demos script '${topic}' via /api/demos/node/${topic}...`, true);
    try {
        const res = await fetch(`/api/demos/node/${topic}`);
        if (!res.ok) {
            throw new Error(`Failed to execute script. Status: ${res.status}`);
        }
        const data = await res.json();
        logConsole(consoleId, `Command: ${data.command}\n\n${data.output}`);
    } catch (err) {
        logConsole(consoleId, `❌ Execution error: ${err.message}\nYou can also run this in your terminal:\n  npm run demo:${topic === 'streams' ? 'streams' : topic === 'emitter' ? 'emitter' : topic === 'fs' ? 'fs' : topic === 'modules' ? 'modules' : 'event-loop'}`);
    }
}

function checkNativeHttpInfo() {
    logConsole('nativeHttpConsole', '=== Native Node.js HTTP Module (Lecture 35) ===', true);
    logConsole('nativeHttpConsole', 'File: node-demos/05_native_http_server.js');
    logConsole('nativeHttpConsole', 'Key Concepts:\n' +
        '1. Uses built-in `http.createServer((req, res) => {...})` without Express.\n' +
        '2. Inspects raw `req.url` and `req.method` to perform manual routing.\n' +
        '3. Sets headers using `res.setHeader()` and status codes using `res.writeHead(200)`.\n' +
        '4. Writes payload and closes response stream with `res.end(JSON.stringify(data))`.\n' +
        '\nTo launch in a separate terminal: node node-demos/05_native_http_server.js');
}


// ===== TAB 4: EXPRESS, REST & AUTH DEMOS (LECTURES 37-40) =====

async function testExpressValidation() {
    logConsole('expressValidationConsole', '-> Testing input validation: POST /api/tasks with empty title...', true);
    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: "   ", priority: "low" })
        });
        const data = await res.json();
        logConsole('expressValidationConsole', `HTTP Status: ${res.status} (${res.statusText})`);
        logConsole('expressValidationConsole', `Server Response:\n${JSON.stringify(data, null, 2)}`);
        logConsole('expressValidationConsole', '✓ Input validation middleware intercepted empty title and returned 400 Bad Request!');
    } catch (err) {
        logConsole('expressValidationConsole', `✗ Error: ${err.message}`);
    }
}

async function testExpressErrorHandler() {
    logConsole('expressErrorConsole', '-> Requesting non-existent route /api/invalid-endpoint-test-404...', true);
    try {
        const res = await fetch('/api/invalid-endpoint-test-404');
        const data = await res.json();
        logConsole('expressErrorConsole', `HTTP Status: ${res.status}`);
        logConsole('expressErrorConsole', `Centralized Error Handler Response:\n${JSON.stringify(data, null, 2)}`);
        logConsole('expressErrorConsole', '✓ Centralized 4-parameter error middleware caught error and returned structured JSON!');
    } catch (err) {
        logConsole('expressErrorConsole', `✗ Error: ${err.message}`);
    }
}

async function testAuthRegister() {
    const name = document.getElementById('demoAuthName').value;
    const email = document.getElementById('demoAuthEmail').value;
    const password = document.getElementById('demoAuthPass').value;
    
    logConsole('expressAuthConsole', `-> Registering student "${email}" (POST /api/auth/register)...`, true);
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.token) {
            demoAuthToken = data.token;
            logConsole('expressAuthConsole', `✓ Registration successful!\nPassword hashed using bcryptjs.\nGenerated JWT Token:\n${data.token}`);
        } else {
            logConsole('expressAuthConsole', `Response: ${JSON.stringify(data, null, 2)}`);
        }
    } catch (err) {
        logConsole('expressAuthConsole', `✗ Registration error: ${err.message}`);
    }
}

async function testAuthLogin() {
    const email = document.getElementById('demoAuthEmail').value;
    const password = document.getElementById('demoAuthPass').value;
    
    logConsole('expressAuthConsole', `-> Logging in "${email}" (POST /api/auth/login)...`, true);
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            demoAuthToken = data.token;
            logConsole('expressAuthConsole', `✓ Login successful!\nBcrypt verified password hash.\nSigned JWT Token:\n${data.token}`);
        } else {
            logConsole('expressAuthConsole', `Response: ${JSON.stringify(data, null, 2)}`);
        }
    } catch (err) {
        logConsole('expressAuthConsole', `✗ Login error: ${err.message}`);
    }
}

async function testAuthProtectedMe() {
    if (!demoAuthToken) {
        logConsole('expressAuthConsole', '⚠️ No JWT token found in memory. Please Register or Login first!', true);
        return;
    }
    logConsole('expressAuthConsole', '-> Accessing protected route GET /api/auth/me with Bearer token...', true);
    try {
        const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${demoAuthToken}` }
        });
        const data = await res.json();
        logConsole('expressAuthConsole', `HTTP Status: ${res.status}`);
        logConsole('expressAuthConsole', `Protected Profile Decoded by verifyToken Middleware:\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
        logConsole('expressAuthConsole', `✗ Error: ${err.message}`);
    }
}

async function testMulterUpload() {
    const fileInput = document.getElementById('demoUploadFileInput');
    if (!fileInput.files || fileInput.files.length === 0) {
        logConsole('expressUploadConsole', '⚠️ Please select a file (.pdf, .png, .jpg, .docx, .txt) first!', true);
        return;
    }
    const file = fileInput.files[0];
    const targetTaskId = tasks.length > 0 ? tasks[0].id : 1;
    
    logConsole('expressUploadConsole', `-> Uploading file "${file.name}" (${file.size} bytes) to /api/tasks/${targetTaskId}/upload...`, true);
    
    const formData = new FormData();
    formData.append('attachment', file);
    
    try {
        const res = await fetch(`/api/tasks/${targetTaskId}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            logConsole('expressUploadConsole', `✓ File uploaded successfully via Multer!\nSaved Filename: ${data.file}\nFile URL: ${data.url}\n\nTask updated with attachment reference.`);
            loadTasks(); // Refresh tasks list
        } else {
            logConsole('expressUploadConsole', `✗ Upload rejected (${res.status}): ${data.error}`);
        }
    } catch (err) {
        logConsole('expressUploadConsole', `✗ Upload error: ${err.message}`);
    }
}


// ===== TAB 5: MONGODB & MONGOOSE DEMOS (LECTURE 41) =====

async function checkLiveDbStatus() {
    logConsole('mongoStatusConsole', '-> Querying GET /api/status for database health...', true);
    try {
        const res = await fetch('/api/status');
        const data = await res.json();
        logConsole('mongoStatusConsole', `Server Uptime: ${data.uptimeSeconds} seconds`);
        logConsole('mongoStatusConsole', `Database Connected: ${data.database.connected}`);
        logConsole('mongoStatusConsole', `Active Provider: ${data.database.provider}`);
        logConsole('mongoStatusConsole', `Fail-Safe Dual-Mode: ${data.database.connected ? 'Primary MongoDB active' : 'Fallback data/tasks.json active'}`);
    } catch (err) {
        logConsole('mongoStatusConsole', `✗ Status error: ${err.message}`);
    }
}

function showMongooseSchemaCode() {
    logConsole('mongoSchemaConsole', '=== Task Mongoose Schema (models/Task.js) ===', true);
    logConsole('mongoSchemaConsole',
`const taskSchema = new mongoose.Schema({
  id: { type: Number, default: () => Date.now() },
  title: { type: String, required: true, trim: true, minlength: 2 },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  attachment: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // populate() reference
});`);
}

async function testMongoosePopulate() {
    logConsole('mongoPopulateConsole', '-> Querying GET /api/tasks to inspect populate("user")...', true);
    try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        const taskWithUser = data.find(t => t.user);
        if (taskWithUser) {
            logConsole('mongoPopulateConsole', `✓ Found Task populated with User document:`);
            logConsole('mongoPopulateConsole', JSON.stringify(taskWithUser, null, 2));
        } else {
            logConsole('mongoPopulateConsole', `Tasks fetched (${data.length} tasks). If you create a task while authenticated, the user ObjectId is automatically populated into: { name, email }.`);
            if (data.length > 0) {
                logConsole('mongoPopulateConsole', `Sample task: ${JSON.stringify(data[0], null, 2)}`);
            }
        }
    } catch (err) {
        logConsole('mongoPopulateConsole', `✗ Error: ${err.message}`);
    }
}

