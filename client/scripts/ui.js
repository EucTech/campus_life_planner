// UI Rendering and DOM Manipulation

export class UI {
    constructor(state) {
        this.state = state;
        this.currentModal = null;
        this.deleteTaskId = null;
    }

    // Render Stats Cards
    renderStats() {
        const stats = this.state.getStats();
        const grid = document.getElementById('statsGrid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Tasks</span>
                    <svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                </div>
                <div class="stat-value" data-testid="stat-total-tasks">${stats.totalTasks}</div>
                <div class="stat-trend">+${stats.totalTasks} total</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Hours</span>
                    <svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <div class="stat-value">${(stats.totalDuration / 60).toFixed(1)}h</div>
                <div class="stat-trend">${stats.totalDuration} minutes</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Top Tag</span>
                    <svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                </div>
                <div class="stat-value">${stats.topTag}</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Completion Rate</span>
                    <svg class="stat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                </div>
                <div class="stat-value">${stats.completionRate}%</div>
                <div class="stat-trend">${stats.completedTasks}/${stats.totalTasks} completed</div>
            </div>
        `;
    }

    // Render Task Card
    renderTaskCard(task) {
        const statusLabels = {
            urgent: 'Due within 24h',
            dueSoon: 'Due within 3 days',
            onTrack: 'On Track',
            completed: 'Completed'
        };

        return `
            <div class="task-card status-${task.status}" data-task-id="${task.id}">
                <div class="task-header">
                    <h3 class="task-title" data-testid="task-title-${task.id}">${this.escapeHtml(task.title)}</h3>
                    <div class="task-actions">
                        <button class="icon-btn edit-btn" data-task-id="${task.id}" data-testid="button-edit-${task.id}" aria-label="Edit task">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="icon-btn delete-btn" data-task-id="${task.id}" data-testid="button-delete-${task.id}" aria-label="Delete task">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="task-meta">
                    <span class="badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${task.duration} min
                    </span>
                    <span class="badge badge-outline">${this.escapeHtml(task.tag)}</span>
                </div>
                <div class="task-footer">
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span data-testid="task-due-${task.id}">${task.dueDate}</span>
                    </span>
                    <span class="badge badge-outline">${statusLabels[task.status]}</span>
                </div>
            </div>
        `;
    }

    // Render Recent Tasks
    renderRecentTasks() {
        const tasks = this.state.getAllTasks().slice(0, 5);
        const container = document.getElementById('recentTasksList');
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem 0;">No tasks yet. Click "Add Task" to get started!</p>';
            return;
        }

        container.innerHTML = tasks.map(task => this.renderTaskCard(task)).join('');
        this.attachTaskCardListeners(container);
    }

    // Render All Tasks
    renderTasksList() {
        const tasks = this.state.getFilteredTasks();
        const container = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        
        if (!container) return;

        if (tasks.length === 0) {
            container.innerHTML = '';
            if (emptyState) {
                emptyState.classList.remove('hidden');
                emptyState.innerHTML = this.state.searchPattern
                    ? '<p class="text-muted">No tasks match your search</p>'
                    : '<p class="text-muted">No tasks yet. Add one to get started!</p>';
            }
            return;
        }

        if (emptyState) {
            emptyState.classList.add('hidden');
        }

        container.innerHTML = tasks.map(task => this.renderTaskCard(task)).join('');
        this.attachTaskCardListeners(container);
    }

    // Render Activity Chart
    renderActivityChart() {
        const stats = this.state.getStats();
        const container = document.getElementById('activityChart');
        if (!container) return;

        const maxValue = Math.max(...stats.activityData.map(d => d.value), 1);

        container.innerHTML = stats.activityData.map(item => `
            <div class="bar">
                <div class="bar-fill" style="height: ${(item.value / maxValue) * 100}%" data-testid="bar-${item.label}"></div>
                <span class="bar-label">${item.label}</span>
            </div>
        `).join('');
    }

    // Render Cap Status
    renderCapStatus() {
        const stats = this.state.getStats();
        const settings = this.state.getSettings();
        const target = settings.weeklyTarget || 500;

        const capText = document.getElementById('capText');
        const capProgress = document.getElementById('capProgress');
        const capWarning = document.getElementById('capWarning');

        if (capText) {
            capText.textContent = `${stats.totalDuration} minutes used of ${target} minute weekly target`;
        }

        if (capProgress) {
            const percentage = Math.min((stats.totalDuration / target) * 100, 100);
            capProgress.style.width = `${percentage}%`;
        }

        if (capWarning) {
            if (stats.totalDuration > target) {
                capWarning.textContent = `${stats.totalDuration - target} minutes over target!`;
                capWarning.setAttribute('aria-live', 'assertive');
            } else {
                capWarning.textContent = '';
                capWarning.setAttribute('aria-live', 'polite');
            }
        }
    }

    // Attach Task Card Event Listeners
    attachTaskCardListeners(container) {
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.currentTarget.dataset.taskId;
                this.openEditModal(taskId);
            });
        });

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.currentTarget.dataset.taskId;
                this.openDeleteModal(taskId);
            });
        });
    }

    // Modal Management
    openAddModal() {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const title = document.getElementById('modalTitle');

        if (title) title.textContent = 'Add New Task';
        if (form) form.reset();

        this.state.setEditingTask(null);
        this.clearFormErrors();
        
        modal?.classList.add('active');
        this.currentModal = 'task';
    }

    openEditModal(taskId) {
        const task = this.state.getTask(taskId);
        if (!task) return;

        const modal = document.getElementById('taskModal');
        const title = document.getElementById('modalTitle');

        if (title) title.textContent = 'Edit Task';

        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDueDate').value = task.dueDate;
        document.getElementById('taskDuration').value = task.duration;
        document.getElementById('taskTag').value = task.tag;
        document.getElementById('taskStatus').value = task.status;

        this.state.setEditingTask(taskId);
        this.clearFormErrors();

        modal?.classList.add('active');
        this.currentModal = 'task';
    }

    openDeleteModal(taskId) {
        this.deleteTaskId = taskId;
        const modal = document.getElementById('deleteModal');
        modal?.classList.add('active');
        this.currentModal = 'delete';
    }

    closeModal() {
        if (this.currentModal === 'task') {
            document.getElementById('taskModal')?.classList.remove('active');
        } else if (this.currentModal === 'delete') {
            document.getElementById('deleteModal')?.classList.remove('active');
            this.deleteTaskId = null;
        }
        this.currentModal = null;
    }

    clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('.warning-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('input.error, select.error').forEach(el => {
            el.classList.remove('error');
        });
    }

    showFormWarnings(warnings) {
        const warningEl = document.getElementById("titleWarning");
        if (warningEl && warnings.length > 0) {
            warningEl.textContent = "⚠️ " + warnings.join(", ");
        }
    }

    showFormErrors(errors) {
        this.clearFormErrors();

        Object.entries(errors).forEach(([field, message]) => {
            const input = document.getElementById(`task${field.charAt(0).toUpperCase() + field.slice(1)}`);
            const error = document.getElementById(`${field}Error`);
            
            if (input) input.classList.add('error');
            if (error) error.textContent = message;
        });
    }

    // Utility
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Full Render
    render() {
        this.renderStats();
        this.renderRecentTasks();
        this.renderTasksList();
        this.renderActivityChart();
        this.renderCapStatus();
    }
}
