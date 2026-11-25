import styles from "./TaskFooter.module.css";
import TaskStats from "../TaskStats/TaskStats";

function TaskFooter({
  remainingCount,
  completedCount,
  onClearCompleted,
  canUndo,
  undoMessage,
  onUndo,
}) {
  return (
    <footer className={styles.listFooter}>
      <TaskStats
        remainingCount={remainingCount}
        completedCount={completedCount}
      />
      {completedCount > 0 && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
      {canUndo && (
        <div className={styles.undoGroup} role="status">
          <span>{undoMessage}</span>
          <button type="button" onClick={onUndo}>
            Undo
          </button>
        </div>
      )}
    </footer>
  );
}

export default TaskFooter;
