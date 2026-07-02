import { AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Metric } from "@/components/Metric";
import { Nav } from "@/components/Nav";
import { StatusBadge } from "@/components/StatusBadge";
import { getCurrentUser } from "@/lib/auth";
import { listCases, listResources } from "@/lib/data";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const [cases, resources] = await Promise.all([listCases(user), listResources()]);
  const highUrgency = cases.filter((item) => item.urgency === "high").length;
  const approved = cases.filter((item) => item.status === "approved").length;

  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-leaf">Welcome, {user.name}</p>
            <h1 className="mt-1 text-3xl font-semibold text-ink">Counselor command center</h1>
          </div>
          <Link className="btn-primary" href="/cases/new">
            New student case
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Metric icon={Users} label="Active cases" value={cases.length} />
          <Metric icon={AlertTriangle} label="High urgency" value={highUrgency} />
          <Metric icon={CheckCircle2} label="Approved" value={approved} />
          <Metric icon={Clock} label="Aid resources" value={resources.length} />
        </div>

        <div className="mt-8 rounded-lg border border-ink/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-ink/10 p-4">
            <h2 className="font-semibold">Recent cases</h2>
            <Link className="text-sm font-semibold text-leaf" href="/cases">
              View all
            </Link>
          </div>
          <div className="divide-y divide-ink/10">
            {cases.slice(0, 6).map((record) => (
              <Link key={record.id} href={`/cases/${record.id}`} className="grid gap-2 p-4 transition hover:bg-cloud md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="font-semibold text-ink">{record.studentName}</div>
                  <div className="text-sm text-ink/65">{record.region} - {record.educationLevel}</div>
                </div>
                <StatusBadge status={record.status} />
                <span className="text-sm font-medium text-coral">{record.urgency} urgency</span>
              </Link>
            ))}
            {cases.length === 0 ? <p className="p-4 text-sm text-ink/70">No cases yet. Create the first intake.</p> : null}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
