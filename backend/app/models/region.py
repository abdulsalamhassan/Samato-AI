from pydantic import BaseModel, Field


class Region(BaseModel):
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
    days_since_rain: int = Field(ge=0)
