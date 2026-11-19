import styles from "./TaskFooter.module.css";

function TaskFooter({ remainingCount, completedCount, onClearCompleted }) {
  return (
    <footer className={styles.listFooter}>
      <span>
        <strong>{remainingCount}</strong>{" "}
        {remainingCount === 1 ? "task" : "tasks"} left
      </span>
      {completedCount > 0 && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
}

export default TaskFooter;
