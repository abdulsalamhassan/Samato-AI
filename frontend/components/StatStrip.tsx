import type { RankedRegion, RegionRecord } from "@/lib/types";

type StatStripProps = {
  regions: RegionRecord[];
  rankings: RankedRegion[];
  isLoading: boolean;
};

export function StatStrip({ regions, rankings, isLoading }: StatStripProps) {
  const criticalToday = rankings.filter(
    (region) => region.riskLevel === "CRITICAL",
  ).length;
  const monitoredWaterPoints = regions.reduce(
    (sum, region) => sum + region.water_sources.length,
    0,
  );
  const stats = [
    { label: "Tracked districts", value: isLoading ? "..." : String(regions.length) },
    { label: "Critical today", value: isLoading ? "..." : String(criticalToday) },
    {
      label: "Water links tracked",
      value: isLoading ? "..." : String(monitoredWaterPoints),
    },
    { label: "Alert channels", value: "SMS + Radio" },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[1.5rem] border border-[var(--panel-border)] bg-[rgba(255,255,255,0.7)] p-5"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
            {stat.label}
          </p>
          <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
