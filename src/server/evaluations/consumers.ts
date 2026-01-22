import { getSharedBus } from "@/server/messaging/bus";
import { verifyEnvelope } from "@/server/messaging/envelope";
import type { MessageEnvelope } from "@/server/messaging/envelope";
import { hyper } from "@/lib/env";
import { create } from "./repository";

type EvaluationRequestPayload = {
  missionId: string;
  evaluatorType: "success" | "performance" | "compliance";
};

let init = false;

export function ensureEvaluationConsumers() {
  if (init) return;
  const bus = getSharedBus();
  bus.subscribe<EvaluationRequestPayload>("mission.evaluation-request", async (msg: MessageEnvelope<EvaluationRequestPayload>) => {
    const ok = verifyEnvelope(msg, hyper.HYPER_MESSAGE_SECRET);
    if (!ok) return;
    const { missionId, evaluatorType } = msg.payload;
    const score = evaluatorType === "success" ? 1 : evaluatorType === "performance" ? 0.9 : 1;
    await create(missionId, evaluatorType, score, { traceId: msg.traceId });
  });
  init = true;
}

