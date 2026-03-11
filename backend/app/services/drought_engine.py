from app.models.drought import DroughtAnalysis
from app.models.region import Region

LITERS_PER_PERSON_PER_DAY = 7
LITERS_PER_LIVESTOCK_PER_DAY = 20
BASE_WATER_SOURCE_CAPACITY_LPD = 50000


def calculate_risk(region: Region) -> DroughtAnalysis:
    water_demand = (
        region.population * LITERS_PER_PERSON_PER_DAY
        + region.livestock * LITERS_PER_LIVESTOCK_PER_DAY
    )
    source_count = max(0, len(region.water_sources))
    effective_supply = max(15000, source_count * BASE_WATER_SOURCE_CAPACITY_LPD)

    demand_pressure = min((water_demand / effective_supply) * 100, 100)
    dryness_pressure = min(region.days_since_rain * 0.8, 60)
    heat_pressure = max(0.0, ((region.temperature_c or 32.0) - 30.0) * 2.5)
    source_penalty = 18 if source_count == 0 else 0

    stress_factor = round((water_demand / effective_supply), 2)
    risk_score = round(
        min(demand_pressure * 0.45 + dryness_pressure * 0.4 + heat_pressure + source_penalty, 100),
        1,
    )

    if risk_score >= 70:
        risk_level = "CRITICAL"
        action_code = "DISPATCH_WATER_AND_MOVE_COMMUNITY"
        recommended_action = "Immediate water trucking and community movement planning required."
    elif risk_score >= 40:
        risk_level = "WARNING"
        action_code = "PREPARE_WATER_DELIVERY"
        recommended_action = "Prepare water delivery, monitor sources, and pre-alert field teams."
    else:
        risk_level = "STABLE"
        action_code = "MONITOR_LOCAL_WATER"
        recommended_action = "Continue monitoring and verify local water point conditions."

    estimated_days_remaining = max(3, int(round(45 - (risk_score * 0.45) - (region.days_since_rain * 0.12))))

    return DroughtAnalysis(
        regionId=region.id,
        regionName=region.name,
        area=region.region,
        waterDemandLpd=water_demand,
        sourceCount=source_count,
        stressFactor=stress_factor,
        riskScore=risk_score,
        riskLevel=risk_level,
        actionCode=action_code,
        estimatedDaysRemaining=estimated_days_remaining,
        recommendedAction=recommended_action,
    )
