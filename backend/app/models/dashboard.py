from datetime import datetime

from pydantic import BaseModel, Field

from app.models.aid import AidPlanResult
from app.models.alert import AlertResponse, RadioScriptResponse, SmsResponse
from app.models.drought import DroughtAnalysis
from app.models.navigation import NearestWaterResult
from app.models.ranking import RankedRegion
from app.models.region import Region


class RainfallRefreshStatus(BaseModel):
    status: str
    source: str | None = None
    last_attempted_at: datetime | None = Field(default=None, alias="lastAttemptedAt")
    last_success_at: datetime | None = Field(default=None, alias="lastSuccessAt")
    imported_count: int = Field(default=0, alias="importedCount")
    total_observations: int = Field(default=0, alias="totalObservations")
    next_scheduled_refresh_at: datetime | None = Field(
        default=None,
        alias="nextScheduledRefreshAt",
    )
    message: str | None = None


class DashboardBootstrapResponse(BaseModel):
    regions: list[Region]
    rankings: list[RankedRegion]
    rainfall_status: RainfallRefreshStatus = Field(alias="rainfallStatus")


class RegionDecisionContext(BaseModel):
    region: Region
    analysis: DroughtAnalysis
    aid_plan: AidPlanResult = Field(alias="aidPlan")
    water_navigation: NearestWaterResult = Field(alias="waterNavigation")
    sms: SmsResponse
    alert: AlertResponse
    radio: RadioScriptResponse
    ai_analysis: str | None = Field(default=None, alias="aiAnalysis")
    confidence: float = 1.0


class AnalysisCenterItem(BaseModel):
    region: Region
    ranking: RankedRegion
    analysis: DroughtAnalysis
    aid_plan: AidPlanResult = Field(alias="aidPlan")
    water_navigation: NearestWaterResult = Field(alias="waterNavigation")


class AnalysisCenterResponse(BaseModel):
    total: int
    generated_at: datetime = Field(alias="generatedAt")
    items: list[AnalysisCenterItem]
