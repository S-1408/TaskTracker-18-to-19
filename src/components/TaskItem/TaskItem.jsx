import styles from "./TaskItem.module.css";

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li
      className={`${styles.taskRow}${task.completed ? ` ${styles.isComplete}` : ""}`}
    >
      <button
        type="button"
        className={styles.checkButton}
        aria-label={
          task.completed
            ? `Mark ${task.title} as active`
            : `Complete ${task.title}`
        }
        aria-pressed={task.completed}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && (
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="m3.5 8.2 2.8 2.7 6.2-6.1" />
          </svg>
        )}
      </button>
      <span className={styles.taskTitle}>{task.title}</span>
      <button
        type="button"
        className={styles.deleteButton}
        aria-label={`Delete ${task.title}`}
        onClick={() => onDelete(task.id)}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M5 6h10M8 6V4h4v2m2 0-.6 10H6.6L6 6m2.5 2.5v5m3-5v5" />
        </svg>
      </button>
    </li>
  );
}

export default TaskItem;
