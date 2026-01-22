export type MissionStatus = "pending" | "running" | "completed" | "failed" | "cancelled" | "timed_out";

export type MissionGuardrails = {
  maxExecutionMs: number;
  maxRetries: number;
  allowedAgents: string[];
};

export type MissionStepStatus = "pending" | "in_progress" | "succeeded" | "failed" | "skipped";

export type MissionStep = {
  id: string;
  name: string;
  agentId: string;
  inputSchemaId?: string;
  outputSchemaId?: string;
  retries: number;
  status: MissionStepStatus;
  startedAt?: number;
  finishedAt?: number;
  lastError?: string;
};

export type MissionDefinition = {
  id: string;
  name: string;
  description?: string;
  guardrails: MissionGuardrails;
  steps: MissionStep[];
};

export type Mission = {
  id: string;
  definition: MissionDefinition;
  status: MissionStatus;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  finishedAt?: number;
  currentStepId?: string;
};

export type MissionMetrics = {
  missionsTotal: number;
  missionsCompleted: number;
  missionsFailed: number;
  averageLatencyMs: number;
};

