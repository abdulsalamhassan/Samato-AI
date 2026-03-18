import { Card, StatCard } from "@/components/ui/Card";
import { Badge, RiskBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AnalysisCenterItem, RainfallStatus } from "@/lib/types";

type AnalysisCenterProps = {
  items: AnalysisCenterItem[];
  selectedRegionId: string;
  isLoading: boolean;
  rainfallStatus: RainfallStatus | null;
  isRefreshingRainfall: boolean;
  onSelectRegion: (regionId: string) => void;
  onRefreshRainfall: () => void;
};

// Simplified date formatter
const formatDate = (date: string | null | undefined) => 
  date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "---";

export function AnalysisCenter({
  items,
  selectedRegionId,
  isLoading,
  rainfallStatus,
  isRefreshingRainfall,
  onSelectRegion,
  onRefreshRainfall,
}: AnalysisCenterProps) {
  return (
    <Card
      title="Batch district triage"
      subtitle="Analysis Center"
      headerAction={
        <div className="flex items-center gap-4">
          <Badge 
            label={`Rainfall sync: ${rainfallStatus?.status || '---'}`} 
            variant="outline" 
          />
          <button
            onClick={onRefreshRainfall}
            disabled={isRefreshingRainfall}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isRefreshingRainfall ? "Syncing..." : "Manual Sync"}
          </button>
        </div>
      }
      padding="none"
    >
      <div className="grid gap-0 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Sidebar Info Section */}
        <div className="bg-[linear-gradient(135deg,#1e293b_0%,#0f172a_100%)] p-6 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Scheduled Updates</p>
          <h3 className="mt-2 text-2xl font-bold">{formatDate(rainfallStatus?.nextScheduledRefreshAt)}</h3>
          
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {rainfallStatus?.message || "Internal model syncs satellite precipitation data every 6 hours."}
          </p>

          <div className="mt-8 grid gap-3">
             <div className="rounded-xl border border-white/10 bg-white/5 p-4">
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Imported</p>
               <p className="text-2xl font-bold">{rainfallStatus?.importedCount || 0}</p>
             </div>
             <div className="rounded-xl border border-white/10 bg-white/5 p-4">
               <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Observations</p>
               <p className="text-2xl font-bold">{rainfallStatus?.totalObservations || 0}</p>
             </div>
          </div>
        </div>

        {/* Triage GridSection */}
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-slate-100 p-5">
                <Skeleton height={20} width="40%" />
                <Skeleton height={40} />
                <div className="flex gap-2">
                   <Skeleton height={30} width={60} rounded="full" />
                   <Skeleton height={30} width={60} rounded="full" />
                </div>
              </div>
            ))
          ) : (
            items.map((item) => {
              const isSelected = item.region.id === selectedRegionId;
              return (
                <button
                  key={item.region.id}
                  onClick={() => onSelectRegion(item.region.id)}
                  className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isSelected 
                      ? "border-[var(--accent)] bg-[rgba(47,111,237,0.04)] shadow-xl ring-1 ring-[var(--accent)]" 
                      : "border-slate-100 bg-slate-50/30 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{item.region.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {item.region.region}
                      </p>
                    </div>
                    <RiskBadge risk={item.analysis.riskLevel} score={item.analysis.riskScore} />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white/50 p-2 text-center border border-slate-50">
                       <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Days Left</p>
                       <p className="font-bold text-slate-700">{item.analysis.estimatedDaysRemaining}</p>
                    </div>
                    <div className="rounded-xl bg-white/50 p-2 text-center border border-slate-50">
                       <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Trucks</p>
                       <p className="font-bold text-slate-700">{item.aidPlan.truckTripsFor3DayWindow}</p>
                    </div>
                    <div className="rounded-xl bg-white/50 p-2 text-center border border-slate-50">
                       <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Route</p>
                       <p className="font-bold text-slate-700">{Math.round(item.waterNavigation.distanceKm)}km</p>
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                    {item.analysis.recommendedAction}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}
