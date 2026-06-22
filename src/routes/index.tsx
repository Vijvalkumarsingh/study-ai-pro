import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Flame,
  Clock,
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Plus,
  Play,
  BookOpen,
  Brain,
  Trophy,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { subjects, todayPlan, aiRecommendations, user, weeklyHours } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudyAI" },
      { name: "description", content: "Your personalized study dashboard with AI recommendations, exam countdowns, and progress tracking." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const totalHours = weeklyHours.reduce((s, d) => s + d.hours, 0);
  const nextExam = subjects.slice().sort((a, b) => a.daysLeft - b.daysLeft)[0];

  const stats = [
    { label: "Study Streak", value: `${user.streak} days`, icon: Flame, accent: "from-orange-500 to-rose-500", sub: "+2 vs last week" },
    { label: "Hours This Week", value: `${totalHours.toFixed(1)}h`, icon: Clock, accent: "from-violet-500 to-fuchsia-500", sub: "Goal: 35h" },
    { label: "Next Exam", value: `${nextExam.daysLeft} days`, icon: Calendar, accent: "from-blue-500 to-cyan-500", sub: nextExam.name },
    { label: "Avg. Progress", value: `${Math.round(subjects.reduce((s, x) => s + x.progress, 0) / subjects.length)}%`, icon: Target, accent: "from-emerald-500 to-teal-500", sub: "Across 5 subjects" },
  ];

  return (
    <>
      <TopBar title={`Good evening, ${user.name} 👋`} subtitle="You're on a 14-day streak. Let's keep it going." />

      <div className="p-6 lg:p-8 space-y-6 animate-fade-in-up">
        {/* Hero / Daily plan */}
        <section className="relative overflow-hidden rounded-3xl glass-strong shadow-card p-8">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Today's AI-curated plan
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold leading-tight">
                <span className="gradient-text">5 focused sessions</span><br />
                to keep you on track for finals.
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg">
                Total: 6h 30m today. Priority subject: <span className="text-foreground font-medium">Database Management</span> (exam in 5 days).
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:opacity-90 transition">
                  <Play className="h-4 w-4" /> Start next session
                </button>
                <Link to="/schedule" className="inline-flex items-center gap-2 rounded-xl glass px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition">
                  View full schedule <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl glass p-4 space-y-2 max-h-[300px] overflow-auto">
              {todayPlan.map((s, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl p-3 transition ${s.done ? "opacity-50" : "hover:bg-white/5"}`}>
                  <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    s.priority === "high" ? "bg-rose-500/20 text-rose-300" :
                    s.priority === "medium" ? "bg-amber-500/20 text-amber-300" :
                    "bg-emerald-500/20 text-emerald-300"
                  }`}>
                    {s.done ? <CheckCircle2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{s.topic}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{s.time}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{s.subject}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stat row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl glass shadow-card p-5 hover-lift">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <div className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${s.accent} text-white shadow-glow`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 font-display text-2xl lg:text-3xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
              </div>
            );
          })}
        </section>

        {/* Subjects + AI panel */}
        <section className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
          <div className="rounded-2xl glass shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-lg font-semibold">Subject Progress</h3>
                <p className="text-xs text-muted-foreground">Live completion across all enrolled subjects</p>
              </div>
              <Link to="/subjects/add" className="inline-flex items-center gap-1.5 text-xs rounded-lg glass px-3 py-1.5 hover:bg-white/10">
                <Plus className="h-3.5 w-3.5" /> Add subject
              </Link>
            </div>

            <div className="space-y-3">
              {subjects.map((s) => (
                <div key={s.id} className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 transition">
                  <div className="flex items-center gap-4">
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white font-display font-semibold shadow-glow`}>
                      {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{s.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{s.completedChapters}/{s.totalChapters} ch · {s.daysLeft}d left</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-xs font-medium tabular-nums w-9 text-right">{s.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-6">
            <div className="rounded-2xl glass shadow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary shadow-glow">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">AI Recommendations</h3>
                  <p className="text-[11px] text-muted-foreground">Updated 2 min ago</p>
                </div>
              </div>
              <div className="space-y-3">
                {aiRecommendations.map((r, i) => {
                  const Icon = r.type === "urgent" ? AlertTriangle : r.type === "warning" ? AlertTriangle : Trophy;
                  const tone =
                    r.type === "urgent" ? "border-rose-400/30 bg-rose-500/10 text-rose-200" :
                    r.type === "warning" ? "border-amber-400/30 bg-amber-500/10 text-amber-200" :
                    "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
                  return (
                    <div key={i} className={`rounded-xl border p-4 ${tone}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-foreground">{r.title}</div>
                          <div className="text-xs mt-1 text-muted-foreground leading-relaxed">{r.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl glass-strong shadow-card p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/30 blur-2xl" />
              <h3 className="font-display font-semibold mb-1">Exam Readiness</h3>
              <p className="text-xs text-muted-foreground mb-4">Across all upcoming exams</p>
              <div className="relative h-32 w-32 mx-auto">
                <svg viewBox="0 0 120 120" className="-rotate-90 h-full w-full">
                  <circle cx="60" cy="60" r="50" strokeWidth="10" className="stroke-white/5" fill="none" />
                  <circle
                    cx="60" cy="60" r="50" strokeWidth="10" fill="none"
                    stroke="url(#g1)" strokeLinecap="round"
                    strokeDasharray={`${(74 / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="oklch(0.66 0.22 295)" />
                      <stop offset="100%" stopColor="oklch(0.62 0.21 255)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="font-display text-3xl font-bold">74<span className="text-base text-muted-foreground">%</span></div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Add Subject", icon: Plus, to: "/subjects/add" },
            { label: "View Schedule", icon: Calendar, to: "/schedule" },
            { label: "Track Progress", icon: TrophyShim, to: "/progress" },
            { label: "See Analytics", icon: SparklesShim, to: "/analytics" },
          ].map((a) => (
            <Link key={a.label} to={a.to} className="group rounded-2xl glass p-5 hover-lift flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-white">
                <a.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{a.label}</div>
                <div className="text-[11px] text-muted-foreground">Quick action</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}

// Avoid unused import lint
const TrophyShim = Trophy;
const SparklesShim = Sparkles;
