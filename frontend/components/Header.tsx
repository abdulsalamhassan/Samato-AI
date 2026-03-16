export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-[1rem] bg-[var(--shell)] px-4 py-3 text-white shadow-[0_14px_34px_rgba(7,21,35,0.2)]">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/55">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-white/72">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--stable)]" />
          System: Online
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-white/48">
        <span>Last Update</span>
        <strong className="font-semibold text-white/82">16 Mar 2026, 08:42 UTC</strong>
        <button
          type="button"
          className="rounded-lg border border-[rgba(47,111,237,0.45)] bg-[rgba(47,111,237,0.16)] px-3 py-2 text-[10px] font-semibold tracking-[0.16em] text-[#89b4ff]"
        >
          NGO Access Mode
        </button>
      </div>
    </header>
  );
}
