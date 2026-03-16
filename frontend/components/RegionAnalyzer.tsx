import type { DroughtAnalysis, RegionRecord } from "@/lib/types";

type RegionAnalyzerProps = {
  region: RegionRecord | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
};

export function RegionAnalyzer({
  region,
  analysis,
  isLoading,
}: RegionAnalyzerProps) {
  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(47,111,237,0.08)] text-[var(--accent)]">
            <span className="text-lg font-bold">A</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              AI Risk Analysis
            </p>
            <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">
              {region ? region.name : "Select a region"}
            </h2>
          </div>
        </div>
        <div className="rounded-[0.95rem] border border-[rgba(255,92,97,0.18)] bg-[rgba(255,92,97,0.06)] px-4 py-3 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--critical)]">
            Risk Score
          </p>
          <p className="mt-1 text-[2rem] font-bold leading-none text-[var(--critical)]">
            {analysis ? (analysis.riskScore / 10).toFixed(1) : "..."}
            <span className="text-sm text-[rgba(255,92,97,0.6)]">/10</span>
          </p>
        </div>
      </div>
      <div className="grid gap-4 px-4 pb-4 md:grid-cols-3">
        <div>
          <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Rainfall Gap
          </p>
          <p className="mt-3 text-[2rem] font-bold leading-none text-[var(--critical)]">
            {region ? `-${Math.min(region.days_since_rain, 99)}%` : "..."}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Severe meteorological drought confirmed via dry-day trend.
          </p>
        </div>
        <div>
          <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Pop. Pressure
          </p>
          <p className="mt-3 text-[2rem] font-bold leading-none text-[var(--text)]">
            {analysis?.riskLevel ?? "..."}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {region?.population
              ? `Population ${region.population.toLocaleString()} increasing per-capita demand.`
              : "Population enrichment still pending."}
          </p>
        </div>
        <div>
          <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Infrastructure
          </p>
          <p className="mt-3 text-[2rem] font-bold leading-none text-[var(--critical)]">
            {analysis?.sourceCount ? "Limited" : "Poor"}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {analysis?.recommendedAction ?? "Awaiting backend recommendation."}
          </p>
        </div>
      </div>
      <div className="grid gap-3 border-t border-[rgba(119,145,177,0.16)] bg-[#fbfdff] px-4 py-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-white px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Region Profile
          </p>
          {isLoading || !region ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Loading selected region profile.
            </p>
          ) : (
            <div className="mt-3 grid gap-3 text-sm text-[var(--text)] sm:grid-cols-2">
              <p>
                District
                <span className="mt-1 block font-semibold">{region.district}</span>
              </p>
              <p>
                Region
                <span className="mt-1 block font-semibold">{region.region}</span>
              </p>
              <p>
                Population
                <span className="mt-1 block font-semibold">
                  {region.population?.toLocaleString() ?? "Unknown"}
                </span>
              </p>
              <p>
                Area
                <span className="mt-1 block font-semibold">
                  {region.area_sqkm ? `${region.area_sqkm.toFixed(0)} sq km` : "Unknown"}
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="rounded-[0.9rem] border border-[rgba(255,92,97,0.18)] bg-[rgba(255,92,97,0.06)] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--critical)]">
            Operational Action
          </p>
          <p className="mt-3 text-base font-semibold text-[var(--text)]">
            {analysis?.actionCode ?? "Pending"}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {analysis
              ? `${analysis.estimatedDaysRemaining} days remaining before critical depletion estimate.`
              : "Select a region to see the recommended operational response."}
          </p>
        </div>
      </div>
    </section>
  );
}
