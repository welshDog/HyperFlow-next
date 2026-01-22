import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { NodeCard } from "@/components/NodeCard";

expect.extend(toHaveNoViolations);

describe("Accessibility", () => {
  it("NodeCard has no axe violations", async () => {
    const { container } = render(<NodeCard label="Label" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

