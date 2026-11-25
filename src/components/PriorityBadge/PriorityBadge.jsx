import styles from "./PriorityBadge.module.css";

const PRIORITY_STYLES = {
  low: styles.priorityLow,
  medium: styles.priorityMedium,
  high: styles.priorityHigh,
};

function PriorityBadge({ priority = "medium" }) {
  const label = priority[0].toUpperCase() + priority.slice(1);

  return (
    <span className={`${styles.badge} ${PRIORITY_STYLES[priority]}`}>
      {label}
    </span>
  );
}

export default PriorityBadge;
