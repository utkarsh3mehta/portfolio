export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  domain: string;
  color: string;

  problem: string;
  context: string;
  constraint: string;
  decision: string;
  architecture: ArchNode[];
  tradeoffs: Tradeoff[];
  failure: FailureNote;
  iteration: string;
  outcome: Outcome;
  lessons: string[];
}

export interface ArchNode {
  id: string;
  label: string;
  type: "service" | "store" | "queue" | "client" | "external";
  description: string;
  connects: string[];
}

export interface Tradeoff {
  chose: string;
  over: string;
  because: string;
}

export interface FailureNote {
  what: string;
  discovered: string;
  impact: string;
}

export interface Outcome {
  headline: string;
  metrics: { label: string; value: string }[];
  businessEffect: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "dynamic-pricing",
    title: "Dynamic Pricing Engine",
    tagline: "Replacing a static pricing model without a single minute of downtime.",
    year: "2023",
    domain: "Hospitality SaaS",
    color: "#7C6B4A",

    problem:
      "A hospitality SaaS product priced every room identically regardless of occupancy, season, or local events. Competitors offering dynamic pricing were winning deals. The product needed to think.",

    context:
      "The existing system was a ten-year-old monolith. Pricing happened inside a stored procedure that three people were afraid to touch. There were 1,400 active contracts all referencing the old pricing model. Any migration that broke a single invoice was a support crisis.",

    constraint:
      "Zero downtime. No contract renegotiation. The business could not tell clients that pricing was changing — it had to simply improve. And it had to ship in six weeks.",

    decision:
      "Instead of replacing the pricing model, I introduced an event-sourced pricing layer alongside it. The monolith continued to emit pricing requests; a new engine answered them. The engine's decisions were idempotent and fully auditable. The old system gradually received less traffic until it was inert.",

    architecture: [
      { id: "booking", label: "Booking API", type: "client", description: "Existing monolith. Unmodified.", connects: ["router"] },
      { id: "router", label: "Pricing Router", type: "service", description: "Intercepts pricing requests. Routes to legacy or engine based on feature flag.", connects: ["legacy", "engine"] },
      { id: "legacy", label: "Legacy Pricing", type: "service", description: "Unchanged stored procedure. Receives 0% traffic after cutover.", connects: ["ledger"] },
      { id: "engine", label: "Pricing Engine", type: "service", description: "Event-sourced. Reads occupancy signals, demand forecasts, and competitor rates.", connects: ["signals", "ledger", "audit"] },
      { id: "signals", label: "Signal Store", type: "store", description: "Occupancy, events, competitor rates. Updated every 15 minutes.", connects: [] },
      { id: "audit", label: "Audit Log", type: "store", description: "Every pricing decision stored as an immutable event. Replay at any time.", connects: [] },
      { id: "ledger", label: "Invoice Ledger", type: "store", description: "Single source of truth for all generated invoices.", connects: [] },
    ],

    tradeoffs: [
      {
        chose: "Event sourcing",
        over: "Direct database mutation",
        because: "Auditability was a hard requirement. When a pricing decision is wrong, we need to replay exactly what the engine saw.",
      },
      {
        chose: "Feature flag migration",
        over: "Big-bang cutover",
        because: "The cost of a mistake was too high. Gradual rollout let us catch race conditions under 2% traffic before they affected 100%.",
      },
      {
        chose: "Competitor rates as signal, not rule",
        over: "Rule-based competitor matching",
        because: "Rules encode yesterday's market. A signal lets the engine's decision function evolve without redeployment.",
      },
    ],

    failure: {
      what: "A race condition in concurrent booking scenarios caused price drift. If two bookings were priced within 50ms of each other and occupancy crossed a threshold between them, the second booking used stale occupancy data.",
      discovered: "Discovered during load testing at 3× normal booking volume. Caught before production.",
      impact: "Estimated drift of ~3% on affected bookings. In testing only — zero customer impact.",
    },

    iteration:
      "Added optimistic locking with version vectors on the occupancy store. Each pricing call now includes the occupancy snapshot version it read from. If another call has advanced the version, the second call retries. Latency increased by 8ms at the 99th percentile — a fair trade.",

    outcome: {
      headline: "$2.4M in automated pricing decisions. Zero customer complaints.",
      metrics: [
        { label: "Revenue lift", value: "18%/avg" },
        { label: "Pricing decisions automated", value: "$2.4M" },
        { label: "Migration time", value: "6 weeks" },
        { label: "Downtime", value: "0ms" },
        { label: "Contracts affected", value: "1,400" },
        { label: "Support tickets", value: "0" },
      ],
      businessEffect:
        "The product team gained a competitive differentiator that took a year to develop but six weeks to deploy safely. The pricing engine now handles seasonal peaks without human intervention. Three competitors are still using static pricing.",
    },

    lessons: [
      "When correctness matters more than speed, make state transitions explicit and auditable.",
      "Gradual migration is always slower and always worth it.",
      "A race condition under 2× load is a production incident waiting to happen. Test at 5×.",
      "Event sourcing adds complexity upfront. It removes all the complexity later.",
    ],
  },

  {
    slug: "arzen",
    title: "Arzen Digital Signage",
    tagline: "Synchronizing 12,000 screens across 23 cities without a central clock.",
    year: "2022",
    domain: "Retail Infrastructure",
    color: "#4A6B7C",

    problem:
      "A retail chain needed to push content updates to 12,000+ digital displays across 23 cities. Updates had to be atomic — no screen could show a half-rendered campaign. Connectivity was unreliable. Some screens were offline for hours.",

    context:
      "The existing system was a broadcast-based push model. A central server emitted updates. Screens received them or didn't. There was no acknowledgment protocol, no conflict resolution, and no way to know what state any given screen was in at any moment.",

    constraint:
      "No cellular upgrade budget. Existing hardware. Updates had to guarantee eventual consistency with no partial-render states. The system had to degrade gracefully — a screen that lost connectivity could not show an error or blank.",

    decision:
      "Each screen became a state machine, not a receiver. Screens maintained local state and requested diffs when they reconnected. Content was versioned and content packages were content-addressed (hash-based). A screen only applied an update if its local hash matched the expected predecessor.",

    architecture: [
      { id: "cms", label: "CMS", type: "client", description: "Content operators publish campaigns. Tags content with version vector.", connects: ["cdn", "registry"] },
      { id: "cdn", label: "Content CDN", type: "external", description: "Content-addressed packages. Immutable once uploaded.", connects: ["screen"] },
      { id: "registry", label: "State Registry", type: "store", description: "Stores the current expected state hash for every screen.", connects: ["sync"] },
      { id: "sync", label: "Sync Service", type: "service", description: "Screens poll this on reconnect. Returns diff from current state to target state.", connects: ["screen", "registry"] },
      { id: "screen", label: "Screen Agent", type: "service", description: "State machine. Applies updates atomically. Falls back to last-known-good on failure.", connects: ["sync", "cdn"] },
      { id: "telemetry", label: "Telemetry Bus", type: "queue", description: "Screens emit health signals. Ops dashboard reads from here.", connects: [] },
    ],

    tradeoffs: [
      {
        chose: "Content-addressed packages",
        over: "Mutable content URLs",
        because: "A screen must be certain that what it downloaded is exactly what was published. Hash-based content makes verification O(1).",
      },
      {
        chose: "Pull-based sync",
        over: "Push-based broadcast",
        because: "Push assumes connectivity. Pull assumes disconnection. When 20% of screens reconnect simultaneously, pull with jittered backoff distributes the load naturally.",
      },
      {
        chose: "Atomic state transitions",
        over: "Incremental asset loading",
        because: "A screen that shows half a campaign is worse than a screen that shows yesterday's campaign. The previous state is always the safe fallback.",
      },
    ],

    failure: {
      what: "When connectivity restored after a regional outage, 3,000 screens reconnected within a 90-second window. Every screen requested its full sync immediately. The Sync Service received 33 requests per second instead of the expected 2-3. It crashed. All screens fell back to last-known-good state, which was the correct behavior — but the cascade took 20 minutes to resolve.",
      discovered: "In production. During a planned maintenance window that coincided with an ISP outage.",
      impact: "No screens went dark. No partial renders. But the new campaign launched 20 minutes late across the affected region.",
    },

    iteration:
      "Added jittered reconnection windows. Each screen waits a random interval (5–180 seconds) after detecting connectivity before requesting sync. Combined with exponential backoff on the sync service side. Tested at 10× the maximum observed reconnect rate. The thundering herd no longer materializes.",

    outcome: {
      headline: "99.97% uptime. Sync latency under 3 seconds globally.",
      metrics: [
        { label: "Screens managed", value: "12,000+" },
        { label: "Cities", value: "23" },
        { label: "Fleet uptime", value: "99.97%" },
        { label: "Sync latency (p99)", value: "<3s" },
        { label: "Partial renders", value: "0" },
        { label: "Requests/day", value: "47M+" },
      ],
      businessEffect:
        "Campaigns now go live simultaneously across all 23 cities within seconds. The content team that used to manage deployment windows now schedules content months in advance and forgets about it. Maintenance cost dropped 60% because errors surface before they become incidents.",
    },

    lessons: [
      "Design distributed systems for the failure path first. The happy path is easy.",
      "Thundering herd is not a theoretical concern. It will happen the day you least want it to.",
      "Content-addressed storage is one of those ideas that looks complicated until you implement it, and then you never go back.",
      "Last-known-good is not failure. It's resilience. Design fallbacks as first-class features.",
    ],
  },

  {
    slug: "app-lab",
    title: "App Lab",
    tagline: "A React-like framework built to teach state, not to ship products.",
    year: "2021",
    domain: "Education Technology",
    color: "#5A7A5A",

    problem:
      "Teaching component-based UI development to beginners failed consistently. The abstraction gap between 'HTML is a file' and 'React is a runtime' was too wide. Students memorized syntax without understanding the mental model.",

    context:
      "Existing tools were either too simple (CodePen, no components) or too complex (Create React App, 700MB of tooling for hello world). Students needed to see the mechanism — the virtual DOM, the reconciler, the component tree — not just use it.",

    constraint:
      "Must run entirely in-browser. Zero installation. First meaningful paint under 2 seconds. And it had to be small enough that a student could read the entire source and understand every line.",

    decision:
      "Build a minimal React-inspired component framework whose internals were visible and legible. The framework itself would be the curriculum. Students would write components in a JSX-like syntax, watch the virtual DOM diff in a live panel, and modify the framework source as an exercise.",

    architecture: [
      { id: "editor", label: "Code Editor", type: "client", description: "Monaco-based. Students write component code here.", connects: ["parser"] },
      { id: "parser", label: "Template Parser", type: "service", description: "Tagged template literals transform to virtual DOM nodes. No build step.", connects: ["vdom"] },
      { id: "vdom", label: "Virtual DOM", type: "service", description: "~400 lines. Creates element descriptors. Diffs against previous render.", connects: ["reconciler"] },
      { id: "reconciler", label: "Reconciler", type: "service", description: "Walks the diff, produces a minimal set of DOM mutations.", connects: ["renderer", "devtools"] },
      { id: "renderer", label: "Native Renderer", type: "service", description: "Applies mutations to real DOM. Batches updates via requestAnimationFrame.", connects: ["preview"] },
      { id: "devtools", label: "DevTools Panel", type: "service", description: "Visualizes component tree, state at each node, and diff operations.", connects: [] },
      { id: "preview", label: "Live Preview", type: "client", description: "Renders output in sandboxed iframe.", connects: [] },
    ],

    tradeoffs: [
      {
        chose: "Tagged template literals",
        over: "JSX transpilation",
        because: "A transpiler is invisible. Tagged templates are native JavaScript. Students could trace exactly how their HTML string became a virtual DOM node.",
      },
      {
        chose: "~1000 lines total",
        over: "Feature completeness",
        because: "A framework students can read is a framework they can reason about. Every feature added is one more thing that obscures the concept.",
      },
      {
        chose: "Visible devtools by default",
        over: "DevTools as optional addon",
        because: "The mental model — component tree, state, re-renders — had to be visible at all times. Understanding only happens when you can see what's happening.",
      },
    ],

    failure: {
      what: "The first implementation used a real transpilation pipeline (Babel in a web worker). It was 40MB, took 8 seconds to initialize, and crashed on mobile. Students who had to wait for a spinner before seeing any output had already lost interest.",
      discovered: "First classroom session. Half the students gave up during the loading screen.",
      impact: "The first cohort never saw the devtools panel. Retention in week 2 dropped to 30%.",
    },

    iteration:
      "Rebuilt from scratch without a build step. Tagged template literals, no transpiler, no Babel. Load time dropped to 800ms. The entire framework became part of the curriculum — students modified the reconciler as homework.",

    outcome: {
      headline: "180+ students who can reason about component trees.",
      metrics: [
        { label: "Framework size", value: "<1000 lines" },
        { label: "Initial load", value: "<800ms" },
        { label: "Dependencies", value: "0" },
        { label: "Students taught", value: "180+" },
        { label: "Week-2 retention (v2)", value: "84%" },
        { label: "Students who modified the framework", value: "62%" },
      ],
      businessEffect:
        "Students from this cohort understood React when they encountered it because they had already built one. Retention in subsequent React modules improved by 3× compared to the previous cohort. Several students cited the framework internals as their interview talking point.",
    },

    lessons: [
      "Teaching tools must optimize for conceptual clarity. Features obscure. Simplicity reveals.",
      "If students are waiting for a spinner, you've already lost them.",
      "The best way to teach how something works is to make it small enough to read.",
      "A framework designed to be modified is a better teaching tool than one designed to be correct.",
    ],
  },

  {
    slug: "untaboo",
    title: "UnTaboo",
    tagline: "Delivering sensitive health education where network filters try to block it.",
    year: "2022",
    domain: "Health Education",
    color: "#6B4A7C",

    problem:
      "A sexual health education platform needed to reach teenagers in conservative school environments. Network filters blocked content. Bandwidth was unreliable. The content itself required careful moderation to stay accurate and age-appropriate.",

    context:
      "The platform had real medical content written by doctors. It also had to pass through ISP-level keyword filters that couldn't distinguish between clinical terminology and prohibited content. Schools were blocking the domain entirely.",

    constraint:
      "Must work on 2G connections. Must survive keyword filters without compromising medical accuracy. Content moderation had to be human-reviewed but scale to thousands of new submissions per month.",

    decision:
      "Rebuilt as an offline-first PWA with content stored as a semantic knowledge graph rather than keyword-indexed documents. Content was tagged with semantic relationships, not raw text. Search worked against the graph, not the content. Filtering systems saw structure, not sensitive terms.",

    architecture: [
      { id: "pwa", label: "PWA Shell", type: "client", description: "Offline-first. Service worker caches critical content. Works on 2G.", connects: ["graph-api", "search"] },
      { id: "graph-api", label: "Content Graph API", type: "service", description: "Returns content nodes by relationship traversal. No raw text in API responses.", connects: ["knowledge-graph", "moderation"] },
      { id: "knowledge-graph", label: "Knowledge Graph", type: "store", description: "Medical concepts as nodes. Relationships as edges. Age-appropriate branching.", connects: [] },
      { id: "search", label: "Semantic Search", type: "service", description: "Query intent mapped to graph traversal. Search doesn't match keywords.", connects: ["knowledge-graph"] },
      { id: "moderation", label: "Moderation Pipeline", type: "service", description: "Human-in-the-loop review. Confidence thresholds determine automation level.", connects: ["review-queue"] },
      { id: "review-queue", label: "Review Queue", type: "queue", description: "Items below confidence threshold go to human reviewers.", connects: [] },
    ],

    tradeoffs: [
      {
        chose: "Semantic knowledge graph",
        over: "CMS with keyword search",
        because: "Keyword-based content is trivially blocked by network filters. Graph traversal exposes relationships, not sensitive terms.",
      },
      {
        chose: "Offline-first PWA",
        over: "Server-rendered pages",
        because: "In low-bandwidth environments, connectivity is intermittent. Content cached during a good connection must be available during a bad one.",
      },
      {
        chose: "Human-in-the-loop moderation at confidence thresholds",
        over: "Fully automated moderation",
        because: "Automated moderation on medical content either over-blocks legitimate content or under-catches harmful content. Humans review the ambiguous cases; automation handles the clear ones.",
      },
    ],

    failure: {
      what: "The first moderation pipeline was fully automated with a conservative classifier. It removed 31% of legitimate medical content flagged as sensitive. Doctors who contributed content stopped submitting.",
      discovered: "After two months of declining content quality. A doctor who stopped contributing emailed to explain why.",
      impact: "Lost 40% of content contributors. Had to rebuild the content library from scratch.",
    },

    iteration:
      "Added confidence scores to every moderation decision. Content above 0.95 confidence is auto-approved. Content below 0.60 is auto-rejected. Everything in between goes to a queue reviewed by a qualified health professional within 24 hours. Contributor satisfaction returned to baseline within one month.",

    outcome: {
      headline: "200K+ students reached. Content stays online.",
      metrics: [
        { label: "Students reached", value: "200K+" },
        { label: "States", value: "3" },
        { label: "Content blocks", value: "0" },
        { label: "Moderation accuracy", value: "97.4%" },
        { label: "Offline availability", value: "100%" },
        { label: "2G load time (p95)", value: "<4s" },
      ],
      businessEffect:
        "The platform is now used in school curricula across three states. Health teachers report that students engage with content outside classroom hours. The semantic search approach was later licensed to two other health education platforms.",
    },

    lessons: [
      "Know your adversary. Design for the network filters, the firewall rules, the conservative keyword blockers.",
      "Automated moderation on sensitive content requires calibration, not confidence. Know what you're optimizing for.",
      "Offline-first is not a feature. In low-connectivity environments, it's the product.",
      "When domain experts stop contributing, the problem is the process, not the experts.",
    ],
  },

  {
    slug: "industrial-3d",
    title: "Industrial 3D Platform",
    tagline: "An operations center for machines that cost $50K per failed print.",
    year: "2023",
    domain: "Manufacturing",
    color: "#7C4A4A",

    problem:
      "Industrial 3D printing facilities were losing prints to failures that took hours to become visible. A print failure on an industrial machine costs $50K–200K in material, machine time, and missed delivery. The only monitoring was a technician walking the floor twice a shift.",

    context:
      "The machines were from five different manufacturers with five different telemetry formats. Some exposed APIs. Some didn't. Some had cameras. Some didn't. The team wanted a single operations view — but the data landscape was heterogeneous and hostile.",

    constraint:
      "Real-time. Any telemetry older than 30 seconds was operationally useless for early failure detection. Machine manufacturers could not be required to change firmware. The budget covered software only.",

    decision:
      "Built an operations center with a telemetry abstraction layer that translated each manufacturer's data format into a common event schema. Anomaly detection operated on the normalized stream. Camera feeds ran through a lightweight local model that detected visual anomalies before they became structural failures.",

    architecture: [
      { id: "machines", label: "Machine Fleet", type: "client", description: "5 manufacturers. Heterogeneous APIs. Some webhook, some poll.", connects: ["adapters"] },
      { id: "adapters", label: "Telemetry Adapters", type: "service", description: "Per-manufacturer translation layer. Normalizes to common event schema.", connects: ["event-bus"] },
      { id: "event-bus", label: "Event Bus", type: "queue", description: "Time-series events. Retained for 30 days. Streamed to all subscribers.", connects: ["anomaly", "ops-center", "ts-db"] },
      { id: "ts-db", label: "Time-Series DB", type: "store", description: "Stores all telemetry. Context windows for anomaly baseline computation.", connects: ["anomaly"] },
      { id: "anomaly", label: "Anomaly Engine", type: "service", description: "ML-based detection with per-machine contextual baselines. Flags deviations.", connects: ["alert"] },
      { id: "cameras", label: "Camera Network", type: "client", description: "Local edge models detect visual anomalies. Frames only sent on deviation.", connects: ["ops-center"] },
      { id: "alert", label: "Alert Router", type: "service", description: "Routes anomalies to the right team. Priority-weighted. Deduplicates.", connects: ["ops-center"] },
      { id: "ops-center", label: "Operations Center", type: "client", description: "Real-time dashboard. Telemetry streams. Camera feeds. Machine lifecycle.", connects: [] },
    ],

    tradeoffs: [
      {
        chose: "Telemetry abstraction layer",
        over: "Direct manufacturer integrations",
        because: "Manufacturers change APIs. Adding a new manufacturer must not require touching the core system. The adapter is disposable; the schema is permanent.",
      },
      {
        chose: "Contextual baselines per machine",
        over: "Global anomaly thresholds",
        because: "Machine A running at 78°C may be normal. Machine B at 78°C may be failing. A global threshold produces alerts that operators learn to ignore.",
      },
      {
        chose: "Edge inference for cameras",
        over: "Cloud video streaming",
        because: "Streaming 40 camera feeds continuously was cost-prohibitive. Local edge models sent only frames flagged as anomalous — reducing bandwidth by 97%.",
      },
    ],

    failure: {
      what: "The first alerting system used static thresholds. It generated 78% false positive alerts within the first two weeks. Operators muted the alert channel.",
      discovered: "During the first operational week. A senior technician mentioned he had turned off notifications.",
      impact: "Three real failures occurred during this period that were caught manually — not by the system.",
    },

    iteration:
      "Replaced static thresholds with per-machine contextual baselines computed over rolling 72-hour windows. Alert confidence scores were added. Low-confidence anomalies were grouped and reviewed in a daily digest rather than triggering immediate alerts. False positive rate dropped from 78% to 4%.",

    outcome: {
      headline: "67% reduction in print failures. 4,200 hours saved.",
      metrics: [
        { label: "Print failure reduction", value: "67%" },
        { label: "Engineering hours saved", value: "4,200+" },
        { label: "False positive rate", value: "4%" },
        { label: "Alert latency", value: "<30s" },
        { label: "Machines monitored", value: "140+" },
        { label: "Camera bandwidth reduction", value: "97%" },
      ],
      businessEffect:
        "The facility went from detecting failures after they happened to preventing them. One prevented failure per month pays for the entire system. The operations team reduced floor walk frequency from 6× per shift to 2×, redirecting that time to maintenance planning.",
    },

    lessons: [
      "Alert fatigue is worse than no alerts. A muted alert channel is a monitoring system with zero coverage.",
      "Contextual baselines always outperform global thresholds. Everything depends on what normal looks like for this specific machine.",
      "An abstraction layer for heterogeneous data is not overhead. It's what makes the system extensible.",
      "Edge inference exists for a reason. Not everything needs to go to the cloud.",
    ],
  },
];
