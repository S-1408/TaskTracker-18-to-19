import PropTypes from "prop-types";
import styles from "./PriorityBadge.module.css";

const PRIORITY_STYLES = {
  low: styles.priorityLow,
  medium: styles.priorityMedium,
  high: styles.priorityHigh,
};

function PriorityBadge({ priority }) {
  const label = priority[0].toUpperCase() + priority.slice(1);

  return (
    <span className={`${styles.badge} ${PRIORITY_STYLES[priority]}`}>
      {label}
    </span>
  );
}

PriorityBadge.propTypes = {
  priority: PropTypes.oneOf(["low", "medium", "high"]),
};

PriorityBadge.defaultProps = {
  priority: "medium",
};

export default PriorityBadge;
