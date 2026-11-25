import { useState } from "react";
import styles from "./TaskItem.module.css";
import PriorityBadge from "../PriorityBadge/PriorityBadge";

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    priority: task.priority,
    dueDate: task.dueDate,
  });
  const dueDate = task.dueDate
    ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const isOverdue = task.dueDate && task.dueDate < localToday && !task.completed;

  function saveEdit(event) {
    event.preventDefault();

    if (!draft.title.trim()) {
      return;
    }

    onUpdate(task.id, draft);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className={styles.taskRow}>
        <form className={styles.editForm} onSubmit={saveEdit}>
          <label className={styles.srOnly} htmlFor={`edit-title-${task.id}`}>
            Edit task title
          </label>
          <input
            id={`edit-title-${task.id}`}
            value={draft.title}
            maxLength={160}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
          />
          <label className={styles.srOnly} htmlFor={`edit-priority-${task.id}`}>
            Edit priority
          </label>
          <select
            id={`edit-priority-${task.id}`}
            value={draft.priority}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                priority: event.target.value,
              }))
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <label className={styles.srOnly} htmlFor={`edit-date-${task.id}`}>
            Edit due date
          </label>
          <input
            id={`edit-date-${task.id}`}
            type="date"
            value={draft.dueDate}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                dueDate: event.target.value,
              }))
            }
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      </li>
    );
  }

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
      {dueDate && (
        <time
          className={`${styles.dueDate}${isOverdue ? ` ${styles.overdue}` : ""}`}
          dateTime={task.dueDate}
        >
          {isOverdue ? `Overdue: ${dueDate}` : dueDate}
        </time>
      )}
      <PriorityBadge priority={task.priority} />
      <button
        type="button"
        className={styles.editButton}
        aria-label={`Edit ${task.title}`}
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
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
