type AlertPanelProps = {
  regionName: string;
  alertReport: string;
  radioScript: string;
  isLoading: boolean;
};

export function AlertPanel({
  regionName,
  alertReport,
  radioScript,
  isLoading,
}: AlertPanelProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
        Alert Center
      </p>
      <h2 className="mt-2 text-2xl font-semibold">NGO and district dispatch</h2>
      <div className="mt-6 rounded-[1.5rem] bg-[#12343b] p-5 text-sm text-white">
        <p className="uppercase tracking-[0.2em] text-white/60">
          {regionName ? `Alert for ${regionName}` : "Sample alert"}
        </p>
        <pre className="mt-3 whitespace-pre-wrap font-sans leading-7 text-white">
          {isLoading ? "Generating NGO dispatch report..." : alertReport}
        </pre>
      </div>
      <div className="mt-4 rounded-[1.5rem] border border-[var(--panel-border)] bg-white/70 p-5 text-sm text-[var(--text)]">
        <p className="uppercase tracking-[0.2em] text-[var(--muted)]">Radio script</p>
        <p className="mt-3 leading-7">
          {isLoading ? "Generating radio guidance..." : radioScript}
        </p>
      </div>
    </section>
  );
}
