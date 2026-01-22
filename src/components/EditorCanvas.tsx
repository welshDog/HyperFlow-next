"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useZenMode } from "@/app/zenMode";

type EditorCanvasProps = {
  onConnect?: (sourceId: string, sourcePort: string, targetId: string, targetPort: string) => void;
};

export function EditorCanvas({ onConnect }: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const { zen } = useZenMode();

  useEffect(() => {
    if (!canvasRef.current) return;
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasSize({ w: canvasRef.current.clientWidth, h: canvasRef.current.clientHeight });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  type Node = { id: string; label: string; x: number; y: number; ports: string[] };
  const nodes: Node[] = useMemo(
    () => [
      { id: "n1", label: "DataSource", x: 100, y: 100, ports: ["out"] },
      { id: "n2", label: "Transform", x: 300, y: 160, ports: ["in", "out"] },
      { id: "n3", label: "Output", x: 520, y: 220, ports: ["in"] },
    ],
    []
  );
  const [focusedNodeIdx, setFocusedNodeIdx] = useState<number>(0);
  const [focusedPortIdx, setFocusedPortIdx] = useState<number>(0);
  const [connectingFrom, setConnectingFrom] = useState<{ nodeIdx: number; portIdx: number } | null>(null);
  const [viewport, setViewport] = useState<{ x: number; y: number; scale: number }>({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking on background
    if (e.target === e.currentTarget || (e.target as HTMLElement).getAttribute("data-canvas")) {
      setIsPanning(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setViewport((prev) => ({ ...prev, x: prev.x + e.movementX, y: prev.y + e.movementY }));
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const s = e.deltaY < 0 ? 1.1 : 0.9;
      setViewport((prev) => ({ ...prev, scale: Math.min(Math.max(0.2, prev.scale * s), 4) }));
    } else {
       setViewport((prev) => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        setConnectingFrom(null);
        e.preventDefault();
      }
      if (e.key === "+") {
        setViewport(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 4) }));
      }
      if (e.key === "-") {
        setViewport(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.2) }));
      }
      if (e.key === "Tab") {
        const ports = nodes[focusedNodeIdx].ports;
        const next = e.shiftKey
          ? (focusedPortIdx - 1 + ports.length) % ports.length
          : (focusedPortIdx + 1) % ports.length;
        setFocusedPortIdx(next);
        e.preventDefault();
      }
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        const dir = e.key;
        const current = nodes[focusedNodeIdx];
        let bestIdx = focusedNodeIdx;
        let bestScore = Infinity;
        for (let i = 0; i < nodes.length; i++) {
          if (i === focusedNodeIdx) continue;
          const n = nodes[i];
          const dx = n.x - current.x;
          const dy = n.y - current.y;
          const angle = Math.atan2(dy, dx);
          const isDir =
            (dir === "ArrowRight" && dx > 0 && Math.abs(angle) < Math.PI / 2) ||
            (dir === "ArrowLeft" && dx < 0 && Math.abs(angle) > Math.PI / 2) ||
            (dir === "ArrowDown" && dy > 0) ||
            (dir === "ArrowUp" && dy < 0);
          if (!isDir) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < bestScore) {
            bestScore = dist;
            bestIdx = i;
          }
        }
        setFocusedNodeIdx(bestIdx);
        setFocusedPortIdx(0);
        e.preventDefault();
      }
      if (e.key === "Enter") {
        const currentSel = { nodeIdx: focusedNodeIdx, portIdx: focusedPortIdx };
        if (!connectingFrom) {
          setConnectingFrom(currentSel);
        } else {
          const src = connectingFrom;
          const tgt = currentSel;
          const srcNode = nodes[src.nodeIdx];
          const tgtNode = nodes[tgt.nodeIdx];
          const srcPort = srcNode.ports[src.portIdx];
          const tgtPort = tgtNode.ports[tgt.portIdx];
          if (onConnect && srcNode.id !== tgtNode.id) {
            onConnect(srcNode.id, srcPort, tgtNode.id, tgtPort);
          }
          setConnectingFrom(null);
        }
        e.preventDefault();
      }
    },
    [focusedNodeIdx, focusedPortIdx, nodes, connectingFrom, onConnect]
  );

  const centerOnSelection = useCallback(() => {
    const node = nodes[focusedNodeIdx];
    // Center node in a 800x600 viewport approximation
    const cx = 400; 
    const cy = 300;
    setViewport({ x: cx - node.x, y: cy - node.y, scale: 1 });
  }, [nodes, focusedNodeIdx]);

  return (
    <div
      ref={canvasRef}
      role="application"
      aria-label="Flow editor canvas"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative h-[60vh] w-full overflow-hidden outline-none focus:ring-2 focus:ring-indigo-500 cursor-grab ${isPanning ? "cursor-grabbing" : ""} ${zen ? "bg-white" : "bg-zinc-100"}`}
      data-canvas="true"
    >
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button onClick={centerOnSelection} className="rounded-md border bg-white px-2 py-1 text-xs shadow-sm">Center</button>
        <div className="rounded-md border bg-white px-2 py-1 text-xs shadow-sm">{Math.round(viewport.scale * 100)}%</div>
      </div>
      
      <div 
        className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out will-change-transform"
        style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}
      >
        {nodes.map((n, idx) => (
          <div
            key={n.id}
            className={`absolute rounded-md border bg-white px-3 py-2 shadow-sm ${
              idx === focusedNodeIdx ? "ring-2 ring-indigo-500" : "ring-0"
            }`}
            style={{ left: n.x, top: n.y }}
            aria-label={`Node ${n.label}`}
          >
            <div className="font-medium text-neutral-800">{n.label}</div>
            <div className="mt-2 flex gap-2">
              {n.ports.map((p, pIdx) => (
                <span
                  key={`${n.id}:${p}`}
                  className={`inline-block rounded-full border px-2 py-0.5 text-xs ${
                    idx === focusedNodeIdx && pIdx === focusedPortIdx ? "border-indigo-500" : "border-neutral-300"
                  }`}
                  aria-label={`Port ${p}`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-2 bottom-2 h-32 w-48 rounded bg-white/90 border shadow-md p-1 pointer-events-none">
        <div className="relative h-full w-full bg-neutral-100 overflow-hidden">
          {nodes.map((n, idx) => (
            <div
              key={`mini-${n.id}`}
              className={`absolute h-2 w-3 ${idx === focusedNodeIdx ? "bg-indigo-500" : "bg-neutral-400"}`}
              style={{ left: n.x / 10, top: n.y / 10 }}
            />
          ))}
          <div
            className="absolute border-2 border-indigo-500 bg-indigo-500/10"
            style={{ 
              left: -viewport.x / 10 / viewport.scale, 
              top: -viewport.y / 10 / viewport.scale, 
              width: canvasSize.w / 10 / viewport.scale, 
              height: canvasSize.h / 10 / viewport.scale 
            }}
          />
        </div>
      </div>
    </div>
  );
}
