import './globals.css';
import type { Metadata, Viewport } from 'next';

// Type as architecture: a condensed display face (Anton), a mono
// (JetBrains Mono) and a heavy grotesque (Archivo). Loaded via an @import in
// globals.css so the build never depends on a network fetch.

export const metadata: Metadata = {
  title: 'Utkarsh Mehta — Software · Mumbai',
  description: 'Builds systems that should not work. Latency leaves fingerprints.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a06',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
