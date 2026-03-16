import type { SmsPreviewResponse } from "@/lib/types";

type SMSPreviewProps = {
  regionName: string;
  sms: SmsPreviewResponse | null;
  isLoading: boolean;
};

export function SMSPreview({ regionName, sms, isLoading }: SMSPreviewProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
        SMS Preview
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Somali-language alert</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {regionName ? `Generated for ${regionName}` : "Waiting for district selection"}
      </p>
      <div className="mt-6 mx-auto max-w-sm rounded-[2rem] border-8 border-[#12343b] bg-[#efe3c5] p-5 shadow-inner">
        <div className="rounded-[1.2rem] bg-white p-4 text-sm leading-7 text-[#12343b]">
          {isLoading ? "Generating Somali-language message..." : sms?.message}
        </div>
        <div className="mt-3 text-xs uppercase tracking-[0.2em] text-[#12343b]/70">
          {sms ? `${sms.provider} ? fallback ${String(sms.usedFallback)}` : "No SMS yet"}
        </div>
      </div>
    </section>
  );
}
