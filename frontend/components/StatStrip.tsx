const stats = [
  { label: "Tracked communities", value: "6" },
  { label: "Critical today", value: "2" },
  { label: "Water points monitored", value: "5" },
  { label: "Alert channels", value: "SMS + Radio" },
];

export function StatStrip() {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[1.5rem] border border-[var(--panel-border)] bg-[rgba(255,255,255,0.7)] p-5"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
            {stat.label}
          </p>
          <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
