"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { METRICS } from "@/data/metrics";
import { CASE_STUDIES } from "@/data/case-studies";

export default function HomeExperience() {
  const heroRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<HTMLSpanElement[]>([]);
  const initiated = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;

    let gsap: typeof import("gsap").gsap;
    let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;

    import("gsap").then(async ({ gsap: g }) => {
      const { ScrollTrigger: ST } = await import("gsap/ScrollTrigger");
      gsap = g;
      ScrollTrigger = ST;
      gsap.registerPlugin(ScrollTrigger);

      /* ── Opening hero animation ─────────────────────────────── */
      const hero = heroRef.current;
      if (!hero) return;

      const words = hero.querySelectorAll<HTMLElement>(".hero-word");
      const sub = hero.querySelector<HTMLElement>(".hero-sub");

      gsap.fromTo(
        words,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.2,
        }
      );

      if (sub) {
        gsap.fromTo(
          sub,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "expo.out", delay: 1.0 }
        );
      }

      /* ── Metrics scroll animation ───────────────────────────── */
      const metricsEl = metricsRef.current;
      if (!metricsEl) return;

      const metricItems = metricsEl.querySelectorAll<HTMLElement>(".metric-item");

      metricItems.forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              once: true,
            },
            delay: i * 0.05,
          }
        );
      });

      /* ── Number counters ────────────────────────────────────── */
      countersRef.current.forEach((counter, i) => {
        if (!counter) return;
        const raw = counter.getAttribute("data-value") || "0";
        const target = parseFloat(raw);
        const isDecimal = raw.includes(".");

        gsap.fromTo(
          { v: 0 },
          { v: target },
          {
            duration: 2.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: counter,
              start: "top 85%",
              once: true,
            },
            onUpdate: function () {
              const v = (this as { targets: () => { v: number }[] }).targets()[0].v;
              counter.textContent = isDecimal ? v.toFixed(1) : Math.round(v).toLocaleString();
            },
          }
        );
      });

      /* ── Narrative section ──────────────────────────────────── */
      const narRows = document.querySelectorAll<HTMLElement>(".nar-row");
      narRows.forEach((row) => {
        gsap.fromTo(
          row,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      /* ── Case study teaser cards ────────────────────────────── */
      const cards = document.querySelectorAll<HTMLElement>(".cs-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      /* ── Section reveals ────────────────────────────────────── */
      const reveals = document.querySelectorAll<HTMLElement>(".js-section-reveal");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    });

    return () => {
      /* ScrollTrigger.getAll?.().forEach(t => t.kill()); */
    };
  }, []);

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(5rem, 12vw, 10rem) clamp(1.25rem, 4vw, 5rem)",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label="Opening statement"
      >
        {/* Large display heading */}
        <h1
          aria-label="Systems that outlive their builders."
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(3rem, 9vw, 9rem)",
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: "var(--fg)",
            maxWidth: "14ch",
            overflow: "hidden",
          }}
        >
          {"Systems that outlive".split(" ").map((word, i) => (
            <span
              key={i}
              className="hero-word"
              style={{ display: "inline-block", marginRight: "0.25em", opacity: 0 }}
            >
              {word}
            </span>
          ))}
          <br />
          {"their builders.".split(" ").map((word, i) => (
            <span
              key={`b-${i}`}
              className="hero-word"
              style={{
                display: "inline-block",
                marginRight: "0.25em",
                color: i === 1 ? "var(--accent)" : "var(--fg)",
                opacity: 0,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className="hero-sub"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
            fontWeight: 400,
            color: "var(--fg-muted)",
            marginTop: "clamp(1.5rem, 4vw, 3rem)",
            maxWidth: "44ch",
            lineHeight: 1.6,
            letterSpacing: "0.01em",
            opacity: 0,
          }}
        >
          Principal-level engineering across distributed systems,
          automation infrastructure, and product architecture.
        </p>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(2rem, 4vw, 3rem)",
            left: "clamp(1.25rem, 4vw, 5rem)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "var(--fg-dim)",
          }}
        >
          <span
            style={{
              display: "block",
              width: 1,
              height: 48,
              background: "var(--accent)",
              animation: "scrollPulse 2s ease infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Scroll to discover
          </span>
        </div>

        <style>{`
          @keyframes scrollPulse {
            0%, 100% { opacity: 0.3; transform: scaleY(1); }
            50% { opacity: 1; transform: scaleY(0.6); }
          }
        `}</style>
      </section>

      {/* ── METRICS ───────────────────────────────────────────────────── */}
      <section
        ref={metricsRef}
        style={{
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 5rem)",
          borderTop: "1px solid var(--border)",
        }}
        aria-label="Career impact at a glance"
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* Section label */}
          <p
            className="js-section-reveal"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--fg-dim)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "clamp(3rem, 6vw, 5rem)",
            }}
          >
            Scale
          </p>

          {/* Metrics grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "clamp(2rem, 4vw, 4rem) clamp(1.5rem, 3vw, 3rem)",
            }}
          >
            {METRICS.map((m, i) => (
              <div
                key={m.id}
                className="metric-item"
                style={{ opacity: 0 }}
              >
                {/* Number */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.15em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {m.prefix && (
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                        fontWeight: 400,
                        color: "var(--accent)",
                        lineHeight: 1,
                      }}
                    >
                      {m.prefix}
                    </span>
                  )}
                  <span
                    ref={(el) => { if (el) countersRef.current[i] = el; }}
                    data-value={m.value}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                      fontWeight: 400,
                      color: "var(--fg)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    0
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      fontWeight: 400,
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}
                  >
                    {m.suffix}
                  </span>
                </div>

                {/* Label */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--fg)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {m.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-xs)",
                    color: "var(--fg-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {m.sublabel}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NARRATIVE / IDENTITY ──────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 5rem)",
          borderTop: "1px solid var(--border)",
        }}
        aria-label="About"
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
              gap: "clamp(3rem, 6vw, 6rem)",
              alignItems: "start",
            }}
          >
            {/* Left: identity */}
            <div>
              <p
                className="nar-row"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--fg-dim)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                }}
              >
                Who builds this
              </p>
              <h2
                className="nar-row"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  color: "var(--fg)",
                  marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                }}
              >
                I'm Utkarsh.
              </h2>
              <p
                className="nar-row"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-base)",
                  color: "var(--fg-muted)",
                  lineHeight: 1.75,
                  maxWidth: "48ch",
                  marginBottom: "2rem",
                }}
              >
                I design systems that operate at scale without requiring their designers to be present. The work ranges from distributed signage infrastructure to educational frameworks to pricing engines — the common thread is thinking three levels below the surface.
              </p>
              <p
                className="nar-row"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-base)",
                  color: "var(--fg-muted)",
                  lineHeight: 1.75,
                  maxWidth: "48ch",
                }}
              >
                Constraints make better engineers. The best work I've shipped came from hard limits: zero downtime, offline devices, 2G networks, one week. The problems are always more interesting than they look from the outside.
              </p>
            </div>

            {/* Right: quick nav */}
            <div>
              <p
                className="nar-row"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--fg-dim)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                }}
              >
                Explore
              </p>
              <nav aria-label="Section navigation" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { href: "/case-studies", label: "Case Studies", sub: "Five systems. Decisions, failures, outcomes." },
                  { href: "/architecture", label: "Architecture Gallery", sub: "Interactive diagrams. Hoverable. Alive." },
                  { href: "/principles", label: "Engineering Principles", sub: "Six principles with visual proofs." },
                  { href: "/failures", label: "Failure Gallery", sub: "Seven things that went wrong and why." },
                  { href: "/ai-lab", label: "AI Lab", sub: "Ask about any system. At any depth." },
                ].map(({ href, label, sub }) => (
                  <Link
                    key={href}
                    href={href}
                    className="nar-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.25rem 0",
                      borderBottom: "1px solid var(--border)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "padding-left 0.3s ease",
                      gap: "1rem",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "0.75rem"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
                  >
                    <div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--fg)", marginBottom: "0.2rem" }}>
                        {label}
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)" }}>
                        {sub}
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: "var(--fg-dim)" }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDY TEASERS ────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 5rem)",
          borderTop: "1px solid var(--border)",
        }}
        aria-label="Selected work"
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p
              className="js-section-reveal"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--fg-dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Selected work
            </p>
            <Link
              href="/case-studies"
              className="js-section-reveal"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                color: "var(--accent)",
                textDecoration: "none",
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              All case studies
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
            }}
          >
            {CASE_STUDIES.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="cs-card"
                style={{
                  display: "block",
                  background: "var(--bg)",
                  padding: "clamp(1.5rem, 3vw, 2.5rem)",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background 0.3s ease",
                  opacity: 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg)"; }}
              >
                {/* Year + domain */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "clamp(1rem, 2vw, 1.5rem)",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--fg-dim)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {cs.year}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-xs)",
                      color: "var(--fg-muted)",
                      background: "var(--bg-raised)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "2px",
                    }}
                  >
                    {cs.domain}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    color: "var(--fg)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {cs.title}
                </h3>

                {/* Tagline */}
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: "var(--fg-muted)",
                    lineHeight: 1.6,
                    marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                  }}
                >
                  {cs.tagline}
                </p>

                {/* Outcome metric teaser */}
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "var(--text-sm)",
                      fontStyle: "italic",
                      color: "var(--fg-muted)",
                    }}
                  >
                    {cs.outcome.metrics[0]?.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "var(--text-lg)",
                      fontWeight: 500,
                      color: "var(--accent)",
                    }}
                  >
                    {cs.outcome.metrics[0]?.value}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CALL TO ACTION ────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.25rem, 4vw, 5rem)",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
        aria-label="Contact"
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p
            className="js-section-reveal"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--fg-dim)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            What's next
          </p>
          <h2
            className="js-section-reveal"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "var(--fg)",
              marginBottom: "clamp(1.5rem, 3vw, 2rem)",
            }}
          >
            If you're building something that matters at scale, let's talk.
          </h2>
          <p
            className="js-section-reveal"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              color: "var(--fg-muted)",
              lineHeight: 1.7,
              marginBottom: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            Open to Principal Engineer, Staff Engineer, and Architect roles. I'm particularly interested in problems where the technical decisions have direct business consequences.
          </p>
          <div
            className="js-section-reveal"
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/vcard"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--bg)",
                background: "var(--fg)",
                padding: "0.75rem 2rem",
                textDecoration: "none",
                letterSpacing: "0.02em",
                transition: "opacity 0.2s ease",
                borderRadius: "2px",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              Get in touch
            </Link>
            <Link
              href="/ai-lab"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                fontWeight: 400,
                color: "var(--fg)",
                padding: "0.75rem 2rem",
                border: "1px solid var(--border-strong)",
                textDecoration: "none",
                letterSpacing: "0.02em",
                transition: "border-color 0.2s ease",
                borderRadius: "2px",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--fg)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
            >
              Try the AI Lab
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
