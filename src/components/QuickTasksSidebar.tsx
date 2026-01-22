"use client";

import { useEffect, useMemo, useState } from "react";

interface QuickTask {
  id: string;
  title: string;
  href: string;
}

interface QuickTasksSidebarProps {
  tasks: QuickTask[];
  storageKey?: string;
}

export function QuickTasksSidebar({ tasks, storageKey = "quicktasks:collapsed" }: QuickTasksSidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      return raw === "true";
    } catch {
      return false;
    }
  });
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const comp = typeof window !== "undefined" ? localStorage.getItem(`${storageKey}:completed`) : null;
      return comp ? (JSON.parse(comp) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(collapsed));
      localStorage.setItem(`${storageKey}:completed`, JSON.stringify(completed));
    } catch {}
  }, [collapsed, completed, storageKey]);

  const completedCount = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);

  return (
    <aside aria-label="Quick Tasks" className="border-l border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Quick Tasks</h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{completedCount}/{tasks.length}</span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded px-2 py-1 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:outline-none focus:ring focus:ring-blue-500"
          aria-expanded={!collapsed}
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>
      {!collapsed && (
        <ul className="space-y-2 px-4 pb-4">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-start justify-between gap-3">
              <a
                href={t.href}
                className="flex-1 text-sm text-blue-700 dark:text-blue-400 hover:underline focus:outline-none focus:ring focus:ring-blue-500"
              >
                {t.title}
              </a>
              <label className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300">
                <input
                  type="checkbox"
                  aria-label={`Mark ${t.title} as completed`}
                  checked={Boolean(completed[t.id])}
                  onChange={(e) => setCompleted((c) => ({ ...c, [t.id]: e.target.checked }))}
                  className="accent-blue-600"
                />
                Done
              </label>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
