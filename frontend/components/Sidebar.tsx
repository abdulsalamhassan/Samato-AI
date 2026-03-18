"use client";

import React from "react";

interface SidebarItem {
  label: string;
  active?: boolean;
  hasDot?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  onItemClick?: (label: string) => void;
}

export function Sidebar({ items, onItemClick }: SidebarProps) {
  return (
    <aside className="flex h-full flex-col justify-between bg-[#0B1521] text-white">
      <div className="flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center gap-4 px-6 py-6 border-b border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2F7FED] font-black text-white text-xs">
            SA
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black leading-tight uppercase tracking-wider">Samato AI</h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Drought Crisis Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 mt-6">
          <ul className="grid gap-2">
            {items.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => onItemClick?.(item.label)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                    item.active
                      ? "bg-[#2F7FED] font-bold text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <NavigationIcon label={item.label} />
                  <span className="text-xs font-semibold tracking-wide flex-1">{item.label}</span>
                  {item.hasDot && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C61] shadow-[0_0_8px_rgba(255,92,97,0.6)]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t border-white/5">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-xs font-bold text-slate-500 transition hover:bg-white/5 hover:text-slate-300">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </button>
      </div>
    </aside>
  );
}

function NavigationIcon({ label }: { label: string }) {
  // Rough icons to match the image
  return (
    <div className="w-5 h-5 flex items-center justify-center opacity-70">
      {label === "Dashboard" && (
        <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V4zM2 12a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" /></svg>
      )}
      {label === "Crisis Map" && (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )}
      {label === "Priority Communities" && (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )}
      {label === "AI Risk Analyzer" && (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      )}
      {label === "Alert Center" && (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      )}
    </div>
  );
}
