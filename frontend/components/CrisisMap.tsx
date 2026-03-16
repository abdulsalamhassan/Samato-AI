"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, Pane, TileLayer, useMap } from "react-leaflet";

import { MapFocusPanel } from "@/components/MapFocusPanel";
import type { DroughtAnalysis, RegionRecord, RiskLevel, WaterNavigation } from "@/lib/types";

type CrisisMapProps = {
  regions: RegionRecord[];
  selectedRegionName: string;
  analysis: DroughtAnalysis | null;
  water: WaterNavigation | null;
  isLoading: boolean;
  onSelectRegion: (regionName: string) => void;
  riskByRegion: Record<string, RiskLevel>;
};

const somaliaCenter: [number, number] = [5.1521, 46.1996];

const riskColor: Record<RiskLevel, string> = {
  CRITICAL: "#ff5c61",
  WARNING: "#f6a623",
  STABLE: "#18b777",
};

function SelectionMapFocus({ region }: { region: RegionRecord | null }) {
  const map = useMap();

  useEffect(() => {
    if (!region) {
      return;
    }

    map.flyTo([region.latitude, region.longitude], 7, {
      duration: 1.2,
    });
  }, [map, region]);

  return null;
}

export function CrisisMap({
  regions,
  selectedRegionName,
  analysis,
  water,
  isLoading,
  onSelectRegion,
  riskByRegion,
}: CrisisMapProps) {
  const selectedRegion =
    regions.find((region) => region.name === selectedRegionName) ?? null;

  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="flex items-center justify-between border-b border-[rgba(119,145,177,0.16)] px-4 py-3">
        <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">Dynamic Crisis Map</h2>
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--critical)]" />Critical</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--warning)]" />At Risk</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--stable)]" />Stable</span>
        </div>
      </div>
      <div className="grid gap-4 p-4 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="overflow-hidden rounded-[0.9rem] border border-[rgba(119,145,177,0.16)]">
            <MapContainer
              center={somaliaCenter}
              zoom={6}
              minZoom={5}
              className="h-[370px] w-full"
              zoomControl
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Pane name="regions" style={{ zIndex: 450 }} />
              {regions.map((region) => {
                const risk = riskByRegion[region.name] ?? "WARNING";
                const isSelected = region.name === selectedRegionName;

                return (
                  <CircleMarker
                    key={region.id}
                    center={[region.latitude, region.longitude]}
                    pane="regions"
                    radius={isSelected ? 10 : 7}
                    pathOptions={{
                      color: isSelected ? "#ffffff" : riskColor[risk],
                      weight: isSelected ? 3 : 1,
                      fillColor: riskColor[risk],
                      fillOpacity: isSelected ? 0.95 : 0.82,
                    }}
                    eventHandlers={{
                      click: () => onSelectRegion(region.name),
                    }}
                  />
                );
              })}
              <SelectionMapFocus region={selectedRegion} />
            </MapContainer>
          </div>

          <div className="mt-3 rounded-[0.9rem] border border-[rgba(119,145,177,0.18)] bg-[#fbfdff] px-4 py-3">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              <span>Today</span>
              <span>+7 Days</span>
              <span>+14 Days</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#dce5f1]">
              <div className="h-1.5 w-[18%] rounded-full bg-[var(--accent)]" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {regions.slice(0, 10).map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelectRegion(region.name)}
                className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
                  selectedRegionName === region.name
                    ? "border-[var(--accent)] bg-[rgba(47,111,237,0.1)] text-[var(--accent)]"
                    : "border-[rgba(119,145,177,0.18)] bg-white text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>

        <MapFocusPanel
          region={selectedRegion}
          analysis={analysis}
          water={water}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
