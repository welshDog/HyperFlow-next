import { listSurveyResponses } from "@/app/actions/survey";

export const dynamic = "force-dynamic";

function avg(nums: number[]) {
  return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
}

type Row = { id: string; createdAt: number; data: Record<string, unknown> };

export default async function Page() {
  const rows = (await listSurveyResponses()) as Row[];
  const baseline = rows.map((r) => Number(r.data["baseline_task_time_minutes"]) || 0);
  const target = rows.map((r) => Number(r.data["target_task_time_minutes"]) || 0);
  const avgBaseline = avg(baseline);
  const avgTarget = avg(target);
  const improvement = avgBaseline && avgTarget ? Math.round((avgBaseline / Math.max(1, avgTarget)) * 100) : 0;
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Survey Analytics</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">Aggregate metrics from submitted responses.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded border p-4"><div className="text-sm text-neutral-500">Avg Baseline (min)</div><div className="text-2xl">{avgBaseline}</div></div>
        <div className="rounded border p-4"><div className="text-sm text-neutral-500">Avg Target (min)</div><div className="text-2xl">{avgTarget}</div></div>
        <div className="rounded border p-4"><div className="text-sm text-neutral-500">Improvement (%)</div><div className="text-2xl">{improvement}</div></div>
      </div>
      <div className="mt-6">
        <a className="text-blue-700" href="/api/survey/export">Download CSV</a>
      </div>
    </main>
  );
}
