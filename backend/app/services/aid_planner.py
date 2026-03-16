import math

from app.models.aid import AidPlanResult
from app.models.drought import DroughtAnalysis
from app.models.region import Region

LITERS_PER_PERSON_PER_DAY = 15
LITERS_PER_LIVESTOCK_PER_DAY = 5
TRUCK_CAPACITY_LITERS = 10000


def build_aid_plan(region: Region, analysis: DroughtAnalysis) -> AidPlanResult:
    population_served = region.population or 0
    livestock_served = region.livestock or 0
    liters_required_per_day = (
        population_served * LITERS_PER_PERSON_PER_DAY
        + livestock_served * LITERS_PER_LIVESTOCK_PER_DAY
    )
    water_trucks_required = (
        max(1, math.ceil(liters_required_per_day / TRUCK_CAPACITY_LITERS))
        if liters_required_per_day > 0
        else 1
    )

    return AidPlanResult(
        regionId=region.id,
        regionName=region.name,
        area=region.region,
        riskLevel=analysis.risk_level,
        actionCode=analysis.action_code,
        estimatedDaysRemaining=analysis.estimated_days_remaining,
        distributionCenter=f"{region.district} District Center",
        distributionLatitude=region.latitude,
        distributionLongitude=region.longitude,
        populationServed=population_served,
        livestockServed=livestock_served,
        litersRequiredPerDay=liters_required_per_day,
        waterTrucksRequired=water_trucks_required,
        recommendedAction=analysis.recommended_action,
        planningStatus="PLANNING_RECOMMENDATION_ONLY",
        planningBasis=[
            "Internal NGO planning output only.",
            "Do not communicate delivery timing until logistics are human-confirmed.",
            f"Truck estimate assumes {LITERS_PER_PERSON_PER_DAY} L per person per day and {TRUCK_CAPACITY_LITERS:,} L truck capacity.",
        ],
    )
