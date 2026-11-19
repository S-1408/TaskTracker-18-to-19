import styles from "./TaskFooter.module.css";
import TaskStats from "../TaskStats/TaskStats";

function TaskFooter({ remainingCount, completedCount, onClearCompleted }) {
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
    </footer>
  );
}

export default TaskFooter;
