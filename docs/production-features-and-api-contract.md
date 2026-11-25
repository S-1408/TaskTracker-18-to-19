# Production features and API contract

## What is implemented

This release adds offline-first task management. All task/project data remains in this browser's local storage; the API below is a proposed contract only and is not connected to the application.

| Feature | Behavior |
| --- | --- |
| Theme | Switch between light and dark appearance; selection persists locally, and first visit follows the device color preference. |
| Login/sign-up screens | Accessible UI previews with form validation. No credentials are sent, stored, or treated as an authenticated session; connect an identity provider to enable accounts. |
| React 19 form Action | `useActionState` handles task submission and returns a user-visible validation error for an empty title. |
| Task details | Tasks can be added with low/medium/high priority and an optional due date; overdue active tasks are identified. |
| Edit | Update a task's title, priority, or due date. |
| Projects | Create named project lists and switch the task view between them. The Inbox project is always present. |
| Search and sort | Search task titles in the selected project and sort by newest, due date, priority, or title. |
| Undo | Restore the last deleted task or cleared completed-task set. Undo is discarded after a newer task change so it cannot overwrite that change. |
| Backup | Export the whole workspace as versioned JSON; import validates JSON/version and caps files at 5 MB. Import asks for confirmation before replacing current local data. |
| Storage safety | Old task-array data is migrated to the workspace shape; invalid entries are discarded and storage errors are logged. |

### Deliberate limits

There are no working accounts/authentication, server, cross-device synchronization, collaboration, recurring tasks, notifications, or project deletion. Login and sign-up forms are UI-only and explicitly tell users that no credentials are sent or saved. Browser storage is device/browser-specific and may be cleared by the user or browser. Export a backup before changing devices. Confirmed import replaces rather than merges local data.

## Proposed REST API (not implemented)

For accounts and cross-device sync, deploy a backend and use authenticated, user-scoped HTTPS endpoints. The API owns authorization, validation, durable storage, concurrency, and timestamps; a React Action is only a UI submission mechanism and is not itself an API.

### Resource shapes

```json
{
  "project": {
    "id": "prj_123",
    "name": "Work",
    "createdAt": "2026-11-25T10:00:00.000Z",
    "updatedAt": "2026-11-25T10:00:00.000Z",
    "version": 1
  },
  "task": {
    "id": "tsk_123",
    "projectId": "prj_123",
    "title": "Prepare launch",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-12-01",
    "createdAt": "2026-11-25T10:00:00.000Z",
    "updatedAt": "2026-11-25T10:00:00.000Z",
    "version": 1
  }
}
```

### Endpoints

| Method and path | Request | Success response |
| --- | --- | --- |
| `GET /api/v1/workspace` | Optional `?updatedSince=<ISO timestamp>` for incremental sync | `200` with `{ projects, tasks, serverTime }` |
| `POST /api/v1/projects` | `{ "name": "Work" }` | `201` with `{ project }` |
| `PATCH /api/v1/projects/{projectId}` | `{ "name": "Personal", "version": 1 }` | `200` with `{ project }` |
| `DELETE /api/v1/projects/{projectId}` | `?moveTasksTo=<projectId>` or require an empty project | `204`; Inbox cannot be deleted |
| `POST /api/v1/projects/{projectId}/tasks` | `{ "title": "...", "priority": "medium", "dueDate": null }` | `201` with `{ task }` |
| `PATCH /api/v1/tasks/{taskId}` | Any editable fields plus required `version` | `200` with `{ task }` |
| `DELETE /api/v1/tasks/{taskId}` | Required `If-Match` version/ETag | `204` |
| `PUT /api/v1/workspace` | `{ "projects": [...], "tasks": [...] }`; explicit full replacement for restoring a backup | `200` with normalized `{ projects, tasks, serverTime }` |

### Contract requirements

- Authenticate with an OIDC/OAuth session; scope every query and mutation to the authenticated user. Never accept a client-supplied user ID as authorization.
- Validate title (trimmed, 1-160 characters), project name (trimmed, 1-50 characters), priority enum, ISO calendar date, project ownership, payload size, and JSON shape on the server.
- Return consistent errors: `400` invalid input, `401` unauthenticated, `403` not authorized, `404` missing resource, `409` duplicate/conflicting change, `413` payload too large, and `429` rate limit. Error body: `{ "error": { "code": "VALIDATION_ERROR", "message": "Readable summary", "fields": { "title": "Required" } } }`.
- Use `ETag`/`If-Match` or a numeric `version` to prevent lost updates. Return `409` on a stale version, with enough current metadata for the client to offer reload/retry.
- Use pagination for larger workspaces, idempotency keys for retryable create/import operations, TLS, request-size limits, rate limits, audit logging, and automated backups.
- Define deletion semantics and data retention before launch. A full workspace restore is destructive; require user confirmation and ideally support server-side snapshots.

Before implementing this contract, choose the backend, database, identity provider, hosting environment, and conflict-resolution UX. Do not add a client sync layer until these are agreed.

## Redux Toolkit adoption plan

### Is Redux useful for this app?

Redux Toolkit (RTK) could help if this app grows beyond a compact, single-page task tracker. Its main value here would be one explicit workspace state shared across task lists, project navigation, search/filter controls, backup flows, and future API synchronization. Reducers make updates predictable, selectors provide reusable derived views, and Redux DevTools helps inspect how state changes when debugging.

It would also make future server integration easier to structure: RTK Query can manage API caching and request lifecycle, while versioned state transitions can help coordinate local edits and sync. However, RTK does **not** provide persistence, authentication, a backend, or conflict resolution automatically.

Today, `useTasks` already centralizes most task operations and the rest of the app is small. Adding Redux now would introduce a store, provider, slices, selectors, and persistence wiring without clearly solving a current scaling problem. Treat this as a planned architectural option, not a required production fix. Reassess when multiple routes/features need the same workspace state, prop drilling becomes difficult, or API synchronization arrives.

### Incremental implementation plan

1. **Agree on the trigger and state boundary.** Keep component-only state (editing drafts, open menus, search text if it remains page-local) in React. Put shared domain state—projects, tasks, persistence status, and later sync status—in Redux. Do not move every input state into the store by default.
2. **Add the official packages.** Install `@reduxjs/toolkit` and `react-redux`; keep React 19 compatibility and update the lockfile. Create `src/app/store.js`, wrap the app with `<Provider>`, and verify existing behavior before migrating features.
3. **Create a workspace slice.** Define normalized project/task state and reducers for `taskAdded`, `taskUpdated`, `taskToggled`, `taskDeleted`, `completedTasksCleared`, `projectCreated`, `workspaceImported`, and `undoApplied`. Preserve current validation rules and the single-level undo behavior. Use generated IDs/timestamps in action creators or a `prepare` callback, not inside reducers, so reducers remain deterministic.
4. **Migrate consumers in small batches.** Replace `useTasks` reads and callbacks with `useSelector` and typed-by-convention `useDispatch` usage. Start with task form/actions, then project selection and toolbar, then filters/stats. Use memoized selectors for tasks filtered by project/status/search and sorted order; avoid duplicating derived arrays in store state.
5. **Keep persistence explicit.** Add a small persistence listener/middleware that serializes only the workspace slice to the existing `daymark-tasks` key, catches quota/access failures, and hydrates through the existing validation/migration functions. Do not persist transient UI state or Redux internals. Ensure old array-shaped local data still migrates to the workspace shape.
6. **Test and remove duplicate state paths.** Add reducer tests for each transition and undo edge case, selector tests for filters/sorting, and integration tests for persistence migration, task flows, import/export, and reload behavior. Once migrated, remove the old `useTasks` domain-state implementation to avoid maintaining two sources of truth.
7. **Add server data tooling only when there is a backend.** If the proposed API is implemented, evaluate RTK Query for fetching, caching, invalidation, and request status. Decide how optimistic local edits reconcile with server versions/`409` conflicts before adding optimistic updates. RTK Query is not needed for the current browser-only app.
8. **Validate and measure.** Run lint, unit/integration tests, production build, and the task keyboard/accessibility checklist. Compare complexity and user-visible behavior with the pre-Redux baseline; do not keep the migration merely because it uses Redux.

### Completion criteria

- One source of truth exists for shared task/project state, and no UI behavior is duplicated between Redux and `useTasks`.
- Existing local data and backup formats remain readable; storage failures remain visible to the user.
- Reducers are deterministic and immutable updates are handled through RTK's Immer integration.
- Selectors cover derived task lists without storing redundant filtered/sorted results.
- Tests cover state transitions, undo correctness, persistence compatibility, and key user flows.
- The production build and accessibility checks pass, and the team agrees Redux complexity is justified by the app's growth.
