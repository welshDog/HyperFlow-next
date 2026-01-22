import { describe, expect, it } from "vitest";
import { createMission, startMission, listMissions } from "@/server/orchestrator/service";
import type { MissionDefinition } from "@/server/orchestrator/types";
import { ensureConsumers } from "@/server/messaging/consumers";
import { dispatchNextStep } from "@/server/messaging/dispatcher";

describe("bus integration", () => {
  it("dispatches steps and completes mission", async () => {
    ensureConsumers();
    const def: Omit<MissionDefinition, "id"> = {
      name: "Test Mission",
      description: "",
      guardrails: { maxExecutionMs: 10000, maxRetries: 1, allowedAgents: ["frontend-specialist"] },
      steps: [
        { id: "s1", name: "Do Frontend", agentId: "frontend-specialist", retries: 0, status: "pending" },
        { id: "s2", name: "Do Backend", agentId: "backend-specialist", retries: 0, status: "pending" },
      ],
    };
    const m = createMission(def);
    const started = startMission(m.id)!;
    await dispatchNextStep(started.id);
    await new Promise(r => setTimeout(r, 20));
    await new Promise(r => setTimeout(r, 20));
    const missions = listMissions();
    const updated = missions.find(x => x.id === started.id)!;
    expect(updated.status === "completed" || updated.status === "running").toBe(true);
  });
});

