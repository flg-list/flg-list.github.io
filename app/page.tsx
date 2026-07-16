"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { nextStep, progress, momentum, commitmentState, Momentum } from "@/lib/engine";
import { PROJECT_TYPE_LABELS, Project } from "@/lib/types";
import { stageById } from "@/lib/journey";

const TONE: Record<Momentum["tone"], string> = {
  hot: "bg-orange-500/15 text-orange-400",
  good: "bg-emerald-500/15 text-emerald-400",
  neutral: "bg-slate-500/15 text-slate-400",
  stalled: "bg-red-500/15 text-red-400",
};

export default function Dashboard() {
  const { state, hydrated, setFounderName } = useStore();
  const [name, setName] = useState("");

  if (!hydrated) return null;

  // First visit: ask for a name
  if (!state.founderName) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center pop">
        <div className="text-5xl mb-4">🤝</div>
        <h1 className="text-2xl font-bold mb-2">Hey, builder.</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          I'm your accountability partner. You've shipped things — now let's get them from{" "}
          <span className="text-[var(--accent)] font-semibold">0 to 1</span>. One step at a time.
          No list dumps, ever.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) setFounderName(name.trim());
          }}
          className="flex gap-2"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should I call you?"
            className="flex-1 panel !rounded-[10px] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
          <button className="btn btn-primary" type="submit">
            Let's go
          </button>
        </form>
      </div>
    );
  }

  const stalled = state.projects.filter((p) => momentum(p).tone === "stalled");

  return (
    <div className="pop">
      <div className="flex items-end justify-between mb-1">
        <h1 className="text-2xl font-bold">Hey {state.founderName} 👋</h1>
        <Link href="/new" className="btn btn-primary">
          + Add project
        </Link>
      </div>
      <p className="text-slate-400 text-sm mb-8">
        {state.projects.length === 0
          ? "Add your first project and I'll figure out exactly where you are — and what's next."
          : stalled.length > 0
          ? `${stalled.length} project${stalled.length > 1 ? "s" : ""} could use some love this week.`
          : "Everything's moving. Pick a project, do the one thing."}
      </p>

      {state.projects.length === 0 ? (
        <div className="panel p-10 text-center text-slate-400">
          <div className="text-4xl mb-3">📦</div>
          <p className="mb-1 text-slate-300 font-medium">No projects yet</p>
          <p className="text-sm mb-6">
            Web app on localhost? TestFlight beta? Half-finished repo? All welcome.
          </p>
          <Link href="/new" className="btn btn-primary">
            Add your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {state.projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const next = nextStep(project);
  const prog = progress(project);
  const mom = momentum(project);
  const commit = commitmentState(project, next?.id);

  return (
    <Link
      href={`/project?id=${project.id}`}
      className="panel p-5 block hover:border-[#3a4356] transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="font-bold text-lg truncate">{project.name}</h2>
            <span className="chip bg-slate-500/15 text-slate-400">
              {PROJECT_TYPE_LABELS[project.type]}
            </span>
            <span className={`chip ${TONE[mom.tone]}`}>{mom.label}</span>
          </div>
          <p className="text-sm text-slate-400 truncate">{project.oneLiner}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-bold text-[var(--accent)]">{prog.pct}%</div>
          <div className="text-[11px] text-slate-500">
            {prog.done}/{prog.total - prog.skipped} steps
          </div>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-[#1c2230] mt-4 mb-4 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${prog.pct}%` }}
        />
      </div>

      {next ? (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500 shrink-0">
            {stageById(next.stage).emoji} Next:
          </span>
          <span className="font-medium text-slate-200 truncate">{next.title}</span>
          {commit && (
            <span
              className={`chip ml-auto shrink-0 ${
                commit.overdue
                  ? "bg-red-500/15 text-red-400"
                  : "bg-[var(--accent)]/15 text-[var(--accent)]"
              }`}
            >
              {commit.overdue
                ? `${-commit.days}d overdue`
                : commit.days === 0
                ? "due today"
                : `due in ${commit.days}d`}
            </span>
          )}
        </div>
      ) : (
        <div className="text-sm text-emerald-400 font-medium">
          🎉 0→1 journey complete — keep the weekly rhythm going
        </div>
      )}
    </Link>
  );
}
