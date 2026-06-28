import { createFileRoute, notFound } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { SubjectForm } from "@/components/SubjectForm";
import { loadSubjects } from "@/lib/subjects-store";

export const Route = createFileRoute("/subjects/$id/edit")({
  loader: ({ params }) => {
    const subject = loadSubjects().find((s) => s.id === params.id);
    if (!subject) throw notFound();
    return { subject };
  },
  component: EditSubjectPage,
});

function EditSubjectPage() {
  const { subject } = Route.useLoaderData();
  return (
    <>
      <TopBar title="Edit Subject" subtitle={`Updating details for ${subject.name}.`} />
      <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full animate-fade-in-up">
        <SubjectForm subject={subject} />
      </div>
    </>
  );
}