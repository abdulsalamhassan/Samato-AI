"use client";

import React from "react";

type RiskLevel = "CRITICAL" | "WARNING" | "STABLE" | "UNKNOWN";

interface BadgeProps {
  label: string;
  variant?: "solid" | "subtle" | "outline";
  status?: RiskLevel | "INFO" | "SUCCESS" | "DANGER";
  className?: string;
}

export function Badge({ label, variant = "subtle", status = "INFO", className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] transition-all";
  
  const statusStyles = {
    CRITICAL: "bg-[rgba(255,92,97,0.12)] text-[var(--critical)] border border-[rgba(255,107,107,0.2)]",
    WARNING: "bg-[rgba(246,166,35,0.12)] text-[var(--warning)] border border-[rgba(246,166,35,0.2)]",
    STABLE: "bg-[rgba(24,183,119,0.12)] text-[var(--stable)] border border-[rgba(24,183,119,0.2)]",
    UNKNOWN: "bg-[rgba(119,145,177,0.12)] text-[var(--muted)] border border-[rgba(119,145,177,0.2)]",
    INFO: "bg-[rgba(47,111,237,0.12)] text-[var(--accent)] border border-[rgba(47,111,237,0.2)]",
    SUCCESS: "bg-[rgba(24,183,119,0.12)] text-[#18b777] border border-[rgba(24,183,119,0.2)]",
    DANGER: "bg-[rgba(255,92,97,0.12)] text-[#ff5c61] border border-[rgba(255,107,107,0.2)]",
  };

  const variantStyles = {
    solid: `bg-current text-white border-transparent`, // Incomplete, needs dynamic colors
    subtle: statusStyles[status as keyof typeof statusStyles] || statusStyles.INFO,
    outline: `bg-transparent border border-current opacity-70` // Simplified
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {label}
    </span>
  );
}

export function RiskBadge({ risk, score }: { risk: RiskLevel; score?: number }) {
  const displayLabel = score !== undefined ? `${risk} (${(score / 10).toFixed(1)}/10)` : risk;
  
  return (
    <div className="flex items-center gap-2">
      {risk === 'CRITICAL' && <span className="flex h-1.5 w-1.5 animate-ping rounded-full bg-[var(--critical)]" />}
      <Badge status={risk} label={displayLabel} />
    </div>
  );
}
