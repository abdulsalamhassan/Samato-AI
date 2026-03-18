from pydantic import BaseModel, Field
from app.models.common import ActionCode, RiskLevel


class RankedRegion(BaseModel):
    region_id: str = Field(alias="regionId")
    region_name: str = Field(alias="regionName")
    area: str
    risk_score: float = Field(alias="riskScore")
    risk_level: RiskLevel = Field(alias="riskLevel")
    action_code: ActionCode = Field(alias="actionCode")
    estimated_days_remaining: int = Field(alias="estimatedDaysRemaining")
    recommended_action: str = Field(alias="recommendedAction")
    ai_analysis: str | None = Field(default=None, alias="aiAnalysis")
    confidence: float = 1.0


class RankingsResponse(BaseModel):
    total: int
    regions: list[RankedRegion]
