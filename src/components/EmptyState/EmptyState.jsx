import styles from "./EmptyState.module.css";

function EmptyState({ filter, hasTasks, isSearching }) {
  const isCompletedFilter = filter === "Completed";
  const isCaughtUp = filter === "Active" && hasTasks;

  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon} aria-hidden="true">
        {isCompletedFilter ? "✓" : "✳"}
      </span>
      <h2 className={styles.emptyTitle}>
        {isSearching
          ? "No matching tasks"
          : isCompletedFilter
          ? "Nothing checked off yet"
          : isCaughtUp
            ? "You’re all caught up"
            : "A clear page is a good start"}
      </h2>
      <p className={styles.emptyDescription}>
        {isSearching
          ? "Try a different search or clear the search field."
          : isCompletedFilter
          ? "Finished tasks will find their place here."
          : isCaughtUp
            ? "Enjoy the breathing room. You’ve done everything on your list."
            : "Add a task above and take the first step."}
      </p>
    </div>
  );
}

export default EmptyState;
