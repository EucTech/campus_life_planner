import { getAllTasks, saveTasksEvents } from "../storage.js";
import {
  checkTitleValidity,
  checkNumberValidity,
  checkDateValidity,
  checkTagValidity,
} from "../validation.js";


let taskToDeleteId = null;
let taskToEditId = null;

// dashboard stats
export async function loadDashboardStats() {
  try {
    const tasks = getAllTasks();
    if (tasks.length === 0)
      return console.log("No tasks found in localStorage!");

    // Total tasks
    const totalTasks = tasks.length;

    // count completed tasks
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    // count upcoming tasks
    const upcomingTasks = tasks.filter(
      (task) => task.status === "Upcoming"
    ).length;

    // Calculate total hours spent
    let totalHours = 0;
    tasks.forEach((task) => {
      const match = task.duration.match(/(\d+(\.\d+)?)/);
      if (match) totalHours += parseFloat(match[0]);
    });

    // Get the most frequent tag
    const count = {};
    tasks.forEach((task) => {
      count[task.tag] = (count[task.tag] || 0) + 1;
    });
    const topTag = Object.keys(count).reduce((a, b) =>
      count[a] > count[b] ? a : b
    );

    const statsGrid = document.getElementById("statsGrid");
    if (!statsGrid) return;

    statsGrid.innerHTML = `
      <div class="stats-card">
        <div class="stats-card-title-icon">
          <h4>Total Tasks</h4>
          <i class="fa-solid fa-check-double"></i>
        </div>
        <p>${totalTasks}</p>
      </div>

      <div class="stats-card">
        <div class="stats-card-title-icon">
          <h4>Completed Tasks</h4>
          <i class="fa-solid fa-check-double"></i>
        </div>
        <p>${completedTasks}</p>
      </div>

      <div class="stats-card">
        <div class="stats-card-title-icon">
          <h4>Total Hours</h4>
          <i class="fa-regular fa-alarm-clock"></i>
        </div>
        <p>${totalHours} hours</p>
      </div>

      <div class="stats-card">
        <div class="stats-card-title-icon">
          <h4>Upcoming Tasks</h4>
          <i class="fa-solid fa-tag"></i>
        </div>
        <p>${upcomingTasks}</p>
      </div>
    `;
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

// Render tasks in the tasks page
export function displayTasksEvents(tasksToRender = null) {
  const tasks = tasksToRender || getAllTasks();
  const taskList = document.getElementById("taskList");

  if (!taskList) return;

  if (!tasks.length) {
    taskList.innerHTML = "<div class='no-tasks'><p>No tasks or events found.</p></div>";
    return;
  }

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";

    taskCard.innerHTML = `
      <div class="task-card-title-icon">
        <h5>${task.title}</h5>
        <div>
          <i class="fa-solid fa-pen-to-square edit-task-icon" data-task-id="${task.id}"></i>
          <i class="fa-solid fa-trash delete-task-icon" data-task-id="${task.id}"></i>
        </div>
      </div>

      <div class="task-card-time-tag">
        <span class="task-time">
          <i class="fa-regular fa-clock"></i>
          <p>${task.duration}</p>
        </span>
        <span class="task-tag">${task.tag}</span>
      </div>

      <div class="task-card-date-duration">
        <span class="task-date">
          <i class="fa-regular fa-calendar"></i>
          <p>${task.date} </p>
        </span>
        <span class="task-duration">${task.status}</span>
      </div>
    `;

    taskList.appendChild(taskCard);
  });

  // Add event listeners to edit and delete icons
  attachTaskCardListeners();
}

// Attach event listeners to task card icons
function attachTaskCardListeners() {
  // Edit icons
  const editIcons = document.querySelectorAll(".edit-task-icon");
  editIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const taskId = icon.getAttribute("data-task-id");
      editTaskEvent(taskId);
    });
  });

  // Delete icons
  const deleteIcons = document.querySelectorAll(".delete-task-icon");
  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const taskId = icon.getAttribute("data-task-id");
      openDeleteModal(taskId);
    });
  });
}

// Search tasks functionality
function initializeSearchTaskEvent() {
  const searchInput = document.getElementById("searchInput");
  
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const allTasks = getAllTasks();

    if (!searchTerm) {
      // If search is empty, show all tasks
      displayTasksEvents();
      return;
    }

    // Filter tasks based on search term
    const filteredTasks = allTasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        task.tag.toLowerCase().includes(searchTerm) ||
        task.status.toLowerCase().includes(searchTerm) ||
        task.date.includes(searchTerm)
      );
    });

    // Render filtered tasks
    displayTasksEvents(filteredTasks);
  });
}

// open delete modal
function openDeleteModal(taskId) {
  taskToDeleteId = taskId;
  const tasks = getAllTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return;

  const modal = document.getElementById("deleteModal");
  if (!modal) return;

  const modalText = modal.querySelector("p");
  if (modalText) {
    modalText.innerText = `Are you sure you want to delete the task "${task.title}" scheduled on ${task.date}? This action cannot be undone.`;
  }

  // This will display the modal in the center of the screen
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
}

// Confirm Task Deletion
function startDeleteTaskEvent() {
  const confirmBtn = document.getElementById("confirmDelete");
  const cancelBtn = document.getElementById("cancelDelete");
  const modal = document.getElementById("deleteModal");

  if (!confirmBtn || !cancelBtn || !modal) return;

  // Remove any existing listeners by cloning buttons
  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  newConfirmBtn.addEventListener("click", () => {
    if (!taskToDeleteId) return;

    let tasks = getAllTasks();
    tasks = tasks.filter((task) => task.id !== taskToDeleteId);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    modal.style.display = "none";
    taskToDeleteId = null;

    displayTasksEvents();
    loadDashboardStats();
  });

  newCancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    taskToDeleteId = null;
  });

  // This will close the modal when clicking outside the modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      taskToDeleteId = null;
    }
  });
}

// Open Add Task Modal
function startAddTaskEvent() {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const addTaskModal = document.getElementById("addTaskModal");
  const closeAddModal = document.getElementById("closeAddModal");
  const cancelAddTask = document.getElementById("cancelAddTask");
  const addTaskForm = document.getElementById("addTaskForm");
  const modalTitle = document.getElementById("modalTitle");
  const submitTaskBtn = document.getElementById("submitTaskBtn");

  if (!addTaskBtn || !addTaskModal || !addTaskForm) return;

  // Open modal for adding new task
  addTaskBtn.addEventListener("click", () => {
    taskToEditId = null; 
    modalTitle.textContent = "Add New Task";
    submitTaskBtn.textContent = "Add Task";
    addTaskForm.reset();
    addTaskModal.classList.add("active");
  });

  // Close modal 
  if (closeAddModal) {
    closeAddModal.addEventListener("click", () => addTaskModal.classList.remove("active"));
  }
  
  if (cancelAddTask) {
    cancelAddTask.addEventListener("click", () => addTaskModal.classList.remove("active"));
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === addTaskModal) addTaskModal.classList.remove("active");
  });

  // Handle Form Submit (Add or Edit)
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const date = document.getElementById("taskDate").value;
    const duration = document.getElementById("taskDuration").value;
    const tag = document.getElementById("taskTag").value;
    const status = document.getElementById("taskStatus").value;

    if (!title || !date || !duration || !tag || !status) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate inputs
  if (!checkTitleValidity(title)) {
    alert("Please enter a valid title");
    return;
  }

  if (!checkDateValidity(date)) {
    alert("Please enter a valid date in YYYY-MM-DD format.");
    return;
  }

  if (!checkNumberValidity(duration)) {
    alert("Please enter a valid duration.");
    return;
  }

  if (!checkTagValidity(tag)) {
    alert("Please enter a valid tag.");
    return;
  }

    const tasks = getAllTasks();

    if (taskToEditId) {
      // Edit existing task and events and save to localStorage
      const taskIndex = tasks.findIndex((task) => task.id === taskToEditId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], title, date, duration, tag, status };
      }
      alert("Your task has been updated successfully!");
    } else {
      // Adding a new task and save to localStorage
      const addNewTask = {
        id: `task_${Date.now()}`,
        title,
        date,
        duration,
        tag,
        status,
      };
      tasks.push(addNewTask);
      alert("Your task has been added successfully!");
    }

    // Save and refresh
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasksEvents();
    loadDashboardStats();

    // Reset modal when done
    addTaskModal.classList.remove("active");
    addTaskForm.reset();
    taskToEditId = null;
  });
}

// Edit Task Function
function editTaskEvent(taskId) {
  const tasks = getAllTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return alert("Task not found!");

  // Set edit mode
  taskToEditId = taskId;

  // Pre-fill form with task data
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDate").value = task.date;
  document.getElementById("taskDuration").value = parseInt(task.duration);
  document.getElementById("taskTag").value = task.tag;
  document.getElementById("taskStatus").value = task.status;

  // Update Add Modal to Edit Modal
  document.getElementById("modalTitle").textContent = "Edit Task or Event";
  document.getElementById("submitTaskBtn").textContent = "Save Changes";

  // Open Add or Edit Modal
  document.getElementById("addTaskModal").classList.add("active");
}

// Initialize the app
export function init() {
  saveTasksEvents().then(() => {
    loadDashboardStats();
    displayTasksEvents();
    startDeleteTaskEvent();
    startAddTaskEvent();
    initializeSearchTaskEvent();
  });
}