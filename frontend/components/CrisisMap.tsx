"use client";

import type { GeoJsonObject } from "geojson";
import type { Layer } from "leaflet";
import { useEffect } from "react";
import {
  GeoJSON,
  MapContainer,
  Pane,
  TileLayer,
  useMap,
} from "react-leaflet";

import { MapFocusPanel } from "@/components/MapFocusPanel";
import type {
  DistrictGeoJson,
  DroughtAnalysis,
  RegionRecord,
  RiskLevel,
} from "@/lib/types";

type CrisisMapProps = {
  regions: RegionRecord[];
  districtGeoJson: DistrictGeoJson | null;
  selectedRegionId: string;
  analysis: DroughtAnalysis | null;
  isLoading: boolean;
  onSelectRegion: (regionId: string) => void;
  riskByRegionId: Record<string, RiskLevel>;
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
  districtGeoJson,
  selectedRegionId,
  analysis,
  isLoading,
  onSelectRegion,
  riskByRegionId,
}: CrisisMapProps) {
  const selectedRegion =
    regions.find((region) => region.id === selectedRegionId) ?? null;

  return (
    <section className="overflow-hidden rounded-[1rem] border border-[rgba(119,145,177,0.22)] bg-white shadow-[0_14px_32px_rgba(31,47,74,0.06)]">
      <div className="flex items-center justify-between border-b border-[rgba(119,145,177,0.16)] px-4 py-3">
        <h2 className="text-[1.1rem] font-semibold text-[var(--text)]">District Risk Map</h2>
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
              className="h-[420px] w-full"
              zoomControl
              scrollWheelZoom
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Pane name="districts" style={{ zIndex: 430 }} />
              {districtGeoJson ? (
                <GeoJSON
                  key={selectedRegionId}
                  data={districtGeoJson as GeoJsonObject}
                  pane="districts"
                  style={(feature) => {
                    const regionId = String(feature?.properties?.adm2_pcode ?? "").toLowerCase();
                    const risk = riskByRegionId[regionId] ?? "WARNING";
                    const isSelected = regionId === selectedRegionId;
                    return {
                      color: isSelected ? "#ffffff" : "#28425f",
                      weight: isSelected ? 2.2 : 0.8,
                      fillColor: riskColor[risk],
                      fillOpacity: isSelected ? 0.72 : 0.38,
                    };
                  }}
                  onEachFeature={(feature, layer: Layer) => {
                    const regionId = String(feature.properties?.adm2_pcode ?? "").toLowerCase();
                    layer.on({
                      click: () => onSelectRegion(regionId),
                    });
                  }}
                />
              ) : null}
              <SelectionMapFocus region={selectedRegion} />
            </MapContainer>
          </div>

          <div className="mt-3 rounded-[0.9rem] border border-[rgba(119,145,177,0.18)] bg-[#fbfdff] px-4 py-3">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              <span>Staging</span>
              <span>3-Day Window</span>
              <span>7-Day Window</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#dce5f1]">
              <div
                className="h-1.5 rounded-full bg-[var(--accent)]"
                style={{
                  width: `${Math.max(16, Math.min(100, (analysis?.estimatedDaysRemaining ?? 2) * 4))}%`,
                }}
              />
            </div>
          </div>
        </div>

        <MapFocusPanel
          region={selectedRegion}
          analysis={analysis}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
