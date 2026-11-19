# Daymark — Task Tracker

A small task tracker built with React, JSX, and Webpack. Tasks are saved in the browser, so no account or backend is needed.

## Dependencies and why

### Runtime dependencies

These are packages the app needs while it runs.

| Dependency | Why it is used |
| --- | --- |
| `react` | Builds the interface from reusable components and manages UI state with hooks. |
| `react-dom` | Mounts the React app into the page's `#root` element. |
| `prop-types` | Provides runtime prop validation for the React 18 migration example. |

### Development dependencies

These tools are used to develop, test, format, lint, or build the app; the static production bundle does not need them at runtime.

| Dependency | Why it is used |
| --- | --- |
| `webpack` | Bundles the app for development and production. |
| `webpack-cli` | Provides the `webpack` command used by the build script. |
| `webpack-dev-server` | Serves the app locally and supports hot reload while developing. |
| `@babel/core` | Runs the JavaScript/JSX transpilation pipeline. |
| `@babel/preset-env` | Transforms modern JavaScript syntax for configured browser targets. |
| `@babel/preset-react` | Transforms JSX into React calls. |
| `babel-loader` | Connects Babel to Webpack's JavaScript module pipeline. |
| `html-webpack-plugin` | Generates the page from `public/index.html` and adds the bundled script. |
| `css-loader` | Resolves CSS imports and turns each `.module.css` file into scoped class-name mappings. |
| `style-loader` | Injects the processed styles into the page. |
| `eslint`, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `globals` | Check source code for common JavaScript, React, and hooks mistakes. |
| `prettier` | Formats source files consistently. |
| `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom` | Run UI tests in a browser-like environment and make DOM assertions. |
| `identity-obj-proxy` | Mocks CSS Module class mappings in Jest tests. |

The app does not use a backend or a storage package: it saves tasks with the browser's built-in `localStorage` API.

## Run locally

```bash
npm install
npm run dev
# npm start is an alias for the same development server
```

Webpack opens the app at `http://localhost:3000`. To create a production build, run `npm run build`; the output is written to `dist/`.

## Quality scripts

| Command | Purpose |
| --- | --- |
| `npm test` | Run Jest tests once. |
| `npm run test:watch` | Re-run tests as files change. |
| `npm run lint` | Check app source with ESLint. |
| `npm run format` | Format files under `src/` with Prettier. |
| `npm run format:check` | Check formatting without changing files. |
| `npm run check` | Run lint, tests, and a production build in sequence. |

This project is still JavaScript, so it has no `typecheck` script. Add one with the TypeScript migration.

Webpack source maps are enabled in development (`eval-source-map`) to help debug original source files. They are disabled for production builds.

## Features

- Add tasks, mark them complete, and delete them
- Filter between all, active, and completed tasks
- Clear completed tasks in one action
- Keep tasks between visits with browser local storage
- Responsive layout with keyboard-accessible controls

## Keyboard accessibility check

Run the app with `npm start`, then use the keyboard without clicking:

1. Press `Tab` repeatedly. Focus should move through the home link, task input, Add task button, filters, and task controls in visual order. A visible focus outline should identify the current control. Use `Shift+Tab` to move backwards; focus should never get trapped.
2. Focus the task input, type a task, and press `Enter`. The task should be added. Try submitting an empty or whitespace-only value; it should not add a task.
3. Use `Tab` to reach All, Active, and Completed. Press `Enter` or `Space` to activate each filter and confirm the visible list changes.
4. On a task, press `Enter` or `Space` on its completion button. It should toggle completion and update the remaining count. The delete control should also become visible when keyboard-focused; activate it with `Enter` or `Space`.
5. Complete a task, then use `Tab` to reach Clear completed and activate it. The completed task should be removed.

For screen-reader coverage, repeat the flow with a screen reader such as Windows Narrator and confirm controls announce meaningful names and pressed states. Keyboard testing is a useful manual check, but does not replace screen-reader or automated accessibility testing.

## Project structure

```text
src/
  components/
    AppHeader/
      AppHeader.jsx
      AppHeader.module.css
    EmptyState/
      EmptyState.jsx
      EmptyState.module.css
    PageFooter/
      PageFooter.jsx
      PageFooter.module.css
    PageIntro/
      PageIntro.jsx
      PageIntro.module.css
    PriorityBadge/
      PriorityBadge.jsx
      PriorityBadge.module.css
    PrivacyNote/
      PrivacyNote.jsx
      PrivacyNote.module.css
    TaskFilters/
      TaskFilters.jsx
      TaskFilters.module.css
    TaskFooter/
      TaskFooter.jsx
      TaskFooter.module.css
    TaskForm/
      TaskForm.jsx
      TaskForm.module.css
    TaskItem/
      TaskItem.jsx
      TaskItem.module.css
    TaskList/
      TaskList.jsx
      TaskList.module.css
    TaskStats/
      TaskStats.jsx
      TaskStats.module.css
    TextField/
      TextField.jsx
      TextField.module.css
  hooks/        Task state and task actions
  utils/        Local-storage helpers
  App.jsx       Page composition and filter selection
  App.module.css Page layout styles
  index.jsx     React entry point
  styles.css    Global base/reset styles
```

## React 18-to-19 migration examples

- `PriorityBadge` uses function-component `propTypes` and `defaultProps`.
- `TaskStats` is a class component with the legacy string ref `ref="box"`.
- `TextField` uses `forwardRef` so `TaskForm` can focus its input when mounted.

These are intentional React 18 examples for practicing the React 19 migration. Review and migrate them before upgrading; do not copy these legacy patterns into new components.

## Migration ideas: why, what, and how to measure

A migration is not automatically an upgrade. Do it when it solves a real maintenance or performance problem, supports a team requirement, or is an explicit learning goal. If this small app is easy to maintain and its build is fast enough, keeping the current stack is a reasonable choice.

| Candidate | Problem it can solve | How to measure success |
| --- | --- | --- |
| **JavaScript/JSX → TypeScript/TSX** | JavaScript does not check task shapes or component props before runtime. Types can flag mistakes such as passing a task without `completed` or calling a component with the wrong props. | Include all app files in the TypeScript check; require `tsc --noEmit` to pass and track type errors caught during real changes. Re-run the task-flow checklist below. TypeScript does not replace runtime validation or tests. |
| **Webpack → Vite** | A custom Webpack/Babel/loader setup can take time to configure and maintain. Vite may simplify that setup and can improve local startup or edit-refresh time, depending on the project and machine. | Before and after, use the same machine and Node version. Record the median of five cold-start times, five edit-to-refresh times, and five production-build times; compare output sizes too. Keep the migration only if the simpler setup or measured results are worthwhile and the build still works. |
| **CSS Modules → a different styling approach (optional)** | There is no current class-name collision problem to solve: this app already uses CSS Modules. A move to something like Tailwind is only useful if utility classes better fit the team's design-system or styling workflow. | Compare duplicated style rules, generated CSS size, and the effort to make a few representative design changes. Keep behavior and accessibility checks unchanged. There is no inherent quality or speed gain from changing styling tools. |

### A repeatable migration check

Before each migration, record the current build result and timing, then run the keyboard accessibility check and verify adding, completing, deleting, filtering, clearing, and reloading tasks. Change one thing at a time; repeat the same checks and measurements afterward. Document regressions as well as improvements so the decision is based on evidence rather than the tool's popularity.
