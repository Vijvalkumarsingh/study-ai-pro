import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { ChapterChecklist } from "@/components/ChapterChecklist";
import { loadSubjects } from "@/lib/subjects-store";
import { computeProgressStats, buildConsistencyGrid, loadStreak } from "@/lib/progress-store";
import { achievements, weeklyHours } from "@/lib/mock-data";
import type { Subject } from "@/lib/mock-data";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
});

function ProgressPage() {
  const [subjects,    setSubjects]    = useState<Subject[]>([]);
  const [stats,       setStats]       = useState(computeProgressStats());
  const [streak,      setStreak]      = useState(loadStreak());
  const [consistency, setConsistency] = useState<number[][]>([]);

  const refresh = useCallback(() => {
    setSubjects(loadSubjects());
    setStats(computeProgressStats());
    setStreak(loadStreak());
    setConsistency(buildConsistencyGrid());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const emptyGrid = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];

  return (
    <>
      <TopBar title="Progress Tracking" subtitle="Chapter completion, consistency, and achievement badges." />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in-up">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Avg. Completion",  value: `${stats.avgCompletion}%`,                            sub: "Across all subjects" },
            { label: "Chapters Done",    value: `${stats.totalChaptersDone}/${stats.totalChapters}`,   sub: `${subjects.length} subject${subjects.length !== 1 ? "s" : ""}` },
            { label: "Study Streak",     value: `${streak.current}d`,                                 sub: `Best: ${streak.longest} days` },
            { label: "Badges Earned",    value: `${achievements.filter(a => a.earned).length}/${achievements.length}`, sub: "Unlock by studying" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl glass shadow-card p-5 hover-lift">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="font-display text-3xl font-bold mt-2 gradient-text">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Chapter Completion</h3>
            {subjects.length === 0 ? (
              <div className="rounded-2xl glass shadow-card p-10 text-center">
                <p className="text-sm text-muted-foreground">No subjects yet. Add subjects to track chapter progress.</p>
              </div>
            ) : (
              subjects.map((s) => <ChapterChecklist key={s.id} subject={s} onUpdate={refresh} />)
            )}
          </div>

          <div className="rounded-2xl glass shadow-card p-6 space-y-6">
            <div>
              <h3 className="font-display text-lg font-semibold mb-1">Study Consistency</h3>
              <p className="text-xs text-muted-foreground mb-5">Last 4 weeks — updates as you complete chapters</p>
              <div className="space-y-2">
                {(consistency.length > 0 ? consistency : emptyGrid).map((week, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-8">W{i + 1}</span>
                    {week.map((d, j) => (
                      <div key={j} className={`h-7 flex-1 rounded-md transition-all ${d ? "gradient-primary shadow-glow" : "bg-white/5"}`} />
                    ))}
                  </div>
                ))}
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>M T W T F S S</span>
                  <span className="flex items-center gap-1.5">
                    Less <span className="h-2 w-2 rounded-sm bg-white/10" />
                    <span className="h-2 w-2 rounded-sm gradient-primary" /> More
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-3">Daily hours this week</div>
              <div className="grid grid-cols-7 gap-1.5">
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

            <div className="rounded-xl border border-white/10 bg-white/2 p-4">
              <div className="text-xs text-muted-foreground mb-1">🔥 Current Streak</div>
              <div className="font-display text-3xl font-bold gradient-text">{streak.current} days</div>
              <div className="text-xs text-muted-foreground mt-1">Best: {streak.longest} days</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl glass shadow-card p-6">
          <h3 className="font-display text-lg font-semibold mb-1">Achievements</h3>
          <p className="text-xs text-muted-foreground mb-5">Unlock badges by staying consistent</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((a) => (
              <div key={a.name} className={`relative rounded-2xl p-4 text-center transition ${
                a.earned ? "glass hover-lift" : "bg-white/2 border border-white/5 opacity-50"
              }`}>
                <div className="text-4xl mb-2">{a.icon}</div>
                <div className="font-display font-semibold text-sm">{a.name}</div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{a.desc}</div>
                {a.earned
                  ? <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-zinc-300" />
                  : <Lock className="absolute top-2 right-2 h-3.5 w-3.5 text-muted-foreground" />
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}