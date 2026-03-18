import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { DroughtAnalysis, RegionRecord, AidPlan } from "@/lib/types";

type WaterFinderProps = {
  region: RegionRecord | null;
  aidPlan: AidPlan | null;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
};

export function WaterFinder({
  region,
  aidPlan,
  analysis,
  isLoading,
}: WaterFinderProps) {
  const isDataReady = !isLoading && aidPlan && region;

  return (
    <Card 
      title="Aid Distribution Plan" 
      subtitle="Logistics & Supply"
      padding="medium"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
          {!isDataReady ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton height={40} width={40} rounded="full" />
                <div className="space-y-2 flex-1">
                  <Skeleton height={12} width="40%" />
                  <Skeleton height={18} width="60%" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                 <Skeleton height={50} />
                 <Skeleton height={50} />
                 <Skeleton height={50} />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                   <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Distribution Center</p>
                  <h4 className="text-xl font-bold text-slate-800">{aidPlan.distributionCenter}</h4>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                 <StatItem label="Population" value={aidPlan.populationServed.toLocaleString()} />
                 <StatItem label="Daily Need" value={`${aidPlan.litersRequiredPerDay.toLocaleString()}L`} />
                 <StatItem label="3-Day Trips" value={aidPlan.truckTripsFor3DayWindow.toString()} />
                 <StatItem label="7-Day Vol" value={`${aidPlan.litersRequired7Day.toLocaleString()}L`} />
                 <StatItem label="Window" value={`${aidPlan.stagingWindowHours}h`} />
                 <StatItem label="Cycle" value={`${aidPlan.refillCycleHours}h`} />
              </div>
            </>
          )}
        </div>

        <Card variant="dark" padding="medium" className="border-none">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Logistics Context</p>
          <h5 className="mt-2 text-xl font-bold">{aidPlan?.planningStatus || "Awaiting Data"}</h5>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {analysis?.recommendedAction || "Simulation engine running dispatch scenarios..."}
          </p>
          {aidPlan && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3 text-xs text-white/80 border border-white/5">
               <span className="font-bold text-blue-400">ROUTE:</span>
               <span>{aidPlan.nearestWaterSourceName} ({aidPlan.nearestWaterDistanceKm}km {aidPlan.nearestWaterDirection})</span>
            </div>
          )}
        </Card>
      </div>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-hover hover:shadow-md">
      <p className="text-[9px] font-bold uppercase tracking-tight text-slate-400">{label}</p>
      <p className="mt-1 text-base font-bold text-slate-700">{value}</p>
    </div>
  );
}
