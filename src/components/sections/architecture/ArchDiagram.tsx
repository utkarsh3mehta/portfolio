"use client";

import { useEffect, useRef, useState } from "react";
import type { ArchNode } from "@/data/case-studies";

interface Props {
  nodes: ArchNode[];
}

const TYPE_COLORS: Record<ArchNode["type"], string> = {
  service:  "var(--accent)",
  store:    "#5A8A6A",
  queue:    "#6A5A8A",
  client:   "var(--fg-muted)",
  external: "var(--fg-dim)",
};

const TYPE_LABELS: Record<ArchNode["type"], string> = {
  service:  "Service",
  store:    "Data Store",
  queue:    "Queue / Bus",
  client:   "Client",
  external: "External",
};

export default function ArchDiagram({ nodes }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Layout: arrange nodes in a roughly left-to-right flow */
  const NODE_W = 140;
  const NODE_H = 52;
  const COLS = Math.min(nodes.length, 4);
  const SVG_W = COLS * (NODE_W + 60) + 60;
  const ROW_H = 120;
  const ROWS = Math.ceil(nodes.length / COLS);
  const SVG_H = ROWS * ROW_H + 40;

  const positions = nodes.map((_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    return {
      x: 60 + col * (NODE_W + 60),
      y: 40 + row * ROW_H,
    };
  });

  /* Animate edges on mount */
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  /* Edge paths between connected nodes */
  const edges: Array<{ from: string; to: string; fromPos: { x: number; y: number }; toPos: { x: number; y: number } }> = [];
  nodes.forEach((node, fromIdx) => {
    node.connects.forEach(toId => {
      const toIdx = nodes.findIndex(n => n.id === toId);
      if (toIdx === -1) return;
      edges.push({
        from: node.id,
        to: toId,
        fromPos: positions[fromIdx],
        toPos: positions[toIdx],
      });
    });
  });

  const activeNode = active ? nodes.find(n => n.id === active) : null;

  return (
    <div ref={containerRef} style={{ width: "100%", overflowX: "auto" }}>
      <div
        style={{
          background: "var(--bg-subtle)",
          border: "1px solid var(--border)",
          borderRadius: "2px",
          padding: "1.5rem",
          minWidth: SVG_W + 40,
        }}
      >
        {/* Legend */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {(Object.entries(TYPE_COLORS) as [ArchNode["type"], string][]).filter(([type]) => nodes.some(n => n.type === type)).map(([type, color]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--fg-dim)", letterSpacing: "0.06em" }}>{TYPE_LABELS[type]}</span>
            </div>
          ))}
        </div>

        {/* SVG Diagram */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width={SVG_W}
          height={SVG_H}
          style={{ display: "block", overflow: "visible" }}
          aria-label="Architecture diagram"
          role="img"
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--border-strong)" />
            </marker>
            <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--accent)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const fromCenter = { x: edge.fromPos.x + NODE_W / 2, y: edge.fromPos.y + NODE_H / 2 };
            const toCenter   = { x: edge.toPos.x   + NODE_W / 2, y: edge.toPos.y   + NODE_H / 2 };
            const isActive = active === edge.from || active === edge.to;

            /* Cubic bezier for smooth curves */
            const dx = toCenter.x - fromCenter.x;
            const dy = toCenter.y - fromCenter.y;
            const cx1 = fromCenter.x + dx * 0.5;
            const cy1 = fromCenter.y;
            const cx2 = toCenter.x - dx * 0.5;
            const cy2 = toCenter.y;
            const d = `M ${fromCenter.x} ${fromCenter.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toCenter.x} ${toCenter.y}`;
            const pathLen = Math.sqrt(dx * dx + dy * dy);

            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke={isActive ? "var(--accent)" : "var(--border-strong)"}
                  strokeWidth={isActive ? 1.5 : 1}
                  markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                  strokeDasharray={animated ? "none" : pathLen}
                  strokeDashoffset={animated ? 0 : pathLen}
                  style={{
                    transition: `stroke-dashoffset 0.8s ease ${i * 0.05}s, stroke 0.3s ease, stroke-width 0.3s ease`,
                    opacity: active && !isActive ? 0.25 : 1,
                  }}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const pos = positions[i];
            const color = TYPE_COLORS[node.type];
            const isActive = active === node.id;
            const isConnected = active ? (
              nodes.find(n => n.id === active)?.connects.includes(node.id) ||
              nodes.some(n => n.id === node.id && n.connects.includes(active))
            ) : false;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: "pointer" }}
                onClick={() => setActive(active === node.id ? null : node.id)}
                role="button"
                aria-label={`${node.label}: ${node.description}`}
                tabIndex={0}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(active === node.id ? null : node.id); } }}
              >
                {/* Node background */}
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={2}
                  fill={isActive ? color : "var(--bg)"}
                  stroke={isActive ? color : (isConnected ? color : "var(--border-strong)")}
                  strokeWidth={isActive ? 2 : 1}
                  style={{ transition: "all 0.3s ease", opacity: active && !isActive && !isConnected ? 0.4 : 1 }}
                />

                {/* Type indicator */}
                <rect
                  width={3}
                  height={NODE_H}
                  rx={1}
                  fill={color}
                  opacity={isActive ? 0 : 0.6}
                />

                {/* Label */}
                <text
                  x={NODE_W / 2}
                  y={NODE_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isActive ? "var(--bg)" : "var(--fg)"}
                  fontSize={11}
                  fontFamily="var(--font-sans)"
                  fontWeight={500}
                  style={{ transition: "fill 0.3s ease", userSelect: "none", pointerEvents: "none" }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Active node description */}
        {activeNode && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem 1.25rem",
              background: "var(--bg)",
              border: `1px solid ${TYPE_COLORS[activeNode.type]}`,
              borderRadius: "2px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--fg)" }}>
                {activeNode.label}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: TYPE_COLORS[activeNode.type], letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {TYPE_LABELS[activeNode.type]}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", lineHeight: 1.6 }}>
              {activeNode.description}
            </p>
            {activeNode.connects.length > 0 && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--fg-dim)", marginTop: "0.5rem" }}>
                → {activeNode.connects.map(id => nodes.find(n => n.id === id)?.label).filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        )}

        {!activeNode && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", marginTop: "1rem", textAlign: "center" }}>
            Click any node to inspect
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
