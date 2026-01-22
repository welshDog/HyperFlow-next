import { getPrisma } from "./prisma";

export async function recordAudit(entry: { userId?: string; action: string; entity: string; entityId?: string; diff?: Record<string, unknown> }) {
  try {
    const prisma = getPrisma() as unknown as Record<string, unknown>;
    const model = prisma["auditLog"] as Record<string, unknown> | undefined;
    const creator = model?.["create"] as (a: unknown) => Promise<unknown> | undefined;
    if (creator) {
      await creator({ data: {
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? "",
        diff: entry.diff ?? {},
      } });
    }
  } catch {}
}
