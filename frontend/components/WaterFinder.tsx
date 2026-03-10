import { waterSourceSeedData } from "@/lib/data";

export function WaterFinder() {
  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
        Water Finder
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Nearest active sources</h2>
      <div className="mt-6 grid gap-3">
        {waterSourceSeedData.map((source) => (
          <div
            key={source.id}
            className="rounded-[1.25rem] border border-[var(--panel-border)] bg-white/70 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{source.name}</p>
                <p className="text-sm text-[var(--muted)]">{source.notes}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                {source.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
