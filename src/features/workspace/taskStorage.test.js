import {
  createEmptyWorkspace,
  parseWorkspaceBackup,
} from "./taskStorage";

test("parses a versioned workspace backup", () => {
  const workspace = {
    ...createEmptyWorkspace(),
    tasks: [
      {
        id: "task-1",
        title: "Test backup",
        completed: false,
        priority: "high",
        dueDate: "2027-06-10",
        projectId: "inbox",
        createdAt: "2026-11-25T10:00:00.000Z",
      },
    ],
  };

  expect(parseWorkspaceBackup(JSON.stringify(workspace))).toEqual(workspace);
});

test("rejects unsupported or partially invalid backups", () => {
  expect(() => parseWorkspaceBackup("{")).toThrow("not valid JSON");
  expect(() =>
    parseWorkspaceBackup(JSON.stringify({ version: 2, projects: [], tasks: [] })),
  ).toThrow("supported workspace");
  expect(() =>
    parseWorkspaceBackup(
      JSON.stringify({
        ...createEmptyWorkspace(),
        tasks: [{ id: "bad", title: "", completed: false }],
      }),
    ),
  ).toThrow("invalid or duplicate");
});
