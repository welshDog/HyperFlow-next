"use server";

import { ActionResponse, unauthorized } from "@/lib/errors";
import * as versionService from "@/domain/flowVersion/service";
import { getServerUser } from "@/lib/supabaseServer";
import { hyper } from "@/lib/env";

export async function listVersions(flowId: string, page: number = 1, limit: number = 20): Promise<ActionResponse<unknown>> {
  console.log(`[Action] listVersions flowId=${flowId} page=${page}`);
  const result = await versionService.listVersions(flowId, page, limit);
  console.log(`[Action] listVersions result ok=${result.ok}`);
  return result;
}

export async function createVersion(flowId: string): Promise<ActionResponse<unknown>> {
  console.log(`[Action] createVersion flowId=${flowId}`);
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !user) {
    console.warn(`[Action] createVersion unauthorized access attempt`);
    return { ok: false, error: unauthorized("Login required to create a version") };
  }
  const author = user?.email ?? user?.id ?? "anonymous";
  const result = await versionService.createVersion(flowId, author);
  console.log(`[Action] createVersion result ok=${result.ok}`);
  return result;
}

export async function restoreVersion(versionId: string): Promise<ActionResponse<unknown>> {
  console.log(`[Action] restoreVersion versionId=${versionId}`);
  const user = await getServerUser();
  if (hyper.HYPER_AUTH_REQUIRED_FOR_RESTORE && !user) {
     console.warn("[Action] restoreVersion unauthorized");
     return { ok: false, error: unauthorized("Login required to restore a version") };
  }
  const result = await versionService.restoreVersion(versionId);
  console.log(`[Action] restoreVersion result ok=${result.ok}`);
  return result;
}
