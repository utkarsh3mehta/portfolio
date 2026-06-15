"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";

const NAV_LINKS = [
  { href: "/case-studies", label: "Work" },
  { href: "/architecture", label: "Systems" },
  { href: "/about", label: "Thinking" },
  { href: "/ai-lab", label: "Lab" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 40);
      setVisible(current < lastScroll.current || current < 80);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease",
          background: scrolled ? "var(--bg-overlay)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 clamp(1.25rem, 4vw, 5rem)",
            height: "clamp(52px, 6vw, 72px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Monogram */}
          <Link
            href="/"
            aria-label="Home"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
              fontWeight: 500,
              color: "var(--fg)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            U·M
          </Link>

          {/* Desktop links */}
          <ul
            role="list"
            style={{
              display: "flex",
              gap: "clamp(1.5rem, 3vw, 3rem)",
              listStyle: "none",
              alignItems: "center",
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 400,
                    color: pathname.startsWith(href) ? "var(--accent)" : "var(--fg-muted)",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    transition: "color 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--fg)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = pathname.startsWith(href) ? "var(--accent)" : "var(--fg-muted)"; }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title="Toggle theme (⌘⇧D / ⌘⇧L)"
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg-muted)",
                transition: "border-color 0.2s, color 0.2s",
                flexShrink: 0,
              }}
            >
              {theme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* VCard link */}
            <Link
              href="/vcard"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--fg)",
                textDecoration: "none",
                padding: "0.4rem 1rem",
                border: "1px solid var(--border-strong)",
                borderRadius: "2px",
                transition: "all 0.2s ease",
                letterSpacing: "0.02em",
                display: "none",
              }}
              className="nav-cta"
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--fg)";
                el.style.color = "var(--bg)";
                el.style.borderColor = "var(--fg)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.color = "var(--fg)";
                el.style.borderColor = "var(--border-strong)";
              }}
            >
              Contact
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--fg)",
                padding: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
              className="mobile-menu-btn"
            >
              <span style={{ display: "block", width: 22, height: 1, background: "currentColor", transition: "transform 0.3s ease, opacity 0.3s ease", transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
              <span style={{ display: "block", width: 22, height: 1, background: "currentColor", transition: "opacity 0.3s ease", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 22, height: 1, background: "currentColor", transition: "transform 0.3s ease, opacity 0.3s ease", transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "var(--bg-overlay)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(1.25rem, 4vw, 5rem)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.4s var(--ease-out)",
        }}
      >
        <ul role="list" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "clamp(1.5rem, 4vw, 3rem)" }}>
          {NAV_LINKS.map(({ href, label }, i) => (
            <li key={href} style={{ transform: menuOpen ? "translateY(0)" : "translateY(20px)", opacity: menuOpen ? 1 : 0, transition: `transform 0.5s var(--ease-expo) ${i * 0.07}s, opacity 0.5s ease ${i * 0.07}s` }}>
              <Link
                href={href}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 8vw, 5rem)",
                  fontWeight: 400,
                  color: pathname.startsWith(href) ? "var(--accent)" : "var(--fg)",
                  textDecoration: "none",
                  lineHeight: 1,
                }}
              >
                {label}
              </Link>
            </li>
          ))}
          <li style={{ transform: menuOpen ? "translateY(0)" : "translateY(20px)", opacity: menuOpen ? 1 : 0, transition: `transform 0.5s var(--ease-expo) ${NAV_LINKS.length * 0.07}s, opacity 0.5s ease ${NAV_LINKS.length * 0.07}s` }}>
            <Link
              href="/vcard"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 8vw, 5rem)",
                fontWeight: 400,
                color: "var(--fg)",
                textDecoration: "none",
                lineHeight: 1,
              }}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .nav-cta { display: block !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
