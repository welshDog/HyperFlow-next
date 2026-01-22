import { describe, it, expect } from "vitest";
import type { ZodIssue } from "zod";
import { fromZodIssues } from "../errors";

describe("errors", () => {
  it("wraps zod issues", () => {
    const issues: ZodIssue[] = [
      { code: "invalid_type", expected: "string", received: "number", path: ["name"], message: "Invalid" } as unknown as ZodIssue,
    ];
    const env = fromZodIssues(issues);
    expect(env.code).toBe("validation_error");
    expect(env.fieldErrors?.name?.length).toBeGreaterThan(0);
  });
});

