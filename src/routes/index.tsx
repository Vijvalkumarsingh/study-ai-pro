import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flame, Calendar, Zap, ArrowRight, Plus, Play, Trophy,
  BookOpen, Brain, Sparkles, BarChart3, Target, Clock, TrendingUp,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { subjects, todayPlan, aiRecommendations, user, weeklyHours, achievements } from "@/lib/mock-data";

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
  const examProgress = Math.min(100, ((28 - nextExam.daysLeft) / 28) * 100);
  const earnedBadges = achievements.filter((a) => a.earned);
  const topReco = aiRecommendations[0];

  return (
    <>
      <TopBar title={`Good evening, ${user.name}`} subtitle="You're on a 14-day streak. Let's keep it going." />

      <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-[1400px] mx-auto w-full">
        {/* Mobile header (above bento) */}
        <header className="flex justify-between items-center px-1 lg:hidden animate-fade-in-up">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">
              Intelligence Active
            </p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              Morning, {user.name}
            </h1>
          </div>
          <div className="h-10 w-10 rounded-full border border-white/20 bg-white/10 grid place-items-center">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse-dot" />
          </div>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 stagger-children">

          {/* 1. AI HERO — full width */}
          <article className="col-span-4 relative overflow-hidden rounded-[2rem] p-6 sm:p-8 shadow-hero"
            style={{ background: "var(--gradient-hero)" }}>
            <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-5 right-6 text-white/15">
              <Zap className="w-12 h-12 sm:w-16 sm:h-16" strokeWidth={1.5} />
            </div>
            <div className="relative z-10 max-w-[420px]">
              <span className="inline-block px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-100">
                AI Recommendation
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3 mb-2 leading-[1.05] tracking-tight">
                {topReco.title}
              </h3>
              <p className="text-zinc-100/80 text-sm leading-relaxed">
                {topReco.description}
              </p>
              <div className="mt-6 flex gap-2.5">
                <button className="px-5 py-2.5 bg-white text-zinc-900 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform inline-flex items-center gap-2">
                  <Play className="h-4 w-4" /> Start Flow State
                </button>
                <Link to="/schedule" className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10 transition inline-flex items-center gap-1.5">
                  Schedule <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* 2. Streak tile — col-span-1 */}
          <article className="col-span-1 rounded-2xl p-3 sm:p-4 glass flex flex-col justify-between aspect-square sm:aspect-auto sm:min-h-[110px] hover-lift">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-zinc-500">Streak</span>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-white leading-none">{user.streak}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Days</div>
            </div>
          </article>

          {/* 3. Exam Countdown — col-span-3 */}
          <article className="col-span-3 rounded-2xl p-4 sm:p-5 glass flex items-center justify-between hover-lift">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-300" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Next Exam</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white truncate font-display">{nextExam.name}</h4>
              <div className="mt-2 w-full max-w-[160px] h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-zinc-300 to-zinc-400 h-full rounded-full" style={{ width: `${examProgress}%` }} />
              </div>
            </div>
            <div className="text-right shrink-0 ml-3">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="font-display text-3xl sm:text-4xl font-bold text-zinc-300 leading-none tabular-nums">
                  {String(nextExam.daysLeft).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-bold">Days</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">to {nextExam.code}</div>
            </div>
          </article>

          {/* 4. Today's Plan — col-span-4 */}
          <article className="col-span-4 rounded-[1.75rem] p-5 glass">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-display text-sm font-bold text-white">Today's Focus Sessions</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">5 sessions · 6h 30m total</p>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 bg-white/10 text-zinc-300 border border-white/20 rounded-full inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-pulse-dot" /> On track
              </span>
            </div>
            <div className="space-y-2.5">
              {todayPlan.slice(0, 4).map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition ${
                  s.done ? "opacity-50" : "hover:bg-white/[0.03]"
                }`}>
                  <div className={`h-9 w-9 shrink-0 rounded-xl grid place-items-center border ${
                    s.priority === "high" ? "bg-white/10 border-white/20 text-zinc-300" :
                    s.priority === "medium" ? "bg-zinc-500/10 border-zinc-500/20 text-zinc-400" :
                    "bg-zinc-700/10 border-zinc-700/20 text-zinc-500"
                  }`}>
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-zinc-200 truncate">{s.topic}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{s.subject}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono text-zinc-400">{s.time}</div>
                    <div className={`text-[9px] uppercase font-bold tracking-wider ${
                      s.priority === "high" ? "text-zinc-300" :
                      s.priority === "medium" ? "text-zinc-400" :
                      "text-zinc-500"
                    }`}>{s.priority}</div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* 5. Subject Proficiency — col-span-4 */}
          <article className="col-span-4 rounded-[1.75rem] p-5 glass">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-sm font-bold text-white">Subject Proficiency</h3>
              <span className="text-[10px] font-medium px-2 py-0.5 bg-white/10 text-zinc-300 rounded-full">
                Weekly Update
              </span>
            </div>
            <div className="space-y-4">
              {subjects.slice(0, 4).map((s, i) => {
                const tones = [
                  { bg: "bg-white/10", br: "border-white/20", tx: "text-zinc-300", bar: "bg-white", glow: "0 0 8px rgba(255, 255, 255, 0.4)" },
                  { bg: "bg-zinc-500/10", br: "border-zinc-500/20", tx: "text-zinc-400", bar: "bg-zinc-400", glow: "0 0 8px rgba(161, 161, 170, 0.5)" },
                  { bg: "bg-zinc-600/10", br: "border-zinc-600/20", tx: "text-zinc-500", bar: "bg-zinc-500", glow: "0 0 8px rgba(113, 113, 122, 0.5)" },
                  { bg: "bg-zinc-700/10", br: "border-zinc-700/20", tx: "text-zinc-600", bar: "bg-zinc-600", glow: "0 0 8px rgba(82, 82, 91, 0.5)" },
                ][i];
                return (
                  <div key={s.id} className="flex items-center gap-3 sm:gap-4">
                    <div className={`h-10 w-10 shrink-0 rounded-xl ${tones.bg} border ${tones.br} grid place-items-center ${tones.tx}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-end mb-1.5 gap-2">
                        <span className="text-xs font-bold text-zinc-200 truncate">{s.name}</span>
                        <span className={`text-[10px] font-mono shrink-0 ${tones.tx}`}>{s.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className={`${tones.bar} h-full rounded-full transition-all duration-700`}
                          style={{ width: `${s.progress}%`, boxShadow: tones.glow }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          {/* 6. Study Hours bar chart — col-span-2 */}
          <article className="col-span-2 rounded-2xl p-4 sm:p-5 glass hover-lift">
            <div className="flex items-center gap-1.5 mb-3">
              <BarChart3 className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Study Hours</span>
            </div>
            <div className="flex items-end gap-1 h-14">
              {weeklyHours.map((d, i) => {
                const max = Math.max(...weeklyHours.map((h) => h.hours));
                const h = (d.hours / max) * 100;
                const isPeak = d.hours === max;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all duration-700 ${
                      isPeak ? "bg-white" : "bg-[#1a1a1a]"
                    }`}
                    style={{
                      height: `${h}%`,
                      boxShadow: isPeak ? "0 0 10px rgba(255, 255, 255, 0.3)" : undefined,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-base font-bold text-white font-display leading-none tabular-nums">
                  {totalHours.toFixed(1)}
                </div>
                <div className="text-[9px] text-zinc-500 font-medium mt-0.5">hrs/wk</div>
              </div>
              <div className="text-[10px] text-zinc-300 font-mono inline-flex items-center gap-0.5">
                <TrendingUp className="h-2.5 w-2.5" /> +12%
              </div>
            </div>
          </article>

          {/* 7. Achievement Badge — col-span-2 */}
          <article className="col-span-2 rounded-2xl p-4 sm:p-5 glass hover-lift group">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Latest Badge</span>
                <h4 className="text-xs font-bold text-white mt-0.5 truncate font-display">{earnedBadges[1]?.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">
                  {earnedBadges.length} of {achievements.length} earned
                </p>
              </div>
            </div>
            <div className="flex gap-1.5 mt-3">
              {achievements.slice(0, 6).map((a, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${a.earned ? "bg-white" : "bg-[#1a1a1a]"}`} />
              ))}
            </div>
          </article>

          {/* 8. Exam Readiness — col-span-2 */}
          <article className="col-span-2 rounded-2xl p-4 sm:p-5 glass hover-lift relative overflow-hidden">
            <div className="absolute -top-8 -right-8 h-24 w-24 bg-white/10 blur-2xl rounded-full" />
            <div className="relative flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0">
                <svg viewBox="0 0 60 60" className="-rotate-90 h-full w-full">
                  <circle cx="30" cy="30" r="25" strokeWidth="5" stroke="#1a1a1a" fill="none" />
                  <circle cx="30" cy="30" r="25" strokeWidth="5" stroke="url(#g)" strokeLinecap="round" fill="none"
                    strokeDasharray={`${(74 / 100) * 157} 157`} />
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#e4e4e7" />
                      <stop offset="100%" stopColor="#a1a1aa" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-xs font-bold font-display text-white">74%</span>
                </div>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Exam Readiness</span>
                <div className="font-display text-base font-bold text-white mt-0.5">Strong</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">+6% vs goal</div>
              </div>
            </div>
          </article>

          {/* 9. Total Hours small tile — col-span-2 */}
          <article className="col-span-2 rounded-2xl p-4 sm:p-5 glass hover-lift">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Today</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-white tabular-nums leading-none">4.2</span>
              <span className="text-xs text-slate-500">/ 6h</span>
            </div>
            <div className="mt-3 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-zinc-400 to-zinc-500 rounded-full" style={{ width: "70%" }} />
            </div>
            <div className="text-[10px] text-slate-500 mt-2">2 sessions remaining</div>
          </article>
        </div>

        {/* Secondary section: AI insights + quick actions */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 stagger-children mt-2">
          {/* AI insights list — col-span-4 sm:col-span-2 */}
          <article className="col-span-4 sm:col-span-2 rounded-[1.75rem] p-5 glass">
            <div className="flex items-center gap-2 mb-4">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 border border-white/20">
                <Brain className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white">More AI Insights</h3>
                <p className="text-[10px] text-slate-500">Updated 2 min ago</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {aiRecommendations.slice(1).map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/30 transition">
                  <div className="text-xs font-bold text-slate-200">{r.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">{r.description}</div>
                </div>
              ))}
            </div>
          </article>

          {/* Quick actions — col-span-4 sm:col-span-2 */}
          <article className="col-span-4 sm:col-span-2 rounded-[1.75rem] p-5 glass">
            <div className="flex items-center gap-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Quick Actions</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Add Subject", icon: Plus, to: "/subjects/add" },
                { label: "Schedule", icon: Calendar, to: "/schedule" },
                { label: "Progress", icon: Target, to: "/progress" },
                { label: "Analytics", icon: BarChart3, to: "/analytics" },
              ].map((a) => (
                <Link key={a.label} to={a.to}
                  className="group flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/30 hover:bg-white/5 transition">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-white/10 border border-white/20 grid place-items-center text-zinc-400 group-hover:scale-110 transition-transform">
                    <a.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{a.label}</span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
