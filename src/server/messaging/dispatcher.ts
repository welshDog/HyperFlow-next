import { getSharedBus } from "./bus";
import { createEnvelope, signEnvelope } from "./envelope";
import { nextRunnableStep } from "@/server/orchestrator/service";
import { hyper } from "@/lib/env";

export type StepDispatchPayload = {
  missionId: string;
  stepId: string;
  agentId: string;
  params?: Record<string, unknown>;
};

export async function dispatchNextStep(missionId: string): Promise<boolean> {
  const step = nextRunnableStep(missionId);
  if (!step) return false;
  const payload: StepDispatchPayload = {
    missionId,
    stepId: step.id,
    agentId: step.agentId,
  };
  const env = createEnvelope<StepDispatchPayload>("mission.step-dispatch", payload, {
    headers: { stepName: step.name },
  });
  const signed = signEnvelope(env, hyper.HYPER_MESSAGE_SECRET);
  const bus = getSharedBus();
  await bus.publish("mission.step-dispatch", signed);
  return true;
}

