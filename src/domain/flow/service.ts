import { z } from "zod";
import { FlowSchema } from "@/lib/validation";
import * as repo from "./repository";
import { ActionResponse, fromZodIssues, notFound } from "@/lib/errors";
import { FlowCreateInput, FlowUpdateInput } from "./interfaces";

export async function createFlow(input: unknown): Promise<ActionResponse<unknown>> {
  const parsed = FlowSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: fromZodIssues(parsed.error.issues) };
  const data = parsed.data as FlowCreateInput;
  const flow = await repo.create({ name: data.name, version: data.version ?? 1 });
  return { ok: true, data: flow };
}

export async function getFlow(id: string): Promise<ActionResponse<unknown>> {
  const idSchema = z.string().cuid();
  try {
    const validId = idSchema.parse(id);
    const flow = await repo.findById(validId);
    if (!flow) return { ok: false, error: notFound("Flow not found") };
    return { ok: true, data: flow };
  } catch {
    return { ok: false, error: { code: "validation_error", message: "Invalid id" } };
  }
}

export async function updateFlow(input: unknown): Promise<ActionResponse<unknown>> {
  const parsed = FlowSchema.extend({ id: z.string().cuid() }).safeParse(input);
  if (!parsed.success) return { ok: false, error: fromZodIssues(parsed.error.issues) };
  const data = parsed.data as FlowUpdateInput;
  const flow = await repo.update(data.id, { name: data.name, version: data.version ?? 1 });
  return { ok: true, data: flow };
}

export async function deleteFlow(id: string): Promise<ActionResponse<unknown>> {
  const idSchema = z.string().cuid();
  try {
    const validId = idSchema.parse(id);
    await repo.remove(validId);
    return { ok: true, data: { success: true } };
  } catch {
    return { ok: false, error: { code: "validation_error", message: "Invalid id" } };
  }
}
