import type { DroughtAnalysis, RegionRecord } from "@/lib/types";

type RegionAnalyzerProps = {
  region: RegionRecord | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
};

export function RegionAnalyzer({
  region,
  analysis,
  isLoading,
}: RegionAnalyzerProps) {
  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(47,111,237,0.08)] text-[var(--accent)]">
            <span className="text-lg font-bold">A</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              AI Risk Analysis
            </p>
            <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">
              {region ? region.name : "Select a region"}
            </h2>
            {region?.satellite_ndvi && (
               <div className="mt-1 flex items-center gap-2">
                 <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                 <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600/70">GEE Intelligence Active</span>
               </div>
            )}
          </div>
        </div>
        <div className="rounded-[0.95rem] border border-[rgba(255,92,97,0.18)] bg-[rgba(255,92,97,0.06)] px-4 py-3 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--critical)]">
            Risk Score
          </p>
          <p className="mt-1 text-[2rem] font-bold leading-none text-[var(--critical)]">
            {analysis ? (analysis.riskScore / 10).toFixed(1) : "..."}
            <span className="text-sm text-[rgba(255,92,97,0.6)]">/10</span>
          </p>
        </div>
      </div>
      <div className="grid gap-4 px-4 pb-4 md:grid-cols-4">
        <div>
          <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Rainfall Gap
          </p>
          <p className="mt-3 text-[1.8rem] font-bold leading-none text-[var(--critical)]">
            {region ? `-${Math.min(region.days_since_rain, 99)}%` : "..."}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Continuous dry-day span.
          </p>
        </div>
        <div>
          <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Pastoral Vulnerability
          </p>
          <p className={`mt-3 text-[1.8rem] font-bold leading-none ${analysis?.pastoralVulnerabilityIndex && analysis.pastoralVulnerabilityIndex > 70 ? 'text-[var(--critical)]' : 'text-[var(--text)]'}`}>
            {analysis?.pastoralVulnerabilityIndex ? `${analysis.pastoralVulnerabilityIndex}/100` : "N/A"}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {analysis?.pastoralVulnerabilityIndex ? "Nomadic/livestock stress." : "Urban center."}
          </p>
        </div>
        <div>
          <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Confidence
          </p>
          <p className={`mt-3 text-[1.8rem] font-bold leading-none ${analysis?.confidence && analysis.confidence < 0.8 ? 'text-[var(--warning)]' : 'text-[var(--stable)]'}`}>
            {analysis?.confidence ? `${(analysis.confidence * 100).toFixed(0)}%` : "..."}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Model certainty.
          </p>
        </div>
        <div>
          <p className="border-b border-[rgba(119,145,177,0.16)] pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Infrastructure
          </p>
          <p className="mt-3 text-[1.8rem] font-bold leading-none text-[var(--text)] capitalize">
            {region?.water_infrastructure_level || (analysis?.sourceCount ? "Limited" : "Poor")}
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {region?.district_type ? `Type: ${region.district_type}` : "Awaiting classification."}
          </p>
        </div>
      </div>
      
      {region?.satellite_ndvi !== undefined && region?.satellite_ndvi !== null && (
        <div className="grid gap-4 px-4 pb-4 md:grid-cols-2">
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3">
             <p className="text-[9px] font-bold uppercase tracking-widest text-blue-500/80 mb-2">Satellite Vegetation (NDVI)</p>
             <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                   <div 
                     className={`h-full rounded-full transition-all duration-1000 ${region.satellite_ndvi > 0.3 ? 'bg-emerald-500' : region.satellite_ndvi > 0.2 ? 'bg-amber-500' : 'bg-rose-500'}`}
                     style={{ width: `${Math.min(100, (region.satellite_ndvi / 0.5) * 100)}%` }}
                   />
                </div>
                <span className="text-sm font-bold text-blue-900">{region.satellite_ndvi.toFixed(2)}</span>
             </div>
             <p className="mt-1 text-[10px] text-blue-700/60 font-medium">Real-time GEE MODIS Observation</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3">
             <p className="text-[9px] font-bold uppercase tracking-widest text-blue-500/80 mb-2">CHIRPS Rainfall (Static)</p>
             <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-blue-900">{region.satellite_rainfall_mm?.toFixed(1) ?? "0.0"}</span>
                <span className="text-[10px] font-bold text-blue-700/40 uppercase">mm</span>
             </div>
             <p className="mt-1 text-[10px] text-blue-700/60 font-medium">Accumulated signal from intelligence feed</p>
          </div>
        </div>
      )}
      
      {analysis?.drivers && analysis.drivers.length > 0 && (
        <div className="border-t border-[rgba(119,145,177,0.16)] bg-[rgba(47,111,237,0.02)] px-4 py-4">
           <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)] mb-3">Analysis Drivers</p>
           <div className="flex flex-wrap gap-2">
             {analysis.drivers.map((driver, i) => (
                <span key={i} className="inline-flex items-center rounded-md border border-[rgba(47,111,237,0.15)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--text)] shadow-sm">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>
                  {driver}
                </span>
             ))}
           </div>
        </div>
      )}
      <div className="grid gap-3 border-t border-[rgba(119,145,177,0.16)] bg-[#fbfdff] px-4 py-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[0.9rem] border border-[rgba(119,145,177,0.16)] bg-white px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Region Profile
          </p>
          {isLoading || !region ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Loading selected region profile.
            </p>
          ) : (
            <div className="mt-3 grid gap-3 text-sm text-[var(--text)] sm:grid-cols-2">
              <p>
                District
                <span className="mt-1 block font-semibold">{region.district}</span>
              </p>
              <p>
                Region
                <span className="mt-1 block font-semibold">{region.region}</span>
              </p>
              <p>
                Population
                <span className="mt-1 block font-semibold">
                  {region.population?.toLocaleString() ?? "Unknown"}
                </span>
              </p>
              <p>
                Area
                <span className="mt-1 block font-semibold">
                  {region.area_sqkm ? `${region.area_sqkm.toFixed(0)} sq km` : "Unknown"}
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="rounded-[0.9rem] border border-[rgba(255,92,97,0.18)] bg-[rgba(255,92,97,0.06)] px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--critical)]">
            Operational Action
          </p>
          <p className="mt-3 text-base font-semibold text-[var(--text)]">
            {analysis?.actionCode ?? "Pending"}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {analysis
              ? `${analysis.estimatedDaysRemaining} days remaining before critical depletion estimate.`
              : "Select a region to see the recommended operational response."}
          </p>
        </div>
      </div>
    </section>
  );
}
