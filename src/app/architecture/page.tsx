"use client";

import { useEffect, useRef, useState } from "react";
import { CASE_STUDIES } from "@/data/case-studies";
import ArchDiagram from "@/components/sections/architecture/ArchDiagram";

export default function ArchitecturePage() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".arch-reveal").forEach((item) => {
        gsap.fromTo(item, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
      });
    });
  }, []);

  const current = CASE_STUDIES[active];

  return (
    <div ref={ref} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* Hero */}
      <section style={{ padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p className="arch-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)", opacity: 0 }}>
            Architecture Gallery
          </p>
          <h1 className="arch-reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "20ch", opacity: 0 }}>
            Every diagram is interactive.
          </h1>
          <p className="arch-reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--fg-muted)", marginTop: "1.5rem", maxWidth: "48ch", lineHeight: 1.7, opacity: 0 }}>
            Click nodes to inspect them. Connections highlight on hover. Each architecture reflects the constraints that shaped it.
          </p>
        </div>
      </section>

      {/* System selector + diagram */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* System tabs */}
          <div
            className="arch-reveal"
            role="tablist"
            aria-label="Select system"
            style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "clamp(3rem, 6vw, 5rem)", overflowX: "auto", opacity: 0 }}
          >
            {CASE_STUDIES.map((cs, i) => (
              <button
                key={cs.slug}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-sm)",
                  fontWeight: active === i ? 500 : 400,
                  color: active === i ? "var(--fg)" : "var(--fg-muted)",
                  background: "none",
                  border: "none",
                  borderBottom: active === i ? "2px solid var(--accent)" : "2px solid transparent",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  marginBottom: "-1px",
                }}
              >
                {cs.title}
              </button>
            ))}
          </div>

          {/* Diagram */}
          <div className="arch-reveal" style={{ opacity: 0 }}>
            {/* System header */}
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400, color: "var(--fg)", marginBottom: "0.5rem" }}>
                {current.title}
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", maxWidth: "52ch" }}>
                {current.decision}
              </p>
            </div>

            <ArchDiagram nodes={current.architecture} />
          </div>

          {/* Key decisions for current system */}
          <div className="arch-reveal" style={{ marginTop: "clamp(4rem, 8vw, 6rem)", opacity: 0 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              Key architectural decisions
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)" }}>
              {current.tradeoffs.map((t, i) => (
                <div key={i} style={{ background: "var(--bg)", padding: "clamp(1.25rem, 2.5vw, 2rem)" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--accent)" }}>{t.chose}</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>over</span>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", textDecoration: "line-through" }}>{t.over}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.65 }}>{t.because}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
