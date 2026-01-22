"use server";

import * as service from "@/domain/flow/service";
import { ActionResponse } from "@/lib/errors";

export async function createFlow(input: unknown): Promise<ActionResponse<unknown>> {
  return service.createFlow(input);
}

export async function getFlow(id: string): Promise<ActionResponse<unknown>> {
  return service.getFlow(id);
}

export async function updateFlow(input: unknown): Promise<ActionResponse<unknown>> {
  return service.updateFlow(input);
}

export async function deleteFlow(id: string): Promise<ActionResponse<unknown>> {
  return service.deleteFlow(id);
}
