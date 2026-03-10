import regions from "@/data/regions.json";
import waterSources from "@/data/watersources.json";
import type { RegionRecord, WaterSourceRecord } from "@/lib/types";

export const regionSeedData = regions as RegionRecord[];
export const waterSourceSeedData = waterSources as WaterSourceRecord[];
