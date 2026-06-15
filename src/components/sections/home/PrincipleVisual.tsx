"use client";

import { useEffect, useRef } from "react";
import type { Principle } from "@/data/principles";

interface Props {
  type: Principle["visualType"];
}

export default function PrincipleVisual({ type }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    import("gsap").then(({ gsap }) => {
      if (type === "compound") {
        /* Exponential bars growing */
        const bars = el.querySelectorAll<SVGElement>(".bar");
        gsap.fromTo(bars, { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, stagger: 0.1, duration: 1, ease: "expo.out", repeat: -1, repeatDelay: 2 });
      } else if (type === "latency") {
        /* Pulse wave */
        const dots = el.querySelectorAll<SVGElement>(".dot");
        gsap.fromTo(dots, { x: -60, opacity: 0 }, { x: 60, opacity: 1, stagger: 0.15, duration: 1.5, ease: "sine.inOut", repeat: -1, yoyo: true });
      } else if (type === "interface") {
        /* Correct path vs incorrect path */
        const paths = el.querySelectorAll<SVGElement>(".path-anim");
        gsap.fromTo(paths, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", repeat: -1, repeatDelay: 1.5, stagger: 0.5 });
      } else if (type === "constraint") {
        /* Box shrinking → better solution */
        const box = el.querySelector<SVGElement>(".constraint-box");
        if (box) gsap.fromTo(box, { scale: 1.3, opacity: 0.5, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: 1.5, ease: "expo.out", repeat: -1, repeatDelay: 1.5 });
      } else if (type === "complexity") {
        /* Lines accumulating */
        const lines = el.querySelectorAll<SVGElement>(".complexity-line");
        gsap.fromTo(lines, { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.2, duration: 0.6, ease: "expo.out", repeat: -1, repeatDelay: 1.5 });
      } else if (type === "failure") {
        /* System pulse → flatline → recovery */
        const pulse = el.querySelector<SVGElement>(".pulse-path");
        if (pulse) {
          gsap.fromTo(pulse, { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 2, ease: "none", repeat: -1, repeatDelay: 0.5 });
        }
      }
    });
  }, [type]);

  const SIZE = 280;
  const H = 200;

  if (type === "compound") {
    const values = [1, 2, 4, 8, 16, 32, 64];
    const maxV = 64;
    const barW = 24;
    const gap = 12;
    const total = values.length * (barW + gap);
    const offsetX = (SIZE - total) / 2;
    return (
      <svg ref={ref} viewBox={`0 0 ${SIZE} ${H}`} width={SIZE} height={H} aria-hidden="true">
        {values.map((v, i) => {
          const bh = (v / maxV) * (H - 40);
          return (
            <rect
              key={i}
              className="bar"
              x={offsetX + i * (barW + gap)}
              y={H - 20 - bh}
              width={barW}
              height={bh}
              fill={i === values.length - 1 ? "var(--accent)" : "var(--border-strong)"}
              rx={2}
            />
          );
        })}
        <text x={SIZE / 2} y={H - 4} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--fg-dim)">
          COMPOUNDING RETURNS
        </text>
      </svg>
    );
  }

  if (type === "latency") {
    return (
      <svg ref={ref} viewBox={`0 0 ${SIZE} ${H}`} width={SIZE} height={H} aria-hidden="true">
        {/* Timeline */}
        <line x1={40} y1={H / 2} x2={SIZE - 40} y2={H / 2} stroke="var(--border-strong)" strokeWidth={1} />
        {/* Dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} className="dot" cx={80 + i * 30} cy={H / 2} r={4} fill={i === 0 ? "var(--accent)" : "var(--border-strong)"} />
        ))}
        <text x={SIZE / 2} y={H - 4} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--fg-dim)">
          EVERY MS IS A DECISION
        </text>
      </svg>
    );
  }

  if (type === "interface") {
    return (
      <svg ref={ref} viewBox={`0 0 ${SIZE} ${H}`} width={SIZE} height={H} aria-hidden="true">
        {/* Wrong path */}
        <path
          className="path-anim"
          d="M 40 80 Q 100 20 160 100 Q 200 140 240 60"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={1.5}
          strokeDasharray={100}
          strokeDashoffset={100}
          strokeLinecap="round"
        />
        {/* Right path */}
        <path
          className="path-anim"
          d="M 40 120 L 240 120"
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeDasharray={200}
          strokeDashoffset={200}
          strokeLinecap="round"
        />
        <text x={42} y={76} fontSize={9} fontFamily="var(--font-mono)" fill="var(--fg-dim)">misuse</text>
        <text x={42} y={136} fontSize={9} fontFamily="var(--font-mono)" fill="var(--accent)">intended path</text>
        <text x={SIZE / 2} y={H - 4} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--fg-dim)">
          INTERFACES TEACH BEHAVIOR
        </text>
      </svg>
    );
  }

  if (type === "constraint") {
    return (
      <svg ref={ref} viewBox={`0 0 ${SIZE} ${H}`} width={SIZE} height={H} aria-hidden="true">
        {/* Outer box */}
        <rect x={60} y={30} width={160} height={120} rx={2} fill="none" stroke="var(--border-strong)" strokeWidth={1} strokeDasharray="4 3" />
        {/* Inner constraint box */}
        <rect className="constraint-box" x={90} y={55} width={100} height={70} rx={2} fill="none" stroke="var(--accent)" strokeWidth={2} />
        {/* Solution dot */}
        <circle cx={140} cy={90} r={6} fill="var(--accent)" />
        <text x={40} y={175} fontSize={9} fontFamily="var(--font-mono)" fill="var(--fg-dim)">
          CONSTRAINT FORCES DECISION
        </text>
      </svg>
    );
  }

  if (type === "complexity") {
    const lines = [
      "const handler = (req, res) => {",
      "  if (cfg.v1) {",
      "    if (legacy) {",
      "      // 47 lines...",
      "    }",
      "  }",
      "}",
    ];
    return (
      <svg ref={ref} viewBox={`0 0 ${SIZE} ${H}`} width={SIZE} height={H} aria-hidden="true">
        {lines.map((line, i) => (
          <text
            key={i}
            className="complexity-line"
            x={20 + i * 4}
            y={30 + i * 22}
            fontSize={10}
            fontFamily="var(--font-mono)"
            fill={i > 3 ? "var(--border-strong)" : "var(--fg-muted)"}
            opacity={0}
          >
            {line}
          </text>
        ))}
        <text x={SIZE / 2} y={H - 4} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--fg-dim)">
          COMPLEXITY ACCUMULATES
        </text>
      </svg>
    );
  }

  if (type === "failure") {
    return (
      <svg ref={ref} viewBox={`0 0 ${SIZE} ${H}`} width={SIZE} height={H} aria-hidden="true">
        {/* Heartbeat then flatline */}
        <path
          className="pulse-path"
          d={`M 20 90 L 60 90 L 75 50 L 90 130 L 105 70 L 120 90 L 150 90 L 160 90 L 260 90`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={200}
          strokeDashoffset={200}
        />
        <text x={SIZE / 2} y={H - 4} textAnchor="middle" fontSize={9} fontFamily="var(--font-mono)" fill="var(--fg-dim)">
          FAILURE IS A SPECIFICATION
        </text>
      </svg>
    );
  }

  return null;
}
