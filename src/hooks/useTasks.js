import { useEffect, useState } from "react";
import { readTasks, STORAGE_KEY } from "../utils/taskStorage";

function useTasks() {
  const [tasks, setTasks] = useState(readTasks);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(title) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setTasks((currentTasks) => [
      { id: window.crypto.randomUUID(), title: trimmedTitle, completed: false },
      ...currentTasks,
    ]);
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  }

  function clearCompleted() {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => !task.completed),
    );
  }

  const remainingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - remainingCount;

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    remainingCount,
    completedCount,
  };
}

export default useTasks;
