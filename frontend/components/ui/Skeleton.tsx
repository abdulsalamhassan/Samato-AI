"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "pulse" | "shimmer";
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "full" | "none";
}

export function Skeleton({ 
  className = "", 
  variant = "pulse", 
  width, 
  height, 
  rounded = "md" 
}: SkeletonProps) {
  const baseStyles = "bg-[rgba(119,145,177,0.12)]";
  const animStyles = variant === "pulse" ? "animate-pulse" : "animate-shimmer"; // Shimmer would need CSS animation
  
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full"
  };

  return (
    <div 
      className={`${baseStyles} ${animStyles} ${roundedStyles[rounded]} ${className}`}
      style={{ 
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton height={40} width={40} rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton height={14} width="60%" />
            <Skeleton height={10} width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}
