import type { LucideIcon } from "lucide-react";

export function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink/70">{label}</span>
        <Icon className="text-leaf" size={18} aria-hidden />
      </div>
      <div className="mt-3 text-3xl font-semibold text-ink">{value}</div>
    </div>
  );
}
