import { findAgentByHandle, ensureDefaultAgents } from "./registry";

export type AgentExecutionParams = {
  missionId: string;
  stepId: string;
  agentId: string;
  payload?: Record<string, unknown>;
};

export async function executeAgent(params: AgentExecutionParams): Promise<{ ok: boolean; output?: Record<string, unknown>; error?: string }> {
  ensureDefaultAgents();
  const agent = findAgentByHandle(params.agentId);
  if (!agent) return { ok: false, error: "agent_not_found" };
  const cap = agent.capabilities[0];
  if (!cap) return { ok: false, error: "capability_missing" };
  const output = { result: "ok", capabilityId: cap.id, missionId: params.missionId, stepId: params.stepId };
  return { ok: true, output };
}
