import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Calendar, ChevronDown, Clock, Hash, Save, Sparkles, X } from "lucide-react";
import type { Difficulty, Subject } from "@/lib/mock-data";
import { createSubject, updateSubject, type SubjectFormData } from "@/lib/subjects-store";

interface SubjectFormProps {
  subject?: Subject;
}

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

const difficultyMeta: Record<Difficulty, { color: string; label: string }> = {
  Easy:   { color: "text-zinc-300", label: "Low workload" },
  Medium: { color: "text-zinc-400", label: "Moderate workload" },
  Hard:   { color: "text-zinc-200", label: "Heavy workload" },
};

export function SubjectForm({ subject }: SubjectFormProps) {
  const navigate = useNavigate();
  const isEdit   = !!subject;

  const [name,         setName]         = useState(subject?.name ?? "");
  const [examDate,     setExamDate]     = useState(subject?.examDate ?? "");
  const [difficulty,   setDifficulty]   = useState<Difficulty>(subject?.difficulty ?? "Medium");
  const [chapters,     setChapters]     = useState<string[]>(
    subject ? Array.from({ length: subject.totalChapters }, (_, i) => `Chapter ${i + 1}`) : ["Introduction", "Core Concepts"]
  );
  const [chapterInput, setChapterInput] = useState("");
  const [hours,        setHours]        = useState(3);
  const [errors,       setErrors]       = useState<Record<string, string>>({});

  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "??";
  const daysLeft = examDate
    ? Math.max(0, Math.round((new Date(examDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86_400_000))
    : 0;

  function addChapter() {
    if (chapterInput.trim()) { setChapters([...chapters, chapterInput.trim()]); setChapterInput(""); }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Subject name is required.";
    if (!examDate) next.examDate = "Exam date is required.";
    else if (new Date(examDate) < new Date()) next.examDate = "Exam date must be in the future.";
    if (chapters.length === 0) next.chapters = "Add at least one chapter.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const data: SubjectFormData = { name: name.trim(), examDate, difficulty, chapters, hoursPerDay: hours };
    if (isEdit && subject) updateSubject(subject.id, data);
    else createSubject(data);
    navigate({ to: "/subjects" });
  }

  return (
    <div className="relative rounded-3xl glass-strong shadow-card p-8 overflow-hidden">
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative grid lg:grid-cols-[1fr_1fr] gap-8">

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <Field label="Subject Name" icon={BookOpen} error={errors.name}>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Database Management Systems"
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Exam Date" icon={Calendar} error={errors.examDate}>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-foreground [color-scheme:dark]" />
            </Field>
            <Field label="Difficulty" icon={Sparkles}>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-transparent outline-none text-sm appearance-none cursor-pointer">
                {DIFFICULTIES.map((d) => <option key={d} value={d} className="bg-card">{d}</option>)}
              </select>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </Field>
          </div>

          <Field label="Add Chapter / Topic" icon={Hash} error={errors.chapters}>
            <input value={chapterInput} onChange={(e) => setChapterInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChapter(); } }}
              placeholder="Type and press Enter…"
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
          </Field>

          {chapters.length > 0 && (
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
          )}

          <Field label={`Available Hours / Day: ${hours}h`} icon={Clock}>
            <input type="range" min={1} max={10} value={hours}
              onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-white" />
          </Field>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit"
              className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:opacity-90 transition">
              <Save className="h-4 w-4" />
              {isEdit ? "Save Changes" : "Save & Generate Plan"}
            </button>
            <Link to="/subjects" className="text-sm text-muted-foreground hover:text-foreground">Cancel</Link>
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl glass p-5">
            <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Preview</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-white font-display font-semibold shadow-glow shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-display font-semibold truncate">{name || "Subject Name"}</div>
                <div className="text-xs text-muted-foreground">{difficulty} · {chapters.length} chapters · {hours}h/day</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Days left"   value={examDate ? String(daysLeft) : "—"} />
              <Stat label="Total hours" value={`${chapters.length * hours * 2}h`} />
              <Stat label="Daily"       value={`${hours}h`} />
            </div>
          </div>

          <div className="rounded-2xl glass p-5 space-y-3">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">AI Insight</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              With <span className="text-foreground font-medium">{hours}h/day</span> and{" "}
              <span className="text-foreground font-medium">{chapters.length} chapters</span>, you'll
              cover content with a <span className={`font-medium ${difficultyMeta[difficulty].color}`}>22% revision buffer</span>.
            </p>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full gradient-primary rounded-full"
                style={{ width: difficulty === "Easy" ? "33%" : difficulty === "Medium" ? "60%" : "88%" }} />
            </div>
            <div className={`text-xs font-medium ${difficultyMeta[difficulty].color}`}>
              {difficultyMeta[difficulty].label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, error, children }: {
  label: string; icon: React.ComponentType<{ className?: string }>; error?: string; children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className={`mt-1.5 flex items-center gap-2 rounded-xl border px-3.5 h-11 focus-within:border-primary/50 transition bg-white/[0.03] ${error ? "border-zinc-500/50" : "border-white/10"}`}>
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-zinc-400">{error}</p>}
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