"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

const LINKS = [
  { href: "/case-studies",  label: "Work" },
  { href: "/architecture",  label: "Systems" },
  { href: "/principles",    label: "Principles" },
  { href: "/failures",      label: "Failures" },
  { href: "/ai-lab",        label: "Lab" },
  { href: "/open-source",   label: "Open Source" },
  { href: "/about",         label: "Thinking" },
  { href: "/vcard",         label: "Contact" },
];

export default function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 5rem)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(2rem, 4vw, 4rem)",
        }}
      >
        {/* Identity */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
              fontWeight: 400,
              color: "var(--fg)",
              marginBottom: "0.75rem",
            }}
          >
            Utkarsh M
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              color: "var(--fg-muted)",
              lineHeight: 1.6,
              maxWidth: "36ch",
              marginBottom: "1.5rem",
            }}
          >
            Principal Software Engineer. Distributed systems, automation infrastructure, product architecture.
          </p>
          <a
            href="mailto:umteappdev@gmail.com"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--accent)",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            umteappdev@gmail.com
          </a>
        </div>

        {/* Nav */}
        <nav aria-label="Footer navigation">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--fg-dim)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Explore
          </p>
          <ul
            role="list"
            style={{
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem 2rem",
            }}
          >
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: "var(--fg-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--fg)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)"; }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme + shortcuts */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--fg-dim)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Appearance
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {(["light", "dark"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-xs)",
                  fontWeight: theme === t ? 500 : 400,
                  color: theme === t ? "var(--fg)" : "var(--fg-muted)",
                  background: theme === t ? "var(--bg-raised)" : "transparent",
                  border: "1px solid var(--border)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {[
              { key: "⌘⇧L", action: "Light mode" },
              { key: "⌘⇧D", action: "Dark mode" },
            ].map(({ key, action }) => (
              <div key={key} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <kbd
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-2xs)",
                    color: "var(--fg-dim)",
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border)",
                    padding: "0.15rem 0.4rem",
                    borderRadius: "2px",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {key}
                </kbd>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-dim)" }}>
                  {action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1440,
          margin: "clamp(2rem, 4vw, 3rem) auto 0",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--fg-dim)",
          }}
        >
          © 2026 Utkarsh M. Built with Next.js.
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--fg-dim)",
          }}
        >
          All architectures are real. All failures are honest.
        </p>
      </div>
    </footer>
  );
}
