type HeaderProps = {
  lastUpdateLabel: string;
  rainfallStatusLabel: string;
};

export function Header({ lastUpdateLabel, rainfallStatusLabel }: HeaderProps) {
  const normalizedStatus = rainfallStatusLabel.toUpperCase();
  const statusClassName =
    normalizedStatus === "SUCCESS"
      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
      : normalizedStatus === "FAILED"
        ? "border-rose-500/20 bg-rose-500/5 text-rose-300"
        : "border-slate-400/20 bg-slate-400/10 text-slate-300";

  return (
    <header className="flex flex-wrap items-center justify-between gap-6 px-12 py-4 bg-[#0B1521] text-white">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          System Online
        </div>
        <div className={`rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${statusClassName}`}>
          Rainfall Sync: {rainfallStatusLabel}
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col items-end">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Last Successful Sync</p>
          <p className="mt-1 text-xs font-black tracking-tight text-slate-200">{lastUpdateLabel}</p>
        </div>

        <button
          className="rounded-lg border border-[#2F7FED]/40 bg-[#2F7FED]/10 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#2F7FED] transition-all hover:bg-[#2F7FED] hover:text-white"
        >
          Coordination Workspace
        </button>
      </div>
    </header>
  );
}
