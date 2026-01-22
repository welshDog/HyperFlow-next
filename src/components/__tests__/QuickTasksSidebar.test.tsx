import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuickTasksSidebar } from "../QuickTasksSidebar";

const tasks = [
  { id: "t1", title: "Task One", href: "/docs/quickstart" },
  { id: "t2", title: "Task Two", href: "/docs/testing" },
];

describe("QuickTasksSidebar", () => {
  it("renders tasks and toggles collapse", async () => {
    const user = userEvent.setup();
    render(<QuickTasksSidebar tasks={tasks} storageKey="test:qt" />);

    expect(screen.getByRole("heading", { name: /Quick Tasks/i })).toBeInTheDocument();
    expect(screen.getByText(/0\/2/)).toBeInTheDocument();

    const hideBtn = screen.getByRole("button", { name: /Hide/i });
    await user.click(hideBtn);
    expect(screen.getByRole("button", { name: /Show/i })).toBeInTheDocument();
  });

  it("tracks completion state", async () => {
    const user = userEvent.setup();
    render(<QuickTasksSidebar tasks={tasks} storageKey="test:qt2" />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(2);
    await user.click(checkboxes[0]);
    expect(screen.getByText(/1\/2/)).toBeInTheDocument();
  });
});

