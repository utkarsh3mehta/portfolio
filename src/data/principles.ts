export interface Principle {
  id: string;
  headline: string;
  subtext: string;
  elaboration: string;
  project: string;
  projectLabel: string;
  lesson: string;
  visualType: "compound" | "latency" | "interface" | "constraint" | "complexity" | "failure";
}

export const PRINCIPLES: Principle[] = [
  {
    id: "automation",
    headline: "Automation compounds.",
    subtext: "The second time you do anything manually, you've already made an error.",
    elaboration:
      "The value of automation is not the time it saves today. It's the compounding effect across every future instance. A manual process that takes 20 minutes is not a 20-minute problem — it's a 20-minute × N problem, where N grows without bound. Automation is not laziness. It's arithmetic.",
    project: "industrial-3d",
    projectLabel: "Industrial 3D Platform",
    lesson:
      "Building the telemetry adapter framework took two extra weeks. It paid that back on the third manufacturer integration and has been paying it back every quarter since.",
    visualType: "compound",
  },
  {
    id: "latency",
    headline: "Latency deserves respect.",
    subtext: "Every millisecond is a decision someone made (or didn't).",
    elaboration:
      "Latency is not a performance metric. It's a product decision. Users interpret latency as competence. A 300ms response and a 3000ms response are not the same user experience — they are different products. Every network boundary, every synchronous call, every cache miss is a decision. Make them consciously.",
    project: "arzen",
    projectLabel: "Arzen Digital Signage",
    lesson:
      "The original sync model had a 12-second worst-case latency. We found it acceptable. Clients did not. Acceptable engineering latency is not the same as acceptable product latency.",
    visualType: "latency",
  },
  {
    id: "interfaces",
    headline: "Interfaces teach behavior.",
    subtext: "An API is a prediction about how it will be misused.",
    elaboration:
      "Every interface you design will be used in ways you didn't anticipate. The question is not whether it will be misused — it will be — but whether the misuse is graceful or catastrophic. Good interfaces make the wrong thing hard and the right thing obvious. Bad interfaces produce correct behavior accidentally and incorrect behavior inevitably.",
    project: "app-lab",
    projectLabel: "App Lab",
    lesson:
      "The first version of the framework's component API allowed mutation of state directly. Students mutated state everywhere and couldn't understand why re-renders were happening. Making state immutable by design made the mental model clear immediately.",
    visualType: "interface",
  },
  {
    id: "constraints",
    headline: "Constraints create clarity.",
    subtext: "Unlimited scope produces unlimited ambiguity.",
    elaboration:
      "When everything is possible, nothing is decided. Constraints force decisions. A constraint is not a limitation — it's a design instrument. The best technical solutions usually emerge from the tightest constraints: zero downtime, no budget, existing hardware, one week. These are not obstacles. They are the problem.",
    project: "dynamic-pricing",
    projectLabel: "Dynamic Pricing Engine",
    lesson:
      "The zero-downtime constraint forced us away from the 'correct' solution (a full rewrite) toward the 'right' solution (a parallel engine with gradual rollover). The constraint made the solution better.",
    visualType: "constraint",
  },
  {
    id: "complexity",
    headline: "Complexity accumulates interest.",
    subtext: "Every shortcut is a loan. The interest compounds.",
    elaboration:
      "Technical debt is a poor metaphor. Debt implies a lump sum that you can pay off. Complexity is more like compounding interest — it grows without your intervention. A system that was simple last year is not simple today if no one actively worked to keep it simple. Simplicity requires maintenance.",
    project: "arzen",
    projectLabel: "Arzen Digital Signage",
    lesson:
      "The original broadcast-based sync looked simple: push content, screens receive it. The complexity was hidden in all the things that could go wrong. The pull-based architecture looked more complex. It was, structurally. But operationally it was radically simpler because failure modes were explicit.",
    visualType: "complexity",
  },
  {
    id: "failure",
    headline: "Failure is a specification.",
    subtext: "How a system fails tells you what it believes about itself.",
    elaboration:
      "Every system fails. The question is not whether but how. A system that fails catastrophically has made an implicit assumption that it won't fail. A system that fails gracefully has made failure a first-class design concern. The failure mode is not an edge case — it's the most important path to design.",
    project: "untaboo",
    projectLabel: "UnTaboo",
    lesson:
      "When the moderation pipeline failed, it didn't alert anyone — it just silently removed content. We discovered the failure two months later. Silent failures are the most dangerous. Now every pipeline has an explicit failure output that is monitored as a first-class concern.",
    visualType: "failure",
  },
];
