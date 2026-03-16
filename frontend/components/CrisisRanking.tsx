import type { RankedRegion } from "@/lib/types";

const statusClassName = {
  CRITICAL: "bg-[rgba(255,92,97,0.12)] text-[var(--critical)]",
  WARNING: "bg-[rgba(246,166,35,0.14)] text-[var(--warning)]",
  STABLE: "bg-[rgba(24,183,119,0.12)] text-[var(--stable)]",
};

type CrisisRankingProps = {
  rankings: RankedRegion[];
  selectedRegionName: string;
  isLoading: boolean;
  onSelectRegion: (regionName: string) => void;
};

export function CrisisRanking({
  rankings,
  selectedRegionName,
  isLoading,
  onSelectRegion,
}: CrisisRankingProps) {
  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="border-b border-[rgba(119,145,177,0.16)] px-4 py-4">
        <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">Priority Communities</h2>
      </div>
      <div className="grid gap-4 p-4">
        {isLoading ? (
          <div className="rounded-[0.9rem] border border-dashed border-[rgba(119,145,177,0.22)] px-4 py-6 text-sm text-[var(--muted)]">
            Loading live risk rankings from the backend.
          </div>
        ) : (
          rankings.slice(0, 5).map((region) => {
            const progress = Math.max(10, Math.min(100, ((30 - region.estimatedDaysRemaining) / 30) * 100));

            return (
              <button
                key={region.regionId}
                type="button"
                onClick={() => onSelectRegion(region.regionName)}
                className={`rounded-[0.95rem] border px-4 py-4 text-left transition ${
                  selectedRegionName === region.regionName
                    ? "border-[rgba(47,111,237,0.32)] bg-[rgba(47,111,237,0.06)] shadow-[0_12px_20px_rgba(47,111,237,0.08)]"
                    : "border-[rgba(119,145,177,0.18)] bg-[#fcfdff] hover:border-[rgba(47,111,237,0.25)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[1rem] font-semibold leading-none text-[var(--text)]">{region.regionName}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {region.area}
                      {region.estimatedDaysRemaining >= 0 ? `  POP. ${region.estimatedDaysRemaining * 900}` : ""}
                    </p>
                  </div>
                  <span className={`rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusClassName[region.riskLevel]}`}>
                    {region.riskLevel}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                    <span>Survival Timeline</span>
                    <span className={region.riskLevel === "CRITICAL" ? "text-[var(--critical)]" : "text-[var(--warning)]"}>
                      {region.estimatedDaysRemaining}/30 Days
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-[#e8eef6]">
                    <div
                      className={`h-1.5 rounded-full ${
                        region.riskLevel === "CRITICAL"
                          ? "bg-[var(--critical)]"
                          : region.riskLevel === "WARNING"
                            ? "bg-[var(--warning)]"
                            : "bg-[var(--stable)]"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })
        )}
        <button
          type="button"
          className="rounded-[0.55rem] bg-[var(--shell)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_22px_rgba(7,21,35,0.22)] transition hover:bg-[#0d233a]"
        >
          Analyze All Regions
        </button>
      </div>
    </section>
  );
}
