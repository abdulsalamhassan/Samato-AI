from pydantic import BaseModel, Field


class RankedRegion(BaseModel):
    region_id: str = Field(alias="regionId")
    region_name: str = Field(alias="regionName")
    area: str
    risk_score: float = Field(alias="riskScore")
    risk_level: str = Field(alias="riskLevel")
    estimated_days_remaining: int = Field(alias="estimatedDaysRemaining")
    recommended_action: str = Field(alias="recommendedAction")


class RankingsResponse(BaseModel):
    total: int
    regions: list[RankedRegion]
