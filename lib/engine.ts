import { STAGES, STEPS } from "./journey";
import { Project, ProjectType, Step } from "./types";

/** All steps that apply to a given project type, in journey order. */
export function applicableSteps(type: ProjectType): Step[] {
  return STEPS.filter((s) => !s.appliesTo || s.appliesTo.includes(type));
}

/** The ONE next action for a project.
 *  Pass 1: first step that is todo (never touched).
 *  Pass 2: if everything is done/skipped/parked, cycle back the first parked step.
 *  Returns null only when every applicable step is done or skipped.
 */
export function nextStep(project: Project): Step | null {
  const steps = applicableSteps(project.type);
  // Pass 1 — skip parked, surface the first truly pending step
  let firstParked: Step | null = null;
  for (const step of steps) {
    const st = project.steps[step.id];
    if (!st || st.status === "todo") return step;
    if (st.status === "parked" && !firstParked) firstParked = step;
  }
  // Pass 2 — everything pending is parked; cycle the oldest parked one back
  return firstParked;
}

export function progress(project: Project) {
  const steps = applicableSteps(project.type);
  const done = steps.filter((s) => project.steps[s.id]?.status === "done").length;
  const skipped = steps.filter((s) => project.steps[s.id]?.status === "skipped").length;
  const parked = steps.filter((s) => project.steps[s.id]?.status === "parked").length;
  const total = steps.length;
  const pct = total - skipped > 0 ? Math.round((done / (total - skipped - parked)) * 100) : 100;
  return { done, skipped, parked, total, pct };
}

export function stageProgress(project: Project) {
  const steps = applicableSteps(project.type);
  return STAGES.map((stage) => {
    const inStage = steps.filter((s) => s.stage === stage.id);
    const done = inStage.filter(
      (s) => project.steps[s.id]?.status === "done" || project.steps[s.id]?.status === "skipped"
    ).length;
    return { stage, done, total: inStage.length };
  }).filter((s) => s.total > 0);
}

export type Momentum =
  | { label: "New"; tone: "neutral" }
  | { label: "On fire"; tone: "hot" }
  | { label: "Moving"; tone: "good" }
  | { label: string; tone: "stalled" };

export function momentum(project: Project): Momentum {
  const doneDates = Object.values(project.steps)
    .filter((s) => s.status === "done" && s.completedAt)
    .map((s) => +new Date(s.completedAt!));
  if (doneDates.length === 0) {
    const ageDays = daysSince(project.createdAt);
    return ageDays > 5
      ? { label: `Stalled ${ageDays}d`, tone: "stalled" }
      : { label: "New", tone: "neutral" };
  }
  const days = daysSince(new Date(Math.max(...doneDates)).toISOString());
  const lastWeek = doneDates.filter((d) => Date.now() - d < 7 * 864e5).length;
  if (lastWeek >= 3) return { label: "On fire", tone: "hot" };
  if (days <= 7) return { label: "Moving", tone: "good" };
  return { label: `Stalled ${days}d`, tone: "stalled" };
}

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - +new Date(iso)) / 864e5);
}

export function commitmentState(project: Project, currentStepId?: string) {
  const c = project.commitment;
  if (!c || c.stepId !== currentStepId) return null;
  const days = Math.ceil((+new Date(c.due) - Date.now()) / 864e5);
  return { due: c.due, days, overdue: days < 0 };
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
