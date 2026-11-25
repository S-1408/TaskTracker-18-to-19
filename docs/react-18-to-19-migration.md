# React 18-to-19 migration guide

This guide records the checks and changes used to move this task tracker from React 18 to React 19. It also describes how to scope codemods for a larger application or for a focused design-system rollout.

## Before starting

1. **Confirm scope and support requirements.** Check the app entry points, server-rendering setup (if any), supported browsers, React-dependent libraries, and whether the change is a framework upgrade or a focused component replacement.
2. **Capture a clean baseline.** Record the current branch and worktree state; do not overwrite unrelated work. Install from the lockfile, then run lint, tests, and a production build. Save existing failures separately so they are not mistaken for migration regressions.
3. **Inventory legacy and changed APIs.** Search for `ReactDOM.render`/`hydrate`, `findDOMNode`, string refs, function-component `propTypes`/`defaultProps`, `forwardRef`, deprecated context APIs, and dependencies that declare React peer ranges. Search all app and test directories, not only the main entry file.
4. **Review official upgrade notes and dependencies.** Check the React 19 upgrade guide and each affected library's compatibility notes. Upgrade libraries with incompatible peer dependencies before or alongside React, and check lockfile changes.
5. **Make the migration reversible.** Keep the change reviewable, ideally in a dedicated branch/commit. Prefer small batches so regressions can be attributed to a specific API or dependency.

## Migration steps used here

1. Upgrade `react` and `react-dom` together to matching React 19 versions and refresh the lockfile.
2. Replace removed root rendering APIs with `createRoot` from `react-dom/client`; fail clearly if the expected root element is missing.
3. Replace function-component `defaultProps` with JavaScript parameter defaults. Remove function-component `propTypes`, which React 19 no longer evaluates; for larger typed apps, use TypeScript or an explicit runtime validation library where runtime checks are required.
4. Replace `forwardRef` wrappers with a `ref` prop where the component is now on React 19. Keep `forwardRef` only when maintaining compatibility with React 18 consumers.
5. Search again for removed/deprecated patterns, update tests and documentation, then run the full project checks and manually verify the critical user flows.

## Validation checklist

- `npm run lint`, `npm test`, and `npm run build` all pass.
- The task input receives focus after mount; adding, completing, deleting, filtering, clearing, and reloading tasks work.
- No migration-related React warnings or errors appear in the browser console.
- Install/build is reproducible from the committed lockfile, and installed libraries support React 19.
- Compare against the recorded baseline and explicitly document any unrelated pre-existing failure.

## Codemod strategy

Codemods are useful for deterministic, syntax-based edits; they are not a substitute for dependency review, API design, or behavioral tests. For the official React 19 migration recipe, start with the React 19 upgrade guidance and run the codemod against a clean branch/worktree, for example:

```bash
npx codemod@latest react/19/migration-recipe
```

Review the tool's preview/help before applying it to a repository, check the diff after each transform, run lint/tests/build, and search manually for patterns the transform cannot safely infer. Codemods may not update third-party APIs, custom wrappers, or behavior-specific code.

### Whole-app React upgrade

For an app-wide React runtime upgrade, run the migration recipe across the application source, tests, and relevant tooling/configuration. Upgrade `react` and `react-dom` together, include all entry points and test renderers, then verify every major route/feature and supported rendering mode. Avoid transforming generated output, dependencies, or archived examples. A single broad codemod pass is appropriate only after the baseline and dependency compatibility are known; split the edits into reviewable batches if the diff is large.

### Adopting one design-system component across the app

Replacing a local component with a design-system component is a different, narrower migration. Do not run the whole React 19 recipe just for this. First define the target component's API and map the existing component's props, events, slots/children, styling, accessibility, and ref behavior. Then use a focused codemod (or a scripted, syntax-aware transform) on the identified import and JSX call sites.

For a reusable codemod, make it idempotent, limit it to known source directories and file types, preserve unrelated props, report unsupported usages instead of guessing, and provide a dry-run/diff. Apply it in batches, inspect representative call sites, and test shared variants plus the application's key flows. Any non-mechanical API differences should be handled deliberately rather than silently removed or translated incorrectly. This approach automates repetitive edits without manually editing every call site while avoiding an uncontrolled app-wide rewrite.
