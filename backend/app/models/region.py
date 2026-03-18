from typing import Literal

from pydantic import BaseModel, Field

from app.models.common import RiskLevel


class Region(BaseModel):
    id: str
    name: str
    district: str
    district_type: Literal["urban", "town", "pastoral"] | None = None
    district_pcode: str | None = None
    region: str
    region_pcode: str | None = None
    country: str | None = None
    latitude: float
    longitude: float
    area_sqkm: float | None = None
    population: int | None = Field(default=None, ge=0)
    pastoral_population_estimate: int | None = Field(default=None, ge=0)
    livestock: int | None = Field(default=None, ge=0)
    water_sources: list[str] = Field(default_factory=list)
    water_infrastructure_level: Literal["high", "medium", "low"] | None = None
    baseline_water_security: Literal["high", "medium", "low"] | None = None
    drought_prone_region: bool = False
    temperature_c: float | None = None
    days_since_rain: int = Field(ge=0)
    satellite_ndvi: float | None = None
    satellite_rainfall_mm: float | None = None
    satellite_drought_score: float | None = None
    satellite_final_priority: float | None = None
    override_risk: RiskLevel | None = None
