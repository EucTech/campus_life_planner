// Application State Manager

export class State {
    constructor(storage) {
        this.storage = storage;
        this.currentPage = 'dashboard';
        this.sortBy = 'date';
        this.sortOrder = 'asc';
        this.searchPattern = '';
        this.searchIsRegex = false;
        this.searchCaseInsensitive = true;
        this.editingTaskId = null;
        this.listeners = new Set();
    }

    // State Updates
    setPage(page) {
        this.currentPage = page;
        this.notify();
    }

    setSorting(field, order) {
        this.sortBy = field;
        this.sortOrder = order;
        this.notify();
    }

    setSearch(pattern, isRegex, caseInsensitive) {
        this.searchPattern = pattern;
        this.searchIsRegex = isRegex;
        this.searchCaseInsensitive = caseInsensitive;
        this.notify();
    }

    setEditingTask(id) {
        this.editingTaskId = id;
        this.notify();
    }

    // Task Operations
    getAllTasks() {
        return this.storage.getAllTasks();
    }

    getFilteredTasks() {
        let tasks = this.getAllTasks();

        // Apply search filter
        if (this.searchPattern) {
            try {
                if (this.searchIsRegex) {
                    const regex = new RegExp(
                        this.searchPattern,
                        this.searchCaseInsensitive ? 'i' : ''
                    );
                    tasks = tasks.filter(task =>
                        regex.test(task.title) ||
                        regex.test(task.tag) ||
                        regex.test(task.dueDate)
                    );
                } else {
                    const pattern = this.searchCaseInsensitive
                        ? this.searchPattern.toLowerCase()
                        : this.searchPattern;

                    tasks = tasks.filter(task => {
                        const title = this.searchCaseInsensitive
                            ? task.title.toLowerCase()
                            : task.title;
                        const tag = this.searchCaseInsensitive
                            ? task.tag.toLowerCase()
                            : task.tag;
                        return title.includes(pattern) || tag.includes(pattern);
                    });
                }
            } catch (e) {
                // Invalid regex, return all tasks
            }
        }

        // Apply sorting
        tasks.sort((a, b) => {
            let comparison = 0;

            if (this.sortBy === 'date') {
                comparison = a.dueDate.localeCompare(b.dueDate);
            } else if (this.sortBy === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (this.sortBy === 'duration') {
                comparison = a.duration - b.duration;
            }

            return this.sortOrder === 'asc' ? comparison : -comparison;
        });

        return tasks;
    }

    getTask(id) {
        return this.storage.getTask(id);
    }

    createTask(taskData) {
        const task = this.storage.createTask(taskData);
        this.notify();
        return task;
    }

    updateTask(id, updates) {
        const task = this.storage.updateTask(id, updates);
        this.notify();
        return task;
    }

    deleteTask(id) {
        const result = this.storage.deleteTask(id);
        this.notify();
        return result;
    }

    // Statistics
    getStats() {
        const tasks = this.getAllTasks();
        const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);

        // Tag counts
        const tagCounts = tasks.reduce((acc, task) => {
            acc[task.tag] = (acc[task.tag] || 0) + 1;
            return acc;
        }, {});

        const topTag = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

        // Completion rate
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const completionRate = tasks.length > 0
            ? Math.round((completedTasks / tasks.length) * 100)
            : 0;

        // Last 7 days activity
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const activityData = last7Days.map((date, index) => {
            const tasksOnDay = tasks.filter(
                task => task.createdAt.split('T')[0] === date
            ).length;
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayOfWeek = new Date(date).getDay();
            return {
                label: days[dayOfWeek],
                value: tasksOnDay
            };
        });

        return {
            totalTasks: tasks.length,
            totalDuration,
            topTag,
            completedTasks,
            completionRate,
            activityData
        };
    }

    // Settings
    getSettings() {
        return this.storage.getSettings();
    }

    updateSettings(updates) {
        this.storage.updateSettings(updates);
        this.notify();
    }

    // Import/Export
    exportData() {
        return this.storage.exportData();
    }

    importData(data) {
        this.storage.importData(data);
        this.notify();
    }

    clearAll() {
        this.storage.clearAll();
        this.notify();
    }

    // Observer Pattern
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }
}
