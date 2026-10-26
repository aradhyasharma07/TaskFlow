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

/**
 * showToast(message, type)
 * 
 * Purpose: Display a temporary floating notification on the screen
 * Parameters:
 * - message (String): Notification text
 * - type (String): 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info') {
    if (!domElements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';
    
    toast.innerHTML = `<span>${icon} ${message}</span>`;
    domElements.toastContainer.appendChild(toast);
    
    // Automatically remove after 3.5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
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
            domElements.studyTipAuthor.textContent = "— Advice Slip REST API (Online)";
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
        domElements.studyTipAuthor.textContent = `— ${randomTip.author} (Offline Fallback)`;
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


// ===== SEARCH, FILTER, AND SORTING =====

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


// ===== RENDERING TASKS =====

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
