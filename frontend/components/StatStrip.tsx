import { StatCard } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { RankedRegion, RegionRecord } from "@/lib/types";

type StatStripProps = {
  regions: RegionRecord[];
  rankings: RankedRegion[];
  isLoading: boolean;
};

export function StatStrip({ regions, rankings, isLoading }: StatStripProps) {
  const criticalCount = rankings.filter((r) => r.riskLevel === "CRITICAL").length;
  const warningCount = rankings.filter((r) => r.riskLevel === "WARNING").length;
  const stableCount = rankings.filter((r) => r.riskLevel === "STABLE").length;
  
  const totalPopAtRisk = rankings
    .filter((r) => r.riskLevel === "CRITICAL" || r.riskLevel === "WARNING")
    .reduce((acc, curr) => {
      const reg = regions.find(x => x.id === curr.regionId);
      return acc + (reg?.population || 0);
    }, 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={100} rounded="lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <StatItem label="Tracked Communities" value={regions.length} />
      <StatItem label="Critical" value={criticalCount} color="text-[#FF5C61]" />
      <StatItem label="At Risk" value={warningCount} color="text-[#F6A623]" />
      <StatItem label="Stable" value={stableCount} color="text-[#18B777]" />
      <StatItem label="Est. People at Risk" value={totalPopAtRisk.toLocaleString()} />
    </div>
  );
}

function StatItem({ label, value, color = "text-slate-900" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

