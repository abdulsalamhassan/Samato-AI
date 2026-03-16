from datetime import date

from pydantic import BaseModel, Field


class RegionBaseline(BaseModel):
    id: str
    name: str
    district: str
    district_pcode: str | None = None
    region: str
    region_pcode: str | None = None
    country: str | None = None
    latitude: float
    longitude: float
    area_sqkm: float | None = None
    population: int | None = Field(default=None, ge=0)
    livestock: int | None = Field(default=None, ge=0)
    water_sources: list[str] = Field(default_factory=list)
    temperature_c: float | None = None


class PopulationRecord(BaseModel):
    district_pcode: str = Field(alias="admin2Pcode")
    district_name: str = Field(alias="Admin2Name_en")
    population_total: int = Field(alias="T_TL", ge=0)


class RainfallObservation(BaseModel):
    region_id: str = Field(alias="regionId")
    observed_on: date = Field(alias="observedOn")
    precipitation_mm: float = Field(alias="precipitationMm", ge=0)


class RainfallImportRequest(BaseModel):
    observations: list[RainfallObservation]


class RainfallImportResponse(BaseModel):
    imported: int
    total_observations: int = Field(alias="totalObservations")


class RainfallFeedPayload(BaseModel):
    observations: list[RainfallObservation]
