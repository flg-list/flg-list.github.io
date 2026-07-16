"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { applicableSteps, uid } from "@/lib/engine";
import { Project, ProjectType, PROJECT_TYPE_LABELS, StepState } from "@/lib/types";

const TYPES: { value: ProjectType; emoji: string; hint: string }[] = [
  { value: "webapp", emoji: "🌐", hint: "SaaS, site, tool in the browser" },
  { value: "mobile", emoji: "📱", hint: "iOS / Android, TestFlight counts" },
  { value: "oss", emoji: "🧩", hint: "Library, CLI, open-source repo" },
  { value: "api", emoji: "⚙️", hint: "API, SDK, dev tool" },
];

export default function NewProject() {
  const router = useRouter();
  const { addProject } = useStore();

  const [phase, setPhase] = useState<"details" | "assess">("details");
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<ProjectType>("webapp");
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [qIndex, setQIndex] = useState(0);

  const questions = useMemo(
    () => applicableSteps(type).filter((s) => s.assess),
    [type]
  );

  function finish(finalAnswers: Record<string, boolean>) {
    const steps: Record<string, StepState> = {};
    const now = new Date().toISOString();
    for (const [stepId, yes] of Object.entries(finalAnswers)) {
      if (yes) steps[stepId] = { status: "done", completedAt: now, note: "already done before joining" };
    }
    const project: Project = {
      id: uid(),
      name: name.trim(),
      type,
      oneLiner: oneLiner.trim(),
      url: url.trim() || undefined,
      createdAt: now,
      steps,
      log: [{ at: now, kind: "info", text: "Project added — journey assessed" }],
    };
    addProject(project);
    router.push(`/project?id=${project.id}`);
  }

  if (phase === "details") {
    return (
      <div className="max-w-lg mx-auto pop">
        <h1 className="text-2xl font-bold mb-1">Tell me about the project</h1>
        <p className="text-slate-400 text-sm mb-8">
          Then I'll ask a few quick yes/no questions to find exactly where you are.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim() && oneLiner.trim()) setPhase("assess");
          }}
          className="space-y-5"
        >
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MindStash"
              className="w-full panel !rounded-[10px] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              What does it do? (one line)
            </label>
            <input
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              placeholder="e.g. Save anything, find it by meaning"
              className="w-full panel !rounded-[10px] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">
              URL <span className="text-slate-500 font-normal">(optional — localhost is fine too)</span>
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className="w-full panel !rounded-[10px] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-1.5">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`panel !rounded-[10px] p-3 text-left transition-colors ${
                    type === t.value ? "!border-[var(--accent)]" : "hover:border-[#3a4356]"
                  }`}
                >
                  <div className="text-sm font-semibold">
                    {t.emoji} {PROJECT_TYPE_LABELS[t.value]}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{t.hint}</div>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            Next: quick check-up →
          </button>
        </form>
      </div>
    );
  }

  // Assessment: one question at a time — never a list dump.
  const q = questions[qIndex];
  const answer = (yes: boolean) => {
    const next = { ...answers, [q.id]: yes };
    setAnswers(next);
    if (qIndex + 1 < questions.length) setQIndex(qIndex + 1);
    else finish(next);
  };

  return (
    <div className="max-w-lg mx-auto pop text-center mt-8" key={q.id}>
      <div className="text-xs text-slate-500 mb-6 tracking-wide">
        QUICK CHECK-UP · {qIndex + 1} / {questions.length}
      </div>
      <div className="h-1 rounded-full bg-[#1c2230] mb-10 overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all"
          style={{ width: `${(qIndex / questions.length) * 100}%` }}
        />
      </div>
      <h2 className="text-xl font-bold mb-8 leading-snug">{q.assess}</h2>
      <div className="flex gap-3 justify-center">
        <button onClick={() => answer(true)} className="btn btn-primary !px-8">
          Yes ✓
        </button>
        <button onClick={() => answer(false)} className="btn btn-ghost !px-8">
          Not yet
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-8">
        Be honest — "not yet" just means I know where to start. No judgment here.
      </p>
    </div>
  );
}
