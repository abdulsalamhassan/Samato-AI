export function Header() {
  return (
    <header className="rounded-[2rem] border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(18,52,59,0.12)] backdrop-blur">
      <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">
        RCC 2026 · AI for Somalia
      </p>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold md:text-6xl">SAMATO AI</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
            Crisis detection, village prioritization, and simple Somali-language
            alerts for drought-affected nomad communities.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-[var(--muted)]">
          <span>Detect the crisis first.</span>
          <span>Rank who needs help now.</span>
          <span>Direct people to water clearly.</span>
        </div>
      </div>
    </header>
  );
}
