import type { DroughtAnalysis, RegionRecord, WaterNavigation } from "@/lib/types";

type WaterFinderProps = {
  region: RegionRecord | null;
  water: WaterNavigation | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
};

const detailCardClassName =
  "rounded-[0.8rem] border border-[rgba(119,145,177,0.16)] bg-white px-3 py-3";

export function WaterFinder({
  region,
  water,
  analysis,
  isLoading,
}: WaterFinderProps) {
  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="border-b border-[rgba(119,145,177,0.16)] px-4 py-4">
        <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">Alert Generation</h2>
      </div>
      <div className="grid gap-4 p-4">
        <div className="rounded-[0.95rem] border border-[rgba(119,145,177,0.18)] bg-[#fbfdff] p-4">
          {isLoading || !water || !region ? (
            <p className="text-sm text-[var(--muted)]">Loading water navigation for the selected district.</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(47,111,237,0.12)] text-[var(--accent)]">
                  <span className="text-base font-bold">O</span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Destination Water Source</p>
                  <p className="text-[1.05rem] font-semibold text-[var(--text)]">{water.waterSourceName}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className={detailCardClassName}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Distance</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">{water.distanceKm}km</p>
                </div>
                <div className={detailCardClassName}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Direction</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">{water.direction}</p>
                </div>
                <div className={detailCardClassName}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Est. Travel</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">4-6h</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="rounded-[1.2rem] bg-[linear-gradient(180deg,#203550_0%,#101f32_100%)] px-5 py-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">Target Source</p>
          <p className="mt-2 text-xl font-semibold">{water?.waterSourceId ?? "Pending source"}</p>
          <p className="mt-2 text-sm leading-6 text-white/62">
            {analysis?.recommendedAction ?? "Waiting for active response guidance from the backend."}
          </p>
        </div>
      </div>
    </section>
  );
}
