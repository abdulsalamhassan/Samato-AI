"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { RankedRegion } from "@/lib/types";

type CrisisRankingProps = {
  rankings: RankedRegion[];
  selectedRegionName: string;
  isLoading: boolean;
  onSelectRegion: (regionName: string) => void;
};

export function CrisisRanking({
  rankings,
  selectedRegionName,
  isLoading,
  onSelectRegion,
}: CrisisRankingProps) {
  const [isAnalyzingAll, setIsAnalyzingAll] = React.useState(false);

  const handleAnalyzeAll = () => {
    setIsAnalyzingAll(true);
    setTimeout(() => setIsAnalyzingAll(false), 2000);
  };

  return (
    <Card 
      title="Priority Communities"
      variant="white"
      padding="small"
      footer={
        <button 
          onClick={handleAnalyzeAll}
          disabled={isAnalyzingAll}
          className="w-full rounded-xl bg-[#0B1521] py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
           {isAnalyzingAll ? (
             <div className="flex items-center justify-center gap-2">
               <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
               Bulk Processing...
             </div>
           ) : "Analyze All Regions"}
        </button>
      }
    >
      <div className="grid gap-3 p-3">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} height={80} rounded="lg" />
          ))
        ) : (
          rankings.slice(0, 5).map((region) => {
            const isSelected = selectedRegionName === region.regionName;
            const progress = Math.max(10, Math.min(100, ((30 - region.estimatedDaysRemaining) / 30) * 100));

            return (
              <button
                key={region.regionId}
                onClick={() => onSelectRegion(region.regionName)}
                className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#2F7FED]/30 bg-[#2F7FED]/5 shadow-sm"
                    : "border-slate-50 bg-white hover:border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm tracking-tight">{region.regionName}</h4>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {region.area} • POP. {(Math.random() * 20000 + 5000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <Badge 
                    label={region.riskLevel} 
                    status={region.riskLevel} 
                    className="text-[8px] px-2 py-0.5" 
                  />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>Survival Timeline</span>
                    <span className={region.riskLevel === 'CRITICAL' ? 'text-[#FF5C61]' : 'text-[#F6A623]'}>
                      {30 - region.estimatedDaysRemaining}/30 Days
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        region.riskLevel === 'CRITICAL' ? 'bg-[#FF5C61]' : 
                        region.riskLevel === 'WARNING' ? 'bg-[#F6A623]' : 'bg-[#18B777]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </Card>
  );
}
