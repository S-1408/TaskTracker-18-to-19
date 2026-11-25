import { useEffect, useState } from "react";
import {
  normalizeWorkspace,
  PRIORITIES,
  readWorkspace,
  STORAGE_KEY,
} from "./taskStorage";

function useWorkspace() {
  const [workspace, setWorkspace] = useState(readWorkspace);
  const [undoSnapshot, setUndoSnapshot] = useState(null);
  const tasks = workspace.tasks;
  const projects = workspace.projects;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch (error) {
      console.error("Could not save tasks:", error);
    }
  }, [workspace]);

  function addTask(title, details = {}) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || trimmedTitle.length > 160) {
      return;
    }

    const projectIds = new Set(projects.map((project) => project.id));
    const task = {
      id: window.crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      priority: PRIORITIES.includes(details.priority)
        ? details.priority
        : "medium",
      dueDate: details.dueDate || "",
      projectId: projectIds.has(details.projectId)
        ? details.projectId
        : "inbox",
      createdAt: new Date().toISOString(),
    };

    setUndoSnapshot(null);
    setWorkspace((current) => ({
      ...current,
      tasks: [task, ...current.tasks],
    }));
  }

  function updateTask(taskId, changes) {
    const trimmedTitle = changes.title.trim();

    if (!trimmedTitle || trimmedTitle.length > 160) {
      return;
    }

    setUndoSnapshot(null);
    setWorkspace((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: trimmedTitle,
              priority: PRIORITIES.includes(changes.priority)
                ? changes.priority
                : task.priority,
              dueDate: changes.dueDate || "",
            }
          : task,
      ),
    }));
  }

  function toggleTask(taskId) {
    setUndoSnapshot(null);
    setWorkspace((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    }));
  }

  function deleteTask(taskId) {
    setUndoSnapshot({
      tasks,
      message: "Task deleted.",
    });
    setWorkspace((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
    }));
  }

  function clearCompleted() {
    const completedTasks = tasks.filter((task) => task.completed);

    if (completedTasks.length > 0) {
      setUndoSnapshot({
        tasks,
        message: `${completedTasks.length} completed ${completedTasks.length === 1 ? "task" : "tasks"} cleared.`,
      });
    }

    setWorkspace((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => !task.completed),
    }));
  }

  function undoLastChange() {
    if (!undoSnapshot) {
      return;
    }

    setWorkspace((current) => ({ ...current, tasks: undoSnapshot.tasks }));
    setUndoSnapshot(null);
  }

  function createProject(name) {
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length > 50) {
      return { error: "Project names must be 1 to 50 characters." };
    }

    if (
      projects.some(
        (project) => project.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      return { error: "A project with that name already exists." };
    }

    const project = {
      id: window.crypto.randomUUID(),
      name: trimmedName,
    };

    setWorkspace((current) => ({
      ...current,
      projects: [...current.projects, project],
    }));

    return { projectId: project.id };
  }

  function importWorkspace(data) {
    const normalized = normalizeWorkspace(data);

    if (!normalized || Array.isArray(data)) {
      return false;
    }

    setWorkspace(normalized);
    setUndoSnapshot(null);
    return true;
  }

  return {
    tasks,
    projects,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    undoLastChange,
    canUndo: Boolean(undoSnapshot),
    undoMessage: undoSnapshot?.message || "",
    createProject,
    importWorkspace,
    exportWorkspace: () => workspace,
  };
}

export default useWorkspace;
