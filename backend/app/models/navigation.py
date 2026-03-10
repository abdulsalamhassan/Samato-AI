from pydantic import BaseModel, Field


class NearestWaterRequest(BaseModel):
    region_id: str | None = Field(default=None, alias="regionId")
    region_name: str | None = Field(default=None, alias="regionName")


class NearestWaterResult(BaseModel):
    region_id: str = Field(alias="regionId")
    region_name: str = Field(alias="regionName")
    water_source_id: str = Field(alias="waterSourceId")
    water_source_name: str = Field(alias="waterSourceName")
    source_status: str = Field(alias="sourceStatus")
    capacity: str
    distance_km: float = Field(alias="distanceKm")
    direction: str
