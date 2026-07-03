import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { Subject } from "@/lib/mock-data";
import { toggleChapter, getCompletedChapters } from "@/lib/progress-store";
import { Toast } from "@/components/Toast";

interface ChapterChecklistProps {
  subject: Subject;
  onUpdate: () => void;
}

export function ChapterChecklist({ subject, onUpdate }: ChapterChecklistProps) {
  const [completed, setCompleted] = useState<number[]>(() =>
    getCompletedChapters(subject.id)
  );

  function handleToggle(index: number) {
    const wasDone    = completed.includes(index);
    const wasComplete = completed.length === subject.totalChapters;

    toggleChapter(subject.id, index);
    const next = getCompletedChapters(subject.id);
    setCompleted(next);
    onUpdate();

    const chapterLabel = `Chapter ${index + 1}`;
    if (!wasDone) {
      // Just completed — check if entire subject is now done
      if (next.length === subject.totalChapters && !wasComplete) {
        Toast.subjectComplete(subject.name);
      } else {
        Toast.chapterDone(chapterLabel);
      }
    } else {
      Toast.chapterUndone(chapterLabel);
    }
  }

  const chapters = Array.from({ length: subject.totalChapters }, (_, i) => ({
    index: i,
    label: `Chapter ${i + 1}`,
    done: completed.includes(i),
  }));

  const progress = subject.totalChapters > 0
    ? Math.round((completed.length / subject.totalChapters) * 100) : 0;

  return (
    <div className="rounded-2xl glass shadow-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br ${subject.color} text-white font-display font-semibold text-sm shadow-glow`}>
          {subject.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-sm truncate">{subject.name}</div>
          <div className="text-xs text-muted-foreground">{completed.length} of {subject.totalChapters} chapters done</div>
        </div>
        <span className="font-display font-bold text-lg tabular-nums">{progress}%</span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-linear-to-r ${subject.color} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
        {chapters.map((ch) => (
          <button
            key={ch.index}
            onClick={() => handleToggle(ch.index)}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all text-left ${
              ch.done
                ? "bg-white/3 text-muted-foreground"
                : "bg-white/1 hover:bg-white/4 text-foreground"
            }`}
          >
            {ch.done
              ? <CheckCircle2 className="h-4 w-4 text-zinc-400 shrink-0" />
              : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            }
            <span className={ch.done ? "line-through" : ""}>{ch.label}</span>
            {ch.done && <span className="ml-auto text-[10px] text-muted-foreground">✓ done</span>}
          </button>
        ))}
      </div>
    </div>
  );
}