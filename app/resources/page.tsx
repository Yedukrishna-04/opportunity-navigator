import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { ResourceForm } from "@/components/forms/ResourceForm";
import { Nav } from "@/components/Nav";
import { getCurrentUser } from "@/lib/auth";
import { listResources } from "@/lib/data";

export default async function ResourcesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const resources = await listResources();

  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Aid resources</h1>
            <p className="mt-1 text-sm text-ink/65">Reviewer-curated opportunities used by the matching engine.</p>
          </div>
          {user.role === "admin" || user.role === "reviewer" ? <ResourceForm /> : null}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <article key={resource.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{resource.title}</h2>
                  <p className="text-sm text-ink/65">{resource.provider}</p>
                </div>
                <span className="rounded-md bg-leaf/10 px-2 py-1 text-xs font-semibold text-leaf">{resource.supportType}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/75">{resource.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="font-semibold">Region</dt><dd>{resource.region}</dd></div>
                <div><dt className="font-semibold">Max income</dt><dd>{resource.maxIncome.toLocaleString()}</dd></div>
                <div><dt className="font-semibold">Education</dt><dd>{resource.minEducationLevel}</dd></div>
                <div><dt className="font-semibold">Deadline</dt><dd>{resource.deadline ?? "Rolling"}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
