import Link from "next/link";
import { LogOut, Map, ShieldCheck, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export async function Nav() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold text-ink">
          <span className="grid size-9 place-items-center rounded-md bg-leaf text-white">
            <Map size={18} aria-hidden />
          </span>
          Opportunity Navigator
        </Link>
        {user ? (
          <nav className="flex items-center gap-2 text-sm">
            <Link className="btn-secondary hidden sm:inline-flex" href="/cases">
              Cases
            </Link>
            <Link className="btn-secondary hidden sm:inline-flex" href="/resources">
              Resources
            </Link>
            <span className="hidden items-center gap-1 rounded-md bg-marigold/20 px-3 py-2 font-medium text-ink md:flex">
              <ShieldCheck size={16} aria-hidden />
              {user.role}
            </span>
            <form action="/api/auth/logout" method="post">
              <button className="btn-secondary" title="Sign out" type="submit">
                <LogOut size={16} aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </nav>
        ) : (
          <span className="hidden items-center gap-2 text-sm text-ink/70 sm:flex">
            <Sparkles size={16} aria-hidden />
            AI-assisted aid operations
          </span>
        )}
      </div>
    </header>
  );
}
