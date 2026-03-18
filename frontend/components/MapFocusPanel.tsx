import type { DroughtAnalysis, RegionRecord } from "@/lib/types";

type MapFocusPanelProps = {
  region: RegionRecord | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
};

export function MapFocusPanel({
  region,
  analysis,
  isLoading,
}: MapFocusPanelProps) {
  const riskTone =
    analysis?.riskLevel === "CRITICAL"
      ? "text-[var(--critical)]"
      : analysis?.riskLevel === "WARNING"
        ? "text-[var(--warning)]"
        : "text-[var(--stable)]";

  return (
    <aside className="rounded-[0.9rem] border border-[rgba(119,145,177,0.18)] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(31,47,74,0.05)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        Region Intelligence
      </p>
      <h3 className="mt-3 text-[2rem] font-semibold leading-none text-[var(--text)]">
        {region?.name ?? "Select Region"}
      </h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {region ? `${region.region}, Somalia` : "Click a red or yellow point to inspect live detail."}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3 border-y border-[rgba(119,145,177,0.14)] py-4 text-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Urban Pop</p>
          <p className="mt-2 text-xl font-semibold text-[var(--text)]">{region?.population?.toLocaleString() ?? "--"}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Pastoral Pop</p>
          <p className="mt-2 text-xl font-semibold text-[var(--text)]">{region?.pastoral_population_estimate?.toLocaleString() ?? "--"}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Rainfall Gap</p>
          <p className="mt-2 text-xl font-semibold text-[var(--critical)]">
            {region ? `${region.days_since_rain} days` : "--"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          AI Risk Analysis
        </p>
        <div className="mt-3 rounded-[0.9rem] border border-[rgba(255,92,97,0.16)] bg-[rgba(255,92,97,0.05)] px-4 py-4">
          {isLoading || !analysis ? (
            <p className="text-sm text-[var(--muted)]">Loading live region analysis.</p>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--critical)]">
                  Risk Level: {analysis.riskLevel}
                </p>
                <p className="mt-4 text-sm text-[var(--muted)]">Estimated Water Remaining:</p>
                <p className="mt-1 text-[1.55rem] font-semibold text-[var(--text)]">
                  {analysis.estimatedDaysRemaining} Days
                </p>
              </div>
              <p className={`text-[2rem] font-bold leading-none ${riskTone}`}>
                {(analysis.riskScore / 10).toFixed(1)}
                <span className="text-sm text-[var(--muted)]">/10</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
