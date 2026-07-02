import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/forms/LoginForm";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-leaf">Full-stack assignment project</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
            Opportunity Navigator
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/75">
            A secure aid operations workspace for counselors who need to move students from financial risk to concrete,
            evidence-backed support decisions.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Eligibility scoring", "Role-based review", "AI action plans"].map((item) => (
              <div key={item} className="rounded-lg border border-ink/10 bg-white p-4 text-sm font-semibold shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}
