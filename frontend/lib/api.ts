import type {
  AlertReportResponse,
  DroughtAnalysis,
  RadioScriptResponse,
  RankingsResponse,
  RegionRecord,
  SmsPreviewResponse,
  WaterNavigation,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${path}`);
  }

  return (await response.json()) as T;
}

export function fetchRegions() {
  return fetchJson<RegionRecord[]>("/regions");
}

export function fetchRankings(limit = 10) {
  return fetchJson<RankingsResponse>(`/rankings?limit=${limit}`);
}

export function fetchRegionAnalysis(regionName: string) {
  return fetchJson<DroughtAnalysis>("/analyze-region", {
    method: "POST",
    body: JSON.stringify({ regionName }),
  });
}

export function fetchNearestWater(regionName: string) {
  return fetchJson<WaterNavigation>("/nearest-water", {
    method: "POST",
    body: JSON.stringify({ regionName }),
  });
}

export function fetchSms(regionName: string) {
  return fetchJson<SmsPreviewResponse>("/generate-sms", {
    method: "POST",
    body: JSON.stringify({ regionName }),
  });
}

export function fetchAlert(regionName: string) {
  return fetchJson<AlertReportResponse>("/generate-alert", {
    method: "POST",
    body: JSON.stringify({ regionName }),
  });
}

export function fetchRadioScript(regionName: string) {
  return fetchJson<RadioScriptResponse>("/radio-script", {
    method: "POST",
    body: JSON.stringify({ regionName }),
  });
}
