import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { CaseForm } from "@/components/forms/CaseForm";
import { Nav } from "@/components/Nav";
import { getCurrentUser } from "@/lib/auth";

export default async function NewCasePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-semibold">New student case</h1>
        <CaseForm />
      </section>
      <Footer />
    </main>
  );
}
