import styles from "./TaskList.module.css";
import EmptyState from "../EmptyState/EmptyState";
import TaskItem from "../TaskItem/TaskItem";

function TaskList({
  tasks,
  filter,
  hasTasks,
  isSearching,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
}) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        filter={filter}
        hasTasks={hasTasks}
        isSearching={isSearching}
      />
    );
  }

  return (
    <ul className={styles.taskList}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
          onUpdate={onUpdateTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
