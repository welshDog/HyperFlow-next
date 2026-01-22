import { surveySpec } from "@/survey/spec";
import SurveyForm from "./surveyForm";

export default function Page({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const token = typeof searchParams?.token === "string" ? searchParams?.token : undefined;
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{surveySpec.meta.title}</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">{surveySpec.meta.description}</p>
      <SurveyForm token={token} />
    </main>
  );
}
