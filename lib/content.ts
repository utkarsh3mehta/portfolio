// ============================================================================
// CONTENT — every sentence behaves like a poster. No bio. No buzzwords.
// ============================================================================

export type Chapter = {
  i: number;
  n: string;
  kicker: string;
  word: string;
  line: string;
};

// The landing statement, across two full screens:
// BUILDING SYSTEMS / THAT SHOULD NOT WORK
export const CHAPTERS: Chapter[] = [
  {
    i: 0,
    n: '00',
    kicker: 'CHAPTER 00',
    word: 'BUILDING SYSTEMS',
    line: 'Latency leaves fingerprints. Queues remember everything.',
  },
  {
    i: 1,
    n: '01',
    kicker: 'CHAPTER 01',
    word: 'THAT SHOULD NOT WORK',
    line: 'Automation compounds quietly. Architecture is accumulated memory.',
  },
];

export type ProjectKind = 'applab' | 'arzen' | 'pricing' | 'untaboo' | 'shaping3d';

export type Project = {
  n: string;
  name: string;
  kind: ProjectKind;
  screenLabel: string;
  line: string;
  tag: string;
  stack: string;
  details: string[];
};

// Projects exist as independent worlds. Each accordion opens a live mockup of
// the actual product it describes.
export const PROJECTS: Project[] = [
  {
    n: '01',
    name: 'APP LAB',
    kind: 'applab',
    screenLabel: 'applab.studio',
    line: 'A coding laboratory where students build real mobile apps by snapping blocks together.',
    tag: 'BUILD',
    stack: 'BLOCK EDITOR · LIVE PREVIEW · PUBLISH',
    details: [
      'Drag blocks to assemble a working mobile app',
      'A live phone preview updates as you build',
      'Publish to a real device when the class is done',
    ],
  },
  {
    n: '02',
    name: 'ARZEN',
    kind: 'arzen',
    screenLabel: 'arzen.fleet',
    line: 'One config update reaches thousands of screens. Synchronization as performance art.',
    tag: 'FLEET SYNC',
    stack: 'WEBSOCKETS · CRDT · EDGE CACHE',
    details: [
      'One config push propagates across the entire wall',
      'Offline nodes reconnect and self-heal',
      'Failure and recovery rendered as a live signal',
    ],
  },
  {
    n: '03',
    name: 'DYNAMIC PRICING',
    kind: 'pricing',
    screenLabel: 'boxoffice.live',
    line: 'A cinema ticketing tool that reprices every seat the moment occupancy shifts.',
    tag: 'CINEMA',
    stack: 'SEAT MAP · OCCUPANCY ENGINE · PRICE RULES',
    details: [
      'The seat map fills in real time as tickets sell',
      'Prices rise automatically with occupancy',
      'Showtimes balance themselves toward full houses',
    ],
  },
  {
    n: '04',
    name: 'UNTABOO',
    kind: 'untaboo',
    screenLabel: 'untaboo.learn',
    line: 'A calm sex-education web app that teaches students clearly, without shame.',
    tag: 'LEARN',
    stack: 'STREAMING LESSONS · TYPOGRAPHY-FIRST',
    details: [
      'Lessons paced for unhurried, private reading',
      'Plain language, zero judgement, no clutter',
      'Progress saved quietly between sessions',
    ],
  },
  {
    n: '05',
    name: 'SHAPING 3D',
    kind: 'shaping3d',
    screenLabel: 'shaping3d.dash',
    line: 'A dashboard to drive and monitor a 3D printer from the first layer to the last.',
    tag: 'PRINTER',
    stack: 'WEBGL VIEW · LIVE TELEMETRY · G-CODE',
    details: [
      'Watch the model build up layer by layer',
      'Nozzle and bed temperatures tracked live',
      'Pause, resume or abort any job remotely',
    ],
  },
];

// App Lab — block-coding canvas rows (snap-together visual code).
export type BlockRow = { t: string; bg: string; ind: number; d: string };
export const BLOCK_ROWS: BlockRow[] = [
  { t: 'WHEN APP STARTS', bg: 'var(--highlight)', ind: 0, d: '.05s' },
  { t: 'REPEAT 10 TIMES', bg: 'var(--secondary)', ind: 0, d: '.14s' },
  { t: 'MOVE SPRITE BY 24', bg: 'var(--primary)', ind: 1, d: '.23s' },
  { t: 'PLAY TONE  C4', bg: '#ffd23c', ind: 1, d: '.32s' },
  { t: 'IF TAPPED → SCORE +1', bg: 'var(--secondary)', ind: 0, d: '.41s' },
];

// ARZEN fleet wall (inside its accordion).
export const WALL_COUNT = 24;
export const WALL_COLS = 8;

// Dynamic Pricing seat map.
export const SEAT_COUNT = 45;

// UnTaboo lesson progress segments.
export const UNTABOO_SEGMENTS = 12;
export const UNTABOO_DONE = 3;

// Bottom ticker — infinite marquee of operating principles.
export const MARQUEE_PHRASES = [
  'LATENCY LEAVES FINGERPRINTS',
  'QUEUES REMEMBER EVERYTHING',
  'AUTOMATION COMPOUNDS QUIETLY',
  'RENDERING IS NEGOTIATION',
  'FAILURES DESERVE DOCUMENTATION',
  'ARCHITECTURE IS ACCUMULATED MEMORY',
  'SILENCE CARRIES INFORMATION',
];

export const MARQUEE_TEXT = MARQUEE_PHRASES.join('  ✦  ') + '  ✦  ';

// Right-rail progress dots track these five sections, in order.
export const NAV_SECTIONS = [
  '[data-chapter="0"]',
  '[data-chapter="1"]',
  '#who',
  '#projects',
  '#contact',
];
