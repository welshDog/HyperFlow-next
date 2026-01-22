import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VersionHistoryPanel } from "@/components/VersionHistoryPanel";

type FlowVersionItem = { id: string; version: number; author?: string | null; createdAt: string | Date };
type ListResponse = { items: FlowVersionItem[]; meta: { total: number; page: number; limit: number; totalPages: number } };
type ErrorEnvelope = { code: string; message: string };
type ActionResponse<T> = { ok: true; data: T } | { ok: false; error: ErrorEnvelope };

const makeItems = (count: number, startVersion = 1): FlowVersionItem[] =>
  Array.from({ length: count }, (_, i) => ({ id: `v-${startVersion + i}`, version: startVersion + i, createdAt: new Date().toISOString() }));

vi.mock("@/app/actions/versions", () => {
  const listVersions = vi.fn(async (flowId: string, page: number): Promise<ActionResponse<ListResponse>> => {
    if (page === 1) {
      return { ok: true, data: { items: makeItems(20, 1), meta: { total: 25, page: 1, limit: 20, totalPages: 2 } } };
    }
    return { ok: true, data: { items: makeItems(5, 21), meta: { total: 25, page: 2, limit: 20, totalPages: 2 } } };
  });
  const createVersion = vi.fn(async (): Promise<ActionResponse<FlowVersionItem>> => ({ ok: true, data: { id: "v-26", version: 26, createdAt: new Date().toISOString() } }));
  const restoreVersion = vi.fn(async (): Promise<ActionResponse<unknown>> => ({ ok: true, data: true }));
  return { listVersions, createVersion, restoreVersion };
});

describe("VersionHistoryPanel pagination", () => {
  it("shows Load More when there are more pages and loads additional items", async () => {
    render(<VersionHistoryPanel flowId="flow-1" />);

    await waitFor(() => {
      expect(screen.getAllByText(/v\d+/).length).toBe(20);
    });

    const loadMore = await screen.findByRole("button", { name: /Load More|Loading.../i });
    expect(loadMore).toBeInTheDocument();

    await userEvent.click(loadMore);

    await waitFor(() => {
      expect(screen.getAllByText(/v\d+/).length).toBe(25);
    });

    const maybeButton = screen.queryByRole("button", { name: /Load More/i });
    expect(maybeButton).toBeNull();
  });
});
