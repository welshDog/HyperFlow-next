import { createEnvelope, signEnvelope } from "@/server/messaging/envelope";
import { getSharedBus } from "@/server/messaging/bus";
import { hyper } from "@/lib/env";

export type EvaluationRequestPayload = {
  missionId: string;
  evaluatorType: "success" | "performance" | "compliance";
};

export async function emitEvaluationRequests(missionId: string) {
  const bus = getSharedBus();
  const types: Array<EvaluationRequestPayload["evaluatorType"]> = ["success", "performance", "compliance"];
  for (const t of types) {
    const env = createEnvelope<EvaluationRequestPayload>("mission.evaluation-request", { missionId, evaluatorType: t }, { headers: { evaluatorType: t } });
    const signed = signEnvelope(env, hyper.HYPER_MESSAGE_SECRET);
    await bus.publish("mission.evaluation-request", signed);
  }
}

