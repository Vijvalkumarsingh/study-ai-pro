// ── Reusable skeleton loading components ──────────────────────────────────────

export function SkeletonCard() {
    return (
      <div className="rounded-2xl glass p-5 flex flex-col gap-4 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3.5 w-3/4 rounded-full bg-white/10" />
            <div className="h-2.5 w-1/2 rounded-full bg-white/5" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg bg-white/5 h-14" />
          ))}
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5" />
      </div>
    );
  }
  
  export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-xl glass p-4 flex items-center gap-3 animate-pulse">
            <div className="h-9 w-9 rounded-xl bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 rounded-full bg-white/10" />
              <div className="h-2.5 w-1/3 rounded-full bg-white/5" />
            </div>
            <div className="h-3 w-16 rounded-full bg-white/5 shrink-0" />
          </div>
        ))}
      </div>
    );
  }
  
  export function SkeletonKPI({ count = 4 }: { count?: number }) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-2xl glass p-5 animate-pulse space-y-3">
            <div className="h-2.5 w-1/2 rounded-full bg-white/10" />
            <div className="h-8 w-2/3 rounded-full bg-white/10" />
            <div className="h-2 w-1/3 rounded-full bg-white/5" />
          </div>
        ))}
      </div>
    );
  }
  
  export function SkeletonChart() {
    return (
      <div className="rounded-2xl glass p-6 animate-pulse space-y-4">
        <div className="h-4 w-1/4 rounded-full bg-white/10" />
        <div className="h-72 rounded-xl bg-white/5" />
      </div>
    );
  }