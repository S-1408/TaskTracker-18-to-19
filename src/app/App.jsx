import { useEffect, useMemo, useState } from "react";
import styles from "./App.module.css";
import AuthPage from "../features/auth/components/AuthPage/AuthPage";
import TaskFilters from "../features/tasks/components/TaskFilters/TaskFilters";
import TaskFooter from "../features/tasks/components/TaskFooter/TaskFooter";
import TaskForm from "../features/tasks/components/TaskForm/TaskForm";
import TaskList from "../features/tasks/components/TaskList/TaskList";
import useWorkspace from "../features/workspace/useWorkspace";
import { DEFAULT_PROJECT_ID } from "../features/workspace/taskStorage";
import useTheme from "../features/theme/useTheme";
import AppHeader from "../shared/layout/AppHeader/AppHeader";
import PageFooter from "../shared/layout/PageFooter/PageFooter";
import PageIntro from "../shared/layout/PageIntro/PageIntro";
import PrivacyNote from "../shared/layout/PrivacyNote/PrivacyNote";
import WorkspaceToolbar from "../features/workspace/components/WorkspaceToolbar/WorkspaceToolbar";

function App() {
  const {
    tasks,
    projects,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    undoLastChange,
    canUndo,
    undoMessage,
    createProject,
    importWorkspace,
    exportWorkspace,
  } = useWorkspace();
  const { theme, toggleTheme } = useTheme();
  const [authPage, setAuthPage] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selectedProjectId, setSelectedProjectId] =
    useState(DEFAULT_PROJECT_ID);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!projects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(DEFAULT_PROJECT_ID);
    }
  }, [projects, selectedProjectId]);

  const projectTasks = useMemo(
    () => tasks.filter((task) => task.projectId === selectedProjectId),
    [selectedProjectId, tasks],
  );
  const remainingCount = projectTasks.filter((task) => !task.completed).length;
  const completedCount = projectTasks.length - remainingCount;
  const visibleTasks = useMemo(() => {
    let result = projectTasks;

    if (filter === "Active") {
      result = result.filter((task) => !task.completed);
    } else if (filter === "Completed") {
      result = result.filter((task) => task.completed);
    }

    if (searchTerm.trim()) {
      const normalizedQuery = searchTerm.trim().toLowerCase();
      result = result.filter((task) =>
        task.title.toLowerCase().includes(normalizedQuery),
      );
    }

    const priorityRank = { low: 1, medium: 2, high: 3 };
    return [...result].sort((first, second) => {
      if (sortBy === "title") {
        return first.title.localeCompare(second.title);
      }

      if (sortBy === "priority") {
        return priorityRank[second.priority] - priorityRank[first.priority];
      }

      if (sortBy === "dueDate") {
        if (!first.dueDate) return 1;
        if (!second.dueDate) return -1;
        return first.dueDate.localeCompare(second.dueDate);
      }

      return second.createdAt.localeCompare(first.createdAt);
    });
  }, [filter, projectTasks, searchTerm, sortBy]);

  function downloadBackup() {
    const backup = {
      ...exportWorkspace(),
      exportedAt: new Date().toISOString(),
    };
    const file = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `daymark-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <main className={styles["page-shell"]}>
      <AppHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateAuth={setAuthPage}
      />

      {authPage ? (
        <AuthPage
          mode={authPage}
          onChangeMode={setAuthPage}
          onBackToTasks={() => setAuthPage(null)}
        />
      ) : (
        <section className={styles.tracker} aria-labelledby="page-title">
          <PageIntro />
          <WorkspaceToolbar
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onCreateProject={createProject}
            onExportBackup={downloadBackup}
            onImportWorkspace={importWorkspace}
          />
          <TaskForm onAddTask={addTask} selectedProjectId={selectedProjectId} />

          <section className={styles["task-card"]} aria-label="Your task list">
            <TaskFilters
              activeFilter={filter}
              taskCount={projectTasks.length}
              onChange={setFilter}
            />
            <TaskList
              tasks={visibleTasks}
              filter={filter}
              hasTasks={projectTasks.length > 0}
              isSearching={Boolean(searchTerm.trim())}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
            <TaskFooter
              remainingCount={remainingCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
              canUndo={canUndo}
              undoMessage={undoMessage}
              onUndo={undoLastChange}
            />
          </section>

          <PrivacyNote />
        </section>
      )}

      <PageFooter />
    </main>
  );
}

export default App;
