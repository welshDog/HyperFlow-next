import { describe, it, expect } from "vitest";
import { createFlow } from "../service";

describe("flow service", () => {
  it("returns validation_error for empty name", async () => {
    const res = await createFlow({ name: "" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe("validation_error");
    }
  });
});

