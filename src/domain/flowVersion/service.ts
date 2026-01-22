import { z } from "zod";
import * as flowRepo from "@/domain/flow/repository";
import * as repo from "./repository";
import type { Prisma } from "@/generated/prisma/client";
import { ActionResponse, notFound } from "@/lib/errors";

const idSchema = z.string().cuid();
const authorSchema = z.string().min(1).optional();

export async function listVersions(
  flowId: string,
  page: number = 1,
  limit: number = 20
): Promise<ActionResponse<{ items: unknown[]; meta: { total: number; page: number; limit: number; totalPages: number } }>> {
  try {
    const fid = idSchema.parse(flowId);
    const p = Math.max(1, page);
    const l = Math.max(1, Math.min(100, limit));
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      repo.list(fid, skip, l),
      repo.count(fid),
    ]);

    return {
      ok: true,
      data: {
        items,
        meta: {
          total,
          page: p,
          limit: l,
          totalPages: Math.ceil(total / l),
        },
      },
    };
  } catch {
    return { ok: false, error: { code: "validation_error", message: "Invalid input" } };
  }
}

export async function createVersion(flowId: string, author?: string): Promise<ActionResponse<unknown>> {
  try {
    const fid = idSchema.parse(flowId);
    authorSchema.parse(author);
    const flow = await flowRepo.findById(fid);
    if (!flow) return { ok: false, error: notFound("Flow not found") };
    const latest = await repo.getLatestVersion(fid);
    const nextVersion = (latest?.version ?? 0) + 1;
    const snapshot: { nodes: repo.SnapshotNode[]; edges: repo.SnapshotEdge[] } = {
      nodes: flow.nodes.map((n) => ({ id: n.id, type: n.type, x: n.x, y: n.y, config: (n.config ?? {}) as Prisma.InputJsonValue })),
      edges: flow.edges.map((e) => ({
        id: e.id,
        sourceNodeId: e.sourceNodeId,
        sourcePort: e.sourcePort,
        targetNodeId: e.targetNodeId,
        targetPort: e.targetPort,
      })),
    };
    const created = await repo.create(fid, nextVersion, snapshot as unknown as Prisma.InputJsonValue, author);
    return { ok: true, data: created };
  } catch {
    return { ok: false, error: { code: "validation_error", message: "Invalid input" } };
  }
}

export async function restoreVersion(versionId: string): Promise<ActionResponse<unknown>> {
  try {
    const vid = idSchema.parse(versionId);
    const v = await repo.getById(vid);
    if (!v) return { ok: false, error: notFound("Version not found") };
    const snapshot = v.snapshot as { nodes?: repo.SnapshotNode[]; edges?: repo.SnapshotEdge[] };
    await repo.restore(v.flowId, { nodes: snapshot.nodes ?? [], edges: snapshot.edges ?? [] });
    return { ok: true, data: { success: true } };
  } catch {
    return { ok: false, error: { code: "validation_error", message: "Invalid version id" } };
  }
}
