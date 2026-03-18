"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

type AlertGenerationProps = {
  isLoading: boolean;
  alertReport: string;
  radioScript: string;
  aiAnalysis?: string;
  confidence: number;
};

export function AlertGeneration({
  isLoading,
  alertReport,
  radioScript,
  aiAnalysis,
  confidence,
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
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
             <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">AI Predictive Diagnostic</p>
                   <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-800">System Confidence:</span>
                    <span className="text-[10px] font-black text-blue-600">{Math.round(confidence * 100)}%</span>
                   </div>
                </div>
             </div>
             <p className="text-xs font-medium leading-relaxed text-slate-700 italic border-l-2 border-blue-500/30 pl-3">
               {aiAnalysis || "Aggregating satellite imagery and ground sensors for predictive modeling..."}
             </p>
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
              {activeAction === 'sms' && "SMS advisory ready for operator review."}
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
