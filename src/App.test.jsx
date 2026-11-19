import { fireEvent, render, screen } from "@testing-library/react";
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
  fireEvent.submit(input.closest("form"));
}
 
test("focuses the task input when the form mounts", () => {
  render(<App />);

  expect(screen.getByRole("textbox", { name: "Add a task" })).toHaveFocus();
});

test("adds, completes, filters, and clears a task", () => {
  render(<App />);

  addTask("Write release notes");
  expect(screen.getByText("Write release notes")).toBeInTheDocument();
  expect(screen.getByText("Medium")).toBeInTheDocument();

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

  expect(JSON.parse(window.localStorage.getItem("daymark-tasks"))).toEqual([]);
});

test("does not add an empty task and can delete a saved task", () => {
  render(<App />);

  addTask("   ");
  expect(screen.getByText("A clear page is a good start")).toBeInTheDocument();

  addTask("Review checklist");
  fireEvent.click(screen.getByRole("button", { name: "Delete Review checklist" }));
  expect(screen.queryByText("Review checklist")).not.toBeInTheDocument();
});
