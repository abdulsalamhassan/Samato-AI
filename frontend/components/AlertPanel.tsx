export function AlertPanel() {
  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
        Alert Center
      </p>
      <h2 className="mt-2 text-2xl font-semibold">NGO and district dispatch</h2>
      <div className="mt-6 rounded-[1.5rem] bg-[#12343b] p-5 text-sm text-white">
        <p className="uppercase tracking-[0.2em] text-white/60">Sample alert</p>
        <p className="mt-3 leading-7">
          Dispatch water trucking to Ceel Buur first. Estimated 8 days remaining.
          Prioritize 4,200 residents, 800 livestock, and coordinate with district
          access routes from Ceel Dheer.
        </p>
      </div>
    </section>
  );
}
