import { useState, useEffect, useRef } from "react";
import { Bell, Search, Moon, Sun, Command, X, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { loadSubjects } from "@/lib/subjects-store";
import type { Subject } from "@/lib/mock-data";

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

function buildNotifications(subjects: Subject[]): Notification[] {
  const notes: Notification[] = [];
  subjects.forEach((s) => {
    if (s.daysLeft <= 3) {
      notes.push({
        id: `exam-${s.id}`,
        title: `⚠️ Exam in ${s.daysLeft} day${s.daysLeft !== 1 ? "s" : ""}`,
        desc: `${s.name} — make sure to do a final review!`,
        time: "now",
        read: false,
      });
    } else if (s.daysLeft <= 7) {
      notes.push({
        id: `soon-${s.id}`,
        title: `📅 Exam coming up`,
        desc: `${s.name} in ${s.daysLeft} days. Stay on track!`,
        time: "today",
        read: false,
      });
    }
    if (s.progress === 100) {
      notes.push({
        id: `done-${s.id}`,
        title: `✅ Subject complete!`,
        desc: `You've finished all chapters in ${s.name}`,
        time: "recently",
        read: true,
      });
    }
  });
  if (notes.length === 0) {
    notes.push({
      id: "default",
      title: "🎯 Keep going!",
      desc: "Add more subjects to get personalized alerts.",
      time: "now",
      read: true,
    });
  }
  return notes;
}

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const navigate    = useNavigate();
  const [query,     setQuery]     = useState("");
  const [results,   setResults]   = useState<Subject[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showBell,   setShowBell]   = useState(false);
  const [dark,       setDark]       = useState(true);
  const [notifs,     setNotifs]     = useState<Notification[]>([]);
  const searchRef   = useRef<HTMLDivElement>(null);
  const bellRef     = useRef<HTMLDivElement>(null);

  // Load notifications from real subjects
  useEffect(() => {
    setNotifs(buildNotifications(loadSubjects()));
  }, []);

  // Search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const subjects = loadSubjects();
    const q = query.toLowerCase();
    setResults(subjects.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    ));
  }, [query]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setQuery("");
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBell(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard shortcut Cmd/Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setShowBell(false);
        setTimeout(() => document.getElementById("topbar-search")?.focus(), 50);
      }
      if (e.key === "Escape") { setShowSearch(false); setQuery(""); setShowBell(false); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Theme toggle
  function toggleTheme() {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 backdrop-blur-xl hidden lg:block">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-semibold leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>

        <div className="ml-auto flex items-center gap-3">

          {/* Search */}
          <div ref={searchRef} className="relative hidden md:block">
            <div className="flex items-center gap-2 h-10 rounded-lg glass px-3 w-72 cursor-text"
              onClick={() => { setShowSearch(true); document.getElementById("topbar-search")?.focus(); }}>
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                id="topbar-search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                placeholder="Search subjects, chapters…"
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
              />
              {query ? (
                <button onClick={() => { setQuery(""); setResults([]); }}>
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              ) : (
                <kbd className="hidden lg:flex items-center gap-1 text-[10px] text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">
                  <Command className="h-3 w-3" />K
                </kbd>
              )}
            </div>

            {/* Search results dropdown */}
            {showSearch && (
              <div className="absolute top-12 left-0 w-72 rounded-xl glass-strong border border-white/10 shadow-card overflow-hidden">
                {results.length > 0 ? (
                  <>
                    <div className="px-3 pt-2 pb-1 text-[10px] text-muted-foreground uppercase tracking-wider">Subjects</div>
                    {results.map((s) => (
                      <button key={s.id}
                        onClick={() => { navigate({ to: "/subjects/$id/edit", params: { id: s.id } }); setShowSearch(false); setQuery(""); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition text-left">
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${s.color} text-white text-xs font-bold`}>
                          {s.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground">{s.code} · {s.progress}% done</div>
                        </div>
                      </button>
                    ))}
                  </>
                ) : query.trim() ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">No subjects found for "{query}"</div>
                ) : (
                  <div className="p-3 space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider px-1 mb-2">Your subjects</div>
                    {loadSubjects().slice(0, 5).map((s) => (
                      <button key={s.id}
                        onClick={() => { navigate({ to: "/subjects/$id/edit", params: { id: s.id } }); setShowSearch(false); }}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition text-left">
                        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground">{s.daysLeft}d left · {s.progress}%</div>
                        </div>
                      </button>
                    ))}
                    {loadSubjects().length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-2">No subjects yet</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bell */}
          <div ref={bellRef} className="relative">
            <button
              onClick={() => { setShowBell((b) => !b); setShowSearch(false); }}
              className="relative grid h-10 w-10 place-items-center rounded-lg glass hover:bg-white/10 transition-colors">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>

            {/* Notifications dropdown */}
            {showBell && (
              <div className="absolute top-12 right-0 w-80 rounded-xl glass-strong border border-white/10 shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <span className="text-sm font-semibold">Notifications</span>
                  {unread > 0 && (
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">{unread} new</span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifs.map((n) => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 ${n.read ? "opacity-60" : ""}`}>
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold">{n.title}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{n.desc}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                      </div>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-lg glass hover:bg-white/10 transition-colors"
            title="Toggle theme">
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}