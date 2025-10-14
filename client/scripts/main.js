// Main Application Entry Point

import { storage } from './storage.js';
import { State } from './state.js';
import { UI } from './ui.js';
import { validateTask } from './validators.js';

// Initialize Application
const appState = new State(storage);
const ui = new UI(appState);

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (theme === 'dark') {
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
    } else {
        sunIcon?.classList.remove('hidden');
        moonIcon?.classList.add('hidden');
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show active page
            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(page)?.classList.add('active');

            appState.setPage(page);
        });
    });
}

// Task Form
function initTaskForm() {
    const form = document.getElementById('taskForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskData = {
            title: document.getElementById('taskTitle').value.trim(),
            dueDate: document.getElementById('taskDueDate').value,
            duration: parseInt(document.getElementById('taskDuration').value),
            tag: document.getElementById('taskTag').value,
            status: document.getElementById('taskStatus').value
        };

        const validation = validateTask(taskData);

        if (!validation.valid) {
            ui.showFormErrors(validation.errors);
            return;
        }

        // Show warnings if any (advanced regex insights)
        if (validation.warnings && validation.warnings.length > 0) {
            ui.showFormWarnings(validation.warnings);
        }

        const editingId = appState.editingTaskId;

        if (editingId) {
            appState.updateTask(editingId, taskData);
        } else {
            appState.createTask(taskData);
        }

        ui.closeModal();
        ui.render();
    });
}

// Modal Controls
function initModals() {
    // Open Add Modal
    document.getElementById('addTaskBtn')?.addEventListener('click', () => {
        ui.openAddModal();
    });

    document.getElementById('addTaskBtn2')?.addEventListener('click', () => {
        ui.openAddModal();
    });

    // Close Task Modal
    document.querySelector('.modal-close')?.addEventListener('click', () => {
        ui.closeModal();
    });

    document.getElementById('cancelBtn')?.addEventListener('click', () => {
        ui.closeModal();
    });

    // Delete Confirmation
    document.getElementById('confirmDelete')?.addEventListener('click', () => {
        if (ui.deleteTaskId) {
            appState.deleteTask(ui.deleteTaskId);
            ui.closeModal();
            ui.render();
        }
    });

    document.getElementById('cancelDelete')?.addEventListener('click', () => {
        ui.closeModal();
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                ui.closeModal();
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ui.currentModal) {
            ui.closeModal();
        }
    });
}

// Search
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const regexToggle = document.getElementById('regexToggle');
    const caseToggle = document.getElementById('caseToggle');
    const regexIndicator = document.getElementById('regexIndicator');
    const searchError = document.getElementById('searchError');

    function handleSearch() {
        const pattern = searchInput.value;
        const isRegex = regexToggle.checked;
        const caseInsensitive = caseToggle.checked;

        searchError.textContent = '';

        if (isRegex && pattern) {
            try {
                new RegExp(pattern, caseInsensitive ? 'i' : '');
                regexIndicator?.classList.remove('hidden');
            } catch (e) {
                searchError.textContent = 'Invalid regex pattern';
                regexIndicator?.classList.add('hidden');
            }
        } else {
            regexIndicator?.classList.add('hidden');
        }

        appState.setSearch(pattern, isRegex, caseInsensitive);
        ui.renderTasksList();
    }

    searchInput?.addEventListener('input', handleSearch);
    regexToggle?.addEventListener('change', handleSearch);
    caseToggle?.addEventListener('change', handleSearch);
}

// Sorting
function initSorting() {
    const sortButtons = {
        date: document.getElementById('sortDate'),
        title: document.getElementById('sortTitle'),
        duration: document.getElementById('sortDuration')
    };

    Object.entries(sortButtons).forEach(([field, button]) => {
        button?.addEventListener('click', () => {
            const currentField = appState.sortBy;
            const currentOrder = appState.sortOrder;

            if (currentField === field) {
                appState.setSorting(field, currentOrder === 'asc' ? 'desc' : 'asc');
            } else {
                appState.setSorting(field, 'asc');
            }

            // Update button text
            const arrow = appState.sortOrder === 'asc' ? '↑' : '↓';
            Object.values(sortButtons).forEach(btn => {
                if (btn) {
                    const text = btn.textContent.split(' ')[0];
                    btn.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m7 15 5 5 5-5"></path>
                            <path d="m7 9 5-5 5 5"></path>
                        </svg>
                        ${text}
                    `;
                }
            });

            if (button) {
                const text = button.textContent.trim().split('\n').map(s => s.trim()).join(' ').split(' ')[0];
                button.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m7 15 5 5 5-5"></path>
                        <path d="m7 9 5-5 5 5"></path>
                    </svg>
                    ${text} ${arrow}
                `;
            }

            ui.renderTasksList();
        });
    });
}

// Settings
function initSettings() {
    const weeklyTarget = document.getElementById('weeklyTarget');
    const saveBtn = document.getElementById('saveTarget');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const clearBtn = document.getElementById('clearBtn');

    // Load settings
    const settings = appState.getSettings();
    if (weeklyTarget) weeklyTarget.value = settings.weeklyTarget;

    // Save target
    saveBtn?.addEventListener('click', () => {
        const value = parseInt(weeklyTarget.value);
        if (value > 0) {
            appState.updateSettings({ weeklyTarget: value });
            ui.render();
            alert('Weekly target saved!');
        }
    });

    // Export data
    exportBtn?.addEventListener('click', () => {
        const data = appState.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `campus-planner-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Import data
    importBtn?.addEventListener('click', () => {
        importFile?.click();
    });

    importFile?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                appState.importData(data);
                ui.render();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Failed to import data: ' + error.message);
            }
        };
        reader.readAsText(file);
    });

    // Clear all data
    clearBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
            appState.clearAll();
            ui.render();
            alert('All data cleared!');
        }
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    themeToggle?.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        const theme = isDark ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });
}

// Initialize App
function init() {
    initTheme();
    initNavigation();
    initTaskForm();
    initModals();
    initSearch();
    initSorting();
    initSettings();
    initThemeToggle();

    // Subscribe to state changes
    appState.subscribe(() => {
        ui.render();
    });

    // Initial render
    ui.render();
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Load sample data if no tasks exist
if (appState.getAllTasks().length === 0) {
    fetch('seed.json')
        .then(res => res.json())
        .then(data => {
            if (data.tasks && data.tasks.length > 0) {
                data.tasks.forEach(task => appState.createTask(task));
                ui.render();
            }
        })
        .catch(() => {
            // No seed data, that's fine
        });
}
