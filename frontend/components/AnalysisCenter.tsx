import type { AnalysisCenterItem, RainfallStatus } from "@/lib/types";

type AnalysisCenterProps = {
  items: AnalysisCenterItem[];
  selectedRegionId: string;
  isLoading: boolean;
  rainfallStatus: RainfallStatus | null;
  isRefreshingRainfall: boolean;
  onSelectRegion: (regionId: string) => void;
  onRefreshRainfall: () => void;
};

function formatTimestamp(value?: string | null) {
  if (!value) {
    return "Not yet synced";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function AnalysisCenter({
  items,
  selectedRegionId,
  isLoading,
  rainfallStatus,
  isRefreshingRainfall,
  onSelectRegion,
  onRefreshRainfall,
}: AnalysisCenterProps) {
  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(119,145,177,0.16)] px-4 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            Analysis Center
          </p>
          <h2 className="mt-1 text-[1.1rem] font-semibold text-[var(--text)]">
            Batch district triage
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-[#f8fbff] px-3 py-2 text-xs text-[var(--muted)]">
            Rainfall sync: {rainfallStatus?.status ?? "loading"}
            <span className="ml-2 text-[var(--text)]">
              {formatTimestamp(rainfallStatus?.lastSuccessAt)}
            </span>
          </div>
          <button
            type="button"
            onClick={onRefreshRainfall}
            className="rounded-[0.8rem] bg-[var(--accent)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_10px_20px_rgba(47,111,237,0.24)]"
          >
            {isRefreshingRainfall ? "Refreshing..." : "Refresh Rainfall"}
          </button>
        </div>
      </div>
      <div className="grid gap-4 p-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[0.9rem] bg-[linear-gradient(180deg,#203550_0%,#101f32_100%)] px-4 py-4 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
            Scheduled updates
          </p>
          <p className="mt-2 text-lg font-semibold">
            {formatTimestamp(rainfallStatus?.nextScheduledRefreshAt)}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/65">
            {rainfallStatus?.message ??
              "Rainfall updates are pulled into the crisis model and exposed in the dashboard bootstrap."}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[0.9rem] border border-white/10 bg-white/5 px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/42">
                Imported
              </p>
              <p className="mt-1 text-xl font-semibold">{rainfallStatus?.importedCount ?? 0}</p>
            </div>
            <div className="rounded-[0.9rem] border border-white/10 bg-white/5 px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/42">
                Observations
              </p>
              <p className="mt-1 text-xl font-semibold">{rainfallStatus?.totalObservations ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {isLoading ? (
            <div className="rounded-[0.9rem] border border-dashed border-[rgba(119,145,177,0.22)] px-4 py-6 text-sm text-[var(--muted)]">
              Building batch triage workflow.
            </div>
          ) : (
            items.map((item) => {
              const isSelected = item.region.id === selectedRegionId;
              return (
                <button
                  key={item.region.id}
                  type="button"
                  onClick={() => onSelectRegion(item.region.id)}
                  className={`rounded-[0.95rem] border px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-[rgba(47,111,237,0.32)] bg-[rgba(47,111,237,0.06)] shadow-[0_12px_20px_rgba(47,111,237,0.08)]"
                      : "border-[rgba(119,145,177,0.18)] bg-[#fcfdff] hover:border-[rgba(47,111,237,0.25)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[1rem] font-semibold text-[var(--text)]">{item.region.name}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                        {item.region.region}  {item.analysis.riskLevel}
                      </p>
                    </div>
                    <div className="rounded-full bg-[rgba(255,92,97,0.08)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--critical)]">
                      {(item.analysis.riskScore / 10).toFixed(1)}/10
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Days left</p>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">{item.analysis.estimatedDaysRemaining}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">3-day plan</p>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">{item.aidPlan.truckTripsFor3DayWindow} trips</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Water route</p>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">
                        {item.waterNavigation.distanceKm} km
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">{item.analysis.recommendedAction}</p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
