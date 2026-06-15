export interface Failure {
  id: string;
  title: string;
  category: "abstraction" | "migration" | "performance" | "production" | "assumption" | "debt" | "monitoring";
  year: string;
  severity: "low" | "medium" | "high";
  what: string;
  context: string;
  consequence: string;
  lesson: string;
  changed: string;
}

export const FAILURES: Failure[] = [
  {
    id: "generic-adapter",
    title: "The GenericAdapter That Knew Too Much",
    category: "abstraction",
    year: "2021",
    severity: "high",
    what: "Built a 'universal adapter' abstraction that was supposed to handle any external service integration. By version 3, it had 14 configuration options and a 200-line factory function.",
    context:
      "The original intent was good: reduce boilerplate for every new integration. But each new integration needed slightly different behavior. Instead of creating a new adapter, we extended the existing one. Each extension added a flag, a conditional, a new configuration path.",
    consequence:
      "When a senior engineer left, nobody understood the adapter. Onboarding a new integration took longer than it would have with no abstraction at all. We eventually deleted it and wrote thin integration-specific code for each service.",
    lesson:
      "Premature abstraction is the wrong kind of DRY. Code duplication between two things that aren't actually the same is not a problem worth solving.",
    changed:
      "Now I wait for three concrete instances of a pattern before abstracting. Not two. Three.",
  },
  {
    id: "live-migration",
    title: "The Migration That Wasn't",
    category: "migration",
    year: "2022",
    severity: "high",
    what: "A database migration script ran successfully in staging. In production, it ran for 14 minutes before timing out — locking the orders table during peak traffic.",
    context:
      "Staging had 50,000 records. Production had 4.2 million. The migration added an index and updated a column with a computed value. Both operations are trivial at staging scale. At production scale, both held an exclusive table lock.",
    consequence:
      "New orders could not be created for 14 minutes. Approximately $180K in order volume was affected. Three enterprise clients called within the hour.",
    lesson:
      "Migration correctness and migration performance are different properties. Staging validates correctness. It does not validate performance.",
    changed:
      "All migrations now go through a three-step review: (1) what locks does this acquire, (2) estimated duration at 10× production scale, (3) can this be done online with a rolling strategy instead of a blocking one.",
  },
  {
    id: "n-plus-one",
    title: "The Dashboard That Queried Itself to Death",
    category: "performance",
    year: "2021",
    severity: "medium",
    what: "An admin dashboard that worked fine in development loaded in 18 seconds in production. The root cause: an N+1 query that executed once per record, and the production dataset had 4,000 records.",
    context:
      "The code was idiomatic. A list of items was fetched, then each item fetched its related entities in a loop. In development, the list had 12 items. In production, it had 4,000. The development experience gave no hint that anything was wrong.",
    consequence:
      "The database received 4,001 queries to load one page. The page loaded in 18 seconds on a good day. On a busy day, it timed out.",
    lesson:
      "Development data is a lie. Any dataset small enough to work correctly regardless of your query patterns is too small to catch real problems.",
    changed:
      "All list views now go through query analysis before deployment. We have a hard limit of 10 queries per page load for anything that will scale with data volume.",
  },
  {
    id: "silent-failure",
    title: "The Pipeline That Failed Quietly",
    category: "monitoring",
    year: "2022",
    severity: "high",
    what: "A content moderation pipeline was removing legitimate content and logging the action as a success. No alerts fired. We discovered it two months later when a contributor emailed to ask why their content had disappeared.",
    context:
      "The pipeline had comprehensive error handling. Every exception was caught and logged. But 'content removed by classifier' was not an exception — it was an expected code path. The monitoring only watched for exceptions, not for outcomes.",
    consequence:
      "Two months of over-aggressive content removal. 40% of content contributors disengaged. Trust was damaged in a domain where trust is the product.",
    lesson:
      "Exceptions are not the only failures. A system that runs without crashing but produces wrong outputs is a failed system. Monitoring must include outcome metrics, not only error rates.",
    changed:
      "Every pipeline now has an explicit 'unexpected output rate' metric that is monitored separately from error rates. If the removal rate for a human-written health article exceeds 5%, an alert fires.",
  },
  {
    id: "cache-invalidation",
    title: "The Two Hard Problems, Demonstrated",
    category: "production",
    year: "2023",
    severity: "medium",
    what: "A caching layer that seemed to work correctly in all tests produced stale data in production for one specific user segment — users who had changed their account type in the last 24 hours.",
    context:
      "Cache keys included the user ID but not the account type. When a user upgraded, their cached responses still reflected the previous account tier's permissions. The cache TTL was 24 hours. The bug existed for six months before the first report.",
    consequence:
      "Users who upgraded saw features disappear until the cache expired. The support team was fielding these as 'upgrade not working' reports without connecting them to caching.",
    lesson:
      "Phil Karlton was right. Cache invalidation is hard because it requires knowing everything that influences correctness. A cache that doesn't include all relevant dimensions of a key is a bug waiting to happen.",
    changed:
      "Cache keys now include a content hash of the authorization context, not just the user ID. Changing any permission-relevant attribute automatically invalidates all related cache entries.",
  },
  {
    id: "event-sourcing-debt",
    title: "The Log I Forgot to Read",
    category: "debt",
    year: "2022",
    severity: "low",
    what: "An event log grew to 800GB over 18 months because no retention policy was ever defined. The cost was modest ($230/month in storage), but rebuilding projections from the full log took 6 hours — an unacceptable recovery time.",
    context:
      "Event sourcing was the right call for auditability. But 'store events forever' is a policy by default, not by design. The system produced correct behavior for 18 months while accumulating a problem that would become very visible in a disaster recovery scenario.",
    consequence:
      "Not a production incident. But the disaster recovery drill exposed a 6-hour RTO where the requirement was 2 hours. The audit found 17 months of events that could have been compacted.",
    lesson:
      "Infinite retention is a policy. Zero retention is a policy. 'We'll deal with it later' is also a policy, and it's the most expensive one.",
    changed:
      "All event stores now have explicit retention policies defined at creation time. Snapshots are taken at configurable intervals. RTO is measured in every quarterly DR drill.",
  },
  {
    id: "wrong-abstraction",
    title: "The Wrong Model, Perfectly Implemented",
    category: "assumption",
    year: "2021",
    severity: "high",
    what: "Built a sophisticated permission system with roles, groups, and inheritance. After three months in production, the team discovered that the actual requirement was simpler: most resources were either public or private, with one exception.",
    context:
      "The requirements gathering didn't surface the simplicity. Everyone agreed that a flexible permission system was a good idea. It was. But it was a solution to a problem that didn't exist at the scale we were building for.",
    consequence:
      "Six weeks of engineering time. A permission system that was correct but had a 100-line initialization sequence for any new resource type. The feature that actually needed permissions was delayed by 5 weeks.",
    lesson:
      "Building the right thing correctly is better than building the sophisticated thing correctly. Start with the simplest model that is correct for the actual requirements, not the imagined future requirements.",
    changed:
      "Now explicitly ask: 'What problem does this solve today?' not 'What problems could this solve?' The future is a hypothesis.",
  },
];
