import type { RankedRegion } from "@/lib/types";

const statusClassName = {
  CRITICAL: "bg-red-100 text-red-700",
  WARNING: "bg-amber-100 text-amber-700",
  STABLE: "bg-emerald-100 text-emerald-700",
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
  if (isLoading) {
    return (
      <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
          Priority Rankings
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Who needs water first</h2>
        <div className="mt-6 rounded-[1.5rem] border border-dashed border-[var(--panel-border)] bg-white/60 p-6 text-sm text-[var(--muted)]">
          Loading live risk rankings from the backend.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
            Priority Rankings
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Who needs water first</h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        {rankings.map((region, index) => (
          <article
            key={region.regionId}
            className={`rounded-[1.5rem] border p-5 transition ${
              selectedRegionName === region.regionName
                ? "border-[#12343b] bg-white shadow-[0_16px_40px_rgba(18,52,59,0.12)]"
                : "border-[var(--panel-border)] bg-white/70"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                  #{index + 1} Priority
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  {region.regionName}, {region.area}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {region.recommendedAction}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClassName[region.riskLevel]}`}
              >
                {region.riskLevel}
              </span>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)] md:grid-cols-3">
              <div>
                <p className="uppercase tracking-[0.2em]">Days Remaining</p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {region.estimatedDaysRemaining} days
                </p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em]">Urgency Score</p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {region.riskScore}
                </p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em]">Action Code</p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)] break-words">
                  {region.actionCode}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectRegion(region.regionName)}
              className="mt-5 rounded-full border border-[#12343b]/20 px-4 py-2 text-sm font-semibold text-[#12343b] transition hover:border-[#12343b] hover:bg-[#12343b] hover:text-white"
            >
              Focus {region.regionName}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
