import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { RankedRegion, SmsPreviewResponse } from "@/lib/types";

type SMSPreviewProps = {
  regionName: string;
  sms: SmsPreviewResponse | null;
  isLoading: boolean;
  ranking: RankedRegion | null;
};

export function SMSPreview({ regionName, sms, isLoading, ranking }: SMSPreviewProps) {
  return (
    <Card 
      title="Mobile Alert Strategy" 
      subtitle="Communication Hub"
      padding="medium"
    >
      <div className="flex flex-col gap-6 lg:flex-row items-center lg:items-start">
        {/* Phone Mockup */}
        <div className="relative w-full max-w-[260px] flex-shrink-0 animate-float">
          <div className="rounded-[2.5rem] bg-slate-900 p-4 shadow-2xl ring-4 ring-slate-800">
            {/* Notch */}
            <div className="absolute left-1/2 top-6 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-800" />
            
            <div className="mt-8 overflow-hidden rounded-[2rem] bg-slate-100 p-4 min-h-[320px] flex flex-col">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                 <Badge label="SMS.SO" status="INFO" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Now</span>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                   <Skeleton height={14} width="80%" />
                   <Skeleton height={14} width="60%" />
                   <Skeleton height={14} width="90%" />
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-4 text-sm font-medium leading-relaxed text-slate-700 shadow-sm border border-white">
                  {sms?.message || "District context required to generate nomadic alert signal."}
                </div>
              )}

              <div className="mt-auto pt-4 flex gap-2">
                 <div className="h-8 flex-1 rounded-full bg-slate-200" />
                 <div className="h-8 w-8 rounded-full bg-blue-500 shadow-md shadow-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Audit / Details */}
        <div className="flex-1 space-y-4">
           <Card variant="shell" padding="medium" className="border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Targeting Logic</p>
              <h5 className="mt-1 text-base font-bold text-slate-800">{regionName || "No selection"}</h5>
              
              <div className="mt-4 grid gap-3">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-500">Provider</span>
                    <span className="text-xs font-bold text-slate-800">{sms?.provider || "---"}</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-500">Fallback</span>
                    <span className="text-xs font-bold text-slate-800">{sms?.usedFallback ? 'ENABLED' : 'DISABLED'}</span>
                 </div>
              </div>
           </Card>

           <div className="rounded-2xl bg-blue-50/50 p-4 border border-blue-100/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Status Update</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 italic">
                 {ranking 
                   ? `"${ranking.regionName} is currently ${ranking.riskLevel.toLowerCase()} with ${ranking.estimatedDaysRemaining} days of water supply remaining."`
                   : "Select a region to view the current mobile alert status."}
              </p>
           </div>
        </div>
      </div>
    </Card>
  );
}

