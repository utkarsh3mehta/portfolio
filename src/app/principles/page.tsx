"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PRINCIPLES } from "@/data/principles";
import PrincipleVisual from "@/components/sections/home/PrincipleVisual";

export default function PrinciplesPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".p-reveal").forEach((item) => {
        gsap.fromTo(item, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
      });
    });
  }, []);

  return (
    <div ref={ref} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* Hero */}
      <section style={{ padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p className="p-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)", opacity: 0 }}>
            Engineering Principles
          </p>
          <h1 className="p-reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "22ch", opacity: 0 }}>
            Six things I've learned by getting them wrong.
          </h1>
        </div>
      </section>

      {/* Principles */}
      <section style={{ padding: "clamp(2rem, 4vw, 3rem) 0" }}>
        {PRINCIPLES.map((p, i) => (
          <div
            key={p.id}
            className="p-reveal"
            style={{
              borderBottom: "1px solid var(--border)",
              padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 5rem)",
              opacity: 0,
            }}
          >
            <div style={{ maxWidth: 1440, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}>

                {/* Text */}
                <div>
                  {/* Index */}
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", marginBottom: "1.5rem" }}>
                    {String(i + 1).padStart(2, "0")} / {String(PRINCIPLES.length).padStart(2, "0")}
                  </p>

                  {/* Headline */}
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 400, lineHeight: 1.05, color: "var(--fg)", marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
                    {p.headline}
                  </h2>

                  {/* Subtext */}
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontStyle: "italic", color: "var(--fg-muted)", marginBottom: "1.5rem" }}>
                    {p.subtext}
                  </p>

                  {/* Elaboration */}
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--fg-muted)", lineHeight: 1.75, maxWidth: "48ch", marginBottom: "2rem" }}>
                    {p.elaboration}
                  </p>

                  {/* Source project */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Proven in
                    </span>
                    <Link
                      href={`/case-studies/${p.project}`}
                      style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                    >
                      {p.projectLabel}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Link>
                  </div>

                  {/* Lesson */}
                  <blockquote
                    style={{
                      marginTop: "2rem",
                      paddingLeft: "1.25rem",
                      borderLeft: "2px solid var(--accent)",
                      fontFamily: "var(--font-serif)",
                      fontSize: "var(--text-base)",
                      fontStyle: "italic",
                      color: "var(--fg-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {p.lesson}
                  </blockquote>
                </div>

                {/* Visual */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PrincipleVisual type={p.visualType} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
