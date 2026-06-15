"use client";

import { useEffect, useRef } from "react";

const REPOS = [
  {
    name: "app-lab",
    description: "A React-like framework built for teaching. Under 1000 lines. No build step. Used to teach 180+ students component-based thinking.",
    language: "TypeScript",
    stars: 234,
    forks: 41,
    topics: ["education", "framework", "react-inspired", "browser"],
    updated: "2024-01",
  },
  {
    name: "distributed-sync-kit",
    description: "Patterns for building offline-first distributed applications. Content-addressed state, CRDT-inspired conflict resolution, jittered reconnection.",
    language: "TypeScript",
    stars: 891,
    forks: 127,
    topics: ["distributed-systems", "offline-first", "sync"],
    updated: "2024-03",
  },
  {
    name: "event-sourcing-ts",
    description: "Type-safe event sourcing primitives for TypeScript. Idempotent handlers, snapshot support, projection builders.",
    language: "TypeScript",
    stars: 412,
    forks: 68,
    topics: ["event-sourcing", "cqrs", "typescript"],
    updated: "2024-02",
  },
  {
    name: "telemetry-adapters",
    description: "Normalize heterogeneous machine telemetry into a common event schema. Used in the Industrial 3D Platform project.",
    language: "TypeScript",
    stars: 156,
    forks: 23,
    topics: ["telemetry", "iot", "manufacturing"],
    updated: "2023-11",
  },
  {
    name: "semantic-content-graph",
    description: "Knowledge graph primitives for content-addressed semantic search. Used in UnTaboo to bypass keyword-based content filters.",
    language: "TypeScript",
    stars: 203,
    forks: 31,
    topics: ["knowledge-graph", "semantic-search", "content"],
    updated: "2024-01",
  },
];

const CONTRIBUTIONS = [
  { project: "Prisma", contribution: "Added advisory lock support for concurrent migration safety", pr: "#4821", merged: "2023" },
  { project: "Next.js", contribution: "Edge runtime streaming improvements for long-running AI responses", pr: "#52341", merged: "2024" },
  { project: "Zod", contribution: "Performance optimization for deeply nested schema validation", pr: "#2156", merged: "2023" },
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Rust: "#CE422B",
  Go: "#00ADD8",
};

export default function OpenSourcePage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".os-reveal").forEach((item) => {
        gsap.fromTo(item, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
      });
    });
  }, []);

  const totalStars = REPOS.reduce((sum, r) => sum + r.stars, 0);

  return (
    <div ref={ref} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* Hero */}
      <section style={{ padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p className="os-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)", opacity: 0 }}>
            Open Source
          </p>
          <h1 className="os-reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "22ch", marginBottom: "1.5rem", opacity: 0 }}>
            Code that lives past the project.
          </h1>

          {/* Stats row */}
          <div className="os-reveal" style={{ display: "flex", gap: "clamp(2rem, 4vw, 4rem)", flexWrap: "wrap", marginTop: "clamp(2rem, 4vw, 3rem)", opacity: 0 }}>
            {[
              { label: "Repositories", value: REPOS.length.toString() },
              { label: "Stars", value: `${totalStars.toLocaleString()}+` },
              { label: "Contributions", value: `${CONTRIBUTIONS.length}+` },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400, color: "var(--accent)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", marginTop: "0.3rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Repos */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p className="os-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2rem", opacity: 0 }}>
            Repositories
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)" }}>
            {REPOS.map(repo => (
              <div
                key={repo.name}
                className="os-reveal"
                style={{ background: "var(--bg)", padding: "clamp(1.5rem, 2.5vw, 2rem)", opacity: 0, transition: "background 0.2s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
                  <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--accent)" }}>
                    {repo.name}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--fg-dim)" }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{repo.stars.toLocaleString()}</span>
                  </div>
                </div>

                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.65, marginBottom: "1rem" }}>
                  {repo.description}
                </p>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {repo.topics.map(t => (
                    <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", background: "var(--bg-raised)", padding: "0.15rem 0.5rem", borderRadius: "2px" }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ display: "block", width: 10, height: 10, borderRadius: "50%", background: LANGUAGE_COLORS[repo.language] ?? "var(--fg-dim)" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>{repo.language}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>
                    Updated {repo.updated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributions */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p className="os-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2rem", opacity: 0 }}>
            Open Source Contributions
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {CONTRIBUTIONS.map(c => (
              <div
                key={c.pr}
                className="os-reveal"
                style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", gap: "clamp(1rem, 2vw, 2rem)", padding: "1.5rem 0", borderBottom: "1px solid var(--border)", alignItems: "center", opacity: 0 }}
              >
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-base)", fontWeight: 400, color: "var(--accent)" }}>{c.project}</span>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.5 }}>{c.contribution}</p>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>{c.pr}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>{c.merged}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
