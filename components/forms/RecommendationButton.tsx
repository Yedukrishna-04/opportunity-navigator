"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export function RecommendationButton({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    await fetch(`/api/cases/${caseId}/recommendations`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button className="btn-primary" disabled={loading} type="button" onClick={generate}>
      <Sparkles size={16} aria-hidden />
      {loading ? "Generating..." : "Generate AI plan"}
    </button>
  );
}
