"use client";

type NodeCardProps = {
  label: string;
  selected?: boolean;
};

export function NodeCard({ label, selected }: NodeCardProps) {
  return (
    <button
      className={`rounded-md border px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        selected ? "border-indigo-500" : "border-neutral-300"
      }`}
      aria-pressed={selected ? true : false}
    >
      <span className="font-medium text-neutral-800">{label}</span>
    </button>
  );
}

