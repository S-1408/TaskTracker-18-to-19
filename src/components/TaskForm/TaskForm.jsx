import { useActionState, useEffect, useId, useRef, useState } from "react";
import styles from "./TaskForm.module.css";
import TextField from "../TextField/TextField";

function TaskForm({ onAddTask, selectedProjectId }) {
  const [newTask, setNewTask] = useState("");
  const inputRef = useRef(null);
  const fieldId = useId();
  const [formState, formAction, isPending] = useActionState(
    (_previousState, formData) => {
      const title = String(formData.get("title") || "").trim();

      if (!title) {
        return { error: "Enter a task title to add it." };
      }

      onAddTask(title, {
        priority: String(formData.get("priority") || "medium"),
        dueDate: String(formData.get("dueDate") || ""),
        projectId: selectedProjectId,
      });
      setNewTask("");
      return { error: "" };
    },
    { error: "" },
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form className={styles.taskForm} action={formAction}>
      <label className={styles.srOnly} htmlFor={`${fieldId}-title`}>
        Add a task
      </label>
      <div className={styles.primaryRow}>
        <span className={styles.formPlus} aria-hidden="true">
          +
        </span>
        <TextField
          ref={inputRef}
          id={`${fieldId}-title`}
          name="title"
          type="text"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="What needs to get done?"
          autoComplete="off"
          maxLength={160}
          aria-describedby={formState.error ? `${fieldId}-error` : undefined}
        />
        <button type="submit" className={styles.addButton} disabled={isPending}>
          {isPending ? "Adding..." : "Add task"}
        </button>
      </div>
      <div className={styles.detailsRow}>
        <label htmlFor={`${fieldId}-priority`}>Priority</label>
        <select id={`${fieldId}-priority`} name="priority" defaultValue="medium">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label htmlFor={`${fieldId}-due-date`}>Due date</label>
        <input id={`${fieldId}-due-date`} name="dueDate" type="date" />
      </div>
      {formState.error && (
        <p className={styles.formError} id={`${fieldId}-error`} role="alert">
          {formState.error}
        </p>
      )}
    </form>
  );
}

export default TaskForm;
