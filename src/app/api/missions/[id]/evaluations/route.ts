import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listByMission } from "@/server/evaluations/repository";
import { getServerUser } from "@/lib/supabaseServer";
import { hasAnyRole } from "@/lib/rbac";
import { unauthorized } from "@/lib/errors";
import { hyper } from "@/lib/env";
import { filterEvaluationsForViewer } from "@/lib/filter";

const QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  evaluatorType: z.string().min(1).optional(),
  startMs: z.coerce.number().int().optional(),
  endMs: z.coerce.number().int().optional(),
  minScore: z.coerce.number().optional(),
  sortBy: z.enum(["createdAt", "score"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (hyper.HYPER_ENABLE_AUTH_GUARDS && !hasAnyRole(user, ["Administrator", "Evaluator", "Viewer"])) {
    return NextResponse.json({ error: unauthorized("Insufficient permissions to view evaluations") }, { status: 403 });
  }
  const { id } = await params;
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", issues: parsed.error.issues }, { status: 400 });
  }
  const { page, limit, evaluatorType, startMs, endMs, minScore, sortBy, sortOrder } = parsed.data;
  const result = await listByMission(id, page, limit, { evaluatorType, startMs, endMs, minScore, sortBy, sortOrder });
  const privileged = hasAnyRole(user, ["Administrator", "Evaluator"]);
  const items = privileged ? result.items : filterEvaluationsForViewer(result.items);
  const totalPages = Math.ceil(result.total / limit);
  return NextResponse.json({ items, meta: { total: result.total, page, limit, totalPages } });
}
