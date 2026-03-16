export type RiskLevel = "STABLE" | "WARNING" | "CRITICAL";

export type ActionCode =
  | "MONITOR_LOCAL_WATER"
  | "PREPARE_WATER_DELIVERY"
  | "DISPATCH_WATER_AND_MOVE_COMMUNITY";

export type RegionRecord = {
  id: string;
  name: string;
  district: string;
  district_pcode?: string | null;
  region: string;
  region_pcode?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  area_sqkm?: number | null;
  population?: number | null;
  livestock?: number | null;
  water_sources: string[];
  temperature_c?: number | null;
  days_since_rain: number;
};

export type WaterSourceRecord = {
  id: string;
  name: string;
  coordinates: [number, number];
  status: string;
  notes?: string;
};

export type RankedRegion = {
  regionId: string;
  regionName: string;
  area: string;
  riskScore: number;
  riskLevel: RiskLevel;
  actionCode: ActionCode;
  estimatedDaysRemaining: number;
  recommendedAction: string;
};

export type RankingsResponse = {
  total: number;
  regions: RankedRegion[];
};

export type DroughtAnalysis = {
  regionId: string;
  regionName: string;
  area: string;
  waterDemandLpd: number;
  sourceCount: number;
  stressFactor: number;
  riskScore: number;
  riskLevel: RiskLevel;
  actionCode: ActionCode;
  estimatedDaysRemaining: number;
  recommendedAction: string;
};

export type WaterNavigation = {
  regionId: string;
  regionName: string;
  waterSourceId: string;
  waterSourceName: string;
  sourceStatus: string;
  capacity: string;
  distanceKm: number;
  direction: string;
};

export type SmsPreviewResponse = {
  message: string;
  provider: string;
  usedFallback: boolean;
};

export type AlertReportResponse = {
  report: string;
};

export type RadioScriptResponse = {
  script: string;
};
