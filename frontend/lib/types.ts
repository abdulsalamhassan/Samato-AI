export type RegionStatus = "CRITICAL" | "WARNING" | "STABLE";

export type RegionRecord = {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number];
  population: number;
  livestock: number;
  waterStatus: string;
  daysSinceRain: number;
  daysRemaining: number;
  urgencyScore: number;
  status: RegionStatus;
};

export type WaterSourceRecord = {
  id: string;
  name: string;
  coordinates: [number, number];
  status: "ACTIVE" | "LOW" | "OFFLINE";
  notes: string;
};
