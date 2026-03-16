"use client";

import { startTransition, useEffect, useState } from "react";

import { AlertPanel } from "@/components/AlertPanel";
import { CrisisMapPlaceholder } from "@/components/CrisisMapPlaceholder";
import { CrisisRanking } from "@/components/CrisisRanking";
import { Header } from "@/components/Header";
import { SMSPreview } from "@/components/SMSPreview";
import { StatStrip } from "@/components/StatStrip";
import { WaterFinder } from "@/components/WaterFinder";
import {
  fetchAlert,
  fetchNearestWater,
  fetchRadioScript,
  fetchRankings,
  fetchRegionAnalysis,
  fetchRegions,
  fetchSms,
} from "@/lib/api";
import type {
  AlertReportResponse,
  DroughtAnalysis,
  RadioScriptResponse,
  RankedRegion,
  RegionRecord,
  SmsPreviewResponse,
  WaterNavigation,
} from "@/lib/types";

type DetailState = {
  analysis: DroughtAnalysis | null;
  water: WaterNavigation | null;
  sms: SmsPreviewResponse | null;
  alert: AlertReportResponse | null;
  radio: RadioScriptResponse | null;
};

const emptyDetailState: DetailState = {
  analysis: null,
  water: null,
  sms: null,
  alert: null,
  radio: null,
};

export function DashboardClient() {
  const [regions, setRegions] = useState<RegionRecord[]>([]);
  const [rankings, setRankings] = useState<RankedRegion[]>([]);
  const [selectedRegionName, setSelectedRegionName] = useState("");
  const [details, setDetails] = useState<DetailState>(emptyDetailState);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const [regionsData, rankingsData] = await Promise.all([
          fetchRegions(),
          fetchRankings(),
        ]);

        if (cancelled) {
          return;
        }

        setRegions(regionsData);
        setRankings(rankingsData.regions);

        const preferredRegion =
          rankingsData.regions[0]?.regionName ?? regionsData[0]?.name ?? "";
        setSelectedRegionName(preferredRegion);
      } catch (bootstrapError) {
        if (!cancelled) {
          setError(
            bootstrapError instanceof Error
              ? bootstrapError.message
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
  }, []);

  useEffect(() => {
    if (!selectedRegionName) {
      return;
    }

    let cancelled = false;
    setIsLoadingDetails(true);

    async function loadDetails() {
      try {
        const [analysis, water, sms, alert, radio] = await Promise.all([
          fetchRegionAnalysis(selectedRegionName),
          fetchNearestWater(selectedRegionName),
          fetchSms(selectedRegionName),
          fetchAlert(selectedRegionName),
          fetchRadioScript(selectedRegionName),
        ]);

        if (cancelled) {
          return;
        }

        startTransition(() => {
          setDetails({ analysis, water, sms, alert, radio });
        });
      } catch (detailError) {
        if (!cancelled) {
          setError(
            detailError instanceof Error
              ? detailError.message
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
  }, [selectedRegionName]);

  const selectedRegion =
    regions.find((region) => region.name === selectedRegionName) ?? null;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <Header />
      <StatStrip
        regions={regions}
        rankings={rankings}
        isLoading={isBootstrapping}
      />
      {error ? (
        <section className="rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </section>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <CrisisMapPlaceholder
          regions={regions}
          selectedRegionName={selectedRegionName}
          selectedRegion={selectedRegion}
          analysis={details.analysis}
          isLoading={isBootstrapping || isLoadingDetails}
          onSelectRegion={setSelectedRegionName}
        />
        <CrisisRanking
          rankings={rankings}
          selectedRegionName={selectedRegionName}
          isLoading={isBootstrapping}
          onSelectRegion={setSelectedRegionName}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <AlertPanel
          regionName={selectedRegionName}
          alertReport={details.alert?.report ?? ""}
          radioScript={details.radio?.script ?? ""}
          isLoading={isLoadingDetails}
        />
        <WaterFinder
          region={selectedRegion}
          water={details.water}
          analysis={details.analysis}
          isLoading={isLoadingDetails}
        />
        <SMSPreview
          regionName={selectedRegionName}
          sms={details.sms}
          isLoading={isLoadingDetails}
        />
      </div>
    </main>
  );
}
