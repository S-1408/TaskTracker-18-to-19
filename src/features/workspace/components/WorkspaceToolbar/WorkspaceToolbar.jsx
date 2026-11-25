import { useId, useRef, useState } from "react";
import { parseWorkspaceBackup } from "../../taskStorage";
import styles from "./WorkspaceToolbar.module.css";

function WorkspaceToolbar({
  projects,
  selectedProjectId,
  onSelectProject,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onCreateProject,
  onExportBackup,
  onImportWorkspace,
}) {
  const fieldId = useId();
  const fileInputRef = useRef(null);
  const [projectName, setProjectName] = useState("");
  const [projectError, setProjectError] = useState("");
  const [backupMessage, setBackupMessage] = useState("");

  function handleCreateProject(event) {
    event.preventDefault();
    const result = onCreateProject(projectName);

    if (result.error) {
      setProjectError(result.error);
      return;
    }

    setProjectName("");
    setProjectError("");
    onSelectProject(result.projectId);
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setBackupMessage("Choose a backup file smaller than 5 MB.");
      return;
    }

    try {
      const backup = parseWorkspaceBackup(await file.text());
      const shouldReplace = window.confirm(
        "Importing this backup replaces all tasks and projects on this device. Continue?",
      );

      if (!shouldReplace) {
        setBackupMessage("Import cancelled.");
        return;
      }

      const imported = onImportWorkspace(backup);
      setBackupMessage(
        imported
          ? "Backup restored."
          : "This backup could not be restored.",
      );
    } catch (error) {
      setBackupMessage(error.message);
    }
  }

  return (
    <section className={styles.toolbar} aria-label="Project and task tools">
      <div className={styles.projectRow}>
        <label htmlFor={`${fieldId}-project`}>Project</label>
        <select
          id={`${fieldId}-project`}
          value={selectedProjectId}
          onChange={(event) => onSelectProject(event.target.value)}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <details className={styles.projectDetails}>
          <summary>New project</summary>
          <form onSubmit={handleCreateProject}>
            <label htmlFor={`${fieldId}-new-project`}>Project name</label>
            <input
              id={`${fieldId}-new-project`}
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              maxLength={50}
              required
            />
            <button type="submit">Create</button>
            {projectError && <span role="alert">{projectError}</span>}
          </form>
        </details>
      </div>

      <div className={styles.searchRow}>
        <label className={styles.srOnly} htmlFor={`${fieldId}-search`}>
          Search tasks
        </label>
        <input
          id={`${fieldId}-search`}
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks"
        />
        <label htmlFor={`${fieldId}-sort`}>Sort</label>
        <select
          id={`${fieldId}-sort`}
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className={styles.backupRow}>
        <button type="button" onClick={onExportBackup}>
          Export backup
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Import backup
        </button>
        <input
          ref={fileInputRef}
          className={styles.srOnly}
          type="file"
          accept="application/json,.json"
          aria-label="Choose a task backup file"
          onChange={handleImport}
        />
        <span
          className={styles.backupMessage}
          role={backupMessage.startsWith("Backup restored") ? "status" : "alert"}
        >
          {backupMessage}
        </span>
      </div>
    </section>
  );
}

export default WorkspaceToolbar;
