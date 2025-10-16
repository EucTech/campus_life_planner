// save tasks and events to localStorage from seed.json
export async function saveTasksEvents() {
  try {
    const seedUrl = new URL('../seed.json', import.meta.url).href;

    const response = await fetch(seedUrl, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Failed to fetch seed.json: ${response.status} ${response.statusText} (${seedUrl})`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const txt = await response.text();
      throw new Error(`Expected JSON but received non-JSON response from ${seedUrl}: ${txt.slice(0, 300)}`);
    }

    const data = await response.json();

    // Save tasks and events to localStorage (use empty arrays as fallbacks)
    localStorage.setItem('tasks', JSON.stringify(data.tasks || []));
    if (data.events) localStorage.setItem('events', JSON.stringify(data.events));
    console.info(`Saved ${ (data.tasks || []).length } tasks from seed.json`);
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
}

// A function that gets all tasks from local storage
export function getAllTasks() {
  const tasksJSON = localStorage.getItem('tasks');
  if (!tasksJSON) return [];
  try {
    return JSON.parse(tasksJSON);
  } catch (err) {
    console.warn('Corrupted tasks in localStorage, clearing and returning empty list');
    localStorage.removeItem('tasks');
    return [];
  }
}