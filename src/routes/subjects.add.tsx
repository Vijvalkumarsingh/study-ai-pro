import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Calendar, ChevronDown, Clock, Hash, Save, Sparkles, X } from "lucide-react";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/subjects/add")({
  head: () => ({
    meta: [
      { title: "Add Subject — StudyAI" },
      { name: "description", content: "Add a new subject and let StudyAI build your personalized study plan." },
    ],
  }),
  component: AddSubject,
});

function AddSubject() {
  const [chapters, setChapters] = useState<string[]>(["Introduction", "Core Concepts"]);
  const [chapter, setChapter] = useState("");
  const [hours, setHours] = useState(3);

  return (
    <>
      <TopBar title="Add a New Subject" subtitle="Tell StudyAI about your subject and we'll generate the optimal plan." />
      <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full animate-fade-in-up">
        <div className="relative rounded-3xl glass-strong shadow-card p-8 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-[1fr_1fr] gap-8">
            <form className="space-y-6">
              <Field label="Subject Name" icon={BookOpen}>
                <input
                  placeholder="e.g. Database Management Systems"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Exam Date" icon={Calendar}>
                  <input type="date" defaultValue="2026-07-15" className="w-full bg-transparent outline-none text-sm text-foreground [color-scheme:dark]" />
                </Field>

                <Field label="Difficulty" icon={Sparkles}>
                  <select defaultValue="Medium" className="w-full bg-transparent outline-none text-sm appearance-none cursor-pointer">
                    <option className="bg-card">Easy</option>
                    <option className="bg-card">Medium</option>
                    <option className="bg-card">Hard</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Field>
              </div>

              <Field label="Add Chapter / Topic" icon={Hash}>
                <input
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chapter.trim()) {
                      e.preventDefault();
                      setChapters([...chapters, chapter.trim()]);
                      setChapter("");
                    }
                  }}
                  placeholder="Type and press Enter…"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
              </Field>

              <div className="flex flex-wrap gap-2">
                {chapters.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs">
                    {c}
                    <button type="button" onClick={() => setChapters(chapters.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                ))}
              </div>

              <Field label={`Available Hours / Day: ${hours}h`} icon={Clock}>
                <input
                  type="range" min={1} max={10} value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </Field>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:opacity-90 transition">
                  <Save className="h-4 w-4" /> Save & Generate Plan
                </button>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Cancel</Link>
              </div>
            </form>

            {/* Live preview */}
            <div className="space-y-4">
              <div className="rounded-2xl glass p-5">
                <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Preview</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-white font-display font-semibold shadow-glow">
                    DB
                  </div>
                  <div>
                    <div className="font-display font-semibold">Database Management Systems</div>
                    <div className="text-xs text-muted-foreground">Medium · {chapters.length} chapters · {hours}h/day</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Stat label="Days" value="23" />
                  <Stat label="Total hours" value={`${chapters.length * 4}h`} />
                  <Stat label="Daily" value={`${hours}h`} />
                </div>
              </div>

              <div className="rounded-2xl glass p-5 space-y-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">AI Insight</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  With <span className="text-foreground font-medium">{hours}h/day</span> and <span className="text-foreground font-medium">{chapters.length} chapters</span>, you'll comfortably cover content with <span className="text-emerald-300 font-medium">22% buffer for revision</span>.
                </p>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: "78%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 h-11 focus-within:border-primary/50 transition">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] py-2">
      <div className="font-display font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
