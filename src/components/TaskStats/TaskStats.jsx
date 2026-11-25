import { Component } from "react";
import PropTypes from "prop-types";
import styles from "./TaskStats.module.css";

class TaskStats extends Component {
  render() {
    const { remainingCount, completedCount } = this.props;

    return (
      <div className={styles.stats}>
        <span>
          <strong>{remainingCount}</strong>{" "}
          {remainingCount === 1 ? "task" : "tasks"} left
        </span>
        <span>
          <strong>{completedCount}</strong>{" "}
          {completedCount === 1 ? "task" : "tasks"} completed
        </span>
      </div>
    );
  }
}

TaskStats.propTypes = {
  remainingCount: PropTypes.number.isRequired,
  completedCount: PropTypes.number.isRequired,
};

export default TaskStats;
