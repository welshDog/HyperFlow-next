import { getPrisma } from "@/lib/prisma";

export type EvaluationRow = {
  id: string;
  missionId: string;
  evaluatorType: string;
  score?: number | null;
  metadata: Record<string, unknown>;
  createdAt: number;
};

const mem: EvaluationRow[] = [];

function toMs(date: Date) {
  return date.getTime();
}

function getModel(name: string): Record<string, unknown> | null {
  try {
    const prisma = getPrisma() as unknown as Record<string, unknown>;
    const m = prisma[name] as unknown;
    return (m && typeof m === "object") ? (m as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function create(missionId: string, evaluatorType: string, score: number | null, metadata: Record<string, unknown>): Promise<{ id: string; createdAt: number }> {
  const model = getModel("evaluation");
  const creator = model?.["create"] as (a: unknown) => Promise<unknown> | undefined;
  if (creator) {
    try {
      const created = await creator({ data: { missionId, evaluatorType, score, metadata } }) as { id?: string; createdAt?: Date } | null;
      return { id: created?.id ?? "", createdAt: created?.createdAt ? toMs(created.createdAt) : Date.now() };
    } catch {}
  }
  const row: EvaluationRow = { id: `mem_${Date.now()}_${Math.random().toString(36).slice(2)}`, missionId, evaluatorType, score: score ?? undefined, metadata, createdAt: Date.now() };
  mem.push(row);
  return { id: row.id, createdAt: row.createdAt };
}

export type ListFilters = {
  evaluatorType?: string;
  startMs?: number;
  endMs?: number;
  minScore?: number;
  sortBy?: "createdAt" | "score";
  sortOrder?: "asc" | "desc";
};

export async function listByMission(missionId: string, page: number, limit: number, filters: ListFilters): Promise<{ items: EvaluationRow[]; total: number }> {
  const model = getModel("evaluation");
  const finder = model?.["findMany"] as (a: unknown) => Promise<unknown> | undefined;
  const counter = model?.["count"] as (a: unknown) => Promise<number> | undefined;
  if (finder) {
    try {
      const where: Record<string, unknown> = { missionId };
      if (filters.evaluatorType) where["evaluatorType"] = filters.evaluatorType;
      const rows = await finder({
        where,
        orderBy: [
          { [filters.sortBy ?? "createdAt"]: filters.sortOrder ?? "desc" },
        ],
        skip: (Math.max(1, page) - 1) * Math.max(1, limit),
        take: Math.max(1, limit),
      }) as Array<{ id: string; missionId: string; evaluatorType: string; score?: number | null; metadata: unknown; createdAt: Date }> | null;
      const items = (rows ?? []).map(r => ({ id: r.id, missionId: r.missionId, evaluatorType: r.evaluatorType, score: r.score ?? undefined, metadata: r.metadata as Record<string, unknown>, createdAt: toMs(r.createdAt) }));
      let totalNum: number;
      const counterFn = model?.["count"];
      if (typeof counterFn === "function") {
        totalNum = await (counterFn as (a: unknown) => Promise<number>)({ where });
      } else {
        totalNum = items.length;
      }
      return { items, total: totalNum };
    } catch {}
  }
  let rows = mem.filter(r => r.missionId === missionId);
  if (filters.evaluatorType) rows = rows.filter(r => r.evaluatorType === filters.evaluatorType);
  if (typeof filters.startMs === "number") rows = rows.filter(r => r.createdAt >= filters.startMs!);
  if (typeof filters.endMs === "number") rows = rows.filter(r => r.createdAt <= filters.endMs!);
  if (typeof filters.minScore === "number") rows = rows.filter(r => (r.score ?? 0) >= filters.minScore!);
  const sortBy = filters.sortBy ?? "createdAt";
  const sortOrder = filters.sortOrder ?? "desc";
  rows.sort((a, b) => {
    const va = sortBy === "score" ? (a.score ?? 0) : a.createdAt;
    const vb = sortBy === "score" ? (b.score ?? 0) : b.createdAt;
    return sortOrder === "asc" ? va - vb : vb - va;
  });
  const total = rows.length;
  const p = Math.max(1, page);
  const l = Math.max(1, limit);
  const items = rows.slice((p - 1) * l, (p - 1) * l + l);
  return { items, total };
}
