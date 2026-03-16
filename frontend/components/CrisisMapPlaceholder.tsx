import type { DroughtAnalysis, RegionRecord } from "@/lib/types";

type CrisisMapPlaceholderProps = {
  regions: RegionRecord[];
  selectedRegionName: string;
  selectedRegion: RegionRecord | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
  onSelectRegion: (regionName: string) => void;
};

export function CrisisMapPlaceholder({
  regions,
  selectedRegionName,
  selectedRegion,
  analysis,
  isLoading,
  onSelectRegion,
}: CrisisMapPlaceholderProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
            Crisis Map
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Somalia drought watch</h2>
        </div>
        <div className="flex gap-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">Critical</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Warning</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Stable</span>
        </div>
      </div>
      <div className="mt-6 grid min-h-[360px] gap-4 rounded-[1.5rem] border border-[var(--panel-border)] bg-[linear-gradient(180deg,rgba(18,52,59,0.04),rgba(18,52,59,0.12))] p-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.25rem] border border-white/50 bg-white/60 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            District Watchlist
          </p>
          <div className="mt-4 grid max-h-[260px] gap-3 overflow-auto pr-1">
            {regions.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelectRegion(region.name)}
                className={`rounded-[1rem] border p-4 text-left transition ${
                  selectedRegionName === region.name
                    ? "border-[#12343b] bg-[#12343b] text-white"
                    : "border-[var(--panel-border)] bg-white/70 text-[var(--text)]"
                }`}
              >
                <p className="font-semibold">{region.name}</p>
                <p className="mt-1 text-sm opacity-80">
                  {region.district}, {region.region}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] opacity-70">
                  {region.days_since_rain} dry days
                </p>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[1.25rem] border border-white/50 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Selected District
          </p>
          {isLoading || !selectedRegion ? (
            <div className="mt-5 text-sm leading-6 text-[var(--muted)]">
              Loading district analysis from the backend.
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              <div>
                <h3 className="text-2xl font-semibold">{selectedRegion.name}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {selectedRegion.district}, {selectedRegion.region}
                </p>
              </div>
              <div className="grid gap-3 text-sm text-[var(--muted)] md:grid-cols-2">
                <div>
                  <p className="uppercase tracking-[0.2em]">Days Since Rain</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                    {selectedRegion.days_since_rain}
                  </p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.2em]">Area</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                    {selectedRegion.area_sqkm ? `${selectedRegion.area_sqkm.toFixed(0)} km?` : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.2em]">Risk Level</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                    {analysis?.riskLevel ?? "Pending"}
                  </p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.2em]">Action Code</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--text)] break-words">
                    {analysis?.actionCode ?? "Pending"}
                  </p>
                </div>
              </div>
              <div className="rounded-[1rem] bg-[#12343b] p-4 text-sm leading-7 text-white">
                {analysis?.recommendedAction ??
                  "Select a district to see drought analysis and response guidance."}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
