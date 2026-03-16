import type { RankedRegion, RegionRecord } from "@/lib/types";

type StatStripProps = {
  regions: RegionRecord[];
  rankings: RankedRegion[];
  isLoading: boolean;
};

const valueClassName = [
  "text-[var(--text)]",
  "text-[var(--critical)]",
  "text-[var(--warning)]",
  "text-[var(--stable)]",
  "text-[var(--text)]",
];

export function StatStrip({ regions, rankings, isLoading }: StatStripProps) {
  const criticalToday = rankings.filter((region) => region.riskLevel === "CRITICAL").length;
  const atRisk = rankings.filter((region) => region.riskLevel === "WARNING").length;
  const stable = rankings.filter((region) => region.riskLevel === "STABLE").length;
  const estimatedPeopleAtRisk = regions.reduce(
    (sum, region) => sum + (region.population ?? 0),
    0,
  );

  const stats = [
    { label: "Tracked Communities", value: isLoading ? "..." : String(regions.length) },
    { label: "Critical", value: isLoading ? "..." : String(criticalToday) },
    { label: "At Risk", value: isLoading ? "..." : String(atRisk) },
    { label: "Stable", value: isLoading ? "..." : String(stable) },
    {
      label: "Est. People at Risk",
      value: isLoading ? "..." : estimatedPeopleAtRisk.toLocaleString(),
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="rounded-[0.95rem] border border-[rgba(119,145,177,0.22)] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(31,47,74,0.06)]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            {stat.label}
          </p>
          <p className={`mt-3 text-[2rem] font-bold leading-none ${valueClassName[index]}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}
