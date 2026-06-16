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

// The landing statement: one massive word per screen.
// BUILDING / SYSTEMS / THAT / SHOULD / NOT / WORK
export const CHAPTERS: Chapter[] = [
  { i: 0, n: '00', kicker: 'CHAPTER 00', word: 'BUILDING', line: 'Latency leaves fingerprints.' },
  { i: 1, n: '01', kicker: 'CHAPTER 01', word: 'SYSTEMS', line: 'Queues remember everything.' },
  { i: 2, n: '02', kicker: 'CHAPTER 02', word: 'THAT', line: 'Every shortcut creates another map.' },
  { i: 3, n: '03', kicker: 'CHAPTER 03', word: 'SHOULD', line: 'Rendering is negotiation.' },
  { i: 4, n: '04', kicker: 'CHAPTER 04', word: 'NOT', line: 'Automation compounds quietly.' },
  { i: 5, n: '05', kicker: 'CHAPTER 05', word: 'WORK', line: 'Architecture is accumulated memory.' },
];

export type Project = {
  n: string;
  name: string;
  line: string;
  tag: string;
  href: string;
};

// Projects exist as independent worlds. ARZEN is the fully realised one.
export const PROJECTS: Project[] = [
  { n: '01', name: 'APP LAB', line: 'A React engine disguised as childrens software. Watch the virtual DOM think.', tag: 'INTERACTIVE', href: '#arzen' },
  { n: '02', name: 'ARZEN', line: 'One update reaches thousands of screens. Synchronization as performance art.', tag: 'ENTER', href: '#arzen' },
  { n: '03', name: 'DYNAMIC PRICING', line: 'Occupancy breathes. Demand reshapes geometry. Pricing bends space.', tag: 'LIVING', href: '#arzen' },
  { n: '04', name: 'UNTABOO', line: 'A calm interruption. Whitespace, human rhythm, streaming. Education first.', tag: 'CALM', href: '#arzen' },
  { n: '05', name: '3D PLATFORM', line: 'Industrial telemetry with a heartbeat. Everything moves. Everything operational.', tag: 'TELEMETRY', href: '#arzen' },
];

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

// ARZEN node wall geometry.
export const ARZEN_COUNT = 50;
export const ARZEN_COLS = 10;
export const ARZEN_ROWS = 5;
