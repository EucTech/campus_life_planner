import { displayTasksEvents, loadDashboardStats } from "./ui/dashboard.js";
import { getAllTasks } from "./storage.js";

export function startDataManagement() {
    // Export data to a JSON file
  const exportBtn = document.getElementById("exportBtn");
  exportBtn?.addEventListener("click", () => {
    const tasks = getAllTasks();
    if (!tasks.length) {
      alert("No data to export.");
      return;
    }

    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tasks_backup_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  });


  // Import data from a JSON file
  const importBtn = document.getElementById("importBtn");
  importBtn?.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (!Array.isArray(importedData)) {
            alert("Invalid data format. Expected an array of tasks.");
            return;
          }

          localStorage.setItem("tasks", JSON.stringify(importedData));
          alert("Data has been imported successfully!");
          window.location.reload();
        } catch (err) {
          alert("Error importing data: " + err.message);
        }
      };

      reader.readAsText(file);
    });

    input.click();
  });

 
    // Delete all data
  const deleteBtn = document.getElementById("deleteBtn");
  deleteBtn?.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tasks? This action cannot be undone.")) {
      localStorage.removeItem("tasks");
      alert("All tasks and events have been cleared.");
      loadDashboardStats();
      displayTasksEvents();
    }
  });
}
