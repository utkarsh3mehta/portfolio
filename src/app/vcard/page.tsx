"use client";

import { useEffect, useRef } from "react";

export default function VCardPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".vc-reveal").forEach((item) => {
        gsap.fromTo(item, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
      });
    });
  }, []);

  const downloadVCard = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Utkarsh M",
      "TITLE:Principal Software Engineer",
      "EMAIL:umteappdev@gmail.com",
      "URL:https://utkarsh.dev",
      "NOTE:Distributed systems, automation infrastructure, product architecture.",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "utkarsh-m.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const LINKS = [
    { label: "Email", value: "umteappdev@gmail.com", href: "mailto:umteappdev@gmail.com", mono: true },
    { label: "GitHub", value: "github.com/utkarsh", href: "https://github.com", mono: false },
    { label: "LinkedIn", value: "linkedin.com/in/utkarsh", href: "https://linkedin.com", mono: false },
  ];

  const AVAILABILITY = [
    { type: "Full-time", status: "open", description: "Principal Engineer, Staff Engineer, Full Stack Architect" },
    { type: "Advisory", status: "open", description: "System design, architecture reviews, technical strategy" },
    { type: "Consulting", status: "selective", description: "Distributed systems, automation infrastructure" },
  ];

  return (
    <div ref={ref} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* Hero */}
      <section
        style={{
          padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)",
          borderBottom: "1px solid var(--border)",
          minHeight: "50svh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 1440, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "center" }}>
            {/* Left */}
            <div>
              <p className="vc-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)", opacity: 0 }}>
                Contact
              </p>
              <h1 className="vc-reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "16ch", marginBottom: "1.5rem", opacity: 0 }}>
                Utkarsh M
              </h1>
              <p className="vc-reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--fg-muted)", lineHeight: 1.7, maxWidth: "44ch", marginBottom: "2.5rem", opacity: 0 }}>
                Principal Software Engineer. Distributed systems, automation infrastructure, and product architecture at scale.
              </p>

              {/* Links */}
              <div className="vc-reveal" style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: "2.5rem", opacity: 0 }}>
                {LINKS.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem 0",
                      borderBottom: "1px solid var(--border)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "padding-left 0.3s ease",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "0.75rem"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
                  >
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", textTransform: "uppercase", letterSpacing: "0.1em", minWidth: "80px" }}>
                      {link.label}
                    </span>
                    <span style={{ fontFamily: link.mono ? "var(--font-mono)" : "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--accent)" }}>
                      {link.value}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "var(--fg-dim)" }}>
                      <path d="M3 7h8M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ))}
              </div>

              {/* VCard download */}
              <div className="vc-reveal" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", opacity: 0 }}>
                <button
                  onClick={downloadVCard}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--bg)",
                    background: "var(--fg)",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    cursor: "pointer",
                    borderRadius: "2px",
                    transition: "opacity 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v7M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download .vcf
                </button>
              </div>
            </div>

            {/* Right: availability */}
            <div>
              <p className="vc-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem", opacity: 0 }}>
                Availability
              </p>
              <div className="vc-reveal" style={{ display: "flex", flexDirection: "column", gap: 0, opacity: 0 }}>
                {AVAILABILITY.map(a => (
                  <div key={a.type} style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--fg)" }}>{a.type}</span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-xs)",
                          color: a.status === "open" ? "#5A8A6A" : "var(--fg-muted)",
                          background: a.status === "open" ? "rgba(90,138,106,0.1)" : "var(--bg-raised)",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "2px",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-muted)" }}>{a.description}</p>
                  </div>
                ))}
              </div>

              {/* What I'm looking for */}
              <div className="vc-reveal" style={{ marginTop: "2.5rem", padding: "1.5rem", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: "2px", opacity: 0 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  What I'm looking for
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.7 }}>
                  Problems where the technical decisions have direct, visible business consequences. Teams where engineering judgment is trusted. Systems that operate at scale and have to stay that way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
