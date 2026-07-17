export type ProjectType = "webapp" | "mobile" | "oss" | "api";

export type StepStatus = "todo" | "done" | "skipped" | "parked";

export type Effort = "S" | "M" | "L"; // <1h, half a day, multi-day

export interface Resource {
  label: string;
  url: string;
}

export interface Step {
  id: string;
  stage: string;
  title: string;
  why: string;
  how: string[];
  resources?: Resource[];
  effort: Effort;
  /** If set, step only applies to these project types */
  appliesTo?: ProjectType[];
  /** Question asked during onboarding assessment ("yes" marks it done) */
  assess?: string;
  /** Optional AI prompt the user can browse and copy to get started */
  prompt?: string;
}

export interface Stage {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
}

export interface StepState {
  status: StepStatus;
  completedAt?: string;
  note?: string;
}

export interface LogEntry {
  at: string;
  text: string;
  kind: "done" | "skip" | "commit" | "info" | "park";
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  oneLiner: string;
  url?: string;
  createdAt: string;
  steps: Record<string, StepState>;
  /** Active commitment on the current next step */
  commitment?: { stepId: string; due: string };
  log: LogEntry[];
}

export interface AppState {
  founderName: string;
  projects: Project[];
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  webapp: "Web app",
  mobile: "Mobile app",
  oss: "Open source",
  api: "API / dev tool",
};

export const EFFORT_LABELS: Record<Effort, string> = {
  S: "< 1 hour",
  M: "half a day",
  L: "a few days",
};
