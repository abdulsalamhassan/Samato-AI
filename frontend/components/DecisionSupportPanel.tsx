"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AidPlan, DroughtAnalysis, RegionRecord } from "@/lib/types";

type DecisionSupportPanelProps = {
  region: RegionRecord | null;
  analysis: DroughtAnalysis | null;
  aidPlan: AidPlan | null;
  alertReport: string;
  radioScript: string;
  isLoading: boolean;
};

export function DecisionSupportPanel({
  region,
  analysis,
  aidPlan,
  alertReport,
  radioScript,
  isLoading,
}: DecisionSupportPanelProps) {
  const [activeAction, setActiveAction] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  if (isLoading || !region || !analysis) {
    return (
      <Card title="AI Risk Analysis" padding="medium">
        <div className="space-y-6">
           <Skeleton height={20} width="60%" />
           <div className="grid grid-cols-3 gap-6">
              <Skeleton height={80} />
              <Skeleton height={80} />
              <Skeleton height={80} />
           </div>
        </div>
      </Card>
    );
  }

  const handleAction = (type: string) => {
    setIsProcessing(type);
    setTimeout(() => {
       setIsProcessing(null);
       setActiveAction(type);
    }, 1200);
  };

  const gap = Math.round(analysis.stressFactor * 10);

  return (
    <div className="flex flex-col gap-6">
      <Card 
        variant="white"
        padding="large"
        title={`AI Risk Analysis: ${region.name}`}
        headerAction={
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#FF5C61]">Risk Score</span>
            <div className="flex items-baseline gap-1 rounded-lg bg-[#FF5C61]/10 px-3 py-1 ring-1 ring-[#FF5C61]/20">
                <span className="text-xl font-black text-[#FF5C61]">{(analysis.riskScore / 10).toFixed(1)}</span>
                <span className="text-[10px] font-bold text-[#FF5C61]/60">/ 10</span>
            </div>
          </div>
        }
      >
        <div className="grid gap-12 md:grid-cols-3 mb-8">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Rainfall Gap</p>
            <p className="mt-4 text-3xl font-black text-[#FF5C61]">-{gap}% <span className="text-[10px] font-bold text-slate-400 align-middle ml-1">vs 5yr avg</span></p>
            <p className="mt-4 text-[11px] font-medium leading-relaxed text-slate-500">
              {analysis.recommendedAction.split('.')[0]}. Severe meteorological drought confirmed.
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Pop. Pressure</p>
            <p className="mt-4 text-3xl font-black text-slate-800">Critical <span className="text-[10px] font-bold text-[#2F7FED] align-middle ml-1">+12% Inflow</span></p>
            <p className="mt-4 text-[11px] font-medium leading-relaxed text-slate-500">
              High IDP movement from surrounding rural areas increasing per-capita demand.
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Infrastructure</p>
            <p className="mt-4 text-3xl font-black text-[#FF5C61]">Poor <span className="text-[10px] font-bold text-slate-400 align-middle ml-1">1/4 Active</span></p>
            <p className="mt-4 text-[11px] font-medium leading-relaxed text-slate-500">
              Primary borehole mechanical failure imminent. Backup sources contaminated.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 border-t border-slate-100 pt-8">
           {/* Aid Planning */}
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-[#2F7FED]" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#2F7FED]">Aid Planning</p>
              </div>
              <div className="rounded-[1.25rem] bg-slate-50 p-6 border border-slate-100">
                 <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">Suggested Distribution Point</p>
                 <h4 className="mt-3 text-lg font-black text-slate-800">{aidPlan?.distributionCenter || "Searching for borehole center..."}</h4>
                 <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
                   {aidPlan?.truckTripsFor3DayWindow} trips in 3 days, {aidPlan?.populationServed.toLocaleString()} people served, planning only.
                 </p>
                 <p className="mt-2 text-[11px] text-slate-400">
                   Route via {aidPlan?.nearestWaterSourceName}, {aidPlan?.nearestWaterDistanceKm.toFixed(1)} km {aidPlan?.nearestWaterDirection}.
                 </p>
              </div>
           </div>

           {/* Advisory Actions */}
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-[#2F7FED]" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#2F7FED]">Advisory Actions</p>
              </div>
              <div className="grid gap-3">
                 <ActionButton 
                    label="View SMS Advisory" 
                    color="bg-[#2F7FED]" 
                    isLoading={isProcessing === 'sms'} 
                    onClick={() => handleAction('sms')}
                 />
                 <ActionButton 
                    label="View NGO Brief" 
                    color="bg-[#FF5C61]" 
                    isLoading={isProcessing === 'ngo'} 
                    onClick={() => handleAction('ngo')}
                 />
                 <ActionButton 
                    label="View Radio Advisory" 
                    color="bg-white text-slate-800 border border-slate-200" 
                    isLoading={isProcessing === 'radio'} 
                    onClick={() => handleAction('radio')}
                 />
              </div>
           </div>
        </div>
      </Card>

      {/* Action Result Modal / In-page Expansion */}
      {activeAction && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 animate-in slide-in-from-top-4 duration-300">
           <div className="flex items-center justify-between mb-4">
              <h5 className="text-xs font-black uppercase text-blue-600 tracking-widest">
                {activeAction === 'sms' && "Nomadic Emergency Message"}
                {activeAction === 'ngo' && "Humanitarian Coordination Brief"}
                {activeAction === 'radio' && "BBC Somali Broadcast Script"}
              </h5>
              <button 
                onClick={() => setActiveAction(null)}
                className="text-blue-400 hover:text-blue-600 font-bold text-xs"
              >
                DISMISS
              </button>
           </div>
           <div className="rounded-xl bg-white p-5 text-sm font-medium leading-relaxed text-slate-700 shadow-sm border border-blue-100/50 whitespace-pre-wrap">
              {activeAction === 'sms' && (radioScript.split('\n')[0] || "Alert: Water scarcity ahead...")}
              {activeAction === 'ngo' && alertReport}
              {activeAction === 'radio' && radioScript}
           </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ 
  label, 
  color, 
  isLoading, 
  onClick 
}: { 
  label: string; 
  color: string; 
  isLoading: boolean; 
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`relative w-full overflow-hidden rounded-xl py-4 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:brightness-95 active:scale-[0.98] ${color} ${!color.includes('white') ? 'text-white shadow-lg shadow-black/5' : 'shadow-none'}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
           <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
           Generating Intelligence...
        </div>
      ) : label}
    </button>
  );
}
