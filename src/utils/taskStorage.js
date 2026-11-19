export const STORAGE_KEY = "daymark-tasks";

export function readTasks() {
  const savedTasks = window.localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);
    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch (error) {
    console.error("Could not read saved tasks:", error);
    return [];
  }
}
