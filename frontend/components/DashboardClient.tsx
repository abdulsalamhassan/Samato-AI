"use client";

import dynamic from "next/dynamic";
import { startTransition, useEffect, useMemo, useState } from "react";

import { AnalysisCenter } from "@/components/AnalysisCenter";
import { CrisisRanking } from "@/components/CrisisRanking";
import { DecisionSupportPanel } from "@/components/DecisionSupportPanel";
import { Header } from "@/components/Header";
import { SMSPreview } from "@/components/SMSPreview";
import { StatStrip } from "@/components/StatStrip";
import { WaterFinder } from "@/components/WaterFinder";
import {
  fetchAnalysisCenter,
  fetchDashboardBootstrap,
  fetchDistrictGeoJson,
  fetchRegionDecisionContext,
  refreshRainfallFeed,
} from "@/lib/api";
import type {
  AnalysisCenterItem,
  DistrictGeoJson,
  RainfallStatus,
  RankedRegion,
  RegionDecisionContext,
  RegionRecord,
} from "@/lib/types";

const CrisisMap = dynamic(
  () => import("@/components/CrisisMap").then((module) => module.CrisisMap),
  {
    ssr: false,
    loading: () => (
      <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
        <div className="border-b border-[rgba(119,145,177,0.16)] px-4 py-3">
          <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">District Risk Map</h2>
        </div>
        <div className="p-4">
          <div className="h-[420px] animate-pulse rounded-[0.9rem] bg-[linear-gradient(180deg,#dde5f0_0%,#eef3f9_100%)]" />
        </div>
      </section>
    ),
  },
);

const emptyDecisionContext: RegionDecisionContext | null = null;

const navigationItems = [
  { label: "Dashboard", active: true, hasDot: false },
  { label: "District Map", active: false, hasDot: false },
  { label: "Analysis Center", active: false, hasDot: true },
  { label: "Logistics Window", active: false, hasDot: false },
  { label: "Alert Center", active: false, hasDot: false },
];

function formatHeaderTime(value?: string | null) {
  if (!value) {
    return "Awaiting sync";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function DashboardClient() {
  const [regions, setRegions] = useState<RegionRecord[]>([]);
  const [rankings, setRankings] = useState<RankedRegion[]>([]);
  const [analysisCenterItems, setAnalysisCenterItems] = useState<AnalysisCenterItem[]>([]);
  const [districtGeoJson, setDistrictGeoJson] = useState<DistrictGeoJson | null>(null);
  const [rainfallStatus, setRainfallStatus] = useState<RainfallStatus | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [decisionContext, setDecisionContext] = useState<RegionDecisionContext | null>(emptyDecisionContext);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isRefreshingRainfall, setIsRefreshingRainfall] = useState(false);
  const [bootstrapError, setBootstrapError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        setBootstrapError("");
        const [bootstrapData, geoData, analysisCenterData] = await Promise.all([
          fetchDashboardBootstrap(),
          fetchDistrictGeoJson(),
          fetchAnalysisCenter(),
        ]);

        if (cancelled) {
          return;
        }

        setRegions(bootstrapData.regions);
        setRankings(bootstrapData.rankings);
        setRainfallStatus(bootstrapData.rainfallStatus);
        setDistrictGeoJson(geoData);
        setAnalysisCenterItems(analysisCenterData.items);

        const preferredRegionId =
          analysisCenterData.items[0]?.region.id ??
          bootstrapData.rankings[0]?.regionId ??
          bootstrapData.regions[0]?.id ??
          "";
        setSelectedRegionId(preferredRegionId);
      } catch (bootstrapFailure) {
        if (!cancelled) {
          setBootstrapError(
            bootstrapFailure instanceof Error
              ? bootstrapFailure.message
              : "Failed to load SAMATO backend data.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    if (!selectedRegionId) {
      return;
    }

    let cancelled = false;
    setIsLoadingDetails(true);

    async function loadDetails() {
      try {
        const context = await fetchRegionDecisionContext(selectedRegionId);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setDecisionContext(context);
          setDetailError("");
        });
      } catch (detailFailure) {
        if (!cancelled) {
          setDetailError(
            detailFailure instanceof Error
              ? detailFailure.message
              : "Failed to load region detail flow.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingDetails(false);
        }
      }
    }

    void loadDetails();
    return () => {
      cancelled = true;
    };
  }, [selectedRegionId]);

  const selectedRegion =
    decisionContext?.region ??
    regions.find((region) => region.id === selectedRegionId) ??
    null;

  const selectedRanking = useMemo(
    () => rankings.find((region) => region.regionId === selectedRegionId) ?? null,
    [rankings, selectedRegionId],
  );

  const riskByRegionId = useMemo(
    () =>
      rankings.reduce<Record<string, RankedRegion["riskLevel"]>>((accumulator, region) => {
        accumulator[region.regionId] = region.riskLevel;
        return accumulator;
      }, {}),
    [rankings],
  );

  function handleSelectRegion(regionId: string) {
    if (regionId === selectedRegionId) {
      return;
    }

    setSelectedRegionId(regionId);
    setDetailError("");
  }

  function handleRetryBootstrap() {
    setIsBootstrapping(true);
    setBootstrapError("");
    setReloadToken((current) => current + 1);
  }

  async function handleRefreshRainfall() {
    try {
      setIsRefreshingRainfall(true);
      const nextStatus = await refreshRainfallFeed();
      setRainfallStatus(nextStatus);
      setReloadToken((current) => current + 1);
    } finally {
      setIsRefreshingRainfall(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f9_100%)] text-[var(--text)]">
      <div className="grid min-h-screen lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="flex min-h-screen flex-col justify-between bg-[linear-gradient(180deg,#071523_0%,#091728_100%)] text-white shadow-[18px_0_36px_rgba(7,21,35,0.22)]">
          <div>
            <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-xs font-bold">
                SA
              </div>
              <div>
                <h1 className="text-[1.65rem] font-semibold leading-none tracking-[0.01em]">SAMATO AI</h1>
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/45">
                  Drought Crisis Intelligence
                </p>
              </div>
            </div>
            <nav className="px-3 py-5">
              <ul className="grid gap-2">
                {navigationItems.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition ${
                        item.active
                          ? "bg-[var(--accent)] font-semibold text-white shadow-[0_12px_30px_rgba(47,111,237,0.38)]"
                          : "text-white/58 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.hasDot ? <span className="h-2 w-2 rounded-full bg-[var(--critical)]" /> : null}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="border-t border-white/8 px-3 py-4">
            <button
              type="button"
              className="w-full rounded-xl px-4 py-3 text-left text-sm text-white/58 transition hover:bg-white/5 hover:text-white"
            >
              Settings
            </button>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-4 md:px-5 lg:px-6">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-4">
            <Header
              lastUpdateLabel={formatHeaderTime(rainfallStatus?.lastSuccessAt)}
              rainfallStatusLabel={rainfallStatus?.status ?? "loading"}
            />
            <StatStrip
              regions={regions}
              rankings={rankings}
              isLoading={isBootstrapping}
            />
            <section className="flex flex-wrap items-center justify-between gap-3 rounded-[0.95rem] border border-[rgba(119,145,177,0.18)] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(31,47,74,0.05)]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Focused District
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                  {selectedRegion?.name || "Waiting for backend selection"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em]">
                <span className="rounded-full border border-[rgba(119,145,177,0.18)] bg-[#f7faff] px-3 py-2 text-[var(--muted)]">
                  {isBootstrapping ? "Loading dashboard" : "Dashboard synced"}
                </span>
                <span className={`rounded-full px-3 py-2 ${isLoadingDetails ? "bg-[rgba(246,166,35,0.14)] text-[var(--warning)]" : "bg-[rgba(24,183,119,0.12)] text-[var(--stable)]"}`}>
                  {isLoadingDetails ? "Refreshing decision flow" : "Decision flow ready"}
                </span>
              </div>
            </section>
            {bootstrapError ? (
              <section className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-[0_10px_30px_rgba(220,38,38,0.08)]">
                <span>{bootstrapError}</span>
                <button
                  type="button"
                  onClick={handleRetryBootstrap}
                  className="rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-red-700"
                >
                  Retry Load
                </button>
              </section>
            ) : null}
            {detailError ? (
              <section className="rounded-[1.1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 shadow-[0_10px_24px_rgba(245,158,11,0.08)]">
                Decision flow for {selectedRegion?.name || "the selected district"} could not be refreshed. Existing data remains on screen.
              </section>
            ) : null}
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.72fr)_340px]">
              <CrisisMap
                regions={regions}
                districtGeoJson={districtGeoJson}
                selectedRegionId={selectedRegionId}
                analysis={decisionContext?.analysis ?? null}
                aidPlan={decisionContext?.aidPlan ?? null}
                isLoading={isBootstrapping || isLoadingDetails}
                onSelectRegion={handleSelectRegion}
                riskByRegionId={riskByRegionId}
              />
              <CrisisRanking
                rankings={rankings}
                selectedRegionName={selectedRegion?.name ?? ""}
                isLoading={isBootstrapping}
                onSelectRegion={(regionName) => {
                  const nextRegion = regions.find((region) => region.name === regionName);
                  if (nextRegion) {
                    handleSelectRegion(nextRegion.id);
                  }
                }}
              />
            </div>
            <AnalysisCenter
              items={analysisCenterItems}
              selectedRegionId={selectedRegionId}
              isLoading={isBootstrapping}
              rainfallStatus={rainfallStatus}
              isRefreshingRainfall={isRefreshingRainfall}
              onSelectRegion={handleSelectRegion}
              onRefreshRainfall={handleRefreshRainfall}
            />
            <DecisionSupportPanel
              region={selectedRegion}
              analysis={decisionContext?.analysis ?? null}
              aidPlan={decisionContext?.aidPlan ?? null}
              alertReport={decisionContext?.alert.report ?? ""}
              radioScript={decisionContext?.radio.script ?? ""}
              isLoading={isLoadingDetails}
            />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
              <WaterFinder
                region={selectedRegion}
                aidPlan={decisionContext?.aidPlan ?? null}
                analysis={decisionContext?.analysis ?? null}
                isLoading={isLoadingDetails}
              />
              <SMSPreview
                regionName={selectedRegion?.name ?? ""}
                sms={decisionContext?.sms ?? null}
                isLoading={isLoadingDetails}
                ranking={selectedRanking}
              />
            </div>
            <footer className="rounded-[1rem] bg-[var(--shell)] px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/35">
              Data Sources: HDX Somalia Boundaries  Rainfall Feed  WorldPop  WPDx
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
