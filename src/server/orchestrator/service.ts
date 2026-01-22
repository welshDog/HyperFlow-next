import { randomUUID } from "node:crypto";
import { Mission, MissionDefinition, MissionMetrics, MissionStep, MissionStatus } from "./types";
import { emitEvaluationRequests } from "@/server/evaluations/dispatcher";

type MissionStore = {
  missions: Map<string, Mission>;
  metrics: {
    completedLatencies: number[];
  };
};

const store: MissionStore = {
  missions: new Map(),
  metrics: {
    completedLatencies: [],
  },
};

function nowMs() {
  return Date.now();
}

export function createMission(definition: Omit<MissionDefinition, "id">): Mission {
  const id = randomUUID();
  const defWithId: MissionDefinition = {
    ...definition,
    id,
  };
  const createdAt = nowMs();
  const mission: Mission = {
    id,
    definition: defWithId,
    status: "pending",
    createdAt,
    updatedAt: createdAt,
  };
  store.missions.set(id, mission);
  return mission;
}

export function listMissions(): Mission[] {
  return Array.from(store.missions.values());
}

export function getMission(id: string): Mission | undefined {
  return store.missions.get(id);
}

export function startMission(id: string): Mission | undefined {
  const mission = store.missions.get(id);
  if (!mission) return undefined;
  if (mission.status !== "pending") return mission;
  const updated: Mission = {
    ...mission,
    status: "running",
    startedAt: mission.startedAt ?? nowMs(),
    updatedAt: nowMs(),
  };
  store.missions.set(id, updated);
  return updated;
}

export function updateMissionStatus(id: string, status: MissionStatus, error?: string): Mission | undefined {
  const mission = store.missions.get(id);
  if (!mission) return undefined;
  const finished = status === "completed" || status === "failed" || status === "timed_out" || status === "cancelled";
  const finishedAt = finished ? nowMs() : mission.finishedAt;
  const updated: Mission = {
    ...mission,
    status,
    updatedAt: nowMs(),
    finishedAt,
  };
  if (finished && mission.startedAt && finishedAt) {
    store.metrics.completedLatencies.push(finishedAt - mission.startedAt);
  }
  store.missions.set(id, updated);
  if (error) {
    const step = updated.definition.steps.find(s => s.id === updated.currentStepId);
    if (step) {
      step.lastError = error;
    }
  }
  if (status === "completed") {
    emitEvaluationRequests(id).catch(() => {});
  }
  return updated;
}

export function nextRunnableStep(id: string): MissionStep | undefined {
  const mission = store.missions.get(id);
  if (!mission) return undefined;
  const now = nowMs();
  const deadline = mission.definition.guardrails.maxExecutionMs;
  if (mission.startedAt && now - mission.startedAt > deadline && mission.status === "running") {
    updateMissionStatus(id, "timed_out");
    return undefined;
  }
  const step = mission.definition.steps.find(s => s.status === "pending" || (s.status === "failed" && s.retries < mission.definition.guardrails.maxRetries));
  if (!step) return undefined;
  mission.currentStepId = step.id;
  step.status = "in_progress";
  step.startedAt = step.startedAt ?? nowMs();
  mission.updatedAt = nowMs();
  store.missions.set(id, mission);
  return step;
}

export function completeStep(missionId: string, stepId: string, ok: boolean, error?: string): Mission | undefined {
  const mission = store.missions.get(missionId);
  if (!mission) return undefined;
  const step = mission.definition.steps.find(s => s.id === stepId);
  if (!step) return mission;
  step.status = ok ? "succeeded" : "failed";
  step.finishedAt = nowMs();
  if (!ok) {
    step.retries += 1;
    step.lastError = error;
  }
  const allDone = mission.definition.steps.every(s => s.status === "succeeded" || s.status === "skipped");
  const anyFailedHard = mission.definition.steps.some(s => s.status === "failed" && s.retries >= mission.definition.guardrails.maxRetries);
  if (allDone) {
    updateMissionStatus(missionId, "completed");
  } else if (anyFailedHard) {
    updateMissionStatus(missionId, "failed", error);
  } else {
    mission.updatedAt = nowMs();
    store.missions.set(missionId, mission);
  }
  return store.missions.get(missionId);
}

export function missionMetrics(): MissionMetrics {
  const missions = Array.from(store.missions.values());
  const completed = missions.filter(m => m.status === "completed");
  const failed = missions.filter(m => m.status === "failed" || m.status === "timed_out" || m.status === "cancelled");
  const latencies = store.metrics.completedLatencies;
  const avg = latencies.length === 0 ? 0 : latencies.reduce((a, b) => a + b, 0) / latencies.length;
  return {
    missionsTotal: missions.length,
    missionsCompleted: completed.length,
    missionsFailed: failed.length,
    averageLatencyMs: Math.round(avg),
  };
}
