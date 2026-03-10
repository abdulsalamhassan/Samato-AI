from pydantic import BaseModel, Field


class NearestWaterRequest(BaseModel):
    latitude: float
    longitude: float


class NearestWaterResponse(BaseModel):
    water_source: str = Field(alias="waterSource")
    status: str
    distance_km: float = Field(alias="distanceKm")
    direction: str
