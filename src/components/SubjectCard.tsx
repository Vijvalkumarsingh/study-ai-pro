import { Link } from "@tanstack/react-router";
import { BookOpen, Calendar, Edit2, Trash2, BarChart2 } from "lucide-react";
import type { Subject } from "@/lib/mock-data";
import { deleteSubject, createSubject } from "@/lib/subjects-store";
import { Toast } from "@/components/Toast";

interface SubjectCardProps {
  subject: Subject;
  onDeleted: () => void;
}

const difficultyColors: Record<string, string> = {
  Easy:   "text-zinc-300 bg-zinc-300/10 border-zinc-300/20",
  Medium: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  Hard:   "text-zinc-200 bg-zinc-200/10 border-zinc-200/20",
};

export function SubjectCard({ subject, onDeleted }: SubjectCardProps) {
  const initials  = subject.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const diffClass = difficultyColors[subject.difficulty] ?? difficultyColors["Medium"];

  function handleDelete() {
    // Snapshot the subject before deleting so we can restore it on undo
    const snapshot = { ...subject };
    deleteSubject(subject.id);
    onDeleted();

    Toast.deletedSubject(subject.name, () => {
      // Restore the subject by re-creating it with the same data
      // (id will be new but all fields are restored)
      createSubject({
        name:         snapshot.name,
        examDate:     snapshot.examDate,
        difficulty:   snapshot.difficulty,
        chapters:     Array.from({ length: snapshot.totalChapters }, (_, i) => `Chapter ${i + 1}`),
        hoursPerDay:  Math.round(snapshot.targetHours / snapshot.totalChapters) || 2,
      });
      onDeleted(); // refresh the list
    });
  }

  return (
    <article className="relative rounded-2xl glass shadow-card p-5 flex flex-col gap-4 hover-lift group">
      <div className="flex items-start gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-linear-to-br ${subject.color} text-white font-display font-semibold shadow-glow`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display font-semibold text-sm truncate">{subject.name}</div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground font-mono">{subject.code}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${diffClass}`}>
              {subject.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Link
            to="/subjects/$id/edit"
            params={{ id: subject.id }}
            className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition"
            title="Edit"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={handleDelete}
            className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-zinc-300 hover:bg-zinc-300/10 transition"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat icon={<Calendar className="h-3 w-3" />} label="Exam" value={`${subject.daysLeft}d`} accent={subject.daysLeft <= 7 ? "text-zinc-200" : "text-foreground"} />
        <Stat icon={<BookOpen className="h-3 w-3" />} label="Chapters" value={`${subject.completedChapters}/${subject.totalChapters}`} />
        <Stat icon={<BarChart2 className="h-3 w-3" />} label="Progress" value={`${subject.progress}%`} />
      </div>

      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full bg-linear-to-r ${subject.color} transition-all duration-700`}
          style={{ width: `${subject.progress}%` }} />
      </div>
    </article>
  );
}

function Stat({ icon, label, value, accent = "text-foreground" }: {
  icon: React.ReactNode; label: string; value: string; accent?: string;
}) {
  return (
    <div className="rounded-lg bg-white/3 py-2 px-1">
      <div className={`font-display font-bold text-sm ${accent}`}>{value}</div>
      <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
        {icon}{label}
      </div>
    </div>
  );
}