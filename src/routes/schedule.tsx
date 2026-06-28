import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, Repeat2, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { loadSchedule, toggleSessionDone } from "@/lib/schedule-store";
import { computeTimeAllocation } from "@/lib/scheduler";
import { loadSubjects } from "@/lib/subjects-store";
import type { ScheduleResult } from "@/lib/scheduler";

export const Route = createFileRoute("/schedule")({
  component: SchedulePage,
});

const STATUS_BADGE = {
  on_track: { label: "On track", cls: "bg-white/10 text-zinc-300 border-white/20",      dot: "bg-zinc-300" },
  ahead:    { label: "Ahead",    cls: "bg-zinc-300/10 text-zinc-200 border-zinc-200/20", dot: "bg-zinc-200" },
  behind:   { label: "Behind",   cls: "bg-zinc-500/10 text-zinc-400 border-zinc-400/20", dot: "bg-zinc-400" },
};

function SchedulePage() {
  const [schedule,   setSchedule]   = useState<ScheduleResult | null>(null);
  const [allocation, setAllocation] = useState<ReturnType<typeof computeTimeAllocation>>([]);

  useEffect(() => {
    setSchedule(loadSchedule());
    setAllocation(computeTimeAllocation(loadSubjects()));
  }, []);

  function handleToggle(index: number) {
    setSchedule({ ...toggleSessionDone(index) });
  }

  if (!schedule) return null;

  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const badge      = STATUS_BADGE[schedule.status];
  const noSubjects = schedule.todayPlan.length === 0;

  return (
    <>
      <TopBar title="Study Schedule" subtitle="Daily plan, weekly grid, and revision blocks — all in one view." />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in-up">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">

          <div className="rounded-2xl glass shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-lg font-semibold">Today · {todayLabel}</h3>
                <p className="text-xs text-muted-foreground">
                  {noSubjects ? "Add subjects to generate a plan" : `${schedule.totalSessionsToday} sessions · ${schedule.totalHoursToday.toFixed(1)}h total`}
                </p>
              </div>
              {!noSubjects && (
                <span className={`inline-flex items-center gap-1.5 text-xs rounded-full border px-3 py-1 ${badge.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${badge.dot}`} />
                  {badge.label}
                </span>
              )}
            </div>

            {noSubjects ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                No subjects yet. Head to <span className="text-zinc-300">Subjects</span> to get started.
              </p>
            ) : (
              <ol className="relative border-l border-white/10 pl-6 space-y-4">
                {schedule.todayPlan.map((s, i) => (
                  <li key={i} className="relative">
                    <span className={`absolute -left-[31px] top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-background ${
                      s.priority === "high" ? "bg-zinc-300" : s.priority === "medium" ? "bg-zinc-500" : "bg-zinc-700"
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-background" />
                    </span>
                    <div onClick={() => handleToggle(i)}
                      className={`rounded-xl border border-white/5 p-4 transition cursor-pointer select-none ${
                        s.done ? "bg-white/[0.01] opacity-50" : "bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-medium flex items-center gap-2 ${s.done ? "line-through" : ""}`}>
                          {s.done && <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />}
                          {s.topic}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                          <Clock className="h-3 w-3" /> {s.time}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{s.subjectName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                          s.priority === "high" ? "bg-white/10 text-zinc-300" :
                          s.priority === "medium" ? "bg-zinc-500/10 text-zinc-400" : "bg-zinc-700/10 text-zinc-500"
                        }`}>{s.priority}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="rounded-2xl glass shadow-card p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Time Allocation</h3>
            <p className="text-xs text-muted-foreground mb-5">Hours per subject this week</p>
            {allocation.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">Add subjects to see allocation.</p>
            ) : (
              <div className="space-y-4">
                {allocation.map((s) => (
                  <div key={s.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium truncate">{s.name}</span>
                      <span className="text-muted-foreground tabular-nums shrink-0 ml-2">{s.hoursThisWeek}h / {s.targetHours}h</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                        style={{ width: `${Math.min(100, s.targetHours > 0 ? (s.hoursThisWeek / s.targetHours) * 100 : 0)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Repeat2 className="h-4 w-4 text-primary" /> Revision Window
              </div>
              <p className="text-xs text-muted-foreground">Saturday 10:00–13:00 reserved for spaced repetition across all weak topics.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl glass shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold">Weekly Planner</h3>
              <p className="text-xs text-muted-foreground">AI-generated from your subjects and priorities</p>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              {loadSubjects().slice(0, 5).map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${s.color}`} />
                  {s.name.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-3 min-w-[700px] overflow-auto">
            {schedule.weekSchedule.map((d) => (
              <div key={d.day} className="rounded-xl bg-white/[0.02] border border-white/5 p-3 min-h-[260px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d.day}</span>
                  <span className="text-[10px] text-muted-foreground">{d.slots.length}</span>
                </div>
                <div className="space-y-2">
                  {d.slots.map((s, i) => (
                    <div key={i} className={`rounded-lg border px-2 py-2 backdrop-blur-md ${s.color}`}>
                      <div className="text-[10px] uppercase tracking-wider text-white/80">{s.time}</div>
                      <div className="text-xs font-medium text-white truncate">{s.subject}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}