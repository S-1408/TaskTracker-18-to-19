import styles from "./TaskFilters.module.css";

const FILTERS = ["All", "Active", "Completed"];

function TaskFilters({ activeFilter, taskCount, onChange }) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <div className={styles.listToolbar}>
      <div className={styles.filterTabs} role="group" aria-label="Filter tasks">
        {FILTERS.map((filterName) => (
          <button
            key={filterName}
            type="button"
            className={`${styles.filterTab}${activeFilter === filterName ? ` ${styles.isActive}` : ""}`}
            aria-pressed={activeFilter === filterName}
            onClick={() => onChange(filterName)}
          >
            {filterName}
            {filterName === "All" && (
              <span className={styles.filterCount}>{taskCount}</span>
            )}
          </button>
        ))}
      </div>
      <span className={styles.listDate}>{formattedDate}</span>
    </div>
  );
}

export default TaskFilters;
