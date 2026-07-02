"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });

    setLoading(false);
    if (!response.ok) {
      const text = await response.text();
      const body = text ? JSON.parse(text) : {};
      setError(body.error ?? "Unable to sign in.");
      return;
    }

    router.push(params.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input className="field mt-1" id="email" name="email" type="email" defaultValue="counselor@opnav.test" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input className="field mt-1" id="password" name="password" type="password" defaultValue="Password123!" required />
      </div>
      {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p> : null}
      <button className="btn-primary w-full" disabled={loading} type="submit">
        <LogIn size={16} aria-hidden />
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
