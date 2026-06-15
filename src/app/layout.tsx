import type { Metadata, Viewport } from "next";
import { cormorant, dmSans, jetbrainsMono } from "@/lib/fonts";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const SITE_URL = "https://utkarsh.dev";
const SITE_TITLE = "Utkarsh M — Principal Software Engineer";
const SITE_DESCRIPTION =
  "Staff-level engineer specializing in distributed systems, automation infrastructure, and product architecture. 47M+ requests processed. 12K+ devices synchronized. $2.4M in automated decisions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Utkarsh M",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Principal Software Engineer",
    "Staff Software Engineer",
    "Full Stack Architect",
    "Automation Engineer",
    "Distributed Systems",
    "React Developer",
    "TypeScript",
    "System Design",
  ],
  authors: [{ name: "Utkarsh M" }],
  creator: "Utkarsh M",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Utkarsh M",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F3EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0B09" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t||p);}catch(e){}})();`,
          }}
        />
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Utkarsh M",
              jobTitle: "Principal Software Engineer",
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              knowsAbout: [
                "Distributed Systems",
                "Software Architecture",
                "Automation Engineering",
                "Full Stack Development",
                "React",
                "TypeScript",
                "System Design",
              ],
            }),
          }}
        />
      </head>
      <body className="grain">
        <ThemeProvider>
          <Navigation />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
