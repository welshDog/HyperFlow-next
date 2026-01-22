import type { EvaluationRow } from "@/server/evaluations/repository";

export function filterEvaluationsForViewer(items: EvaluationRow[]): EvaluationRow[] {
  return items.map((i) => ({ ...i, metadata: {} }));
}

