export const STORAGE_KEY = "daymark-tasks";
export const DEFAULT_PROJECT_ID = "inbox";
export const PRIORITIES = ["low", "medium", "high"];
export const BACKUP_VERSION = 1;

export function createEmptyWorkspace() {
  return {
    version: BACKUP_VERSION,
    projects: [{ id: DEFAULT_PROJECT_ID, name: "Inbox" }],
    tasks: [],
  };
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDueDate(value) {
  if (value === "") {
    return true;
  }

  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.getFullYear() === Number(value.slice(0, 4)) &&
    parsedDate.getMonth() + 1 === Number(value.slice(5, 7)) &&
    parsedDate.getDate() === Number(value.slice(8, 10))
  );
}

function normalizeProjects(projects) {
  const validProjects = Array.isArray(projects)
    ? projects.filter(
        (project) =>
          isObject(project) &&
          typeof project.id === "string" &&
          project.id.length > 0 &&
          typeof project.name === "string" &&
          project.name.trim().length > 0,
      )
    : [];
  const uniqueProjects = validProjects.filter(
    (project, index) =>
      validProjects.findIndex((candidate) => candidate.id === project.id) ===
      index,
  );
  const defaultProject = uniqueProjects.find(
    (project) => project.id === DEFAULT_PROJECT_ID,
  ) || { id: DEFAULT_PROJECT_ID, name: "Inbox" };

  return [
    defaultProject,
    ...uniqueProjects.filter((project) => project.id !== DEFAULT_PROJECT_ID),
  ].map((project) => ({ id: project.id, name: project.name.trim() }));
}

function normalizeTasks(tasks, projects) {
  if (!Array.isArray(tasks)) {
    return [];
  }

  const taskIds = new Set();
  const validTasks = tasks.filter((task) => {
    if (
      !isObject(task) ||
      typeof task.id !== "string" ||
      task.id.length === 0 ||
      typeof task.title !== "string" ||
      task.title.trim().length === 0 ||
      task.title.length > 160 ||
      typeof task.completed !== "boolean" ||
      taskIds.has(task.id)
    ) {
      return false;
    }

    taskIds.add(task.id);
    return true;
  });

  if (validTasks.length !== tasks.length) {
    console.error("Ignoring invalid saved task entries.");
  }

  const projectIds = new Set(projects.map((project) => project.id));

  return validTasks
    .map((task) => ({
      id: task.id,
      title: task.title.trim(),
      completed: task.completed,
      priority: PRIORITIES.includes(task.priority) ? task.priority : "medium",
      dueDate: isDueDate(task.dueDate) ? task.dueDate : "",
      projectId: projectIds.has(task.projectId)
        ? task.projectId
        : DEFAULT_PROJECT_ID,
      createdAt: typeof task.createdAt === "string" ? task.createdAt : "",
    }))
    .filter((task) => task.title.length > 0);
}

export function normalizeWorkspace(value) {
  if (Array.isArray(value)) {
    const projects = createEmptyWorkspace().projects;
    return {
      version: BACKUP_VERSION,
      projects,
      tasks: normalizeTasks(value, projects),
    };
  }

  if (
    !isObject(value) ||
    !Array.isArray(value.projects) ||
    !Array.isArray(value.tasks)
  ) {
    return null;
  }

  const projects = normalizeProjects(value.projects);

  return {
    version: BACKUP_VERSION,
    projects,
    tasks: normalizeTasks(value.tasks, projects),
  };
}

export function parseWorkspaceBackup(contents) {
  let parsed;

  try {
    parsed = JSON.parse(contents);
  } catch (error) {
    throw new Error("The backup file is not valid JSON.", { cause: error });
  }

  if (
    !isObject(parsed) ||
    parsed.version !== BACKUP_VERSION ||
    !Array.isArray(parsed.projects) ||
    !Array.isArray(parsed.tasks)
  ) {
    throw new Error("The backup file does not contain a supported workspace.");
  }

  const projectIds = new Set();
  for (const project of parsed.projects) {
    if (
      !isObject(project) ||
      typeof project.id !== "string" ||
      !project.id ||
      typeof project.name !== "string" ||
      !project.name.trim() ||
      project.name.length > 50 ||
      projectIds.has(project.id)
    ) {
      throw new Error("The backup contains invalid or duplicate project records.");
    }

    projectIds.add(project.id);
  }

  const taskIds = new Set();
  for (const task of parsed.tasks) {
    if (
      !isObject(task) ||
      typeof task.id !== "string" ||
      !task.id ||
      taskIds.has(task.id) ||
      typeof task.title !== "string" ||
      !task.title.trim() ||
      task.title.length > 160 ||
      typeof task.completed !== "boolean" ||
      !PRIORITIES.includes(task.priority) ||
      !isDueDate(task.dueDate) ||
      !projectIds.has(task.projectId) ||
      typeof task.createdAt !== "string"
    ) {
      throw new Error("The backup contains invalid or duplicate task records.");
    }

    taskIds.add(task.id);
  }

  const workspace = normalizeWorkspace(parsed);

  if (
    workspace.projects.length !== parsed.projects.length ||
    workspace.tasks.length !== parsed.tasks.length
  ) {
    throw new Error(
      "The backup contains invalid or duplicate project/task records.",
    );
  }

  return workspace;
}

export function readWorkspace() {
  let savedWorkspace;

  try {
    savedWorkspace = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("Could not access saved tasks:", error);
    return createEmptyWorkspace();
  }

  if (!savedWorkspace) {
    return createEmptyWorkspace();
  }

  try {
    const workspace = normalizeWorkspace(JSON.parse(savedWorkspace));

    if (!workspace) {
      console.error("Saved workspace has an unsupported format.");
      return createEmptyWorkspace();
    }

    return workspace;
  } catch (error) {
    console.error("Could not read saved tasks:", error);
    return createEmptyWorkspace();
  }
}
