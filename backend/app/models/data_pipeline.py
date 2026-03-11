from datetime import date

from pydantic import BaseModel, Field


class RegionBaseline(BaseModel):
    id: str
    name: str
    region: str
    latitude: float
    longitude: float
    population: int = Field(ge=0)
    livestock: int = Field(ge=0)
    water_sources: list[str] = Field(default_factory=list)
    temperature_c: float | None = None


class RainfallObservation(BaseModel):
    region_id: str = Field(alias="regionId")
    observed_on: date = Field(alias="observedOn")
    precipitation_mm: float = Field(alias="precipitationMm", ge=0)
