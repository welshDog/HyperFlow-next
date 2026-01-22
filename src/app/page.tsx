import { EditorCanvas } from "@/components/EditorCanvas";
import { NodeCard } from "@/components/NodeCard";
import { ZenModeToggle } from "@/components/ZenModeToggle";
import { QuickTasksSidebar } from "@/components/QuickTasksSidebar";
import { VersionHistoryPanel } from "@/components/VersionHistoryPanel";

export default function Home() {
  const tasks = [
    { id: "env", title: "Set environment variables", href: "/docs/quickstart#setup" },
    { id: "run", title: "Run dev server", href: "/docs/quickstart#setup" },
    { id: "zen", title: "Toggle Zen Mode", href: "/docs/quickstart#first-flow" },
    { id: "version", title: "Review Version History", href: "/docs/quickstart#first-flow" },
    { id: "tests", title: "Run unit & E2E tests", href: "/docs/testing" },
    { id: "a11y", title: "Check accessibility", href: "/docs/accessibility" },
  ];
  return (
    <main className="min-h-screen w-full bg-zinc-50 dark:bg-black">
      <section className="mx-auto max-w-6xl p-6 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
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
        <div className="md:col-start-2 md:row-start-1 md:row-span-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40">
          <QuickTasksSidebar tasks={tasks} />
        </div>
      </section>
    </main>
  );
}
