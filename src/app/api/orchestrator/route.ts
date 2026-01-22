import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createMission, listMissions, missionMetrics, startMission } from "@/server/orchestrator/service";
import { ensureConsumers } from "@/server/messaging/consumers";
import { dispatchNextStep } from "@/server/messaging/dispatcher";
import { ensureEvaluationConsumers } from "@/server/evaluations/consumers";
import { getServerUser } from "@/lib/supabaseServer";
import { hasAnyRole } from "@/lib/rbac";
import { unauthorized } from "@/lib/errors";
import { hyper } from "@/lib/env";
import type { MissionDefinition } from "@/server/orchestrator/types";

const MissionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  guardrails: z.object({
    maxExecutionMs: z.number().int().positive(),
    maxRetries: z.number().int().min(0),
    allowedAgents: z.array(z.string().min(1)),
  }),
  steps: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      agentId: z.string().min(1),
      inputSchemaId: z.string().optional(),
      outputSchemaId: z.string().optional(),
    })
  ),
});

export async function GET() {
  ensureConsumers();
  ensureEvaluationConsumers();
  const missions = listMissions();
  const metrics = missionMetrics();
  return NextResponse.json({ missions, metrics });
}

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !hasAnyRole(user, ["Administrator", "MissionCreator"])) {
    return NextResponse.json({ error: unauthorized("Insufficient permissions to create missions") }, { status: 403 });
  }
  if (hyper.HYPER_KILL_SWITCH) {
    return NextResponse.json({ error: "system_killed" }, { status: 503 });
  }
  const body = await req.json();
  const parsed = MissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mission", issues: parsed.error.issues }, { status: 400 });
  }
  const def: Omit<MissionDefinition, "id"> = {
    name: parsed.data.name,
    description: parsed.data.description,
    guardrails: parsed.data.guardrails,
    steps: parsed.data.steps.map(step => ({
      ...step,
      retries: 0,
      status: "pending",
    })),
  };
  const mission = createMission(def);
  const started = startMission(mission.id);
  ensureConsumers();
  ensureEvaluationConsumers();
  if (started) {
    await dispatchNextStep(started.id);
  }
  return NextResponse.json(started ?? mission, { status: 201 });
}
