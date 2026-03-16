import type { DroughtAnalysis, RegionRecord, WaterNavigation } from "@/lib/types";

type WaterFinderProps = {
  region: RegionRecord | null;
  water: WaterNavigation | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
};

export function WaterFinder({
  region,
  water,
  analysis,
  isLoading,
}: WaterFinderProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
        Water Finder
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Nearest active sources</h2>
      <div className="mt-6 grid gap-3">
        <div className="rounded-[1.25rem] border border-[var(--panel-border)] bg-white/70 p-4">
          {isLoading || !water || !region ? (
            <p className="text-sm text-[var(--muted)]">
              Loading water navigation for the selected district.
            </p>
          ) : (
            <div className="grid gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{water.waterSourceName}</p>
                  <p className="text-sm text-[var(--muted)]">
                    Primary route for {region.name}, {region.region}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {water.sourceStatus}
                </span>
              </div>
              <div className="grid gap-3 text-sm text-[var(--muted)]">
                <p>
                  <span className="font-semibold text-[var(--text)]">
                    {water.distanceKm} km
                  </span>{" "}
                  {water.direction}
                </p>
                <p>
                  Capacity:{" "}
                  <span className="font-semibold text-[var(--text)]">
                    {water.capacity}
                  </span>
                </p>
                <p>
                  Action:{" "}
                  <span className="font-semibold text-[var(--text)]">
                    {analysis?.recommendedAction ?? "Pending analysis"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
