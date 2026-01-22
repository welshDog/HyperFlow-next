import { describe, it, expect } from "vitest";
import { listVersions, createVersion, restoreVersion } from "../service";

describe("flowVersion service validation", () => {
  it("listVersions invalid id", async () => {
    const res = await listVersions("bad-id");
    expect(res.ok).toBe(false);
  });

  it("createVersion invalid id", async () => {
    const res = await createVersion("bad-id");
    expect(res.ok).toBe(false);
  });

  it("restoreVersion invalid id", async () => {
    const res = await restoreVersion("bad-id");
    expect(res.ok).toBe(false);
  });
});

