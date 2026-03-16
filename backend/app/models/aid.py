from pydantic import BaseModel, Field

from app.models.common import ActionCode, RiskLevel


class AidPlanRequest(BaseModel):
    region_id: str | None = Field(default=None, alias="regionId")
    region_name: str | None = Field(default=None, alias="regionName")


class AidPlanResult(BaseModel):
    region_id: str = Field(alias="regionId")
    region_name: str = Field(alias="regionName")
    area: str
    risk_level: RiskLevel = Field(alias="riskLevel")
    action_code: ActionCode = Field(alias="actionCode")
    estimated_days_remaining: int = Field(alias="estimatedDaysRemaining")
    distribution_center: str = Field(alias="distributionCenter")
    distribution_latitude: float = Field(alias="distributionLatitude")
    distribution_longitude: float = Field(alias="distributionLongitude")
    population_served: int = Field(alias="populationServed")
    livestock_served: int = Field(alias="livestockServed")
    liters_required_per_day: int = Field(alias="litersRequiredPerDay")
    liters_required_3_day: int = Field(alias="litersRequired3Day")
    liters_required_7_day: int = Field(alias="litersRequired7Day")
    water_trucks_required: int = Field(alias="waterTrucksRequired")
    truck_trips_per_day: int = Field(alias="truckTripsPerDay")
    truck_trips_for_3_day_window: int = Field(alias="truckTripsFor3DayWindow")
    truck_trips_for_7_day_window: int = Field(alias="truckTripsFor7DayWindow")
    staging_window_hours: int = Field(alias="stagingWindowHours")
    refill_cycle_hours: int = Field(alias="refillCycleHours")
    convoy_priority: str = Field(alias="convoyPriority")
    nearest_water_source_name: str = Field(alias="nearestWaterSourceName")
    nearest_water_distance_km: float = Field(alias="nearestWaterDistanceKm")
    nearest_water_direction: str = Field(alias="nearestWaterDirection")
    source_capacity: str = Field(alias="sourceCapacity")
    recommended_action: str = Field(alias="recommendedAction")
    planning_status: str = Field(alias="planningStatus")
    planning_basis: list[str] = Field(alias="planningBasis")


class AidPlanListResponse(BaseModel):
    total: int
    plans: list[AidPlanResult]
