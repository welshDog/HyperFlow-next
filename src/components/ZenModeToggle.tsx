"use client";

import { useZenMode } from "@/app/zenMode";

export function ZenModeToggle() {
  const { zen, setZen } = useZenMode();
  return (
    <button
      aria-pressed={zen}
      onClick={() => setZen(!zen)}
      className={`rounded-full border px-3 py-1 text-sm ${zen ? "border-indigo-500" : "border-neutral-300"}`}
    >
      {zen ? "Zen Mode: On" : "Zen Mode: Off"}
    </button>
  );
}

