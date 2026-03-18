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
};

export function AlertGeneration({
  sms,
  isLoading,
  aidPlan,
}: AlertGenerationProps) {
  if (isLoading) {
    return (
      <Card title="Alert Generation" padding="medium">
        <Skeleton height={200} />
      </Card>
    );
  }

  return (
    <Card 
      variant="white"
      title="Alert Generation"
      padding="large"
    >
      <div className="flex flex-col gap-8">
        {/* Statistics and Destination */}
        <div className="rounded-2xl bg-slate-50/50 p-6 border border-slate-100/50">
          <div className="flex items-center gap-4 mb-6">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F7FED] text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Destination Water Source</p>
                <h3 className="text-lg font-black text-slate-800">{aidPlan?.nearestWaterSourceName || "Searching..."}</h3>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
             <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Distance</p>
                <p className="text-sm font-black text-slate-800">{Math.round(aidPlan?.nearestWaterDistanceKm || 0)}km</p>
             </div>
             <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Direction</p>
                <p className="text-sm font-black text-slate-800">{aidPlan?.nearestWaterDirection || "North"}</p>
             </div>
             <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Est. Travel</p>
                <p className="text-sm font-black text-slate-800">4-6h</p>
             </div>
          </div>
        </div>

        {/* Messaging Preview - Small Phone Mockup Style */}
        <div className="relative mx-auto w-full max-w-[280px]">
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
                      <p className="font-bold mb-1 text-blue-400">SAMATO_ALERT:</p>
                      {sms?.message || "Generating vital resource message in Somali..."}
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
      </div>
    </Card>
  );
}
