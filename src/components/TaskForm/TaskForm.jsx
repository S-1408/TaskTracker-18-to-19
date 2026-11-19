import { useEffect, useRef, useState } from "react";
import styles from "./TaskForm.module.css";
import TextField from "../TextField/TextField";

function TaskForm({ onAddTask }) {
  const [newTask, setNewTask] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (!newTask.trim()) {
      return;
    }

    onAddTask(newTask);
    setNewTask("");
  }

  return (
    <form className={styles.taskForm} onSubmit={handleSubmit}>
      <label className={styles.srOnly} htmlFor="new-task">
        Add a task
      </label>
      <span className={styles.formPlus} aria-hidden="true">
        +
      </span>
      <TextField
        ref={inputRef}
        id="new-task"
        type="text"
        value={newTask}
        onChange={(event) => setNewTask(event.target.value)}
        placeholder="What needs to get done?"
        autoComplete="off"
      />
      <button type="submit" className={styles.addButton}>
        Add task
      </button>
    </form>
  );
}

export default TaskForm;
