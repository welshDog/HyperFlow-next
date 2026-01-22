"use client";

import { useEffect, useMemo, useState } from "react";

type MissionStep = {
  id: string;
  name: string;
  agentId: string;
  retries: number;
  status: "pending" | "in_progress" | "succeeded" | "failed" | "skipped";
  startedAt?: number;
  finishedAt?: number;
  lastError?: string;
};

type MissionDefinition = {
  id: string;
  name: string;
  description?: string;
  guardrails: {
    maxExecutionMs: number;
    maxRetries: number;
    allowedAgents: string[];
  };
  steps: MissionStep[];
};

type Mission = {
  id: string;
  definition: MissionDefinition;
  status: "pending" | "running" | "completed" | "failed" | "cancelled" | "timed_out";
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  finishedAt?: number;
  currentStepId?: string;
};

type OrchestratorResponse = {
  missions: Mission[];
  metrics: {
    missionsTotal: number;
    missionsCompleted: number;
    missionsFailed: number;
    averageLatencyMs: number;
  };
};

type HealthCoreResponse = {
  status: string;
  orchestrator: {
    missionsTotal: number;
    missionsCompleted: number;
    missionsFailed: number;
    averageLatencyMs: number;
  };
  agents: { count: number };
  resources: { memoryRssMb: number; uptimeSeconds: number };
};

function formatMs(ms: number) {
  if (ms < 1000) return `${ms} ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)} s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}m ${rem}s`;
}

export default function HyperDashboardPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [metrics, setMetrics] = useState<OrchestratorResponse["metrics"]>({ missionsTotal: 0, missionsCompleted: 0, missionsFailed: 0, averageLatencyMs: 0 });
  const [agentsCount, setAgentsCount] = useState(0);
  const [resources, setResources] = useState<{ memoryRssMb: number; uptimeSeconds: number }>({ memoryRssMb: 0, uptimeSeconds: 0 });
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [memMax, setMemMax] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [orcRes, healthRes] = await Promise.all([
          fetch("/api/orchestrator", { cache: "no-store" }).then(r => r.json() as Promise<OrchestratorResponse>),
          fetch("/api/health/core", { cache: "no-store" }).then(r => r.json() as Promise<HealthCoreResponse>),
        ]);
        if (!mounted) return;
        setMissions(orcRes.missions);
        setMetrics(orcRes.metrics);
        setAgentsCount(healthRes.agents.count);
        setResources(healthRes.resources);
        setMemMax(prev => Math.max(prev, healthRes.resources.memoryRssMb));
      } catch {}
    }
    load();
    const id = setInterval(load, 3000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      const statusOk = statusFilter ? m.status === statusFilter : true;
      const text = `${m.definition.name} ${m.definition.description ?? ""}`.toLowerCase();
      const searchOk = search ? text.includes(search.toLowerCase()) : true;
      return statusOk && searchOk;
    });
  }, [missions, statusFilter, search]);

  const statusColors: Record<Mission["status"], string> = {
    pending: "bg-neutral-300 text-neutral-800",
    running: "bg-blue-600 text-white",
    completed: "bg-green-600 text-white",
    failed: "bg-red-600 text-white",
    cancelled: "bg-yellow-600 text-white",
    timed_out: "bg-orange-600 text-white",
  };

  const memPct = memMax > 0 ? Math.min(100, Math.round((resources.memoryRssMb / memMax) * 100)) : 0;

  return (
    <main className="min-h-screen w-full bg-zinc-50 dark:bg-black" aria-label="Hyper Dashboard">
      <section className="mx-auto max-w-6xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-zinc-50">Hyper Dashboard</h1>
          <div aria-live="polite" className="text-sm text-neutral-600 dark:text-neutral-400">Updated live</div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border p-4 bg-white/70 dark:bg-neutral-900/40">
            <div className="text-xs text-neutral-500">Missions Total</div>
            <div className="text-xl font-semibold">{metrics.missionsTotal}</div>
          </div>
          <div className="rounded-lg border p-4 bg-white/70 dark:bg-neutral-900/40">
            <div className="text-xs text-neutral-500">Completed</div>
            <div className="text-xl font-semibold text-green-700">{metrics.missionsCompleted}</div>
          </div>
          <div className="rounded-lg border p-4 bg-white/70 dark:bg-neutral-900/40">
            <div className="text-xs text-neutral-500">Failed</div>
            <div className="text-xl font-semibold text-red-700">{metrics.missionsFailed}</div>
          </div>
          <div className="rounded-lg border p-4 bg-white/70 dark:bg-neutral-900/40">
            <div className="text-xs text-neutral-500">Avg Latency</div>
            <div className="text-xl font-semibold">{formatMs(metrics.averageLatencyMs)}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 bg-white/70 dark:bg-neutral-900/40">
            <div className="text-xs text-neutral-500">Agents Registered</div>
            <div className="text-xl font-semibold">{agentsCount}</div>
          </div>
          <div className="rounded-lg border p-4 bg-white/70 dark:bg-neutral-900/40">
            <div className="text-xs text-neutral-500">Memory (RSS MB)</div>
            <div className="text-xl font-semibold">{resources.memoryRssMb}</div>
            <div className="mt-2 h-2 w-full rounded bg-neutral-200">
              <div className="h-2 rounded bg-blue-600" style={{ width: `${memPct}%` }} />
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-white/70 dark:bg-neutral-900/40">
            <div className="text-xs text-neutral-500">Uptime</div>
            <div className="text-xl font-semibold">{formatMs(resources.uptimeSeconds * 1000)}</div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <input
            aria-label="Search missions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search missions"
            className="flex-1 rounded border border-neutral-300 p-2"
          />
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-neutral-300 p-2"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="timed_out">Timed out</option>
          </select>
        </div>

        <div className="mt-6 rounded-lg border bg-white/70 dark:bg-neutral-900/40">
          <div className="p-4 font-semibold">Missions</div>
          <ul className="divide-y">
            {filteredMissions.map((m) => {
              const statusClass = statusColors[m.status];
              const steps = m.definition.steps;
              const counts = {
                pending: steps.filter(s => s.status === "pending").length,
                inProgress: steps.filter(s => s.status === "in_progress").length,
                succeeded: steps.filter(s => s.status === "succeeded").length,
                failed: steps.filter(s => s.status === "failed").length,
              };
              return (
                <li key={m.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-neutral-500">{m.definition.id}</div>
                      <div className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{m.definition.name}</div>
                      {m.definition.description && (
                        <div className="text-sm text-neutral-600 dark:text-neutral-300">{m.definition.description}</div>
                      )}
                    </div>
                    <span className={`rounded px-2 py-1 text-xs ${statusClass}`}>{m.status}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded border p-2 text-sm">
                      <div className="text-xs text-neutral-500">Pending</div>
                      <div className="font-semibold">{counts.pending}</div>
                    </div>
                    <div className="rounded border p-2 text-sm">
                      <div className="text-xs text-neutral-500">In Progress</div>
                      <div className="font-semibold">{counts.inProgress}</div>
                    </div>
                    <div className="rounded border p-2 text-sm">
                      <div className="text-xs text-neutral-500">Succeeded</div>
                      <div className="font-semibold">{counts.succeeded}</div>
                    </div>
                    <div className="rounded border p-2 text-sm">
                      <div className="text-xs text-neutral-500">Failed</div>
                      <div className="font-semibold">{counts.failed}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-neutral-500">Allowed Agents</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {m.definition.guardrails.allowedAgents.map(a => (
                        <span key={a} className="rounded border px-2 py-0.5 text-xs">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-neutral-500">Steps</div>
                    <ul className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {steps.map(s => (
                        <li key={s.id} className="rounded border p-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium">{s.name}</div>
                              <div className="text-xs text-neutral-600">Agent: {s.agentId}</div>
                            </div>
                            <span className="text-xs text-neutral-700">{s.status}</span>
                          </div>
                          {s.lastError && (
                            <div className="mt-1 text-xs text-red-700">{s.lastError}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}

