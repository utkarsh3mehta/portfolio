'use client';

// ============================================================================
// Utkarsh Mehta — the living site.
//
// A faithful React/Next port of the handcrafted prototype. One client
// component owns all state, refs and animation loops (canvas flow-field,
// living cursor, ARZEN node wall, chapter dots, live clock). The DOM-driven
// loops read the current palette through `palRef` so a palette swap recolours
// everything instantly without re-rendering 50 nodes per frame.
//
// Sections: scroll chapters · WHO AM I · projects · ARZEN · contact,
// plus the Color Lab, the ⌘K command palette and the alive cursor.
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
  MARQUEE_TEXT,
  ARZEN_COUNT,
  ARZEN_COLS,
  ARZEN_ROWS,
} from '@/lib/content';

type Cmd = { id: string; kind: string; label: string; hint: string; act: () => void };

function now(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

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

  // ---- DOM refs ----
  const bgRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cmdInputRef = useRef<HTMLInputElement>(null);
  const floppyRef = useRef<HTMLButtonElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  // ---- mutable refs the rAF loops read live ----
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
      'BEGIN:VCARD\nVERSION:3.0\nN:Mehta;Utkarsh;;;\nFN:Utkarsh Mehta\nTITLE:Software\nADR;TYPE=WORK:;;Mumbai;;;;India\nNOTE:Builds systems that should not work.\nEND:VCARD';
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

  // ---- command list (depends only on query + toggle labels) ----
  const filtered = useMemo<Cmd[]>(() => {
    const cmds: Cmd[] = [
      { id: 'top', kind: 'GOTO', label: 'Landing — the statement', hint: '↵', act: () => goto('top') },
      { id: 'who', kind: 'GOTO', label: 'Who am I — the fragments', hint: '↵', act: () => goto('who') },
      { id: 'projects', kind: 'GOTO', label: 'Projects — independent worlds', hint: '↵', act: () => goto('projects') },
      { id: 'arzen', kind: 'GOTO', label: 'ARZEN — synchronized screen wall', hint: '↵', act: () => goto('arzen') },
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
    let arzenRaf = 0;
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

    // ----- ARZEN node wall: signal propagation + offline/recover -----
    const startArzen = () => {
      const cells = Array.from(document.querySelectorAll<HTMLElement>('[data-arzen-cell]'));
      if (!cells.length) {
        arzenRaf = requestAnimationFrame(() => window.setTimeout(startArzen, 400));
        return;
      }
      const cols = ARZEN_COLS;
      const offline = new Set<number>();
      let originX = 0;
      let originY = 0;
      let front = 0;
      let active = false;
      let idle = 0;
      const statusEl = document.getElementById('arzen-status');
      const countEl = document.getElementById('arzen-count');
      const loop = () => {
        if (stopRef.current) return;
        if (reducedRef.current) {
          arzenRaf = requestAnimationFrame(() => window.setTimeout(loop, 200));
          return;
        }
        idle++;
        if (!active && idle > 70) {
          active = true;
          idle = 0;
          front = 0;
          originX = Math.floor(Math.random() * cols);
          originY = Math.floor(Math.random() * ARZEN_ROWS);
          if (statusEl) {
            statusEl.textContent = `● SIGNAL FROM NODE ${originY * cols + originX}`;
            statusEl.style.color = palRef.current.primary;
          }
          blip(880);
        }
        if (active) {
          front += 0.5;
          cells.forEach((cell, i) => {
            const cx = i % cols;
            const cy = Math.floor(i / cols);
            const d = Math.hypot(cx - originX, cy - originY);
            const band = Math.abs(d - front);
            if (offline.has(i)) {
              cell.style.background = hexA(palRef.current.secondary, 0.12);
              cell.style.borderColor = hexA(palRef.current.secondary, 0.6);
              cell.style.boxShadow = 'none';
            } else if (band < 0.9) {
              cell.style.background = palRef.current.primary;
              cell.style.borderColor = palRef.current.primary;
              cell.style.boxShadow = `0 0 14px ${hexA(palRef.current.primary, 0.7)}`;
            } else {
              cell.style.background = hexA(palRef.current.bg, 0.7);
              cell.style.borderColor = hexA(palRef.current.text, 0.35);
              cell.style.boxShadow = 'none';
            }
          });
          if (front > 16) {
            active = false;
            if (statusEl) statusEl.textContent = `● SYNCED · ${new Date().toLocaleTimeString()}`;
            if (Math.random() > 0.4) {
              const k = Math.floor(Math.random() * cells.length);
              offline.add(k);
              if (countEl) countEl.textContent = String(ARZEN_COUNT - offline.size);
              window.setTimeout(() => {
                offline.delete(k);
                if (countEl) countEl.textContent = String(ARZEN_COUNT - offline.size);
              }, 2600);
            }
          }
        }
        arzenRaf = requestAnimationFrame(loop);
      };
      loop();
    };
    startArzen();

    // ----- chapter progress dots (plain scroll listener) -----
    const chapterEls = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
    const dotEls = Array.from(document.querySelectorAll<HTMLElement>('[data-dot]'));
    const updateChapter = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestD = Infinity;
      chapterEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height / 2;
        const d = Math.abs(c - mid);
        if (d < bestD) {
          bestD = d;
          best = parseInt(el.dataset.chapter || '0', 10);
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
      rafs.forEach((id) => cancelAnimationFrame(id));
      if (cursorRaf) cancelAnimationFrame(cursorRaf);
      if (arzenRaf) cancelAnimationFrame(arzenRaf);
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

      {/* chapter progress dots */}
      <div className="dots" aria-hidden>
        {CHAPTERS.map((c) => (
          <span key={c.i} data-dot={c.i} className="dot" />
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
        {/* CHAPTERS */}
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
            {/* terminal */}
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

            {/* git log */}
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

            {/* coordinates */}
            <div className="card cardPrimary revealFade" style={{ transform: 'rotate(-0.8deg)' }}>
              <div className="cardLabel">COORDINATES</div>
              <div className="coordBig">19.0760°N</div>
              <div className="coordBig" style={{ color: 'var(--primary)' }}>
                72.8777°E
              </div>
              <div className="coordSub">MUMBAI · GMT+5:30 · ALWAYS DEPLOYING</div>
            </div>

            {/* console */}
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

            {/* abandoned sketch */}
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

            {/* deploy log */}
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

        {/* PROJECTS */}
        <section id="projects" data-screen-label="PROJECTS" className="section projects">
          <div className="sectionLabel revealRise">INDEX / INDEPENDENT WORLDS</div>
          {PROJECTS.map((p) => (
            <a key={p.n} href={p.href} data-cursor="link" className="projRow revealRise">
              <span className="projNum">{p.n}</span>
              <span>
                <span className="projName">{p.name}</span>
                <span className="projLine">{p.line}</span>
              </span>
              <span className="projTag">{p.tag} ↗</span>
            </a>
          ))}
          <div className="projEnd" />
        </section>

        {/* ARZEN PROJECT WORLD */}
        <section id="arzen" data-screen-label="ARZEN" className="arzen">
          <div className="arzenInner">
            <div className="arzenHead">
              <div className="arzenTitle revealRise">ARZEN</div>
              <div className="arzenMeta revealRise">
                FLEET CONFIG SYNC
                <br />
                ENTER ANOTHER UNIVERSE →
              </div>
            </div>
            <div className="arzenStatement revealRise">
              One update reaches thousands. Synchronization becomes performance art.
            </div>

            <div className="arzenBox">
              <div className="arzenBoxHead">
                <span>
                  NODE WALL · <span id="arzen-count" style={{ color: 'var(--primary)' }}>{ARZEN_COUNT}</span> ONLINE
                </span>
                <span id="arzen-status" style={{ color: 'var(--primary)' }}>
                  ● PROPAGATING
                </span>
              </div>
              <div className="arzenGrid">
                {Array.from({ length: ARZEN_COUNT }, (_, i) => (
                  <div key={i} data-arzen-cell={i} className="arzenCell">
                    <div className="cellBars">
                      <span className="bar" style={{ height: '60%' }} />
                      <span className="bar" style={{ height: '90%' }} />
                      <span className="bar" style={{ height: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="arzenLegend">
                <span>◆ signal travels visually</span>
                <span>◆ offline nodes reconnect</span>
                <span>◆ failures recover</span>
              </div>
            </div>
          </div>
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
