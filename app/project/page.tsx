"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useStore } from "@/lib/store";
import {
  nextStep,
  progress,
  stageProgress,
  momentum,
  commitmentState,
  applicableSteps,
} from "@/lib/engine";
import { stageById, stepById } from "@/lib/journey";
import { EFFORT_LABELS, PROJECT_TYPE_LABELS, Project, Step } from "@/lib/types";

function ProjectPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { state, hydrated, updateProject, removeProject } = useStore();
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [stuckOpen, setStuckOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showParked, setShowParked] = useState(false);

  if (!hydrated) return null;
  const project = state.projects.find((p) => p.id === id);
  if (!project) {
    return (
      <div className="text-center mt-16 text-slate-400">
        Project not found. <Link href="/" className="text-[var(--accent)]">← Dashboard</Link>
      </div>
    );
  }

  const step = nextStep(project);
  const prog = progress(project);
  const mom = momentum(project);
  const commit = commitmentState(project, step?.id);

  // Parked steps list (for the resume panel)
  const parkedSteps = applicableSteps(project.type).filter(
    (s) => project.steps[s.id]?.status === "parked"
  );

  const mark = (status: "done" | "skipped" | "parked", note?: string) => {
    if (!step) return;
    const now = new Date().toISOString();
    const kindMap = { done: "done", skipped: "skip", parked: "park" } as const;
    const textMap = {
      done: `Completed: ${step.title}`,
      skipped: `Skipped: ${step.title}${note ? ` (${note})` : ""}`,
      parked: `Parked for later: ${step.title}`,
    };
    updateProject(project.id, (p) => ({
      ...p,
      steps: { ...p.steps, [step.id]: { status, completedAt: now, note } },
      commitment: undefined,
      log: [
        {
          at: now,
          kind: kindMap[status],
          text: textMap[status],
        },
        ...p.log,
      ],
    }));
    setStuckOpen(false);
    if (status === "done") {
      setCelebrate(step.title);
      setTimeout(() => setCelebrate(null), 3500);
    }
  };

  const resumeStep = (stepId: string) => {
    const now = new Date().toISOString();
    const s = stepById(stepId);
    updateProject(project.id, (p) => ({
      ...p,
      steps: { ...p.steps, [stepId]: { status: "todo" } },
      log: [
        { at: now, kind: "info", text: `Resumed: ${s?.title ?? stepId}` },
        ...p.log,
      ],
    }));
  };

  const commitBy = (days: number) => {
    if (!step) return;
    const due = new Date(Date.now() + days * 864e5).toISOString();
    updateProject(project.id, (p) => ({
      ...p,
      commitment: { stepId: step.id, due },
      log: [
        { at: new Date().toISOString(), kind: "commit", text: `Committed to "${step.title}" in ${days}d` },
        ...p.log,
      ],
    }));
    setStuckOpen(false);
  };

  return (
    <div className="pop">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-300">
        ← Dashboard
      </Link>

      <div className="flex items-start justify-between gap-4 mt-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 flex-wrap">
            {project.name}
            <span className="chip bg-slate-500/15 text-slate-400">
              {PROJECT_TYPE_LABELS[project.type]}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">{project.oneLiner}</p>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              {project.url}
            </a>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-[var(--accent)]">{prog.pct}%</div>
          <div className="text-[11px] text-slate-500">
            {prog.done} done · {mom.label}
          </div>
          {prog.parked > 0 && (
            <div className="text-[11px] text-amber-500/70 mt-0.5">
              {prog.parked} parked
            </div>
          )}
        </div>
      </div>

      {celebrate && (
        <div className="panel !border-emerald-500/40 bg-emerald-500/10 p-4 mb-5 pop text-sm">
          🎉 <span className="font-semibold">"{celebrate}" — done.</span>{" "}
          <span className="text-slate-300">
            That's real progress most builders never make. Here's your next one:
          </span>
        </div>
      )}

      {step ? (
        <FocusCard
          step={step}
          commit={commit}
          stuckOpen={stuckOpen}
          onDone={() => mark("done")}
          onAlready={() => mark("done", "already done")}
          onSkip={() => {
            const reason = window.prompt("Why isn't this relevant? (helps me pick better steps)") || undefined;
            mark("skipped", reason);
          }}
          onPark={() => mark("parked")}
          onStuck={() => setStuckOpen((v) => !v)}
          onCommit={commitBy}
        />
      ) : (
        <div className="panel p-8 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h2 className="font-bold text-lg mb-2">You did it. This project is at 1.</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Shipped, discoverable, secured, launched, and earning coffees. Keep the weekly rhythm
            going — and maybe it's time to add the next project?
          </p>
        </div>
      )}

      {/* Journey map: stages only — steps stay hidden. No list dumps. */}
      <div className="mt-6">
        <button
          onClick={() => setShowMap((v) => !v)}
          className="text-sm text-slate-500 hover:text-slate-300"
        >
          {showMap ? "▾" : "▸"} The road ahead (stages, not spoilers)
        </button>
        {showMap && (
          <div className="panel p-4 mt-2 grid gap-2.5">
            {stageProgress(project).map(({ stage, done, total }) => {
              const active = step && step.stage === stage.id;
              return (
                <div key={stage.id} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-center">{stage.emoji}</span>
                  <span className={`w-40 shrink-0 ${active ? "text-[var(--accent)] font-semibold" : done === total ? "text-slate-300" : "text-slate-500"}`}>
                    {stage.title}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#1c2230] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${done === total ? "bg-emerald-500" : "bg-[var(--accent)]"}`}
                      style={{ width: `${total ? (done / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 w-10 text-right">
                    {done}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Parked steps panel */}
      {parkedSteps.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowParked((v) => !v)}
            className="text-sm text-amber-500/70 hover:text-amber-400"
          >
            {showParked ? "▾" : "▸"} Parked steps ({parkedSteps.length}) — pick one up anytime
          </button>
          {showParked && (
            <div className="panel p-4 mt-2 grid gap-3">
              {parkedSteps.map((s) => {
                const stage = stageById(s.stage);
                return (
                  <div key={s.id} className="flex items-center gap-3 text-sm">
                    <span className="text-base">{stage.emoji}</span>
                    <span className="flex-1 text-slate-400">{s.title}</span>
                    <button
                      onClick={() => resumeStep(s.id)}
                      className="btn btn-ghost !text-[11px] !py-1 !px-2"
                    >
                      ↩ Resume
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div className="mt-3">
        <button
          onClick={() => setShowLog((v) => !v)}
          className="text-sm text-slate-500 hover:text-slate-300"
        >
          {showLog ? "▾" : "▸"} History ({project.log.length})
        </button>
        {showLog && (
          <div className="panel p-4 mt-2 grid gap-2 text-sm max-h-64 overflow-y-auto">
            {project.log.map((l, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-slate-600 text-xs shrink-0 w-20 pt-0.5">
                  {new Date(l.at).toLocaleDateString()}
                </span>
                <span className={
                  l.kind === "done" ? "text-emerald-400" :
                  l.kind === "skip" ? "text-slate-500" :
                  l.kind === "park" ? "text-amber-500/70" :
                  "text-slate-400"
                }>
                  {l.kind === "done" ? "✓ " : l.kind === "skip" ? "– " : l.kind === "park" ? "🅿 " : ""}
                  {l.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 text-right">
        <button
          onClick={() => {
            if (window.confirm(`Delete ${project.name}? This can't be undone.`)) {
              removeProject(project.id);
              router.push("/");
            }
          }}
          className="text-xs text-slate-600 hover:text-red-400"
        >
          Delete project
        </button>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={<div className="text-center mt-16 text-slate-400">Loading project...</div>}>
      <ProjectPageContent />
    </Suspense>
  );
}

function FocusCard(props: {
  step: Step;
  commit: { days: number; overdue: boolean } | null;
  stuckOpen: boolean;
  onDone: () => void;
  onAlready: () => void;
  onSkip: () => void;
  onPark: () => void;
  onStuck: () => void;
  onCommit: (days: number) => void;
}) {
  const { step, commit, stuckOpen } = props;
  const stage = stageById(step.stage);

  return (
    <div className="panel p-6" key={step.id}>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="chip bg-[var(--accent)]/15 text-[var(--accent)]">
          {stage.emoji} {stage.title}
        </span>
        <span className="chip bg-slate-500/15 text-slate-400">⏱ {EFFORT_LABELS[step.effort]}</span>
        {commit && (
          <span className={`chip ${commit.overdue ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"}`}>
            {commit.overdue
              ? `${-commit.days}d overdue — let's just do it now`
              : commit.days === 0
              ? "due today"
              : `committed · ${commit.days}d left`}
          </span>
        )}
      </div>

      <div className="text-[11px] tracking-widest text-slate-500 font-semibold mb-1">
        YOUR ONE NEXT ACTION
      </div>
      <h2 className="text-xl font-bold mb-3">{step.title}</h2>
      <p className="text-sm text-slate-400 leading-relaxed mb-4">
        <span className="text-slate-300 font-semibold">Why it matters: </span>
        {step.why}
      </p>

      <div className="bg-[#0d1119] border border-[var(--border)] rounded-xl p-4 mb-4">
        <div className="text-[11px] tracking-widest text-slate-500 font-semibold mb-2">HOW</div>
        <ul className="grid gap-2">
          {step.how.map((h, i) => (
            <li key={i} className="text-sm text-slate-300 flex gap-2.5 leading-relaxed">
              <span className="text-[var(--accent)] shrink-0">{i + 1}.</span>
              {h}
            </li>
          ))}
        </ul>
        {step.resources && (
          <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-[var(--border)]">
            {step.resources.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="chip bg-slate-500/10 text-slate-400 hover:text-[var(--accent)]"
              >
                ↗ {r.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={props.onDone} className="btn btn-primary">
          ✓ Done — what's next?
        </button>
        <button onClick={props.onStuck} className="btn btn-ghost">
          I'm stuck / no time
        </button>
        <button onClick={props.onAlready} className="btn btn-ghost">
          Already did this
        </button>
        <button onClick={props.onPark} className="btn btn-ghost !text-amber-500/80 hover:!text-amber-400">
          🅿 Park for now
        </button>
        <button onClick={props.onSkip} className="btn btn-ghost !text-slate-500">
          Not relevant
        </button>
      </div>

      {stuckOpen && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] pop">
          <p className="text-sm text-slate-400 mb-3">
            Totally fine — this is what an accountability partner is for. Shrink it: what's the
            smallest version of step 1 above you could do in 15 minutes? Then commit:
          </p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => props.onCommit(1)} className="btn btn-ghost">
              I'll do it tomorrow
            </button>
            <button onClick={() => props.onCommit(3)} className="btn btn-ghost">
              Within 3 days
            </button>
            <button onClick={() => props.onCommit(7)} className="btn btn-ghost">
              This week
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            I'll hold you to it on the dashboard. Kindly, but I will.
          </p>
        </div>
      )}
    </div>
  );
}
