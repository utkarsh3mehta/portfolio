'use client';

// ============================================================================
// Utkarsh Mehta — the living site.
//
// A faithful React/Next port of the handcrafted prototype. One client
// component owns all state, refs and animation loops (canvas flow-field,
// living cursor, node walls, per-product sims, nav dots, live clock). The
// DOM-driven loops read the current palette through `palRef` so a palette swap
// recolours everything instantly without re-rendering.
//
// Opener: two scroll-snapped screens. Then WHO AM I, an accordion PROJECTS
// index where each row expands a live mockup of the actual product, and the
// vCard contact. Plus the Color Lab, the ⌘K command palette and the cursor.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PRESETS,
  PRESET_NAMES,
  hexA,
  type Palette,
  type SavedPalette,
} from '@/lib/palettes';
import {
  CHAPTERS,
  PROJECTS,
  BLOCK_ROWS,
  MARQUEE_TEXT,
  NAV_SECTIONS,
  WALL_COUNT,
  WALL_COLS,
  SEAT_COUNT,
  UNTABOO_SEGMENTS,
  UNTABOO_DONE,
} from '@/lib/content';

type Cmd = { id: string; kind: string; label: string; hint: string; act: () => void };

type WallS = {
  offline: Set<number>;
  originX: number;
  originY: number;
  front: number;
  active: boolean;
  idle: number;
};

function now(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

// UnTaboo lesson reader: streaming text bars (width + entrance delay).
const STREAM_LINES = [
  { w: '94%', d: '0.1s' },
  { w: '100%', d: '0.32s' },
  { w: '88%', d: '0.54s' },
  { w: '66%', d: '0.76s' },
];

type Props = {
  startPalette?: string;
  soundDefault?: boolean;
  reducedMotion?: boolean;
};

export default function Portfolio({
  startPalette = 'ACID',
  soundDefault = false,
  reducedMotion = false,
}: Props) {
  const initialPalette = PRESETS[startPalette] ?? PRESETS.ACID;
  const initialName = PRESETS[startPalette] ? startPalette : 'ACID';

  // ---- UI state ----
  const [palette, setPalette] = useState<Palette>(initialPalette);
  const [activeName, setActiveName] = useState<string>(initialName);
  const [customs, setCustoms] = useState<SavedPalette[]>([]);
  const [labOpen, setLabOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [cmdIndex, setCmdIndex] = useState(0);
  const [sound, setSound] = useState(soundDefault);
  const [reduced, setReduced] = useState(reducedMotion);
  const [cursorMode, setCursorMode] = useState<'none' | 'auto'>('none');
  const [openProject, setOpenProject] = useState<number | null>(null);

  // ---- DOM refs ----
  const bgRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);
  const floppyRef = useRef<HTMLButtonElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  // ---- mutable refs the loops read live ----
  const palRef = useRef<Palette>(initialPalette);
  const reducedRef = useRef<boolean>(reducedMotion);
  const soundRef = useRef<boolean>(soundDefault);
  const stopRef = useRef<boolean>(false);
  const acRef = useRef<AudioContext | null>(null);

  // ---- imperative helpers ----
  const applyVars = (p: Palette) => {
    const r = document.documentElement;
    const map: Record<string, string> = {
      '--bg': p.bg,
      '--text': p.text,
      '--primary': p.primary,
      '--secondary': p.secondary,
      '--highlight': p.highlight,
      '--grid': p.grid,
      '--cursor': p.cursor,
      '--ui': p.ui,
    };
    Object.entries(map).forEach(([k, v]) => r.style.setProperty(k, v));
  };

  const blip = (freq = 660) => {
    if (!soundRef.current) return;
    try {
      if (!acRef.current) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        acRef.current = new Ctor();
      }
      const ac = acRef.current;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.04, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.09);
      o.connect(g);
      g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 0.1);
    } catch {
      /* audio not available */
    }
  };

  const applyPalette = (name: string, colors?: Palette) => {
    const p = colors ?? PRESETS[name];
    if (!p) return;
    palRef.current = p;
    applyVars(p);
    setPalette(p);
    setActiveName(name);
    try {
      localStorage.setItem('um.palette', JSON.stringify({ name, colors: p }));
    } catch {
      /* storage blocked */
    }
    blip(520);
  };

  const goto = (id: string) => {
    setCmdOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: reducedRef.current ? 'auto' : 'smooth' });
    }
    blip(620);
  };

  const toggleCmd = () => {
    setCmdOpen((o) => !o);
    setCmdQuery('');
    setCmdIndex(0);
    blip(700);
  };

  const toggleLab = () => {
    setLabOpen((o) => !o);
    blip(680);
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    soundRef.current = next;
    if (next) blip(900);
  };

  const toggleReduced = () => setReduced((r) => !r);

  const toggleProject = (idx: number) => {
    const wasOpen = openProject === idx;
    setOpenProject((o) => (o === idx ? null : idx));
    blip(wasOpen ? 480 : 760);
  };

  const saveCustom = () => {
    const name = `CUSTOM ${customs.length + 1}`;
    const next: SavedPalette[] = [...customs, { name, colors: { ...palRef.current } }];
    setCustoms(next);
    try {
      localStorage.setItem('um.customs', JSON.stringify(next));
    } catch {
      /* storage blocked */
    }
    blip(740);
  };

  const downloadVcard = () => {
    const vcf =
      'BEGIN:VCARD\nVERSION:3.0\nN:Mehta;Utkarsh;;;\nFN:Utkarsh Mehta\nTITLE:Principal Software Engineer\nTEL;TYPE=CELL,VOICE:+919819642511\nEMAIL;TYPE=INTERNET:umtebiz@gmail.com\nADR;TYPE=WORK:;;Mumbai;;;;India\nNOTE:Builds systems that should not work.\nEND:VCARD';
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UTKARSH_MEHTA.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    blip(560);
  };

  const floppyEnter = () => {
    if (floppyRef.current && !reducedRef.current)
      floppyRef.current.style.transform = 'translateY(-22px) rotate(-2deg)';
  };
  const floppyLeave = () => {
    if (floppyRef.current) floppyRef.current.style.transform = 'none';
  };

  // ---- command list ----
  const filtered = useMemo<Cmd[]>(() => {
    const cmds: Cmd[] = [
      { id: 'top', kind: 'GOTO', label: 'Landing — the statement', hint: '↵', act: () => goto('top') },
      { id: 'who', kind: 'GOTO', label: 'Who am I — the fragments', hint: '↵', act: () => goto('who') },
      { id: 'projects', kind: 'GOTO', label: 'Projects — independent worlds', hint: '↵', act: () => goto('projects') },
      { id: 'contact', kind: 'GOTO', label: 'Contact — eject the vCard', hint: '↵', act: () => goto('contact') },
    ];
    PRESET_NAMES.forEach((name) =>
      cmds.push({ id: `pal-${name}`, kind: 'PALETTE', label: `Palette · ${name}`, hint: 'apply', act: () => applyPalette(name) }),
    );
    cmds.push({ id: 'lab', kind: 'TOGGLE', label: 'Open Color Lab', hint: '⌘', act: () => { setLabOpen(true); setCmdOpen(false); } });
    cmds.push({ id: 'motion', kind: 'TOGGLE', label: 'Toggle reduced motion', hint: reduced ? 'ON' : 'OFF', act: () => { setReduced((r) => !r); setCmdOpen(false); } });
    cmds.push({ id: 'sound', kind: 'TOGGLE', label: 'Toggle sound', hint: sound ? 'ON' : 'OFF', act: () => { const n = !soundRef.current; soundRef.current = n; setSound(n); setCmdOpen(false); } });

    const q = cmdQuery.trim().toLowerCase();
    if (!q) return cmds;
    return cmds.filter((c) => `${c.label} ${c.kind}`.toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmdQuery, reduced, sound]);

  // ====== keep loop refs synced with state ======
  useEffect(() => {
    reducedRef.current = reduced;
    document.documentElement.dataset.reduced = reduced ? '1' : '0';
  }, [reduced]);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    palRef.current = palette;
    applyVars(palette);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette]);

  // ====== focus the command input when it opens ======
  useEffect(() => {
    if (!cmdOpen) return;
    const t = setTimeout(() => cmdInputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [cmdOpen]);

  // ====== keyboard ======
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
        ev.preventDefault();
        toggleCmd();
        return;
      }
      if (cmdOpen) {
        if (ev.key === 'Escape') setCmdOpen(false);
        else if (ev.key === 'ArrowDown') {
          ev.preventDefault();
          setCmdIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          setCmdIndex((i) => Math.max(i - 1, 0));
        } else if (ev.key === 'Enter') {
          const c = filtered[cmdIndex];
          if (c) c.act();
        }
      } else if (ev.key === 'Escape' && labOpen) {
        setLabOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmdOpen, cmdIndex, labOpen, filtered]);

  // ====== mount: restore prefs + start every living loop ======
  useEffect(() => {
    stopRef.current = false;

    // restore saved palette + custom combos
    try {
      const saved = JSON.parse(localStorage.getItem('um.palette') || 'null');
      if (saved && saved.colors) {
        palRef.current = saved.colors;
        applyVars(saved.colors);
        setPalette(saved.colors);
        setActiveName(saved.name || 'CUSTOM');
      } else {
        applyVars(palRef.current);
      }
      const cs = JSON.parse(localStorage.getItem('um.customs') || '[]');
      if (Array.isArray(cs)) setCustoms(cs);
    } catch {
      applyVars(palRef.current);
    }

    // accessibility: honour the OS reduced-motion preference
    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      reducedRef.current = true;
      setReduced(true);
    }
    document.documentElement.dataset.reduced = prefersReduced || reducedMotion ? '1' : '0';

    // touch devices: fall back to the native cursor, skip the custom one
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (coarse) setCursorMode('auto');

    // live clock — written via ref so it never triggers a re-render
    const clockTimer = window.setInterval(() => {
      if (clockRef.current) clockRef.current.textContent = now();
    }, 1000);
    if (clockRef.current) clockRef.current.textContent = now();

    // ----- generative flow-field background -----
    const rafs: number[] = [];
    let cursorRaf = 0;
    let wallRaf = 0;
    let onResize: (() => void) | null = null;

    const canvas = bgRef.current;
    const ctx2d = canvas ? canvas.getContext('2d') : null;
    if (canvas && ctx2d) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let bw = window.innerWidth;
      let bh = window.innerHeight;
      const resize = () => {
        bw = window.innerWidth;
        bh = window.innerHeight;
        canvas.width = bw * dpr;
        canvas.height = bh * dpr;
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      onResize = resize;
      window.addEventListener('resize', resize);

      const N = 460;
      const ps = Array.from({ length: N }, () => ({
        x: Math.random() * bw,
        y: Math.random() * bh,
      }));
      let t = 0;
      ctx2d.fillStyle = palRef.current.bg;
      ctx2d.fillRect(0, 0, bw, bh);
      const tick = () => {
        if (stopRef.current) return;
        if (reducedRef.current) {
          rafs.push(requestAnimationFrame(() => window.setTimeout(tick, 120)));
          return;
        }
        const w = bw;
        const h = bh;
        t += 0.0026;
        ctx2d.fillStyle = hexA(palRef.current.bg, 0.08);
        ctx2d.fillRect(0, 0, w, h);
        ctx2d.globalAlpha = 0.45;
        ctx2d.lineWidth = 1;
        ctx2d.strokeStyle = palRef.current.particle;
        for (const p of ps) {
          const a =
            (Math.sin(p.x * 0.0042 + t) +
              Math.cos(p.y * 0.0052 - t * 0.8) +
              Math.sin((p.x + p.y) * 0.0022 + t * 1.3)) *
            1.7;
          const nx = p.x + Math.cos(a) * 1.4;
          const ny = p.y + Math.sin(a) * 1.4;
          ctx2d.beginPath();
          ctx2d.moveTo(p.x, p.y);
          ctx2d.lineTo(nx, ny);
          ctx2d.stroke();
          p.x = nx;
          p.y = ny;
          if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
          }
        }
        ctx2d.globalAlpha = 1;
        rafs.push(requestAnimationFrame(tick));
      };
      tick();
    }

    // ----- living cursor (fine pointers only) -----
    let onMove: ((e: MouseEvent) => void) | null = null;
    if (!coarse) {
      let mx = -100;
      let my = -100;
      let rx = -100;
      let ry = -100;
      let dx = -100;
      let dy = -100;
      let mode: 'idle' | 'link' = 'idle';
      onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        const target = e.target as Element | null;
        const link = target && target.closest ? target.closest('[data-cursor]') : null;
        mode = link ? 'link' : 'idle';
      };
      window.addEventListener('mousemove', onMove);
      const loop = () => {
        if (stopRef.current) return;
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        dx += (mx - dx) * 0.55;
        dy += (my - dy) * 0.55;
        const ring = ringRef.current;
        const dot = dotRef.current;
        if (ring) {
          const size = mode === 'link' ? 56 : 34;
          ring.style.width = `${size}px`;
          ring.style.height = `${size}px`;
          ring.style.background = mode === 'link' ? hexA(palRef.current.cursor, 0.14) : 'transparent';
          ring.style.transform = `translate(${rx - size / 2}px,${ry - size / 2}px)`;
        }
        if (dot) dot.style.transform = `translate(${dx - 3}px,${dy - 3}px)`;
        cursorRaf = requestAnimationFrame(loop);
      };
      loop();
    }

    // ----- node walls: generalised driver for every [data-wall] (ARZEN) -----
    const wallState = new Map<Element, WallS>();
    const wallLoop = () => {
      if (stopRef.current) return;
      if (reducedRef.current) {
        wallRaf = requestAnimationFrame(() => window.setTimeout(wallLoop, 200));
        return;
      }
      const pal = palRef.current;
      const walls = document.querySelectorAll<HTMLElement>('[data-wall]');
      const liveSet = new Set<Element>(walls);
      for (const key of Array.from(wallState.keys())) {
        if (!liveSet.has(key)) wallState.delete(key);
      }
      walls.forEach((wall) => {
        const cells = wall.querySelectorAll<HTMLElement>('[data-wall-cell]');
        if (!cells.length) return;
        const cols = parseInt(wall.dataset.wallCols || '10', 10);
        const rows = Math.ceil(cells.length / cols);
        let s = wallState.get(wall);
        if (!s) {
          s = {
            offline: new Set<number>(),
            originX: 0,
            originY: 0,
            front: 0,
            active: false,
            idle: Math.floor(Math.random() * 60),
          };
          wallState.set(wall, s);
        }
        const ws = s;
        const statusEl = wall.querySelector<HTMLElement>('[data-wall-status]');
        const countEl = wall.querySelector<HTMLElement>('[data-wall-count]');
        ws.idle++;
        if (!ws.active && ws.idle > 70) {
          ws.active = true;
          ws.idle = 0;
          ws.front = 0;
          ws.originX = Math.floor(Math.random() * cols);
          ws.originY = Math.floor(Math.random() * rows);
          if (statusEl) {
            statusEl.textContent = `● SIGNAL FROM NODE ${ws.originY * cols + ws.originX}`;
            statusEl.style.color = pal.primary;
          }
          blip(880);
        }
        if (ws.active) {
          ws.front += 0.5;
          cells.forEach((cell, i) => {
            const cx = i % cols;
            const cy = Math.floor(i / cols);
            const d = Math.hypot(cx - ws.originX, cy - ws.originY);
            const band = Math.abs(d - ws.front);
            if (ws.offline.has(i)) {
              cell.style.background = hexA(pal.secondary, 0.12);
              cell.style.borderColor = hexA(pal.secondary, 0.6);
              cell.style.boxShadow = 'none';
            } else if (band < 0.9) {
              cell.style.background = pal.primary;
              cell.style.borderColor = pal.primary;
              cell.style.boxShadow = `0 0 14px ${hexA(pal.primary, 0.7)}`;
            } else {
              cell.style.background = hexA(pal.bg, 0.7);
              cell.style.borderColor = hexA(pal.text, 0.35);
              cell.style.boxShadow = 'none';
            }
          });
          if (ws.front > Math.hypot(cols, rows) + 1) {
            ws.active = false;
            if (statusEl) statusEl.textContent = `● SYNCED · ${new Date().toLocaleTimeString()}`;
            if (Math.random() > 0.4) {
              const k = Math.floor(Math.random() * cells.length);
              ws.offline.add(k);
              if (countEl) countEl.textContent = String(cells.length - ws.offline.size);
              window.setTimeout(() => {
                ws.offline.delete(k);
                if (countEl) countEl.textContent = String(cells.length - ws.offline.size);
              }, 2600);
            }
          }
        }
      });
      wallRaf = requestAnimationFrame(wallLoop);
    };
    wallLoop();

    // ----- per-product sims (only the open accordion has these nodes) -----
    const simTimer = window.setInterval(() => {
      if (stopRef.current || reducedRef.current) return;

      // DYNAMIC PRICING — cinema occupancy & price
      document.querySelectorAll<HTMLElement>('[data-sim="pricing"]').forEach((root) => {
        let occ = parseFloat(root.dataset.occ || '58');
        occ += (Math.random() - 0.42) * 6;
        occ = Math.max(24, Math.min(98, occ));
        root.dataset.occ = String(occ);
        const price = Math.round((180 + (occ / 100) * 360) / 10) * 10;
        const occEl = root.querySelector<HTMLElement>('[data-occ-val]');
        if (occEl) occEl.textContent = `${occ.toFixed(0)}%`;
        const priceEl = root.querySelector<HTMLElement>('[data-price-val]');
        if (priceEl) priceEl.textContent = `₹${price}`;
        const trendEl = root.querySelector<HTMLElement>('[data-trend]');
        if (trendEl) trendEl.textContent = occ > 70 ? 'SURGE ↑' : occ < 40 ? 'EASING ↓' : 'STEADY →';
        const seats = root.querySelectorAll<HTMLElement>('[data-seat]');
        const fill = Math.round((seats.length * occ) / 100);
        seats.forEach((s, i) => {
          const on = i < fill;
          s.style.background = on ? 'var(--primary)' : 'transparent';
          s.style.borderColor = on ? 'var(--primary)' : hexA(palRef.current.text, 0.3);
        });
      });

      // SHAPING 3D — print progress, layers, temps
      document.querySelectorAll<HTMLElement>('[data-sim="shaping3d"]').forEach((root) => {
        let prog = parseFloat(root.dataset.prog || '6');
        prog += 1.4;
        if (prog > 100) prog = 4;
        root.dataset.prog = String(prog);
        const pEl = root.querySelector<HTMLElement>('[data-prog-val]');
        if (pEl) pEl.textContent = `${prog.toFixed(0)}%`;
        const barEl = root.querySelector<HTMLElement>('[data-prog-bar]');
        if (barEl) barEl.style.width = `${prog}%`;
        const objEl = root.querySelector<HTMLElement>('[data-print-obj]');
        if (objEl) objEl.style.height = `${10 + prog * 0.78}%`;
        const headEl = root.querySelector<HTMLElement>('[data-print-head]');
        if (headEl) headEl.style.bottom = `calc(${10 + prog * 0.78}% + 6px)`;
        const layEl = root.querySelector<HTMLElement>('[data-layer-val]');
        if (layEl) layEl.textContent = `${String(Math.round(prog * 2.4)).padStart(3, '0')}/240`;
        const nz = root.querySelector<HTMLElement>('[data-nozzle]');
        if (nz) nz.textContent = `${205 + Math.round(Math.sin(prog / 7) * 4)}°C`;
        const bd = root.querySelector<HTMLElement>('[data-bed]');
        if (bd) bd.textContent = `${60 + Math.round(Math.cos(prog / 11) * 2)}°C`;
      });
    }, 650);

    // ----- nav progress dots (plain scroll listener over 5 sections) -----
    const navEls = NAV_SECTIONS.map((sel) => document.querySelector<HTMLElement>(sel)).filter(
      (el): el is HTMLElement => !!el,
    );
    const dotEls = Array.from(document.querySelectorAll<HTMLElement>('[data-dot]'));
    const updateChapter = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestD = Infinity;
      navEls.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      dotEls.forEach((d) => {
        const on = parseInt(d.dataset.dot || '-1', 10) === best;
        d.style.opacity = on ? '1' : '0.28';
        d.style.background = on ? 'var(--primary)' : 'var(--text)';
      });
    };
    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        updateChapter();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateChapter();

    return () => {
      stopRef.current = true;
      window.clearInterval(clockTimer);
      window.clearInterval(simTimer);
      rafs.forEach((id) => cancelAnimationFrame(id));
      if (cursorRaf) cancelAnimationFrame(cursorRaf);
      if (wallRaf) cancelAnimationFrame(wallRaf);
      if (onMove) window.removeEventListener('mousemove', onMove);
      if (onResize) window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- derived view data for the lab ----
  const editorKeys: { key: keyof Palette; label: string }[] = [
    { key: 'primary', label: 'PRIMARY' },
    { key: 'secondary', label: 'SECONDARY' },
    { key: 'highlight', label: 'HIGHLIGHT' },
    { key: 'bg', label: 'BACKGROUND' },
    { key: 'text', label: 'TEXT' },
  ];

  const tuneColor = (key: keyof Palette, v: string) => {
    const np: Palette = { ...palRef.current, [key]: v };
    if (key === 'primary') np.particle = v;
    palRef.current = np;
    applyVars(np);
    setPalette(np);
    setActiveName('CUSTOM');
  };

  return (
    <div
      className={`root${cursorMode === 'none' ? ' cursorHidden' : ''}`}
      style={{ cursor: cursorMode }}
    >
      {/* generative living background */}
      <canvas ref={bgRef} className="bgCanvas" />
      <div className="gridOverlay" />
      <div className="scanlines" />

      {/* living cursor */}
      <div ref={ringRef} className="cursorRing" aria-hidden />
      <div ref={dotRef} className="cursorDot" aria-hidden />

      {/* fixed HUD */}
      <div className="hud hudLeft">
        UTKARSH MEHTA
        <br />
        <span className="hudDim">SOFTWARE · MUMBAI</span>
      </div>
      <div className="hud hudRight">
        <span ref={clockRef}>00:00:00</span> IST
        <br />
        <span className="hudDim">19.0760°N 72.8777°E</span>
      </div>

      {/* nav progress dots — one per section */}
      <div className="dots" aria-hidden>
        {NAV_SECTIONS.map((_, i) => (
          <span key={i} data-dot={i} className="dot" />
        ))}
      </div>

      {/* bottom marquee ticker */}
      <div className="marquee" aria-hidden>
        <div className="marqueeTrack">
          <span className="marqueeText">{MARQUEE_TEXT}</span>
          <span className="marqueeText">{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* launcher + lab toggle */}
      <button data-cursor="link" onClick={toggleCmd} className="navBtn">
        ⌘K&nbsp;&nbsp;NAVIGATE
      </button>
      <button data-cursor="link" onClick={toggleLab} className="labBtn">
        ◐ COLOR LAB
      </button>

      {/* ============ CONTENT ============ */}
      <main id="top" className="main">
        {/* CHAPTERS — two screens */}
        {CHAPTERS.map((ch) => (
          <section
            key={ch.i}
            data-chapter={ch.i}
            data-screen-label={ch.n}
            className="chapter"
          >
            <div className="chapterGhost">{ch.n}</div>
            <div className="kicker heroKicker">{ch.kicker}</div>
            <h1 className="chapterWord heroWord">{ch.word}</h1>
            <div className="chapterLine heroLine">{ch.line}</div>
          </section>
        ))}

        {/* WHO AM I */}
        <section id="who" data-screen-label="WHO AM I" className="section who">
          <div className="whoTitle revealRise">
            WHO
            <br />
            <span style={{ color: 'var(--primary)' }}>AM I</span>
          </div>
          <div className="whoSub revealRise">No biography. Assemble the fragments yourself.</div>

          <div className="cardGrid">
            <div className="card revealFade" style={{ transform: 'rotate(-1deg)' }}>
              <div className="cardLabel">$ TERMINAL</div>
              <div className="termBody">
                <span className="cPrimary">utkarsh@mumbai</span>:~$ whoami
                <br />
                &gt; builds systems that should not work
                <br />
                <span className="cPrimary">~</span>$ uptime
                <br />
                &gt; 7y, load avg 0.3 0.6 0.9
                <br />
                <span className="cPrimary">~</span>$ _<span className="termCursor" />
              </div>
            </div>

            <div className="card revealFade" style={{ transform: 'rotate(0.6deg)' }}>
              <div className="cardLabel">GIT LOG</div>
              <div className="gitBody">
                <span className="cHigh">a1f9c</span> feat: render is negotiation
                <br />
                <span className="cHigh">7d20e</span> fix: queue never forgets
                <br />
                <span className="cHigh">3b8a1</span> perf: 4000 screens, one signal
                <br />
                <span className="cHigh">0c4f2</span> chore: document the failure
                <br />
                <span className="cHigh">9ee07</span> init: latency, observed
              </div>
            </div>

            <div className="card cardPrimary revealFade" style={{ transform: 'rotate(-0.8deg)' }}>
              <div className="cardLabel">COORDINATES</div>
              <div className="coordBig">19.0760°N</div>
              <div className="coordBig" style={{ color: 'var(--primary)' }}>
                72.8777°E
              </div>
              <div className="coordSub">MUMBAI · GMT+5:30 · ALWAYS DEPLOYING</div>
            </div>

            <div className="card revealFade" style={{ transform: 'rotate(1deg)' }}>
              <div className="cardLabel">CONSOLE</div>
              <div className="consoleBody">
                <span className="cPrimary">▸ log</span> interfaces teach behavior
                <br />
                <span className="cWarn">▲ warn</span> shortcut created a new map
                <br />
                <span className="cSec">✕ err</span> assumption not found
                <br />
                <span className="cPrimary">▸ log</span> recovered. documented.
              </div>
            </div>

            <div className="card cardDashed revealFade" style={{ transform: 'rotate(-1.4deg)' }}>
              <div className="cardLabel">SKETCH · v1 (ABANDONED)</div>
              <svg viewBox="0 0 200 90" className="sketchSvg">
                <rect x="8" y="14" width="54" height="34" fill="none" stroke="var(--text)" strokeWidth="1.5" />
                <rect x="138" y="40" width="54" height="34" fill="none" stroke="var(--text)" strokeWidth="1.5" />
                <line x1="62" y1="31" x2="138" y2="57" stroke="var(--text)" strokeWidth="1.5" />
                <line x1="6" y1="8" x2="196" y2="84" stroke="var(--secondary)" strokeWidth="2" />
                <line x1="196" y1="8" x2="6" y2="84" stroke="var(--secondary)" strokeWidth="2" />
              </svg>
            </div>

            <div className="card revealFade" style={{ transform: 'rotate(0.4deg)' }}>
              <div className="cardLabel">DEPLOY LOG</div>
              <div className="deployBody">
                2026-06-16 04:11 → prod ✦ ok
                <br />
                2026-06-15 23:47 → prod ✦ ok
                <br />
                2026-06-15 02:09 → prod ✦ rollback
                <br />
                2026-06-14 18:30 → prod ✦ ok
                <br />
                <span className="cPrimary">uptime 99.98%</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS — accordion index, each opens a live product mockup */}
        <section id="projects" data-screen-label="PROJECTS" className="section projects">
          <div className="sectionLabel revealRise">INDEX / INDEPENDENT WORLDS</div>
          {PROJECTS.map((p, idx) => {
            const open = openProject === idx;
            return (
              <div key={p.n} className="projItem revealRise">
                <div
                  data-cursor="link"
                  data-proj
                  onClick={() => toggleProject(idx)}
                  className="projHeader"
                >
                  <span className="projNum">{p.n}</span>
                  <span>
                    <span className="projName">{p.name}</span>
                    <span className="projLine">{p.line}</span>
                  </span>
                  <span className="projTag">
                    {p.tag}
                    {open ? '  −' : '  +'}
                  </span>
                </div>

                {open && (
                  <div className="projPanel">
                    <div className="projPanelGrid">
                      <div>
                        <div className="fieldLabel">{'// FIELD NOTES'}</div>
                        {p.details.map((d, i) => (
                          <div key={i} className="fieldNote">
                            <span>▸</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="fieldLabel">{'// STACK'}</div>
                        <div className="stackText">{p.stack}</div>
                      </div>
                    </div>

                    <div className="screenMock">
                      <div className="screenChrome">
                        <span className="chromeDots">
                          <span className="chromeDot" style={{ background: 'var(--secondary)' }} />
                          <span className="chromeDot" style={{ background: '#ffd23c' }} />
                          <span className="chromeDot" style={{ background: 'var(--primary)' }} />
                        </span>
                        <span className="screenLabel">{p.screenLabel}</span>
                        <span className="liveTag">● LIVE</span>
                      </div>

                      {/* APP LAB — block-coding studio */}
                      {p.kind === 'applab' && (
                        <div className="applab">
                          <div className="phone">
                            <div className="phoneTitle">MY FIRST APP</div>
                            <div className="phoneScreen">
                              <div className="phoneBall" />
                              <div className="phoneScore">SCORE 07</div>
                              <div className="phoneTap">TAP ME</div>
                            </div>
                          </div>
                          <div className="blockCanvas">
                            <div className="blockCanvasLabel">BLOCK CANVAS</div>
                            {BLOCK_ROWS.map((b, i) => (
                              <div
                                key={i}
                                className="blockRow"
                                style={{ background: b.bg, marginLeft: b.ind * 22, animationDelay: b.d }}
                              >
                                {b.t}
                              </div>
                            ))}
                            <div className="blockHint">drag a block · preview updates instantly</div>
                          </div>
                        </div>
                      )}

                      {/* ARZEN — synchronized fleet wall */}
                      {p.kind === 'arzen' && (
                        <div data-wall data-wall-cols={WALL_COLS} className="wall">
                          <div className="wallHead">
                            <span>
                              FLEET · <span data-wall-count style={{ color: 'var(--primary)' }}>{WALL_COUNT}</span> SCREENS ONLINE
                            </span>
                            <span data-wall-status style={{ color: 'var(--primary)' }}>
                              ● PROPAGATING
                            </span>
                          </div>
                          <div className="wallGrid">
                            {Array.from({ length: WALL_COUNT }, (_, i) => (
                              <div key={i} data-wall-cell className="wallCell">
                                <div className="wallBars">
                                  <span className="wallBar" style={{ height: '60%' }} />
                                  <span className="wallBar" style={{ height: '90%' }} />
                                  <span className="wallBar" style={{ height: '40%' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DYNAMIC PRICING — cinema occupancy */}
                      {p.kind === 'pricing' && (
                        <div data-sim="pricing" data-occ="58" className="pricing">
                          <div>
                            <div className="screenCurve" />
                            <div className="screenWord">SCREEN</div>
                            <div className="seatGrid">
                              {Array.from({ length: SEAT_COUNT }, (_, i) => (
                                <div key={i} data-seat className="seat" />
                              ))}
                            </div>
                            <div className="seatLegend">
                              <span>
                                <span className="legendChip sold" />
                                SOLD
                              </span>
                              <span>
                                <span className="legendChip open" />
                                OPEN
                              </span>
                            </div>
                          </div>
                          <div className="priceSide">
                            <div className="miniLabel">PRICE / SEAT</div>
                            <div data-price-val className="priceVal">
                              ₹390
                            </div>
                            <div className="miniLabel" style={{ marginTop: 16 }}>
                              OCCUPANCY
                            </div>
                            <div data-occ-val className="occVal">
                              58%
                            </div>
                            <div data-trend className="trendVal">
                              STEADY →
                            </div>
                          </div>
                        </div>
                      )}

                      {/* UNTABOO — calm lesson reader */}
                      {p.kind === 'untaboo' && (
                        <div className="untaboo">
                          <div className="lessonKicker">LESSON 03 · OF 12</div>
                          <div className="lessonTitle">CONSENT &amp; BOUNDARIES</div>
                          <div className="streamLines">
                            {STREAM_LINES.map((l, i) => (
                              <span
                                key={i}
                                className="streamLine"
                                style={{ width: l.w, animationDelay: l.d }}
                              />
                            ))}
                          </div>
                          <div className="lessonSegs">
                            {Array.from({ length: UNTABOO_SEGMENTS }, (_, i) => (
                              <span
                                key={i}
                                className="lessonSeg"
                                style={{
                                  background:
                                    i < UNTABOO_DONE
                                      ? 'var(--primary)'
                                      : 'color-mix(in srgb, var(--text) 22%, transparent)',
                                }}
                              />
                            ))}
                          </div>
                          <div className="continueBtn">CONTINUE →</div>
                        </div>
                      )}

                      {/* SHAPING 3D — printer dashboard */}
                      {p.kind === 'shaping3d' && (
                        <div data-sim="shaping3d" data-prog="6" className="shaping">
                          <div className="chamber">
                            <div data-print-head className="printHead" />
                            <div data-print-obj className="printObj" />
                            <div className="printBase" />
                          </div>
                          <div className="printSide">
                            <div>
                              <div className="miniLabel">PROGRESS</div>
                              <div data-prog-val className="progVal">
                                6%
                              </div>
                              <div className="progTrack">
                                <div data-prog-bar className="progBar" />
                              </div>
                            </div>
                            <div className="printStats">
                              <div className="printStat">
                                <div className="miniLabelSm">NOZZLE</div>
                                <div data-nozzle className="statVal">
                                  205°C
                                </div>
                              </div>
                              <div className="printStat">
                                <div className="miniLabelSm">BED</div>
                                <div data-bed className="statVal">
                                  60°C
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="miniLabelSm">LAYER</div>
                              <div data-layer-val className="statValText">
                                014/240
                              </div>
                            </div>
                            <div className="printBtns">
                              <span className="btnGhost">PAUSE</span>
                              <span className="btnDanger">ABORT</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="projEnd" />
        </section>

        {/* CONTACT / VCARD */}
        <section id="contact" data-screen-label="CONTACT" className="section contact">
          <div className="contactTitle revealRise">TAKE A COPY</div>
          <div className="contactSub revealRise">No download button. Eject the disk.</div>

          <button
            ref={floppyRef}
            data-cursor="link"
            onClick={downloadVcard}
            onMouseEnter={floppyEnter}
            onMouseLeave={floppyLeave}
            className="floppy revealFade"
            aria-label="Download Utkarsh Mehta vCard"
          >
            <div className="floppyCorner" />
            <div className="floppyShutterR" />
            <div className="floppyShutterL" />
            <div className="floppyLabel">
              <div className="floppyLabelName">UTKARSH_MEHTA.vcf</div>
              <div className="floppyLabelSub">3.5&quot; · SOFTWARE · MUMBAI</div>
              <div className="floppyLabelBar" />
            </div>
          </button>
          <div className="floppyHint revealRise">CLICK TO DOWNLOAD vCARD</div>

          <div className="footerLine revealRise">UTKARSH MEHTA · 2026 · BUILT, NOT TEMPLATED</div>
        </section>
      </main>

      {/* ============ COLOR LAB ============ */}
      {labOpen && (
        <div className="lab">
          <div className="labHead">
            <div className="labTitle">COLOR LAB</div>
            <button data-cursor="link" onClick={toggleLab} className="closeBtn" aria-label="Close Color Lab">
              ✕
            </button>
          </div>
          <div className="labIntro">The site owns no single identity. Rewrite it.</div>

          <div className="labSectionLabel">PRESETS</div>
          <div className="presetGrid">
            {PRESET_NAMES.map((name) => {
              const p = PRESETS[name];
              const active = activeName === name;
              return (
                <button
                  key={name}
                  data-cursor="link"
                  onClick={() => applyPalette(name)}
                  className={`presetBtn${active ? ' presetBtnActive' : ''}`}
                >
                  <span className="swatches">
                    <span className="swatch" style={{ background: p.primary }} />
                    <span className="swatch" style={{ background: p.secondary }} />
                    <span className="swatch" style={{ background: p.highlight }} />
                  </span>
                  <span className="presetName">{name}</span>
                </button>
              );
            })}
          </div>

          <div className="labSectionLabel">TUNE</div>
          {editorKeys.map(({ key, label }) => (
            <label key={key} className="swatchRow">
              <span className="swatchRowLabel">{label}</span>
              <input
                type="color"
                value={palette[key]}
                onChange={(e) => tuneColor(key, e.target.value)}
                data-cursor="link"
                className="colorInput"
                aria-label={label}
              />
            </label>
          ))}

          <button data-cursor="link" onClick={saveCustom} className="saveBtn">
            ＋ SAVE THIS COMBINATION
          </button>

          {customs.length > 0 && (
            <div className="labSaved">
              <div className="labSectionLabel">SAVED</div>
              <div className="savedList">
                {customs.map((cu, idx) => (
                  <button
                    key={`${cu.name}-${idx}`}
                    data-cursor="link"
                    onClick={() => applyPalette(cu.name, cu.colors)}
                    className="savedBtn"
                  >
                    <span className="savedSwatches">
                      <span className="savedSwatch" style={{ background: cu.colors.primary }} />
                      <span className="savedSwatch" style={{ background: cu.colors.secondary }} />
                      <span className="savedSwatch" style={{ background: cu.colors.highlight }} />
                    </span>
                    {cu.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="labToggles">
            <button data-cursor="link" onClick={toggleReduced} className="toggleBtn">
              <span>REDUCED MOTION</span>
              <span className="toggleVal">{reduced ? 'ON' : 'OFF'}</span>
            </button>
            <button data-cursor="link" onClick={toggleSound} className="toggleBtn">
              <span>SOUND</span>
              <span className="toggleVal">{sound ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============ COMMAND PALETTE ============ */}
      {cmdOpen && (
        <div className="cmdOverlay" onClick={() => setCmdOpen(false)}>
          <div className="cmdBox" onClick={(e) => e.stopPropagation()}>
            <div className="cmdHeader">
              <span className="cmdIcon">⌕</span>
              <input
                ref={cmdInputRef}
                value={cmdQuery}
                onChange={(e) => {
                  setCmdQuery(e.target.value);
                  setCmdIndex(0);
                }}
                placeholder="navigate the system…"
                data-cursor="link"
                className="cmdInput"
              />
              <span className="cmdEsc">ESC</span>
            </div>
            <div className="cmdList">
              {filtered.map((cmd, idx) => (
                <div
                  key={cmd.id}
                  data-cursor="link"
                  onClick={() => cmd.act()}
                  onMouseEnter={() => setCmdIndex(idx)}
                  className={`cmdRow${idx === cmdIndex ? ' cmdRowActive' : ''}`}
                >
                  <span className="cmdRowMain">
                    <span className="cmdKind">{cmd.kind}</span>
                    <span className="cmdLabel">{cmd.label}</span>
                  </span>
                  <span className="cmdHint">{cmd.hint}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="cmdEmpty">no match. the system is still listening.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
