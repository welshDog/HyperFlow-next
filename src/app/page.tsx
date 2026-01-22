import { EditorCanvas } from "@/components/EditorCanvas";
import { NodeCard } from "@/components/NodeCard";
import { ZenModeToggle } from "@/components/ZenModeToggle";
import { VersionHistoryPanel } from "@/components/VersionHistoryPanel";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-zinc-50 dark:bg-black">
      <section className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-zinc-50">Hyperflow Editor</h1>
        <p className="mt-2 text-neutral-600 dark:text-zinc-400">
          Drag nodes, connect ports, and build flows. Zen Mode coming soon.
        </p>
        <div className="mt-6 flex gap-3 items-center">
          <NodeCard label="DataSource" />
          <NodeCard label="Transform" />
          <NodeCard label="Output" />
          <ZenModeToggle />
        </div>
        <div className="mt-6">
          <EditorCanvas />
        </div>
        <div className="mt-6">
          <VersionHistoryPanel flowId="demo-flow-id" />
        </div>
      </section>
    </main>
  );
}
