from typing import Literal

from pydantic import BaseModel, Field


class SmsRequest(BaseModel):
    region_name: str = Field(alias="regionName")
    water_source: str = Field(alias="waterSource")
    distance_km: int = Field(alias="distanceKm")
    direction: str


class SmsResponse(BaseModel):
    message: str


class AlertRequest(BaseModel):
    region_name: str = Field(alias="regionName")
    district: str
    risk_level: Literal["CRITICAL", "WARNING", "STABLE"] = Field(alias="riskLevel")
    days_remaining: int = Field(alias="daysRemaining")
    population: int
    livestock: int


class AlertResponse(BaseModel):
    report: str


class RadioScriptRequest(BaseModel):
    region_name: str = Field(alias="regionName")
    water_source: str = Field(alias="waterSource")
    urgency: Literal["CRITICAL", "WARNING", "STABLE"]


class RadioScriptResponse(BaseModel):
    script: str
