"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CASE_STUDIES } from "@/data/case-studies";

export default function CaseStudiesPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".cs-reveal").forEach((item) => {
        gsap.fromTo(
          item,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } }
        );
      });
    });
  }, []);

  return (
    <div ref={ref} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* Hero */}
      <section
        style={{
          padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p
            className="cs-reveal"
            style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)", opacity: 0 }}
          >
            Case Studies
          </p>
          <h1
            className="cs-reveal"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "20ch", opacity: 0 }}
          >
            Five systems. Real constraints. Honest failures.
          </h1>
        </div>
      </section>

      {/* List */}
      <section style={{ padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {CASE_STUDIES.map((cs, i) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="cs-reveal"
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "clamp(1.5rem, 3vw, 3rem)",
                alignItems: "start",
                padding: "clamp(2rem, 4vw, 3rem) 0",
                borderBottom: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                opacity: 0,
                transition: "padding-left 0.3s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "1rem"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
            >
              {/* Index */}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--fg-dim)",
                  paddingTop: "0.35rem",
                  minWidth: "2rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", background: "var(--bg-raised)", padding: "0.2rem 0.6rem", borderRadius: "2px" }}>
                    {cs.domain}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>
                    {cs.year}
                  </span>
                </div>
                <h2
                  style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.01em", color: "var(--fg)", marginBottom: "0.75rem" }}
                >
                  {cs.title}
                </h2>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.6, maxWidth: "55ch" }}>
                  {cs.tagline}
                </p>

                {/* Key metric */}
                <div style={{ marginTop: "1.25rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  {cs.outcome.metrics.slice(0, 3).map(m => (
                    <div key={m.label}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 400, color: "var(--accent)" }}>{m.value}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "var(--fg-dim)", marginTop: "0.35rem", flexShrink: 0 }}>
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
