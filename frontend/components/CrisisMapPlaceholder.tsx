export function CrisisMapPlaceholder() {
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
      <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--panel-border)] bg-[linear-gradient(180deg,rgba(18,52,59,0.04),rgba(18,52,59,0.12))] p-6 text-center">
        <div className="max-w-md">
          <p className="text-lg font-semibold">Leaflet map goes here on Day 1.</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The scaffold is ready for a Somalia base map, drought region markers,
            and click-through details once dependencies are installed.
          </p>
        </div>
      </div>
    </section>
  );
}
