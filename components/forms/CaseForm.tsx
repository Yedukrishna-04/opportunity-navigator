"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import type { StudentCase } from "@/lib/types";

const barrierOptions = ["income disruption", "device access", "transport", "documentation", "first generation", "housing"];

export function CaseForm({ record }: { record?: StudentCase }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const barriers = barrierOptions.filter((option) => form.getAll("barriers").includes(option));
    const body = {
      studentName: form.get("studentName"),
      studentEmail: form.get("studentEmail"),
      region: form.get("region"),
      householdIncome: form.get("householdIncome"),
      educationLevel: form.get("educationLevel"),
      urgency: form.get("urgency"),
      barriers,
      notes: form.get("notes") ?? "",
      status: form.get("status") ?? "intake"
    };

    const response = await fetch(record ? `/api/cases/${record.id}` : "/api/cases", {
      method: record ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setSaving(false);

    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Unable to save case.");
      return;
    }

    const payload = await response.json();
    router.push(`/cases/${payload.case.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-lg border border-ink/10 bg-white p-5 shadow-sm md:grid-cols-2">
      <div>
        <label className="label" htmlFor="studentName">
          Student name
        </label>
        <input className="field mt-1" id="studentName" name="studentName" defaultValue={record?.studentName} required />
      </div>
      <div>
        <label className="label" htmlFor="studentEmail">
          Student email
        </label>
        <input className="field mt-1" id="studentEmail" name="studentEmail" type="email" defaultValue={record?.studentEmail} required />
      </div>
      <div>
        <label className="label" htmlFor="region">
          Region
        </label>
        <input className="field mt-1" id="region" name="region" defaultValue={record?.region ?? "Karnataka"} required />
      </div>
      <div>
        <label className="label" htmlFor="householdIncome">
          Household income
        </label>
        <input className="field mt-1" id="householdIncome" name="householdIncome" type="number" min="0" defaultValue={record?.householdIncome ?? 240000} required />
      </div>
      <div>
        <label className="label" htmlFor="educationLevel">
          Education level
        </label>
        <select className="field mt-1" id="educationLevel" name="educationLevel" defaultValue={record?.educationLevel ?? "undergraduate"}>
          <option value="secondary">Secondary</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="postgraduate">Postgraduate</option>
          <option value="vocational">Vocational</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="urgency">
          Urgency
        </label>
        <select className="field mt-1" id="urgency" name="urgency" defaultValue={record?.urgency ?? "medium"}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="status">
          Status
        </label>
        <select className="field mt-1" id="status" name="status" defaultValue={record?.status ?? "intake"}>
          <option value="intake">Intake</option>
          <option value="matched">Matched</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
      <fieldset>
        <legend className="label">Barriers</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {barrierOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 rounded-md border border-ink/10 px-3 py-2 text-sm">
              <input name="barriers" type="checkbox" value={option} defaultChecked={record?.barriers.includes(option)} />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="md:col-span-2">
        <label className="label" htmlFor="notes">
          Counselor notes
        </label>
        <textarea className="field mt-1 min-h-28" id="notes" name="notes" defaultValue={record?.notes} />
      </div>
      {error ? <p className="rounded-md bg-coral/10 px-3 py-2 text-sm text-coral md:col-span-2">{error}</p> : null}
      <div className="md:col-span-2">
        <button className="btn-primary" disabled={saving} type="submit">
          <Save size={16} aria-hidden />
          {saving ? "Saving..." : "Save case"}
        </button>
      </div>
    </form>
  );
}
