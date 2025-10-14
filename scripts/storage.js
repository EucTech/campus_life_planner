// Local Storage Manager for Campus Life Planner

const STORAGE_KEY = 'campus_planner_tasks';
const SETTINGS_KEY = 'campus_planner_settings';

export class Storage {
    constructor() {
        this.tasks = this.loadTasks();
        this.settings = this.loadSettings();
    }

    // Tasks Methods
    loadTasks() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading tasks:', e);
            return [];
        }
    }

    saveTasks(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            this.tasks = tasks;
            return true;
        } catch (e) {
            console.error('Error saving tasks:', e);
            return false;
        }
    }

    getAllTasks() {
        return [...this.tasks];
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }

    createTask(taskData) {
        const task = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...taskData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks(this.tasks);
        return task;
    }

    updateTask(id, updates) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) return null;

        this.tasks[index] = {
            ...this.tasks[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveTasks(this.tasks);
        return this.tasks[index];
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) return false;

        this.tasks.splice(index, 1);
        this.saveTasks(this.tasks);
        return true;
    }

    // Settings Methods
    loadSettings() {
        try {
            const data = localStorage.getItem(SETTINGS_KEY);
            return data ? JSON.parse(data) : { weeklyTarget: 500 };
        } catch (e) {
            console.error('Error loading settings:', e);
            return { weeklyTarget: 500 };
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            this.settings = settings;
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    }

    getSettings() {
        return { ...this.settings };
    }

    updateSettings(updates) {
        this.settings = { ...this.settings, ...updates };
        this.saveSettings(this.settings);
        return this.settings;
    }

    // Import/Export
    exportData() {
        return {
            tasks: this.tasks,
            settings: this.settings,
            exportedAt: new Date().toISOString()
        };
    }

    importData(data) {
        try {
            // Validate data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format');
            }

            if (data.tasks && Array.isArray(data.tasks)) {
                // Validate each task has required fields
                const validTasks = data.tasks.every(task =>
                    task.id && task.title && task.dueDate && 
                    typeof task.duration === 'number' && task.tag
                );

                if (!validTasks) {
                    throw new Error('Invalid task data structure');
                }

                this.tasks = data.tasks;
                this.saveTasks(this.tasks);
            }

            if (data.settings && typeof data.settings === 'object') {
                this.settings = { ...this.settings, ...data.settings };
                this.saveSettings(this.settings);
            }

            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            throw e;
        }
    }

    clearAll() {
        this.tasks = [];
        this.settings = { weeklyTarget: 500 };
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SETTINGS_KEY);
    }
}

export const storage = new Storage();
