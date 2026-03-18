"use client";

import dynamic from "next/dynamic";
import { startTransition, useEffect, useMemo, useState, useRef } from "react";

import { Sidebar } from "@/components/Sidebar";
import { StatStrip } from "@/components/StatStrip";
import { CrisisRanking } from "@/components/CrisisRanking";
import { DecisionSupportPanel } from "@/components/DecisionSupportPanel";
import { Header } from "@/components/Header";
import { AlertGeneration } from "@/components/AlertGeneration";
import { Card } from "@/components/ui/Card";

import {
  fetchDashboardBootstrap,
  fetchDistrictGeoJson,
  fetchRegionDecisionContext,
} from "@/lib/api";
import type {
  DistrictGeoJson,
  RankedRegion,
  RegionDecisionContext,
  RegionRecord,
  RainfallStatus,
} from "@/lib/types";

const CrisisMap = dynamic(
  () => import("@/components/CrisisMap").then((module) => module.CrisisMap),
  {
    ssr: false,
    loading: () => (
      <Card title="Dynamic Crisis Map" padding="medium">
        <div className="h-[520px] animate-pulse rounded-2xl bg-slate-100" />
      </Card>
    ),
  },
);

const emptyDecisionContext: RegionDecisionContext | null = null;

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [regions, setRegions] = useState<RegionRecord[]>([]);
  const [rankings, setRankings] = useState<RankedRegion[]>([]);
  const [districtGeoJson, setDistrictGeoJson] = useState<DistrictGeoJson | null>(null);
  const [rainfallStatus, setRainfallStatus] = useState<RainfallStatus | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [decisionContext, setDecisionContext] = useState<RegionDecisionContext | null>(emptyDecisionContext);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [bootstrapError, setBootstrapError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  // Refs for scrolling to sections
  const mapRef = useRef<HTMLDivElement>(null);
  const rankingRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  const navigationItems = useMemo(() => [
    { label: "Dashboard", active: activeTab === "Dashboard" },
    { label: "Crisis Map", active: activeTab === "Crisis Map" },
    { label: "Priority Communities", active: activeTab === "Priority Communities" },
    { label: "AI Risk Analyzer", active: activeTab === "AI Risk Analyzer" },
    { label: "Alert Center", active: activeTab === "Alert Center", hasDot: true },
  ], [activeTab]);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const [bootstrapData, geoData] = await Promise.all([
          fetchDashboardBootstrap(),
          fetchDistrictGeoJson(),
        ]);
        if (cancelled) return;
        setRegions(bootstrapData.regions);
        setRankings(bootstrapData.rankings);
        setRainfallStatus(bootstrapData.rainfallStatus);
        setDistrictGeoJson(geoData);
        if (bootstrapData.rankings[0]) {
          setSelectedRegionId(bootstrapData.rankings[0].regionId);
        }
      } catch (err) {
        if (!cancelled) setBootstrapError("Failed to load dashboard data");
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }
    bootstrap();
    return () => { cancelled = true; };
  }, [reloadToken]);

  useEffect(() => {
    if (!selectedRegionId) return;
    let cancelled = false;
    setIsLoadingDetails(true);
    async function loadDetails() {
      try {
        const context = await fetchRegionDecisionContext(selectedRegionId);
        if (cancelled) return;
        startTransition(() => {
          setDecisionContext(context);
        });
      } catch (err) {
        // Silently fail or keep existing
      } finally {
        if (!cancelled) setIsLoadingDetails(false);
      }
    }
    loadDetails();
    return () => { cancelled = true; };
  }, [selectedRegionId]);

  const selectedRegion = decisionContext?.region ?? regions.find((r) => r.id === selectedRegionId) ?? null;
  const selectedRanking = useMemo(() => rankings.find((r) => r.regionId === selectedRegionId) ?? null, [rankings, selectedRegionId]);
  const riskByRegionId = useMemo(() => rankings.reduce<Record<string, RankedRegion["riskLevel"]>>((acc, r) => {
    acc[r.regionId] = r.riskLevel;
    return acc;
  }, {}), [rankings]);

  function handleSelectRegion(regionId: string) {
    if (regionId === selectedRegionId) return;
    setSelectedRegionId(regionId);
  }

  const scrollToSection = (label: string) => {
    setActiveTab(label);
    const options: ScrollIntoViewOptions = { behavior: "smooth", block: "start" };
    
    switch (label) {
      case "Dashboard":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "Crisis Map":
        mapRef.current?.scrollIntoView(options);
        break;
      case "Priority Communities":
        rankingRef.current?.scrollIntoView(options);
        break;
      case "AI Risk Analyzer":
        analysisRef.current?.scrollIntoView(options);
        break;
      case "Alert Center":
        alertsRef.current?.scrollIntoView(options);
        break;
    }
  };

  function formatHeaderTime(value?: string | null) {
    if (!value) return "---";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(value));
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#E2E8F0] text-slate-800">
      {/* Persistent Sidebar */}
      <div className="h-screen w-[260px] flex-shrink-0">
        <Sidebar items={navigationItems} onItemClick={scrollToSection} />
      </div>

      {/* Content Area */}
      <section className="relative flex flex-1 flex-col overflow-y-auto">
        <Header
          lastUpdateLabel={formatHeaderTime(rainfallStatus?.lastSuccessAt)}
          rainfallStatusLabel={rainfallStatus?.status ?? "loading"}
        />

        <div className="flex flex-col gap-6 p-8 bg-white m-6 rounded-lg shadow-sm">
            {/* Quick Stats */}
            <StatStrip
              regions={regions}
              rankings={rankings}
              isLoading={isBootstrapping}
            />

            {/* Row 1: Map and Priority */}
            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
               <div ref={mapRef} className="scroll-mt-8">
                <CrisisMap
                  regions={regions}
                  districtGeoJson={districtGeoJson}
                  selectedRegionId={selectedRegionId}
                  analysis={decisionContext?.analysis ?? null}
                  isLoading={isBootstrapping || isLoadingDetails}
                  onSelectRegion={handleSelectRegion}
                  riskByRegionId={riskByRegionId}
                />
               </div>
               <div ref={rankingRef} className="scroll-mt-8">
                <CrisisRanking
                  rankings={rankings}
                  selectedRegionName={selectedRegion?.name ?? ""}
                  isLoading={isBootstrapping}
                  onSelectRegion={(regionName) => {
                    const nextRegion = regions.find((region) => region.name === regionName);
                    if (nextRegion) handleSelectRegion(nextRegion.id);
                  }}
                />
               </div>
            </div>

            {/* Row 2: AI Risk and Alert Generation */}
            <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
               <div ref={analysisRef} className="scroll-mt-8">
                <DecisionSupportPanel
                  region={selectedRegion}
                  analysis={decisionContext?.analysis ?? null}
                  aidPlan={decisionContext?.aidPlan ?? null}
                  isLoading={isLoadingDetails}
                />
               </div>
               <div ref={alertsRef} className="scroll-mt-8">
                <AlertGeneration
                  regionName={selectedRegion?.name ?? ""}
                  sms={decisionContext?.sms ?? null}
                  isLoading={isLoadingDetails}
                  ranking={selectedRanking}
                  aidPlan={decisionContext?.aidPlan ?? null}
                  alertReport={decisionContext?.alert?.report ?? ""}
                  radioScript={decisionContext?.radio?.script ?? ""}
                  aiAnalysis={decisionContext?.aiAnalysis}
                  confidence={decisionContext?.confidence ?? 1.0}
                />
               </div>
            </div>

            <footer className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-slate-100 pt-8 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
               <div className="flex gap-6">
                  <span>Data Sources:</span>
                  <span className="text-slate-500">NASA Climate Data</span>
                  <span className="text-slate-500">HDX Somalia</span>
                  <span className="text-slate-500">WorldPop</span>
                  <span className="text-slate-500">WPDx</span>
               </div>
               <div>
                  © 2023 SAMATO AI • Humanitarian Data Engine
               </div>
            </footer>
        </div>
      </section>
    </main>
  );
}
