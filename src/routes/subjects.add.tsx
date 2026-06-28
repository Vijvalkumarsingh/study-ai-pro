import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { SubjectForm } from "@/components/SubjectForm";

export const Route = createFileRoute("/subjects/add")({
  component: AddSubjectPage,
});

function AddSubjectPage() {
  return (
    <>
      <TopBar title="Add a New Subject" subtitle="Tell StudyAI about your subject and we'll generate the optimal plan." />
      <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full animate-fade-in-up">
        <SubjectForm />
      </div>
    </>
  );
}