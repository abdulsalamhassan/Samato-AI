import type { RankedRegion, SmsPreviewResponse } from "@/lib/types";

type SMSPreviewProps = {
  regionName: string;
  sms: SmsPreviewResponse | null;
  isLoading: boolean;
  ranking: RankedRegion | null;
};

export function SMSPreview({ regionName, sms, isLoading, ranking }: SMSPreviewProps) {
  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="border-b border-[rgba(119,145,177,0.16)] px-4 py-4">
        <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">Mobile Alert</h2>
      </div>
      <div className="grid gap-4 p-4">
        <div className="mx-auto w-full max-w-[250px] rounded-[2rem] bg-[linear-gradient(180deg,#142943_0%,#0a1726_100%)] p-3 shadow-[0_22px_40px_rgba(10,23,38,0.22)]">
          <div className="mx-auto h-5 w-16 rounded-full bg-white/10" />
          <div className="mt-3 rounded-[1.4rem] bg-[#edf3fb] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {regionName ? `Generated for ${regionName}` : "Waiting for district selection"}
            </p>
            <div className="mt-3 rounded-[1rem] bg-white p-4 text-sm leading-6 text-[var(--text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              {isLoading ? "Generating Somali-language message..." : sms?.message || "No SMS generated yet."}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              <span>{sms?.provider ?? "deterministic"}</span>
              <span>{sms ? `fallback ${String(sms.usedFallback)}` : "pending"}</span>
            </div>
          </div>
        </div>
        <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-[#fbfdff] px-4 py-3 text-sm text-[var(--muted)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Priority Snapshot</p>
          <p className="mt-2 text-[var(--text)]">
            {ranking
              ? `${ranking.regionName} is ${ranking.riskLevel.toLowerCase()} with ${ranking.estimatedDaysRemaining} days remaining.`
              : "Select a region to review the current mobile alert status."}
          </p>
        </div>
      </div>
    </section>
  );
}
