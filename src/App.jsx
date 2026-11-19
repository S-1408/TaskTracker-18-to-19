import { useMemo, useState } from "react";
import styles from "./App.module.css";
import AppHeader from "./components/AppHeader/AppHeader";
import PageFooter from "./components/PageFooter/PageFooter";
import PageIntro from "./components/PageIntro/PageIntro";
import PrivacyNote from "./components/PrivacyNote/PrivacyNote";
import TaskFilters from "./components/TaskFilters/TaskFilters";
import TaskFooter from "./components/TaskFooter/TaskFooter";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import useTasks from "./hooks/useTasks";

function App() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    remainingCount,
    completedCount,
  } = useTasks();
  const [filter, setFilter] = useState("All");

  const visibleTasks = useMemo(() => {
    if (filter === "Active") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "Completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [filter, tasks]);

  return (
    <main className={styles["page-shell"]}>
      <AppHeader />

      <section className={styles.tracker} aria-labelledby="page-title">
        <PageIntro />
        <TaskForm onAddTask={addTask} />

        <section className={styles["task-card"]} aria-label="Your task list">
          <TaskFilters
            activeFilter={filter}
            taskCount={tasks.length}
            onChange={setFilter}
          />
          <TaskList
            tasks={visibleTasks}
            filter={filter}
            hasTasks={tasks.length > 0}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
          <TaskFooter
            remainingCount={remainingCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        </section>

        <PrivacyNote />
      </section>

      <PageFooter />
    </main>
  );
}

export default App;
