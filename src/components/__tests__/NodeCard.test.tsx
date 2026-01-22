import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NodeCard } from "../../components/NodeCard";

describe("NodeCard", () => {
  it("renders label", () => {
    render(<NodeCard label="DataSource" />);
    expect(screen.getByText("DataSource")).toBeInTheDocument();
  });
});
