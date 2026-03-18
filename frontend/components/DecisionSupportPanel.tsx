"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AidPlan, DroughtAnalysis, RegionRecord } from "@/lib/types";

type DecisionSupportPanelProps = {
  region: RegionRecord | null;
  analysis: DroughtAnalysis | null;
  aidPlan: AidPlan | null;
  isLoading: boolean;
};

export function DecisionSupportPanel({
  region,
  analysis,
  aidPlan,
  isLoading,
}: DecisionSupportPanelProps) {

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
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Rainfall Deficit</p>
            <p className="mt-4 text-3xl font-black text-[#FF5C61]">{region.days_since_rain}d <span className="text-[10px] font-bold text-slate-400 align-middle ml-1">without rain</span></p>
            <p className="mt-4 text-[11px] font-medium leading-relaxed text-slate-500">
              {analysis.recommendedAction.split('.')[0]}. Rainfall deficit confirmed by satellite.
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">NDVI Vegetation</p>
            <p className="mt-4 text-3xl font-black text-slate-800">
              {region.satellite_ndvi != null ? region.satellite_ndvi.toFixed(2) : "N/A"}
              <span className="text-[10px] font-bold text-[#2F7FED] align-middle ml-1">index</span>
            </p>
            <p className="mt-4 text-[11px] font-medium leading-relaxed text-slate-500">
              {region.satellite_ndvi != null && region.satellite_ndvi < 0.2
                ? "Severe vegetation degradation detected. Pasture collapse imminent."
                : "Vegetation stress observed across pastoral zones."}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Infrastructure</p>
            <p className="mt-4 text-3xl font-black text-[#FF5C61] capitalize">{region.water_infrastructure_level || "Unknown"} <span className="text-[10px] font-bold text-slate-400 align-middle ml-1">capacity</span></p>
            <p className="mt-4 text-[11px] font-medium leading-relaxed text-slate-500">
              {analysis.sourceCount} water source{analysis.sourceCount !== 1 ? "s" : ""} identified. Stress factor {analysis.stressFactor.toFixed(2)}.
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
        </div>
      </Card>
    </div>
  );
}
