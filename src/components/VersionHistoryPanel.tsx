"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { listVersions, createVersion, restoreVersion } from "@/app/actions/versions";
import type { ActionResponse } from "@/lib/errors";
import { toast } from "sonner";

type FlowVersionItem = { id: string; version: number; author?: string | null; createdAt: string | Date };
type ListResponse = { items: FlowVersionItem[]; meta: { total: number; page: number; limit: number; totalPages: number } };
type VersionItem = { id: string; version: number; author?: string | null; createdAt: string };

export function VersionHistoryPanel({ flowId }: { flowId: string }) {
  const [items, setItems] = useState<VersionItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [pending, startTransition] = useTransition();

  const loadVersions = useCallback((p: number) => {
    startTransition(async () => {
      const res = (await listVersions(flowId, p)) as ActionResponse<ListResponse>;
      if (res.ok) {
        const { items: newItems, meta } = res.data;
        const formatted = newItems.map((v) => ({
          id: v.id,
          version: v.version,
          author: v.author,
          createdAt: String(v.createdAt),
        }));
        
        setItems((prev) => (p === 1 ? formatted : [...prev, ...formatted]));
        setHasMore(p < meta.totalPages);
      } else {
        toast.error(res.error.message);
      }
    });
  }, [flowId]);

  useEffect(() => {
    loadVersions(1);
  }, [loadVersions]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadVersions(nextPage);
  };

  const onCreate = () => {
    startTransition(async () => {
      const res = (await createVersion(flowId)) as ActionResponse<FlowVersionItem>;
      if (res.ok) {
        const v = res.data;
        setItems((prev) => [{ id: v.id, version: v.version, author: v.author ?? undefined, createdAt: String(v.createdAt) }, ...prev]);
        toast.success("Version created");
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const onRestore = (versionId: string) => {
    if (!confirm("Restore this version? This will overwrite current nodes and edges.")) return;
    startTransition(async () => {
      const res = await restoreVersion(versionId);
      if (res.ok) {
        toast.success("Version restored successfully");
      } else {
        toast.error(res.error.message);
      }
    });
  };

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Version History</div>
        <button
          onClick={onCreate}
          disabled={pending}
          className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
        >
          Create Version
        </button>
      </div>
      <ul className="mt-3 max-h-64 overflow-auto">
        {items.map((v) => (
          <li key={v.id} className="flex items-center justify-between py-2 border-b">
            <div>
              <div className="text-sm">v{v.version}</div>
              <div className="text-xs text-neutral-600">{v.createdAt} {v.author ? `• ${v.author}` : ""}</div>
            </div>
            <button
              onClick={() => onRestore(v.id)}
              disabled={pending}
              className="rounded-md border px-2 py-1 text-xs disabled:opacity-50"
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={pending}
          className="mt-2 w-full rounded-md border py-1 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
        >
          {pending ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
