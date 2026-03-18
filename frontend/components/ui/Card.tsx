"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "dark" | "shell";
  padding?: "none" | "small" | "medium" | "large";
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  children,
  className = "",
  variant = "white",
  padding = "medium",
  title,
  subtitle,
  badge,
  headerAction,
  footer,
  ...props
}: CardProps) {
  const baseStyles = "overflow-hidden rounded-[1.25rem] border transition-all duration-300";
  
  const variantStyles = {
    white: "bg-white border-[rgba(119,145,177,0.22)] shadow-[0_14px_32px_rgba(31,47,74,0.06)]",
    dark: "bg-[linear-gradient(180deg,#203550_0%,#101f32_100%)] border-white/10 text-white shadow-[0_20px_48px_rgba(0,0,0,0.15)]",
    shell: "bg-[var(--shell)] border-white/8 text-white/80"
  };

  const paddingStyles = {
    none: "",
    small: "p-3",
    medium: "p-5",
    large: "p-8"
  };

  return (
    <section 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      {...props}
    >
      {(title || subtitle || badge || headerAction) && (
        <div className={`flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(119,145,177,0.12)] px-5 py-4 ${variant === 'dark' ? 'border-white/10' : ''}`}>
          <div>
            {subtitle && (
              <p className={`text-[10px] font-bold uppercase tracking-[0.15em] ${variant === 'white' ? 'text-[var(--accent)]' : 'text-white/45'}`}>
                {subtitle}
              </p>
            )}
            <div className="flex items-center gap-3">
              {title && (
                <h2 className="mt-1 text-[1.1rem] font-bold tracking-tight">
                  {title}
                </h2>
              )}
              {badge}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className={paddingStyles[padding]}>
        {children}
      </div>

      {footer && (
        <div className={`border-t border-[rgba(119,145,177,0.08)] bg-slate-50/50 px-5 py-3 ${variant === 'dark' ? 'border-white/5 bg-black/10' : ''}`}>
          {footer}
        </div>
      )}
    </section>
  );
}

export function StatCard({ label, value, icon, trend }: { label: string; value: string | number; icon?: React.ReactNode; trend?: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(119,145,177,0.15)] bg-[#fcfdff] p-4 transition-all hover:border-[var(--accent-hover)] hover:shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold text-[var(--text)]">{value}</p>
      {trend && <p className="mt-1 text-[10px] font-medium text-emerald-600">{trend}</p>}
    </div>
  );
}
