import { getSharedBus } from "./bus";
import { verifyEnvelope } from "./envelope";
import type { MessageEnvelope } from "./envelope";
import { hyper } from "@/lib/env";
import { dispatchNextStep } from "./dispatcher";
import { completeStep, getMission } from "@/server/orchestrator/service";
import { executeAgent } from "@/server/agents/runtime";

type StepDispatchPayload = {
  missionId: string;
  stepId: string;
  agentId: string;
  params?: Record<string, unknown>;
};

let initialized = false;

export function ensureConsumers() {
  if (initialized) return;
  const bus = getSharedBus();
  bus.subscribe<StepDispatchPayload>("mission.step-dispatch", async (msg: MessageEnvelope<StepDispatchPayload>) => {
    const ok = verifyEnvelope(msg, hyper.HYPER_MESSAGE_SECRET);
    if (!ok) return;
    const { missionId, stepId, agentId, params } = msg.payload;
    const res = await executeAgent({ missionId, stepId, agentId, payload: params });
    completeStep(missionId, stepId, res.ok, res.error);
    const mission = getMission(missionId);
    if (mission && mission.status === "running") {
      await dispatchNextStep(missionId);
    }
  });
  initialized = true;
}

