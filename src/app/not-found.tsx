import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(2rem, 6vw, 5rem)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--fg-dim)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 400,
          lineHeight: 1.1,
          color: "var(--fg)",
          marginBottom: "1.5rem",
        }}
      >
        This page doesn&apos;t exist.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          color: "var(--fg-muted)",
          marginBottom: "2.5rem",
          maxWidth: "36ch",
          lineHeight: 1.6,
        }}
      >
        Some abstractions deserve to exist. This one doesn&apos;t.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--bg)",
          background: "var(--fg)",
          padding: "0.75rem 2rem",
          textDecoration: "none",
          borderRadius: "2px",
        }}
      >
        Return home
      </Link>
    </div>
  );
}
