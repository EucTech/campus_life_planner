// import { getAllTasks } from "./storage";

// Render the Components Dynamically
document.addEventListener("DOMContentLoaded", async () => {
  const components = document.querySelectorAll("Component");
  for (const comp of components) {
    const src = comp.getAttribute("src");
    const res = await fetch(src);
    const html = await res.text();
    comp.outerHTML = html;
  }
});

// A function that handles the navigation tabs
function NavTabs() {
  const allNavLinks = document.querySelectorAll(".nav-link");
  const allPages = document.querySelectorAll(".page");

  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.dataset.page;

      // Update active nav link
      allNavLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");

      // Show active page
      allPages.forEach((page) => page.classList.remove("active"));
      document.getElementById(page)?.classList.add("active");
    });
  });
}

// Function that will toggle NavBar in mobile view
const toggleNavBar = () => {
  const toggleButton = document.querySelector(".fa-bars");
  const navBar = document.querySelector(".tabs");

  toggleButton.addEventListener("click", () => {
    navBar.classList.toggle("show");
  });
};

// save tasks to localStorage from seed.json
async function saveTasks() {
  try {
    const response = await fetch("../seed.json");
    const data = await response.json();

    // Save tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(data.tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
}

// A function that get all tasks from local storage
function getAllTasks() {
  const tasksJSON = localStorage.getItem("tasks");
  if (!tasksJSON) return [];
  return JSON.parse(tasksJSON);
}

// dashboard stats
async function loadDashboardStats() {
  try {
    const tasks = getAllTasks(); // Get from localStorage
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

    // Update stats in the DOM
    const statsGrid = document.getElementById("statsGrid");
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

// Initialize the app
function init() {
  NavTabs();
  toggleNavBar();
  saveTasks().then(() => {
    loadDashboardStats();
  });
}

// When the DOM Is ready start the app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
