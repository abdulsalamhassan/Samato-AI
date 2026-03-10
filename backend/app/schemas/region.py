from typing import Literal

from pydantic import BaseModel, Field


class Region(BaseModel):
    id: str
    name: str
    district: str
    coordinates: tuple[float, float]
    population: int
    livestock: int
    water_status: str = Field(alias="waterStatus")
    days_since_rain: int = Field(alias="daysSinceRain")
    days_remaining: int = Field(alias="daysRemaining")
    urgency_score: int = Field(alias="urgencyScore")
    status: Literal["CRITICAL", "WARNING", "STABLE"]


class RankingResponse(BaseModel):
    total: int
    regions: list[Region]


class AnalyzeRegionRequest(BaseModel):
    region_name: str = Field(alias="regionName")
    days_since_rain: int | None = Field(default=None, alias="daysSinceRain")
    water_status: str | None = Field(default=None, alias="waterStatus")


class AnalyzeRegionResponse(BaseModel):
    region: str
    district: str
    risk_level: Literal["CRITICAL", "WARNING", "STABLE"] = Field(alias="riskLevel")
    days_remaining: int = Field(alias="daysRemaining")
    urgency_score: int = Field(alias="urgencyScore")
    recommended_action: str = Field(alias="recommendedAction")
