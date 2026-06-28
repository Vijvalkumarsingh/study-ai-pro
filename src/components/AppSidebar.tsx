import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, CalendarDays, BarChart3,
  TrendingUp, BookOpen, Sparkles, Settings,
} from "lucide-react";
import { loadProfile, loadStreak } from "@/lib/progress-store";
import { SettingsModal } from "@/components/SettingsModal";

const nav = [
  { to: "/",          label: "Dashboard", icon: LayoutDashboard },
  { to: "/subjects",  label: "Subjects",  icon: BookOpen },
  { to: "/schedule",  label: "Schedule",  icon: CalendarDays },
  { to: "/progress",  label: "Progress",  icon: TrendingUp },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname     = useRouterState({ select: (s) => s.location.pathname });
  const [showSettings, setShowSettings] = useState(false);

  const profile       = loadProfile();
  const streak        = loadStreak();
  const nextMilestone = Math.ceil((streak.current + 1) / 7) * 7;
  const daysToNext    = nextMilestone - streak.current;
  const streakPct     = Math.round((streak.current / nextMilestone) * 100);

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="font-display font-semibold text-lg leading-none">
            StudyFlow
            <div className="text-[10px] font-normal text-muted-foreground tracking-widest uppercase mt-1">
              Planner
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <div className="px-3 mb-2 text-xs uppercase tracking-wider text-muted-foreground">Workspace</div>
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon   = item.icon;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-sidebar-accent text-foreground shadow-card border border-white/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                }`}>
                <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl glass p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>🔥</span> Study Streak
          </div>
          <div className="flex items-end gap-2">
            <span className="font-display text-3xl font-bold gradient-text">{streak.current}</span>
            <span className="text-xs text-muted-foreground mb-1">days</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div className="h-full gradient-primary rounded-full" style={{ width: `${streakPct}%` }} />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {daysToNext > 0 ? `${daysToNext} days to next badge` : "Badge unlocked! 🎉"}
          </p>
        </div>

        <div className="p-3 border-t border-sidebar-border flex items-center gap-3">
          <button onClick={() => setShowSettings(true)}
            className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-sm font-semibold text-white hover:opacity-80 transition shrink-0"
            title="Open settings">
            {profile.initials}
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{profile.fullName}</div>
            <div className="text-xs text-muted-foreground truncate">Level {profile.level} · {profile.xp} XP</div>
          </div>
          <button onClick={() => setShowSettings(true)}
            className="text-muted-foreground hover:text-foreground transition-colors" title="Settings">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}