import { regionSeedData } from "@/lib/data";

const statusClassName = {
  CRITICAL: "bg-red-100 text-red-700",
  WARNING: "bg-amber-100 text-amber-700",
  STABLE: "bg-emerald-100 text-emerald-700",
};

export function CrisisRanking() {
  const ranked = [...regionSeedData].sort(
    (left, right) => right.urgencyScore - left.urgencyScore,
  );

  return (
    <section className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">
            Priority Rankings
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Who needs water first</h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        {ranked.map((region, index) => (
          <article
            key={region.id}
            className="rounded-[1.5rem] border border-[var(--panel-border)] bg-white/70 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                  #{index + 1} Priority
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  {region.name}, {region.district}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {region.population.toLocaleString()} people · {region.livestock.toLocaleString()} livestock
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClassName[region.status]}`}
              >
                {region.status}
              </span>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)] md:grid-cols-3">
              <div>
                <p className="uppercase tracking-[0.2em]">Days Remaining</p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {region.daysRemaining} days
                </p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em]">Urgency Score</p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {region.urgencyScore}
                </p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em]">Water Status</p>
                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {region.waterStatus}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
