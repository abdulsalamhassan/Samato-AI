from pydantic import BaseModel, Field
from app.models.common import ActionCode, RiskLevel


class AnalyzeRegionRequest(BaseModel):
    region_id: str | None = Field(default=None, alias="regionId")
    region_name: str | None = Field(default=None, alias="regionName")
    days_since_rain: int | None = Field(default=None, alias="daysSinceRain", ge=0)
    temperature_c: float | None = Field(default=None, alias="temperatureC")


class DroughtAnalysis(BaseModel):
    region_id: str = Field(alias="regionId")
    region_name: str = Field(alias="regionName")
    area: str
    water_demand_lpd: int = Field(alias="waterDemandLpd")
    source_count: int = Field(alias="sourceCount")
    stress_factor: float = Field(alias="stressFactor")
    risk_score: float = Field(alias="riskScore")
    risk_level: RiskLevel = Field(alias="riskLevel")
    action_code: ActionCode = Field(alias="actionCode")
    estimated_days_remaining: int = Field(alias="estimatedDaysRemaining")
    recommended_action: str = Field(alias="recommendedAction")
    drivers: list[str] = Field(default_factory=list)
    confidence: float = 1.0
    pastoral_vulnerability_index: float | None = Field(default=None, alias="pastoralVulnerabilityIndex")
