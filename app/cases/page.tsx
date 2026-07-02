import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { StatusBadge } from "@/components/StatusBadge";
import { getCurrentUser } from "@/lib/auth";
import { listCases } from "@/lib/data";

export default async function CasesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const cases = await listCases(user);

  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Student cases</h1>
          <Link className="btn-primary" href="/cases/new">New case</Link>
        </div>
        <div className="mt-6 grid gap-4">
          {cases.map((record) => (
            <Link key={record.id} href={`/cases/${record.id}`} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm transition hover:border-leaf">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{record.studentName}</h2>
                  <p className="text-sm text-ink/65">{record.studentEmail} - {record.region}</p>
                </div>
                <StatusBadge status={record.status} />
              </div>
              <p className="mt-3 text-sm text-ink/75">{record.notes || "No counselor notes yet."}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
