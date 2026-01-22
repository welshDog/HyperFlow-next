import { describe, expect, it } from "vitest";
import { create, listByMission } from "@/server/evaluations/repository";

describe("evaluations repo", () => {
  it("creates and lists with filters and pagination", async () => {
    const missionId = "m1";
    await create(missionId, "success", 1, {});
    await create(missionId, "performance", 0.8, {});
    await create(missionId, "compliance", 1, {});
    const { items, total } = await listByMission(missionId, 1, 2, { sortBy: "createdAt", sortOrder: "desc" });
    expect(total).toBe(3);
    expect(items.length).toBe(2);
    const filtered = await listByMission(missionId, 1, 10, { evaluatorType: "performance", sortBy: "createdAt", sortOrder: "desc" });
    expect(filtered.items.length).toBe(1);
  });
});

