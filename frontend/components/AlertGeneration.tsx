"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AidPlan, RankedRegion, SmsPreviewResponse } from "@/lib/types";

type AlertGenerationProps = {
  regionName: string;
  sms: SmsPreviewResponse | null;
  isLoading: boolean;
  ranking: RankedRegion | null;
  aidPlan: AidPlan | null;
  alertReport: string;
  radioScript: string;
};

export function AlertGeneration({
  sms,
  isLoading,
  aidPlan,
  alertReport,
  radioScript,
}: AlertGenerationProps) {
  const [activeAction, setActiveAction] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <Card title="Alert Generation" padding="medium">
        <Skeleton height={200} />
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

  return (
    <div className="flex flex-col gap-6">
      <Card 
        variant="white"
        title="Alert Generation"
        padding="large"
      >
        <div className="flex flex-col gap-8">
          {/* Internal Logistics (NGO ONLY) */}
          <div className="rounded-2xl bg-[#0B1521]/5 p-6 border border-[#0B1521]/10">
            <div className="flex items-center gap-4 mb-6">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1521] text-white shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                  </svg>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Internal Logistics Planning</p>
                  <h3 className="text-sm font-black text-slate-800">NGO / Agency View Only</h3>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
               <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Est. Resources</p>
                  <p className="text-xs font-black text-slate-800">{aidPlan?.truckTripsFor3DayWindow} Trucks</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Target Range</p>
                  <p className="text-xs font-black text-[#FF5C61]">{Math.round(aidPlan?.nearestWaterDistanceKm || 0)}km Zone</p>
               </div>
            </div>
          </div>

          {/* Messaging Preview - Small Phone Mockup Style */}
          <div className="relative mx-auto w-full max-w-[280px]">
             {/* Section Label */}
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#2F7FED]">Community Alert</span>
             </div>

             <div className="rounded-[2.5rem] bg-[#111827] p-2 ring-8 ring-slate-900 shadow-2xl">
                <div className="relative h-[220px] overflow-hidden rounded-[2rem] bg-[#0A0F1A] p-4 text-white">
                   <div className="flex items-center justify-between opacity-50 mb-4">
                      <span className="text-[8px] font-bold">12:42</span>
                      <div className="flex gap-1">
                         <span className="h-1 w-1 rounded-full bg-white"></span>
                         <span className="h-1 w-1 rounded-full bg-white"></span>
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="rounded-2xl bg-[#1D2B44] p-3 text-[10px] leading-relaxed">
                        <p className="font-bold mb-1 text-blue-400 tracking-wider">SAMATO_ALERT:</p>
                        <span className="font-medium text-blue-50/90 italic">
                          {sms?.message || "Generating vital resource message in Somali..."}
                        </span>
                      </div>
                   </div>

                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-white/20" />
                </div>
             </div>
             
             <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                <div className="h-10 w-1 bg-slate-800 rounded-l" />
                <div className="h-16 w-1 bg-slate-800 rounded-l" />
             </div>
          </div>

          {/* Advisory Actions (MOVED FROM ANALYSIS PANEL) */}
          <div className="space-y-6 border-t border-slate-100 pt-8">
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
