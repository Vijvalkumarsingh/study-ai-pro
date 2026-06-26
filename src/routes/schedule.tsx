import { createFileRoute } from "@tanstack/react-router";
import { Clock, Repeat2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { todayPlan, weekSchedule, subjects } from "@/lib/mock-data";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Study Schedule — StudyAI" },
      { name: "description", content: "Your daily and weekly study schedule with time allocation, priorities, and revision blocks." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <>
      <TopBar title="Study Schedule" subtitle="Daily plan, weekly grid, and revision blocks — all in one view." />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in-up">

        {/* Today */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="rounded-2xl glass shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-lg font-semibold">Today · Monday, June 22</h3>
                <p className="text-xs text-muted-foreground">5 sessions · 6h 30m total</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs rounded-full bg-white/10 text-zinc-300 border border-white/20 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-pulse" /> On track
              </span>
            </div>
            <ol className="relative border-l border-white/10 pl-6 space-y-4">
              {todayPlan.map((s, i) => (
                <li key={i} className="relative">
                  <span className={`absolute -left-[31px] top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-background ${
                    s.priority === "high" ? "bg-zinc-300" : s.priority === "medium" ? "bg-zinc-500" : "bg-zinc-700"
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-background" />
                  </span>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{s.topic}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {s.time}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{s.subject}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                        s.priority === "high" ? "bg-white/10 text-zinc-300" :
                        s.priority === "medium" ? "bg-zinc-500/10 text-zinc-400" :
                        "bg-zinc-700/10 text-zinc-500"
                      }`}>
                        {s.priority}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Time allocation */}
          <div className="rounded-2xl glass shadow-card p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Time Allocation</h3>
            <p className="text-xs text-muted-foreground mb-5">Hours per subject this week</p>
            <div className="space-y-4">
              {subjects.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground tabular-nums">{s.hoursThisWeek}h / {s.targetHours}h</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width: `${Math.min(100, (s.hoursThisWeek / s.targetHours) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <Repeat2 className="h-4 w-4 text-primary" /> Revision Window
              </div>
              <p className="text-xs text-muted-foreground">Saturday 10:00–13:00 reserved for spaced repetition across all weak topics.</p>
            </div>
          </div>
        </div>

        {/* Weekly planner */}
        <div className="rounded-2xl glass shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold">Weekly Planner</h3>
              <p className="text-xs text-muted-foreground">Drag blocks (coming soon) to rebalance your week</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {[
                ["DBMS", "bg-zinc-300"],
                ["OS", "bg-zinc-400"],
                ["Algo", "bg-zinc-500"],
                ["Net", "bg-zinc-600"],
                ["Math", "bg-zinc-700"],
              ].map(([n, c]) => (
                <span key={n} className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full ${c}`} /> {n}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 min-w-[700px] overflow-auto">
            {weekSchedule.map((d) => (
              <div key={d.day} className="rounded-xl bg-white/[0.02] border border-white/5 p-3 min-h-[260px]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d.day}</span>
                  <span className="text-[10px] text-muted-foreground">{d.slots.length}</span>
                </div>
                <div className="space-y-2">
                  {d.slots.map((s, i) => (
                    <div key={i} className={`rounded-lg border px-2 py-2 backdrop-blur-md ${s.color}`}>
                      <div className="text-[10px] uppercase tracking-wider text-white/80">{s.time}</div>
                      <div className="text-xs font-medium text-white">{s.subject}</div>
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
