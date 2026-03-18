export type RiskLevel = "STABLE" | "WARNING" | "CRITICAL";

export type ActionCode =
  | "MONITOR_LOCAL_WATER"
  | "PREPARE_WATER_DELIVERY"
  | "DISPATCH_WATER_AND_MOVE_COMMUNITY";

export type RegionRecord = {
  id: string;
  name: string;
  district: string;
  district_type?: "urban" | "town" | "pastoral" | null;
  district_pcode?: string | null;
  region: string;
  region_pcode?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  area_sqkm?: number | null;
  population?: number | null;
  pastoral_population_estimate?: number | null;
  livestock?: number | null;
  water_sources: string[];
  water_infrastructure_level?: "high" | "medium" | "low" | null;
  baseline_water_security?: "high" | "medium" | "low" | null;
  drought_prone_region?: boolean | null;
  temperature_c?: number | null;
  days_since_rain: number;
  satellite_ndvi?: number | null;
  satellite_rainfall_mm?: number | null;
  satellite_drought_score?: number | null;
  satellite_final_priority?: number | null;
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
  aiAnalysis?: string;
  confidence: number;
};

export type RankingsResponse = {
  total: number;
  regions: RankedRegion[];
};

export type RainfallStatus = {
  status: string;
  source?: string | null;
  lastAttemptedAt?: string | null;
  lastSuccessAt?: string | null;
  importedCount: number;
  totalObservations: number;
  nextScheduledRefreshAt?: string | null;
  message?: string | null;
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
  drivers?: string[];
  confidence?: number;
  pastoralVulnerabilityIndex?: number | null;
};

export type AidPlan = {
  regionId: string;
  regionName: string;
  area: string;
  riskLevel: RiskLevel;
  actionCode: ActionCode;
  estimatedDaysRemaining: number;
  distributionCenter: string;
  distributionLatitude: number;
  distributionLongitude: number;
  populationServed: number;
  livestockServed: number;
  litersRequiredPerDay: number;
  litersRequired3Day: number;
  litersRequired7Day: number;
  waterTrucksRequired: number;
  truckTripsPerDay: number;
  truckTripsFor3DayWindow: number;
  truckTripsFor7DayWindow: number;
  stagingWindowHours: number;
  refillCycleHours: number;
  convoyPriority: string;
  nearestWaterSourceName: string;
  nearestWaterDistanceKm: number;
  nearestWaterDirection: string;
  sourceCapacity: string;
  recommendedAction: string;
  planningStatus: string;
  planningBasis: string[];
};

export type AidPlanListResponse = {
  total: number;
  plans: AidPlan[];
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

export type DashboardBootstrapResponse = {
  regions: RegionRecord[];
  rankings: RankedRegion[];
  rainfallStatus: RainfallStatus;
};

export type RegionDecisionContext = {
  region: RegionRecord;
  analysis: DroughtAnalysis;
  aidPlan: AidPlan;
  waterNavigation: WaterNavigation;
  sms: SmsPreviewResponse;
  alert: AlertReportResponse;
  radio: RadioScriptResponse;
  aiAnalysis?: string;
  confidence: number;
};

export type AnalysisCenterItem = {
  region: RegionRecord;
  ranking: RankedRegion;
  analysis: DroughtAnalysis;
  aidPlan: AidPlan;
  waterNavigation: WaterNavigation;
};

export type AnalysisCenterResponse = {
  total: number;
  generatedAt: string;
  items: AnalysisCenterItem[];
};

export type GeoFeature = {
  type: string;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

export type DistrictGeoJson = {
  type: "FeatureCollection";
  name?: string;
  features: GeoFeature[];
};

export type GEEPriorityDistrict = {
  adm2_name: string;
  adm2_pcode: string;
  adm1_name: string;
  rainfall_mm: number;
  ndvi: number;
  drought_score: number;
  drought_status: string;
  population: number;
  water_points: number;
  water_access: number;
  final_priority: number;
  center_lat: number;
  center_lon: number;
};

export type PriorityDistrictsResponse = {
  total: number;
  districts: GEEPriorityDistrict[];
};
