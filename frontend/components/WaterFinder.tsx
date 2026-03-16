import type { DroughtAnalysis, RegionRecord, AidPlan } from "@/lib/types";

type WaterFinderProps = {
  region: RegionRecord | null;
  aidPlan: AidPlan | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
};

const detailCardClassName =
  "rounded-[0.8rem] border border-[rgba(119,145,177,0.16)] bg-white px-3 py-3";

export function WaterFinder({
  region,
  aidPlan,
  analysis,
  isLoading,
}: WaterFinderProps) {
  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="border-b border-[rgba(119,145,177,0.16)] px-4 py-4">
        <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">Aid Distribution Plan</h2>
      </div>
      <div className="grid gap-4 p-4">
        <div className="rounded-[0.95rem] border border-[rgba(119,145,177,0.18)] bg-[#fbfdff] p-4">
          {isLoading || !aidPlan || !region ? (
            <p className="text-sm text-[var(--muted)]">Loading NGO aid-planning recommendation for the selected district.</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(47,111,237,0.12)] text-[var(--accent)]">
                  <span className="text-base font-bold">P</span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Recommended Distribution Center</p>
                  <p className="text-[1.05rem] font-semibold text-[var(--text)]">{aidPlan.distributionCenter}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className={detailCardClassName}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Population Served</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">{aidPlan.populationServed.toLocaleString() || "--"}</p>
                </div>
                <div className={detailCardClassName}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Daily Need</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">{aidPlan.litersRequiredPerDay.toLocaleString()}L</p>
                </div>
                <div className={detailCardClassName}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Truck Loads</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">{aidPlan.waterTrucksRequired}</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="rounded-[1.2rem] bg-[linear-gradient(180deg,#203550_0%,#101f32_100%)] px-5 py-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">Planning Status</p>
          <p className="mt-2 text-xl font-semibold">{aidPlan?.planningStatus ?? "Pending recommendation"}</p>
          <p className="mt-2 text-sm leading-6 text-white/62">
            {analysis?.recommendedAction ?? "Waiting for internal NGO planning recommendation."}
          </p>
        </div>
      </div>
    </section>
  );
}
