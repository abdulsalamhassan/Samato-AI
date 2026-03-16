import type { DroughtAnalysis, RegionRecord } from "@/lib/types";

type CrisisMapPlaceholderProps = {
  regions: RegionRecord[];
  selectedRegionName: string;
  selectedRegion: RegionRecord | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
  onSelectRegion: (regionName: string) => void;
};

const dots = [
  { top: "22%", left: "46%", color: "var(--warning)" },
  { top: "31%", left: "61%", color: "var(--critical)" },
  { top: "50%", left: "56%", color: "var(--warning)" },
  { top: "68%", left: "31%", color: "var(--stable)" },
];

export function CrisisMapPlaceholder({
  regions,
  selectedRegionName,
  selectedRegion,
  analysis,
  isLoading,
  onSelectRegion,
}: CrisisMapPlaceholderProps) {
  const visibleRegions = regions.slice(0, 8);

  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="flex items-center justify-between border-b border-[rgba(119,145,177,0.16)] px-4 py-3">
        <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">Dynamic Crisis Map</h2>
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--critical)]" />Critical</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--warning)]" />At Risk</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--stable)]" />Stable</span>
        </div>
      </div>
      <div className="p-4">
        <div className="relative min-h-[370px] overflow-hidden rounded-[0.9rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_26%),linear-gradient(180deg,#3a4150_0%,#2e3746_100%)]">
          {dots.map((dot, index) => (
            <span
              key={index}
              className="absolute h-3.5 w-3.5 rounded-full shadow-[0_0_0_6px_rgba(255,255,255,0.04)]"
              style={{ top: dot.top, left: dot.left, backgroundColor: dot.color }}
            />
          ))}
          <div className="absolute bottom-5 left-4 grid gap-2">
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg font-semibold text-[var(--text)] shadow-sm">+</button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg font-semibold text-[var(--text)] shadow-sm">-</button>
          </div>
        </div>

        <div className="mt-3 rounded-[0.9rem] border border-[rgba(119,145,177,0.18)] bg-[#fbfdff] px-4 py-3">
          <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            <span>Today</span>
            <span>+7 Days</span>
            <span>+14 Days</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-[#dce5f1]">
            <div className="h-1.5 w-[18%] rounded-full bg-[var(--accent)]" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {visibleRegions.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => onSelectRegion(region.name)}
              className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
                selectedRegionName === region.name
                  ? "border-[var(--accent)] bg-[rgba(47,111,237,0.1)] text-[var(--accent)]"
                  : "border-[rgba(119,145,177,0.18)] bg-white text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[1rem] border border-[rgba(119,145,177,0.18)] bg-[#fcfdff] px-4 py-4">
          {isLoading || !selectedRegion ? (
            <p className="text-sm text-[var(--muted)]">Loading selected district analysis.</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_156px]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(47,111,237,0.08)] text-[var(--accent)]">
                    <span className="text-lg font-bold">A</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">AI Risk Analysis</p>
                    <h3 className="text-[1.15rem] font-semibold text-[var(--text)]">{selectedRegion.name}</h3>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Rainfall Gap</p>
                    <p className="mt-3 text-[2rem] font-bold leading-none text-[var(--critical)]">-{Math.min(selectedRegion.days_since_rain, 99)}%</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--muted)]">Severe meteorological drought confirmed via dry-day trend.</p>
                  </div>
                  <div>
                    <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Pop. Pressure</p>
                    <p className="mt-3 text-[2rem] font-bold leading-none text-[var(--text)]">{analysis?.riskLevel ?? "..."}</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{selectedRegion.population ? `Population ${selectedRegion.population.toLocaleString()}` : "Population data still being enriched."}</p>
                  </div>
                  <div>
                    <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Infrastructure</p>
                    <p className="mt-3 text-[2rem] font-bold leading-none text-[var(--critical)]">{analysis?.sourceCount ? "Limited" : "Poor"}</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{analysis?.recommendedAction ?? "Awaiting district analysis from the backend."}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[0.95rem] border border-[rgba(255,92,97,0.18)] bg-[rgba(255,92,97,0.06)] px-4 py-4 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--critical)]">Risk Score</p>
                <p className="mt-2 text-[2.3rem] font-bold leading-none text-[var(--critical)]">
                  {analysis ? (analysis.riskScore / 10).toFixed(1) : "..."}
                  <span className="text-base text-[rgba(255,92,97,0.6)]">/10</span>
                </p>
                <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                  {analysis ? `${analysis.estimatedDaysRemaining} days remaining` : "Awaiting live scoring"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
