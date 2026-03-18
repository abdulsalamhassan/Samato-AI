import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { GEEPriorityDistrict } from "@/lib/types";

interface PriorityRankingGEEProps {
  districts: GEEPriorityDistrict[];
  isLoading: boolean;
}

export function PriorityRankingGEE({ districts, isLoading }: PriorityRankingGEEProps) {
  return (
    <Card 
      title="Nomadic Vulnerability Index (GEE)" 
      subtitle="Satellite Analysis Center"
      headerAction={<Badge label="Nomad Focus v03" status="INFO" />}
      padding="none"
    >
      <div className="border-b border-slate-100 bg-slate-50/30 px-6 py-3">
         <p className="text-[11px] text-slate-500 font-medium">
            Real-time CHIRPS + MODIS fusion prioritized for rural/vulnerable populations.
         </p>
      </div>

      <div className="grid divide-y divide-slate-100">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
               <Skeleton height={32} width={32} rounded="sm" />
               <div className="flex-1 space-y-2">
                 <Skeleton height={14} width="40%" />
                 <Skeleton height={10} width="20%" />
               </div>
               <Skeleton height={20} width={80} rounded="full" />
            </div>
          ))
        ) : (
          districts.map((district, index) => (
            <div 
              key={district.adm2_pcode}
              className="group px-6 py-4 flex flex-wrap items-center justify-between gap-4 transition-all hover:bg-slate-50/50"
            >
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{district.adm2_name}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {district.adm1_name}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-wrap items-center gap-6 justify-end">
                <MetricItem label="Rainfall" value={`${district.rainfall_mm.toFixed(0)}mm`} subValue="CHIRPS" />
                
                <div className="min-w-[100px]">
                   <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Vegetation (NDVI)</p>
                   <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${district.ndvi > 0.3 ? 'bg-emerald-500' : district.ndvi > 0.2 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min(100, (district.ndvi / 0.5) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{district.ndvi.toFixed(2)}</span>
                   </div>
                </div>

                <div className="text-right min-w-[80px]">
                   <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">Priority Score</p>
                   <p className="text-lg font-black text-blue-600">
                     {Math.round(district.final_priority).toLocaleString()}
                   </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100">
        <div className="flex flex-wrap gap-4">
           <LegendItem color="bg-rose-500" label="Critical Veg Stress" />
           <LegendItem color="bg-blue-500" label="Hydrological Deficit" />
           <LegendItem color="bg-amber-500" label="Drought Warning" />
        </div>
      </div>
    </Card>
  );
}

function MetricItem({ label, value, subValue }: { label: string; value: string; subValue: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-bold text-slate-700">{value}</span>
        <span className="text-[8px] font-bold text-slate-400 uppercase">{subValue}</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
}
