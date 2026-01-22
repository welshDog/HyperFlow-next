"use server";

import * as service from "@/domain/flow/service";
import { ActionResponse } from "@/lib/errors";
import { getServerUser } from "@/lib/supabaseServer";
import { hasAnyRole } from "@/lib/rbac";
import { unauthorized } from "@/lib/errors";
import { hyper } from "@/lib/env";
import { recordAudit } from "@/lib/audit";

export async function createFlow(input: unknown): Promise<ActionResponse<unknown>> {
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !hasAnyRole(user, ["Administrator", "MissionCreator"])) {
    console.warn("[Action] createFlow unauthorized");
    await recordAudit({ userId: user?.id, action: "flow:create:denied", entity: "Flow" });
    return { ok: false, error: unauthorized("Insufficient permissions to create flows") };
  }
  await recordAudit({ userId: user?.id, action: "flow:create", entity: "Flow" });
  return service.createFlow(input);
}

export async function getFlow(id: string): Promise<ActionResponse<unknown>> {
  return service.getFlow(id);
}

export async function updateFlow(input: unknown): Promise<ActionResponse<unknown>> {
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !hasAnyRole(user, ["Administrator", "MissionCreator"])) {
    console.warn("[Action] updateFlow unauthorized");
    await recordAudit({ userId: user?.id, action: "flow:update:denied", entity: "Flow" });
    return { ok: false, error: unauthorized("Insufficient permissions to update flows") };
  }
  await recordAudit({ userId: user?.id, action: "flow:update", entity: "Flow" });
  return service.updateFlow(input);
}

export async function deleteFlow(id: string): Promise<ActionResponse<unknown>> {
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !hasAnyRole(user, ["Administrator"])) {
    console.warn("[Action] deleteFlow unauthorized");
    await recordAudit({ userId: user?.id, action: "flow:delete:denied", entity: "Flow", entityId: id });
    return { ok: false, error: unauthorized("Administrator role required to delete flows") };
  }
  await recordAudit({ userId: user?.id, action: "flow:delete", entity: "Flow", entityId: id });
  return service.deleteFlow(id);
}
