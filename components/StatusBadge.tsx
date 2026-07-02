import type { CaseStatus } from "@/lib/types";

const styles: Record<CaseStatus, string> = {
  intake: "bg-moss/15 text-moss",
  matched: "bg-leaf/15 text-leaf",
  submitted: "bg-marigold/25 text-ink",
  approved: "bg-emerald-100 text-emerald-800",
  blocked: "bg-coral/15 text-coral"
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return <span className={`rounded-md px-2 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
