import { Bell, Search, Moon, Command } from "lucide-react";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-semibold leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 h-10 rounded-lg glass px-3 w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search subjects, chapters…"
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
            />
            <kbd className="hidden lg:flex items-center gap-1 text-[10px] text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>

          <button className="relative grid h-10 w-10 place-items-center rounded-lg glass hover:bg-white/10 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          </button>

          <button className="grid h-10 w-10 place-items-center rounded-lg glass hover:bg-white/10 transition-colors">
            <Moon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
