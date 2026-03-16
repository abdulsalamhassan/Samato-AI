import type { AidPlan, DroughtAnalysis, RegionRecord } from "@/lib/types";

type DecisionSupportPanelProps = {
  region: RegionRecord | null;
  analysis: DroughtAnalysis | null;
  aidPlan: AidPlan | null;
  alertReport: string;
  radioScript: string;
  isLoading: boolean;
};

export function DecisionSupportPanel({
  region,
  analysis,
  aidPlan,
  alertReport,
  radioScript,
  isLoading,
}: DecisionSupportPanelProps) {
  const reportLines = alertReport
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);

  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(119,145,177,0.16)] px-4 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            Decision Support
          </p>
          <h2 className="mt-1 text-[1.1rem] font-semibold text-[var(--text)]">
            {region?.name ?? "Select a district"}
          </h2>
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
      <div className="grid gap-4 px-4 py-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-[#fbfdff] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Profile</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text)]">
                {region
                  ? `${region.district}, ${region.region}. Population ${region.population?.toLocaleString() ?? "unknown"}.`
                  : "Waiting for district selection."}
              </p>
            </div>
            <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-[#fbfdff] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Timeline</p>
              <p className="mt-3 text-xl font-semibold text-[var(--text)]">
                {analysis ? `${analysis.estimatedDaysRemaining} days` : "--"}
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                {aidPlan
                  ? `${aidPlan.stagingWindowHours}h staging window and ${aidPlan.refillCycleHours}h refill cycle.`
                  : "Timeline pending detail load."}
              </p>
            </div>
            <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-[#fbfdff] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Operational Action</p>
              <p className="mt-3 text-sm font-semibold text-[var(--text)]">
                {analysis?.actionCode ?? "Pending"}
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                {analysis?.recommendedAction ?? "Select a district to inspect the recommended action path."}
              </p>
            </div>
          </div>
          <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-white px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Dispatch Summary</p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--text)]">
              {isLoading ? (
                <p>Generating dispatch summary...</p>
              ) : reportLines.length > 0 ? (
                reportLines.map((line) => <p key={line}>{line}</p>)
              ) : (
                <p>No dispatch summary generated yet.</p>
              )}
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[0.9rem] bg-[linear-gradient(180deg,#203550_0%,#101f32_100%)] px-4 py-4 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">Logistics Window</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[0.8rem] border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/42">3 Day Volume</p>
                <p className="mt-1 text-lg font-semibold">{aidPlan ? `${aidPlan.litersRequired3Day.toLocaleString()}L` : "--"}</p>
              </div>
              <div className="rounded-[0.8rem] border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/42">7 Day Volume</p>
                <p className="mt-1 text-lg font-semibold">{aidPlan ? `${aidPlan.litersRequired7Day.toLocaleString()}L` : "--"}</p>
              </div>
              <div className="rounded-[0.8rem] border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/42">3 Day Trips</p>
                <p className="mt-1 text-lg font-semibold">{aidPlan?.truckTripsFor3DayWindow ?? "--"}</p>
              </div>
              <div className="rounded-[0.8rem] border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/42">Convoy Priority</p>
                <p className="mt-1 text-lg font-semibold">{aidPlan?.convoyPriority ?? "--"}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/65">
              {aidPlan
                ? `${aidPlan.nearestWaterSourceName} is ${aidPlan.nearestWaterDistanceKm} km ${aidPlan.nearestWaterDirection}. Source capacity is ${aidPlan.sourceCapacity}.`
                : "Logistics route will appear after detail load."}
            </p>
          </div>
          <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-[#fbfdff] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Radio Script</p>
            <p className="mt-3 text-sm leading-6 text-[var(--text)]">
              {isLoading ? "Generating radio script..." : radioScript || "No radio script generated yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
