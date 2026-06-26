import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { subjects, achievements, weeklyHours } from "@/lib/mock-data";
import { CheckCircle2, Lock } from "lucide-react";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — StudyAI" },
      { name: "description", content: "Track subject completion, study consistency, and unlock achievement badges." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const consistency = [
    [1,1,0,1,1,1,1],
    [1,1,1,1,0,1,1],
    [1,1,1,1,1,1,0],
    [1,0,1,1,1,1,1],
  ];

  return (
    <>
      <TopBar title="Progress Tracking" subtitle="Subject completion, consistency, and achievement badges." />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in-up">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Avg. Completion", value: "60%", sub: "↑ 12% this month" },
            { label: "Chapters Done", value: "33/56", sub: "Across 5 subjects" },
            { label: "Consistency", value: "92%", sub: "Last 30 days" },
            { label: "Badges Earned", value: "4/6", sub: "2 to unlock" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl glass shadow-card p-5 hover-lift">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="font-display text-3xl font-bold mt-2 gradient-text">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Subject completion */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="rounded-2xl glass shadow-card p-6">
            <h3 className="font-display text-lg font-semibold mb-5">Subject Completion</h3>
            <div className="space-y-5">
              {subjects.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${s.color} text-white text-xs font-semibold`}>
                        {s.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-[11px] text-muted-foreground">{s.completedChapters} of {s.totalChapters} chapters</div>
                      </div>
                    </div>
                    <span className="font-display text-lg font-semibold tabular-nums">{s.progress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${s.color} shadow-glow`} style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consistency heatmap */}
          <div className="rounded-2xl glass shadow-card p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Study Consistency</h3>
            <p className="text-xs text-muted-foreground mb-5">Last 4 weeks</p>

            <div className="space-y-2">
              {consistency.map((week, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-8">W{i+1}</span>
                  {week.map((d, j) => (
                    <div key={j} className={`h-7 flex-1 rounded-md ${d ? "gradient-primary shadow-glow" : "bg-white/5"}`} />
                  ))}
                </div>
              ))}
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <span>M T W T F S S</span>
                <span className="flex items-center gap-1.5">Less <span className="h-2 w-2 rounded-sm bg-white/10" /><span className="h-2 w-2 rounded-sm gradient-primary" /> More</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1.5">
              {weeklyHours.map((d) => (
                <div key={d.day} className="text-center">
                  <div className="relative h-20 rounded bg-white/5 overflow-hidden flex items-end">
                    <div className="w-full gradient-primary" style={{ height: `${(d.hours / 8) * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-2xl glass shadow-card p-6">
          <h3 className="font-display text-lg font-semibold mb-1">Achievements</h3>
          <p className="text-xs text-muted-foreground mb-5">Unlock badges by staying consistent</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((a) => (
              <div key={a.name} className={`relative rounded-2xl p-4 text-center transition ${
                a.earned ? "glass hover-lift" : "bg-white/[0.02] border border-white/5 opacity-50"
              }`}>
                <div className="text-4xl mb-2">{a.icon}</div>
                <div className="font-display font-semibold text-sm">{a.name}</div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{a.desc}</div>
                {a.earned ? (
                  <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-zinc-300" />
                ) : (
                  <Lock className="absolute top-2 right-2 h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
