import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
  jest.spyOn(window.crypto, "randomUUID").mockReturnValue("test-task-id");
});

afterEach(() => {
  jest.restoreAllMocks();
});

function addTask(title) {
  const input = screen.getByRole("textbox", { name: "Add a task" });
  fireEvent.change(input, { target: { value: title } });
  fireEvent.click(screen.getByRole("button", { name: "Add task" }));
}

test("focuses the task input when the form mounts", () => {
  render(<App />);

  expect(screen.getByRole("textbox", { name: "Add a task" })).toHaveFocus();
});

test("switches themes and remembers the selection", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(window.localStorage.getItem("daymark-theme")).toBe("dark");

  fireEvent.click(
    screen.getByRole("button", { name: "Switch to light theme" }),
  );
  expect(document.documentElement).toHaveAttribute("data-theme", "light");
  expect(window.localStorage.getItem("daymark-theme")).toBe("light");
});

test("loads a previously saved theme", () => {
  window.localStorage.setItem("daymark-theme", "dark");

  render(<App />);

  expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  expect(
    screen.getByRole("button", { name: "Switch to light theme" }),
  ).toBeInTheDocument();
});

test("shows login and sign-up pages without pretending to authenticate", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
  expect(
    screen.getByRole("heading", { name: "Create your account" }),
  ).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Taylor" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "taylor@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "secret-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));

  expect(screen.getByRole("status")).toHaveTextContent(
    "Authentication is not connected",
  );
  expect(screen.getByLabelText("Password")).toHaveValue("");
  expect(window.localStorage.getItem("daymark-auth")).toBeNull();

  fireEvent.click(
    within(screen.getByRole("navigation", { name: "Account" })).getByRole(
      "button",
      { name: "Sign in" },
    ),
  );
  expect(
    screen.getByRole("heading", { name: "Welcome back" }),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Continue without an account" }),
  );
  expect(
    screen.getByRole("heading", { name: "Make today count." }),
  ).toBeInTheDocument();
});

test("adds, completes, filters, and clears a task", () => {
  render(<App />);

  addTask("Write release notes");
  expect(screen.getByText("Write release notes")).toBeInTheDocument();
  expect(
    screen.getByText("Medium", { selector: "span.badge" }),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Complete Write release notes" }),
  );
  expect(
    screen.getByRole("button", { name: "Mark Write release notes as active" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("0", { selector: "strong" })).toBeInTheDocument();
  expect(screen.getByText("1", { selector: "strong" })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Active" }));
  expect(screen.queryByText("Write release notes")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Completed" }));
  expect(screen.getByText("Write release notes")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Clear completed" }));
  expect(screen.queryByText("Write release notes")).not.toBeInTheDocument();

  expect(
    JSON.parse(window.localStorage.getItem("daymark-tasks")).tasks,
  ).toEqual([]);
});

test("does not add an empty task and can delete a saved task", () => {
  render(<App />);

  addTask("   ");
  expect(screen.getByText("A clear page is a good start")).toBeInTheDocument();

  addTask("Review checklist");
  fireEvent.click(
    screen.getByRole("button", { name: "Delete Review checklist" }),
  );
  expect(screen.queryByText("Review checklist")).not.toBeInTheDocument();
});

test("ignores malformed saved tasks without breaking the task list", () => {
  const consoleError = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});
  window.localStorage.setItem(
    "daymark-tasks",
    JSON.stringify([
      { id: "valid-task", title: "Keep this task", completed: false },
      { id: "invalid-task", title: 42, completed: false },
    ]),
  );

  render(<App />);

  expect(screen.getByText("Keep this task")).toBeInTheDocument();
  expect(screen.queryByText("42")).not.toBeInTheDocument();
  expect(consoleError).toHaveBeenCalledWith(
    "Ignoring invalid saved task entries.",
  );
});

test("creates a project task, edits it, searches it, and can undo deletion", () => {
  render(<App />);

  fireEvent.click(screen.getByText("New project"));
  fireEvent.change(screen.getByLabelText("Project name"), {
    target: { value: "Work" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create" }));
  fireEvent.change(screen.getByLabelText("Project"), {
    target: { value: "test-task-id" },
  });
  fireEvent.change(screen.getByLabelText("Priority"), {
    target: { value: "high" },
  });
  fireEvent.change(screen.getByLabelText("Due date"), {
    target: { value: "2027-06-10" },
  });

  addTask("Prepare launch");
  expect(
    screen.getByText("High", { selector: "span.badge" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("time")).toHaveAttribute("datetime", "2027-06-10");

  fireEvent.change(screen.getByRole("searchbox", { name: "Search tasks" }), {
    target: { value: "launch" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Edit Prepare launch" }));
  fireEvent.change(screen.getByLabelText("Edit task title"), {
    target: { value: "Prepare product launch" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  fireEvent.change(screen.getByRole("searchbox", { name: "Search tasks" }), {
    target: { value: "" },
  });

  expect(screen.getByText("Prepare product launch")).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Delete Prepare product launch" }),
  );
  expect(screen.queryByText("Prepare product launch")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Undo" }));
  expect(screen.getByText("Prepare product launch")).toBeInTheDocument();
});

test("does not allow undo to overwrite newer task changes", () => {
  render(<App />);

  addTask("First task");
  fireEvent.click(screen.getByRole("button", { name: "Delete First task" }));
  addTask("Second task");

  expect(
    screen.queryByRole("button", { name: "Undo" }),
  ).not.toBeInTheDocument();
  expect(screen.getByText("Second task")).toBeInTheDocument();
});
