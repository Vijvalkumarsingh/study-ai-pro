import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { weeklyHours, subjectPerformance, completionTrend, subjects } from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { TrendingUp, Zap, Brain, Target } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — StudyAI" },
      { name: "description", content: "Deep insights into your study hours, performance, and exam readiness." },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  backgroundColor: "oklch(0.21 0.03 270 / 95%)",
  border: "1px solid oklch(1 0 0 / 10%)",
  borderRadius: 12,
  color: "white",
  fontSize: 12,
};

function AnalyticsPage() {
  const insights = [
    { icon: Zap, title: "Peak Focus", value: "10am – 12pm", desc: "Your highest retention window" },
    { icon: Brain, title: "Strongest Subject", value: "Discrete Math", desc: "88% mastery score" },
    { icon: TrendingUp, title: "Best Streak Day", value: "Friday", desc: "Avg. 7h study time" },
    { icon: Target, title: "Focus Score", value: "8.4 / 10", desc: "Top 12% of students" },
  ];

  return (
    <>
      <TopBar title="Analytics" subtitle="Deep insights into your learning patterns and exam readiness." />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in-up">

        {/* Insights cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.title} className="rounded-2xl glass shadow-card p-5 hover-lift">
                <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow mb-3">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-xs text-muted-foreground">{i.title}</div>
                <div className="font-display text-xl font-bold mt-1">{i.value}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{i.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Hours chart + readiness */}
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
          <div className="rounded-2xl glass shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-lg font-semibold">Study Hours</h3>
                <p className="text-xs text-muted-foreground">This week vs target</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-400" /> Hours</span>
                <span className="inline-flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full bg-white/30" /> Target</span>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={weeklyHours}>
                  <defs>
                    <linearGradient id="h" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.66 0.22 295)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.66 0.22 295)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                  <XAxis dataKey="day" stroke="oklch(0.7 0.025 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.7 0.025 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "oklch(1 0 0 / 10%)" }} />
                  <Area type="monotone" dataKey="target" stroke="oklch(1 0 0 / 25%)" strokeDasharray="4 4" fill="none" />
                  <Area type="monotone" dataKey="hours" stroke="oklch(0.66 0.22 295)" strokeWidth={2.5} fill="url(#h)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl glass-strong shadow-card p-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
            <h3 className="font-display text-lg font-semibold">Exam Readiness</h3>
            <p className="text-xs text-muted-foreground mb-3">Weighted across all subjects</p>
            <div className="h-56">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "ready", value: 74, fill: "oklch(0.66 0.22 295)" }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background={{ fill: "oklch(1 0 0 / 6%)" }} dataKey="value" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="-mt-44 text-center pointer-events-none">
                <div className="font-display text-4xl font-bold gradient-text">74%</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Ready</div>
              </div>
            </div>
            <div className="mt-12 text-xs text-muted-foreground text-center">
              You're <span className="text-emerald-300 font-medium">+6%</span> above weekly target.
            </div>
          </div>
        </div>

        {/* Subject perf + completion trend */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl glass shadow-card p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Subject Performance</h3>
            <p className="text-xs text-muted-foreground mb-5">Mock test scores per subject</p>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={subjectPerformance}>
                  <defs>
                    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.66 0.22 295)" />
                      <stop offset="100%" stopColor="oklch(0.62 0.21 255)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                  <XAxis dataKey="name" stroke="oklch(0.7 0.025 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.7 0.025 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 4%)" }} />
                  <Bar dataKey="score" fill="url(#b)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl glass shadow-card p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Completion Rate</h3>
            <p className="text-xs text-muted-foreground mb-5">Cumulative syllabus completion (6 weeks)</p>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={completionTrend}>
                  <defs>
                    <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.21 255)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="oklch(0.62 0.21 255)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                  <XAxis dataKey="week" stroke="oklch(0.7 0.025 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.7 0.025 270)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="completion" stroke="oklch(0.62 0.21 255)" strokeWidth={2.5} fill="url(#c)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Productivity by subject mini list */}
        <div className="rounded-2xl glass shadow-card p-6">
          <h3 className="font-display text-lg font-semibold mb-5">Hours invested · this week</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {subjects.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${s.color} mb-3`} />
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="font-display text-2xl font-bold mt-1">{s.hoursThisWeek}h</div>
                <div className="text-[11px] text-muted-foreground">target {s.targetHours}h</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
