"use client";

import { useEffect, useRef } from "react";
import type { Metadata } from "next";

// Note: Can't export metadata from client component.
// For SEO, use a server wrapper. Keeping simple for now.

const DECISIONS = [
  {
    question: "How do you decide what to abstract?",
    answer:
      "Wait for three. Two instances of a pattern feel like coincidence. Three feel like a rule. Abstracting at two builds the wrong generalization — you're encoding what two things have in common, which is usually less than what you think. At three, you've seen enough variation to know what the abstraction actually needs to handle.",
  },
  {
    question: "How do you evaluate a technical decision under time pressure?",
    answer:
      "I ask: what does this make harder to change? The reversibility of a decision matters more than its correctness in the short term. A reversible wrong decision costs one correction. An irreversible one can compound into a system property. Under time pressure, I prefer the option that preserves the most future optionality — even if it's slower now.",
  },
  {
    question: "When do you push back on a product requirement?",
    answer:
      "When the requirement encodes a solution rather than a problem. 'We need a queue here' is a solution. 'We can't lose these requests' is a problem — and it might be solved by a queue, or by synchronous retries, or by idempotency. I push back to find the actual constraint, then design to that constraint rather than its proposed solution.",
  },
  {
    question: "What's your relationship to complexity?",
    answer:
      "Adversarial. Complexity is debt in disguise. Every layer of indirection, every configuration option, every conditional branch is a cost that future engineers pay. My default is deletion and simplification. When I can't simplify, I make the complexity visible — documented, tested, isolated — so it can't spread.",
  },
  {
    question: "How do you think about system failure?",
    answer:
      "As a specification. The way a system fails tells you what it believes about itself. A system that fails catastrophically believed it wouldn't fail. A system that fails gracefully was designed by someone who knew it would. I design failure paths as first-class features — explicit fallbacks, known degraded states, observable signals when things go wrong.",
  },
  {
    question: "What does 'done' mean to you?",
    answer:
      "Observable, reversible, and understood. A feature is done when you can tell whether it's working without reading the code. It's done when you can roll it back without a crisis. It's done when a new engineer can read the system and understand why the decisions were made. 'Working' is necessary but not sufficient.",
  },
];

const VALUES = [
  { label: "Legibility", description: "Code is read 10× more than it's written. Optimize for the reader." },
  { label: "Explicit > Clever", description: "Clever code is the kind that has to be explained. Don't write it." },
  { label: "Make the wrong thing hard", description: "Good interfaces make correct usage obvious and incorrect usage difficult." },
  { label: "Automate what you've done twice", description: "The second time you do something manually, you've made a decision." },
  { label: "Monitor what matters", description: "Exceptions are not the only failures. Outcomes must be observed too." },
  { label: "Design for the failure path", description: "The happy path is easy. What happens when everything goes wrong?" },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      if (!container) return;

      /* Staggered reveal for all reveal elements */
      const items = container.querySelectorAll<HTMLElement>(".about-reveal");
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
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
  }, []);

  return (
    <div ref={containerRef} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p
            className="about-reveal"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--fg-dim)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
              opacity: 0,
            }}
          >
            Thinking
          </p>
          <h1
            className="about-reveal"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "var(--fg)",
              maxWidth: "18ch",
              opacity: 0,
            }}
          >
            How I reason about systems.
          </h1>
        </div>
      </section>

      {/* ── Q&A Decision Making ──────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)",
          borderBottom: "1px solid var(--border)",
        }}
        aria-label="Decision making philosophy"
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "clamp(3rem, 6vw, 6rem)",
            alignItems: "start",
          }}
        >
          {/* Section label */}
          <div>
            <p
              className="about-reveal"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--fg-dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                opacity: 0,
              }}
            >
              Decision making
            </p>
            <h2
              className="about-reveal"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "var(--fg)",
                maxWidth: "20ch",
                opacity: 0,
              }}
            >
              Questions I ask. Answers I've arrived at.
            </h2>
          </div>

          {/* Q&A list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {DECISIONS.map((d, i) => (
              <details
                key={i}
                className="about-reveal"
                style={{
                  borderTop: "1px solid var(--border)",
                  opacity: 0,
                }}
              >
                <summary
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--fg)",
                    padding: "1.25rem 0",
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {d.question}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ flexShrink: 0, color: "var(--fg-muted)", transition: "transform 0.3s ease" }}
                  >
                    <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: "var(--fg-muted)",
                    lineHeight: 1.75,
                    paddingBottom: "1.5rem",
                    maxWidth: "60ch",
                  }}
                >
                  {d.answer}
                </p>
              </details>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)",
          borderBottom: "1px solid var(--border)",
        }}
        aria-label="Engineering values"
      >
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p
            className="about-reveal"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--fg-dim)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "clamp(2.5rem, 5vw, 4rem)",
              opacity: 0,
            }}
          >
            Working values
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
            }}
          >
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="about-reveal"
                style={{
                  background: "var(--bg)",
                  padding: "clamp(1.5rem, 3vw, 2.5rem)",
                  opacity: 0,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    fontWeight: 400,
                    color: "var(--accent)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {v.label}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: "var(--fg-muted)",
                    lineHeight: 1.65,
                  }}
                >
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technical philosophy ─────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)",
        }}
        aria-label="Technical philosophy"
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gap: "clamp(3rem, 6vw, 6rem)",
          }}
        >
          <div>
            <p
              className="about-reveal"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--fg-dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                opacity: 0,
              }}
            >
              Technical philosophy
            </p>
            <h2
              className="about-reveal"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 400,
                lineHeight: 1.15,
                color: "var(--fg)",
                marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                opacity: 0,
              }}
            >
              I optimize for the system after me, not the system right now.
            </h2>
            <p
              className="about-reveal"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                color: "var(--fg-muted)",
                lineHeight: 1.75,
                maxWidth: "48ch",
                opacity: 0,
              }}
            >
              Every system I build will be maintained by someone who wasn't in the room when the decisions were made. That person is my primary design consideration. If they can't understand why a decision was made, the system is incomplete — regardless of how well it runs today.
            </p>
          </div>

          <div>
            <p
              className="about-reveal"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--fg-dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "clamp(1.5rem, 3vw, 2rem)",
                opacity: 0,
              }}
            >
              On failure
            </p>
            <p
              className="about-reveal"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                color: "var(--fg-muted)",
                lineHeight: 1.75,
                maxWidth: "48ch",
                marginBottom: "1.5rem",
                opacity: 0,
              }}
            >
              I've shipped systems that had production incidents, race conditions, wrong abstractions, and monitoring gaps. I document these as clearly as the successes — because the failure cases are where the actual learning lives.
            </p>
            <p
              className="about-reveal"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                color: "var(--fg-muted)",
                lineHeight: 1.75,
                maxWidth: "48ch",
                opacity: 0,
              }}
            >
              Any engineer who claims a flawless record either hasn't built anything important, or isn't being honest about what they built.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
