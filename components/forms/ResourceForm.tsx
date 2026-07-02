"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LibraryBig, Save } from "lucide-react";

export function ResourceForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });

    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Unable to save resource.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button className="btn-primary" type="button" onClick={() => setOpen(true)}>
        <LibraryBig size={16} aria-hidden />
        Add resource
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm md:grid-cols-2">
      <input className="field" name="title" placeholder="Resource title" required />
      <input className="field" name="provider" placeholder="Provider" required />
      <input className="field" name="region" placeholder="Region" defaultValue="All India" required />
      <input className="field" name="maxIncome" type="number" min="0" placeholder="Max income" required />
      <select className="field" name="minEducationLevel" defaultValue="undergraduate">
        <option value="secondary">Secondary</option>
        <option value="undergraduate">Undergraduate</option>
        <option value="postgraduate">Postgraduate</option>
        <option value="vocational">Vocational</option>
      </select>
      <select className="field" name="supportType" defaultValue="tuition">
        <option value="tuition">Tuition</option>
        <option value="device">Device</option>
        <option value="stipend">Stipend</option>
        <option value="housing">Housing</option>
        <option value="exam-fee">Exam fee</option>
        <option value="mentorship">Mentorship</option>
      </select>
      <input className="field" name="deadline" type="date" />
      <textarea className="field min-h-24 md:col-span-2" name="description" placeholder="Eligibility and impact notes" required />
      {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral md:col-span-2">{error}</p> : null}
      <div className="flex gap-2 md:col-span-2">
        <button className="btn-primary" type="submit">
          <Save size={16} aria-hidden />
          Save resource
        </button>
        <button className="btn-secondary" type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
