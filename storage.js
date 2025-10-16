// save tasks and events to localStorage from seed.json
export async function saveTasksEvents() {
  try {
    const response = await fetch("../seed.json");
    const data = await response.json();

    // Save tasks and events to localStorage
    localStorage.setItem("tasks", JSON.stringify(data.tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
}

// A function that get all tasks from local storage
export function getAllTasks() {
  const tasksJSON = localStorage.getItem("tasks");
  if (!tasksJSON) return [];
  return JSON.parse(tasksJSON);
}
