import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, BookOpen } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { SubjectCard } from "@/components/SubjectCard";
import { SkeletonCard } from "@/components/Skeleton";
import { loadSubjects } from "@/lib/subjects-store";
import type { Subject } from "@/lib/mock-data";

export const Route = createFileRoute("/subjects/")({
  component: SubjectsPage,
});

function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading,  setLoading]  = useState(true);

  function refresh() { setSubjects(loadSubjects()); }

  useEffect(() => {
    // Small artificial delay so the skeleton is visible briefly and avoids a flash
    const t = setTimeout(() => {
      setSubjects(loadSubjects());
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <TopBar title="Subjects" subtitle="Manage your subjects, exam dates, and study targets." />
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in-up">

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `${subjects.length} subject${subjects.length !== 1 ? "s" : ""} tracked`}
          </p>
          <Link
            to="/subjects/add"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" /> Add Subject
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : subjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <SubjectCard key={s.id} subject={s} onDeleted={refresh} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl glass-strong p-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-white shadow-glow mb-5">
        <BookOpen className="h-8 w-8" />
      </div>
      <h2 className="font-display text-xl font-semibold mb-2">No subjects yet</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        Add your first subject and StudyFlow will build the optimal study schedule automatically.
      </p>
      <Link
        to="/subjects/add"
        className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
      >
        <Plus className="h-4 w-4" /> Add your first subject
      </Link>
    </div>
  );
}