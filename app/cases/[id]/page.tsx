import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { CaseForm } from "@/components/forms/CaseForm";
import { RecommendationButton } from "@/components/forms/RecommendationButton";
import { Nav } from "@/components/Nav";
import { StatusBadge } from "@/components/StatusBadge";
import { getCurrentUser } from "@/lib/auth";
import { getCase, listRecommendations, listResources, scoreResource } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export default async function CaseDetailPage(props: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const { id } = await props.params;
  const record = await getCase(id, user);
  if (!record) notFound();

  const [recommendations, resources] = await Promise.all([listRecommendations(id), listResources()]);
  const ranked = resources
    .map((resource) => ({ resource, score: scoreResource(record, resource) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link className="text-sm font-semibold text-leaf" href="/cases">Back to cases</Link>
            <h1 className="mt-2 text-3xl font-semibold">{record.studentName}</h1>
            <div className="mt-2 flex items-center gap-3">
              <StatusBadge status={record.status} />
              <span className="text-sm text-ink/65">{record.ownerName}</span>
            </div>
          </div>
          <RecommendationButton caseId={record.id} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <CaseForm record={record} />
          <aside className="space-y-6">
            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Best-fit resources</h2>
              <div className="mt-4 space-y-3">
                {ranked.map(({ resource, score }) => (
                  <div key={resource.id} className="rounded-md border border-ink/10 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <span className="rounded-md bg-leaf/10 px-2 py-1 text-xs font-semibold text-leaf">{score}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink/65">{resource.provider} - {resource.supportType}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">AI plans</h2>
              <div className="mt-4 space-y-4">
                {recommendations.map((item) => (
                  <article key={item.id} className="rounded-md border border-ink/10 p-3">
                    <h3 className="font-semibold">{item.summary}</h3>
                    <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-6 text-ink/75">{item.actionPlan}</pre>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.riskFlags.map((flag) => (
                        <span key={flag} className="rounded-md bg-marigold/20 px-2 py-1 text-xs font-medium">{flag}</span>
                      ))}
                    </div>
                  </article>
                ))}
                {recommendations.length === 0 ? <p className="text-sm text-ink/70">Generate a plan after reviewing the case data.</p> : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}
