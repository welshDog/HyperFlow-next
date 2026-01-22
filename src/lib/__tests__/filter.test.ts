import { describe, it, expect } from "vitest";
import { filterEvaluationsForViewer } from "../filter";

describe("filterEvaluationsForViewer", () => {
  it("redacts metadata for viewer", () => {
    const items = [
      { id: "1", missionId: "m", evaluatorType: "performance", score: 0.9, metadata: { details: "secret" }, createdAt: Date.now() },
    ];
    const filtered = filterEvaluationsForViewer(items);
    expect(filtered[0].metadata).toEqual({});
    expect(filtered[0].score).toBe(0.9);
  });
});

