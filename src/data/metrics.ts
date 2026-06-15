export interface Metric {
  id: string;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  project: string;
}

export const METRICS: Metric[] = [
  {
    id: "requests",
    value: 47,
    suffix: "M+",
    label: "Requests processed",
    sublabel: "across distributed signage infrastructure",
    project: "arzen",
  },
  {
    id: "devices",
    value: 12000,
    suffix: "+",
    label: "Devices synchronized",
    sublabel: "real-time, across 23 cities",
    project: "arzen",
  },
  {
    id: "pricing",
    value: 2.4,
    suffix: "M",
    prefix: "$",
    label: "In pricing decisions automated",
    sublabel: "zero downtime migration from static pricing",
    project: "dynamic-pricing",
  },
  {
    id: "hours",
    value: 4200,
    suffix: "+",
    label: "Engineering hours eliminated",
    sublabel: "through automation pipelines",
    project: "industrial-3d",
  },
  {
    id: "students",
    value: 200,
    suffix: "K+",
    label: "Students reached",
    sublabel: "across 3 states via UnTaboo",
    project: "untaboo",
  },
  {
    id: "cities",
    value: 23,
    suffix: "",
    label: "Cities synchronized",
    sublabel: "zero-coordination distributed state",
    project: "arzen",
  },
];

export const CAREER_SUMMARY = {
  yearsExperience: 8,
  systemsBuilt: 14,
  teamSize: 18,
  uptime: 99.97,
};
