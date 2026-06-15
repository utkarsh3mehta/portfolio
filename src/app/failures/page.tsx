"use client";

import { useEffect, useRef, useState } from "react";
import { FAILURES, type Failure } from "@/data/failures";

const CATEGORY_LABELS: Record<Failure["category"], string> = {
  abstraction:  "Wrong Abstraction",
  migration:    "Migration",
  performance:  "Performance",
  production:   "Production",
  assumption:   "Wrong Assumption",
  debt:         "Technical Debt",
  monitoring:   "Monitoring",
};

const SEVERITY_COLORS: Record<Failure["severity"], string> = {
  low:    "#5A8A6A",
  medium: "#8A7A3A",
  high:   "#8A4A4A",
};

export default function FailuresPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<Failure["category"] | "all">("all");

  useEffect(() => {
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".f-reveal").forEach((item) => {
        gsap.fromTo(item, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
      });
    });
  }, []);

  const categories = Array.from(new Set(FAILURES.map(f => f.category)));
  const filtered = filter === "all" ? FAILURES : FAILURES.filter(f => f.category === filter);

  return (
    <div ref={ref} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* Hero */}
      <section style={{ padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p className="f-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)", opacity: 0 }}>
            Failure Gallery
          </p>
          <h1 className="f-reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "22ch", marginBottom: "1.5rem", opacity: 0 }}>
            Seven things that went wrong.
          </h1>
          <p className="f-reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--fg-muted)", maxWidth: "52ch", lineHeight: 1.7, opacity: 0 }}>
            Production incidents, wrong models, silent failures. Written without corporate language. These are the decisions that cost the most and taught the most.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="f-reveal" style={{ padding: "1.5rem clamp(1.25rem, 4vw, 5rem)", borderBottom: "1px solid var(--border)", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", opacity: 0 }}>
        <button
          onClick={() => setFilter("all")}
          style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: filter === "all" ? 500 : 400, color: filter === "all" ? "var(--fg)" : "var(--fg-muted)", background: filter === "all" ? "var(--bg-raised)" : "none", border: "1px solid var(--border)", padding: "0.3rem 0.8rem", borderRadius: "2px", cursor: "pointer", transition: "all 0.2s" }}
        >
          All ({FAILURES.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: filter === cat ? 500 : 400, color: filter === cat ? "var(--fg)" : "var(--fg-muted)", background: filter === cat ? "var(--bg-raised)" : "none", border: "1px solid var(--border)", padding: "0.3rem 0.8rem", borderRadius: "2px", cursor: "pointer", transition: "all 0.2s" }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Failures list */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 5rem)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>
          {filtered.map((failure, i) => (
            <article
              key={failure.id}
              className="f-reveal"
              style={{
                borderBottom: "1px solid var(--border)",
                opacity: 0,
              }}
            >
              <button
                onClick={() => setExpanded(expanded === failure.id ? null : failure.id)}
                aria-expanded={expanded === failure.id}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  gap: "clamp(1rem, 2vw, 2rem)",
                  alignItems: "center",
                }}
              >
                {/* Index */}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", minWidth: "2rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Title + meta */}
                <div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", background: "var(--bg-raised)", padding: "0.15rem 0.5rem", borderRadius: "2px" }}>
                      {CATEGORY_LABELS[failure.category]}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>
                      {failure.year}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 400, color: "var(--fg)", lineHeight: 1.2 }}>
                    {failure.title}
                  </h2>
                </div>

                {/* Severity */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: SEVERITY_COLORS[failure.severity] }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", textTransform: "uppercase" }}>
                    {failure.severity}
                  </span>
                </div>

                {/* Chevron */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "var(--fg-muted)", transition: "transform 0.3s ease", transform: expanded === failure.id ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                  <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Expanded content */}
              {expanded === failure.id && (
                <div
                  style={{
                    paddingBottom: "clamp(2rem, 4vw, 3rem)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                    gap: "clamp(2rem, 4vw, 4rem)",
                    animation: "fadeIn 0.4s ease",
                  }}
                >
                  {/* Left: narrative */}
                  <div style={{ paddingLeft: "clamp(3rem, 4vw, 4rem)" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>What happened</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg)", lineHeight: 1.75, marginBottom: "1.5rem" }}>{failure.what}</p>

                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Context</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.75 }}>{failure.context}</p>
                  </div>

                  {/* Right: consequence + lessons */}
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Consequence</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.75, marginBottom: "1.5rem" }}>{failure.consequence}</p>

                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>What changed</p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.75, marginBottom: "1.5rem" }}>{failure.changed}</p>

                    <blockquote style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--accent)", fontFamily: "var(--font-serif)", fontSize: "var(--text-base)", fontStyle: "italic", color: "var(--fg)", lineHeight: 1.6 }}>
                      {failure.lesson}
                    </blockquote>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
