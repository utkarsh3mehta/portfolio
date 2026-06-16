// ============================================================================
// PALETTES — the site never owns a single identity.
// Eight presets + a CUSTOM lane. Each palette drives every CSS variable, the
// generative background, the living cursor, and the ARZEN node wall.
// ============================================================================

export type Palette = {
  bg: string;
  text: string;
  primary: string;
  secondary: string;
  highlight: string;
  grid: string;
  particle: string;
  cursor: string;
  ui: string;
};

export const PRESETS: Record<string, Palette> = {
  ACID:        { bg: '#0a0a06', text: '#f4f4ec', primary: '#c6ff00', secondary: '#ff10c4', highlight: '#00ecff', grid: 'rgba(198,255,0,0.06)',  particle: '#c6ff00', cursor: '#ff10c4', ui: '#14140c' },
  VOID:        { bg: '#050507', text: '#e8e8ee', primary: '#4d5dff', secondary: '#2a32a0', highlight: '#8a9bff', grid: 'rgba(120,140,255,0.06)', particle: '#4d5dff', cursor: '#8a9bff', ui: '#101018' },
  LASER:       { bg: '#0a0406', text: '#ffe9ee', primary: '#ff1f4b', secondary: '#ff5d7a', highlight: '#ff8aa0', grid: 'rgba(255,40,80,0.06)',   particle: '#ff1f4b', cursor: '#ff8aa0', ui: '#1a0a0e' },
  SUNSET:      { bg: '#1a0e10', text: '#ffeede', primary: '#ff7a3c', secondary: '#ff3c78', highlight: '#ffd23c', grid: 'rgba(255,120,60,0.07)',  particle: '#ff7a3c', cursor: '#ffd23c', ui: '#241418' },
  TERMINAL:    { bg: '#020806', text: '#b8ffcf', primary: '#2bff88', secondary: '#16c46a', highlight: '#88ffb8', grid: 'rgba(43,255,136,0.06)',  particle: '#2bff88', cursor: '#2bff88', ui: '#06140e' },
  ULTRAVIOLET: { bg: '#0c0618', text: '#f0e6ff', primary: '#b14dff', secondary: '#ff3cf0', highlight: '#7d5bff', grid: 'rgba(177,77,255,0.07)',  particle: '#b14dff', cursor: '#ff3cf0', ui: '#160c28' },
  MONO:        { bg: '#08080a', text: '#fafafa', primary: '#ffffff', secondary: '#9a9a9a', highlight: '#ffffff', grid: 'rgba(255,255,255,0.06)', particle: '#ffffff', cursor: '#ffffff', ui: '#161618' },
  SYNTH:       { bg: '#0c0820', text: '#ffe6f6', primary: '#ff2bd6', secondary: '#2be4ff', highlight: '#ffd23c', grid: 'rgba(255,43,214,0.07)',  particle: '#2be4ff', cursor: '#ff2bd6', ui: '#150e2c' },
};

// Display order for the lab + command palette.
export const PRESET_NAMES = Object.keys(PRESETS);

export type SavedPalette = { name: string; colors: Palette };

// Font stacks — wired to the next/font CSS variables set in the root layout.
export const FONT = {
  anton: "var(--font-anton), 'Anton', Impact, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', ui-monospace, monospace",
  archivo: "var(--font-archivo), 'Archivo', system-ui, sans-serif",
};

// Hex -> rgba() with the given alpha. Used by the canvas + node wall.
export function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
