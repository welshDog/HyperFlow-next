import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureDefaultAgents, listAgents, registerAgent } from "@/server/agents/registry";
import { getServerUser } from "@/lib/supabaseServer";
import { hasAnyRole } from "@/lib/rbac";
import { unauthorized } from "@/lib/errors";
import { hyper } from "@/lib/env";
import { recordAudit } from "@/lib/audit";

const AgentSchema = z.object({
  handle: z.string().min(1),
  displayName: z.string().min(1),
  kind: z.enum(["specialist", "evaluator"]),
  version: z.string().min(1),
  capabilities: z.array(
    z.object({
      id: z.string().min(1),
      description: z.string().min(1),
      inputs: z.array(z.string().min(1)),
      outputs: z.array(z.string().min(1)),
    })
  ),
  resourceLimits: z.object({
    maxConcurrentMissions: z.number().int().positive(),
    maxCpuPercent: z.number().int().min(1).max(100),
    maxMemoryMb: z.number().int().positive(),
  }),
  dependencies: z.array(z.string().min(1)),
});

export async function GET() {
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !hasAnyRole(user, ["Administrator", "AgentManager", "Viewer", "Evaluator", "MissionCreator"])) {
    await recordAudit({ userId: user?.id, action: "agents:list:denied", entity: "Agent" });
    return NextResponse.json({ error: unauthorized("Insufficient permissions to view agents") }, { status: 403 });
  }
  await recordAudit({ userId: user?.id, action: "agents:list", entity: "Agent" });
  ensureDefaultAgents();
  const agents = listAgents();
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !hasAnyRole(user, ["Administrator", "AgentManager"])) {
    await recordAudit({ userId: user?.id, action: "agents:register:denied", entity: "Agent" });
    return NextResponse.json({ error: unauthorized("Insufficient permissions to register agents") }, { status: 403 });
  }
  const body = await req.json();
  const parsed = AgentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid agent", issues: parsed.error.issues }, { status: 400 });
  }
  const agent = registerAgent(parsed.data);
  await recordAudit({ userId: user?.id, action: "agents:register", entity: "Agent", entityId: agent.id, diff: { handle: agent.handle } });
  return NextResponse.json(agent, { status: 201 });
}
