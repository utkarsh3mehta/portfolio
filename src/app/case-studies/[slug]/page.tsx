"use client";

import { use, useEffect, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES } from "@/data/case-studies";
import ArchDiagram from "@/components/sections/architecture/ArchDiagram";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CaseStudyPage({ params }: PageProps) {
  const { slug } = use(params);
  const cs = CASE_STUDIES.find(c => c.slug === slug);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cs) return;
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".cs-body-reveal").forEach((item) => {
        gsap.fromTo(
          item,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } }
        );
      });
    });
  }, [cs]);

  if (!cs) return notFound();

  const csIndex = CASE_STUDIES.findIndex(c => c.slug === cs.slug);
  const next = CASE_STUDIES[(csIndex + 1) % CASE_STUDIES.length];

  return (
    <div ref={ref} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* ── Hero ─────────────────────────────────────── */}
      <header
        style={{
          padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
            <Link
              href="/case-studies"
              style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Case Studies
            </Link>
          </nav>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", background: "var(--bg-raised)", padding: "0.2rem 0.6rem", borderRadius: "2px" }}>{cs.domain}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>{cs.year}</span>
          </div>

          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "20ch", marginBottom: "1.5rem" }}>
            {cs.title}
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--fg-muted)", lineHeight: 1.6, maxWidth: "52ch" }}>
            {cs.tagline}
          </p>

          {/* Metrics row */}
          <div style={{ display: "flex", gap: "clamp(1.5rem, 3vw, 3rem)", flexWrap: "wrap", marginTop: "clamp(2.5rem, 5vw, 4rem)", paddingTop: "clamp(2rem, 4vw, 3rem)", borderTop: "1px solid var(--border)" }}>
            {cs.outcome.metrics.map(m => (
              <div key={m.label}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontWeight: 400, color: "var(--accent)", lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", marginTop: "0.3rem" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────── */}
      <article style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>

          {/* Problem / Context / Constraint */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", marginBottom: "clamp(4rem, 8vw, 7rem)" }}>
            {[{ label: "Problem", content: cs.problem }, { label: "Context", content: cs.context }, { label: "Constraint", content: cs.constraint }].map(({ label, content }) => (
              <div key={label} className="cs-body-reveal" style={{ background: "var(--bg)", padding: "clamp(1.5rem, 3vw, 2.5rem)", opacity: 0 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.75 }}>{content}</p>
              </div>
            ))}
          </div>

          {/* Decision + Tradeoffs */}
          <div className="cs-body-reveal" style={{ marginBottom: "clamp(4rem, 8vw, 7rem)", opacity: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(2rem, 4vw, 4rem)", alignItems: "start" }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.25rem" }}>The decision</p>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400, lineHeight: 1.1, color: "var(--fg)", marginBottom: "1.5rem" }}>What we chose and why.</h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--fg-muted)", lineHeight: 1.75 }}>{cs.decision}</p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Tradeoffs</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {cs.tradeoffs.map((t, i) => (
                    <div key={i} style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--accent)" }}>{t.chose}</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>over</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", textDecoration: "line-through" }}>{t.over}</span>
                      </div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.6 }}>{t.because}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Architecture */}
          <div className="cs-body-reveal" style={{ marginBottom: "clamp(4rem, 8vw, 7rem)", opacity: 0 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Architecture</p>
            <ArchDiagram nodes={cs.architecture} />
          </div>

          {/* Failure + Iteration */}
          <div className="cs-body-reveal" style={{ marginBottom: "clamp(4rem, 8vw, 7rem)", opacity: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)" }}>
              <div style={{ background: "var(--bg)", padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>The failure</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg)", lineHeight: 1.75, marginBottom: "1rem", fontWeight: 500 }}>{cs.failure.what}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--fg-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>DISCOVERED — </span>{cs.failure.discovered}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", lineHeight: 1.6 }}>
                  <span style={{ color: "var(--fg-dim)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>IMPACT — </span>{cs.failure.impact}
                </p>
              </div>
              <div style={{ background: "var(--bg-subtle)", padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Iteration</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.75 }}>{cs.iteration}</p>
              </div>
            </div>
          </div>

          {/* Outcome */}
          <div className="cs-body-reveal" style={{ marginBottom: "clamp(4rem, 8vw, 7rem)", opacity: 0 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Outcome</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 400, lineHeight: 1.1, color: "var(--fg)", maxWidth: "30ch", marginBottom: "2rem" }}>{cs.outcome.headline}</h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--fg-muted)", lineHeight: 1.75, maxWidth: "60ch" }}>{cs.outcome.businessEffect}</p>
          </div>

          {/* Lessons */}
          <div className="cs-body-reveal" style={{ opacity: 0 }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Lessons</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {cs.lessons.map((lesson, i) => (
                <div key={i} style={{ display: "flex", gap: "1.5rem", padding: "1.25rem 0", borderBottom: "1px solid var(--border)", alignItems: "start" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--accent)", paddingTop: "0.3rem", flexShrink: 0, minWidth: "1.5rem" }}>{String(i + 1).padStart(2, "0")}</span>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--fg)", lineHeight: 1.65 }}>{lesson}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* ── Footer nav ───────────────────────────────── */}
      <nav aria-label="Study navigation" style={{ padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 5rem)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <Link href="/case-studies" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 3L5 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All case studies
          </Link>
          <Link href={`/case-studies/${next.slug}`} style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            Next: {next.title}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </nav>
    </div>
  );
}
