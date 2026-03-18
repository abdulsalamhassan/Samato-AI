from app.models.drought import DroughtAnalysis
from app.models.region import Region

LITERS_PER_PERSON_PER_DAY = 7
LITERS_PER_LIVESTOCK_PER_DAY = 20
BASE_WATER_SOURCE_CAPACITY_LPD = 50000


def calculate_risk(region: Region) -> DroughtAnalysis:
    population = region.population or 0
    pastoral_population = region.pastoral_population_estimate or 0
    livestock = region.livestock or 0
    
    water_demand = (
        population * LITERS_PER_PERSON_PER_DAY
        + pastoral_population * LITERS_PER_PERSON_PER_DAY
        + livestock * LITERS_PER_LIVESTOCK_PER_DAY
    )
    source_count = max(0, len(region.water_sources))
    effective_supply = max(15000, source_count * BASE_WATER_SOURCE_CAPACITY_LPD)

    demand_pressure = min((water_demand / effective_supply) * 100, 100)
    dryness_pressure = min(region.days_since_rain * 0.8, 60)
    heat_pressure = max(0.0, ((region.temperature_c or 32.0) - 30.0) * 2.5)
    source_penalty = 18 if source_count == 0 else 0

    stress_factor = round((water_demand / effective_supply), 2)
    risk_score = demand_pressure * 0.45 + dryness_pressure * 0.4 + heat_pressure + source_penalty
    
    # Integrate GEE Satellite Intelligence
    if region.satellite_drought_score is not None:
        # Scale satellite score (0-1) to 0-100 and blend with local pressure
        # Giving 70% weight to high-trust satellite data
        risk_score = (risk_score * 0.3) + (region.satellite_drought_score * 100 * 0.7)
    
    drivers = []
    
    if region.satellite_ndvi is not None:
        nd_status = "Healthy" if region.satellite_ndvi > 0.4 else "Moderate" if region.satellite_ndvi > 0.2 else "Critical Stress"
        drivers.append(f"Satellite Vegetation: {nd_status} (NDVI: {region.satellite_ndvi:.2f})")
    
    if region.satellite_rainfall_mm is not None:
        drivers.append(f"Satellite Rainfall: {region.satellite_rainfall_mm:.1f}mm")
    
    if region.days_since_rain > 0:
        drivers.append(f"{region.days_since_rain} days since rain")

    # 1. Infrastructure Modifier
    if region.water_infrastructure_level == "high":
        risk_score *= 0.3
        drivers.append("High water infrastructure offset")
    elif region.water_infrastructure_level == "medium":
        risk_score *= 0.7
        drivers.append("Medium water infrastructure offset")
    elif region.water_infrastructure_level == "low":
        drivers.append("Limited water infrastructure")

    # 2. Regional Water Baselines
    if region.baseline_water_security == "high":
        risk_score *= 0.5
        drivers.append("High baseline water security offset")
    elif region.baseline_water_security == "medium":
        risk_score *= 0.8
        drivers.append("Medium baseline water security offset")

    # 3. Historical Drought Zones
    if region.drought_prone_region:
        risk_score += 10
        drivers.append("Structurally drought-prone region penalty")
        
    # 4. District Classification & Risk Dampening
    # Senior Engineering Approach: Cities have better water resilience.
    # Drought risk in cities is mostly social/economic, but for nomads, it's life-threatening.
    if region.district_type == "urban":
        risk_score *= 0.25 # 75% reduction for cities with resilient water sources
        drivers.append("Primary urban hub offset (High water resilience)")
        if risk_score > 60:
            risk_score = 40 # Cities cannot hit CRITICAL without catastrophic heat/dryness
            drivers.append("Urban cap: Prioritizing rural nomadic distress")
    elif region.district_type == "town":
        risk_score *= 0.55 # 45% reduction for secondary towns
        drivers.append("Secondary town offset (Moderate water resilience)")
        if risk_score > 75:
            risk_score = 65 # Towns capped at CRITICAL/WARNING boundary
    elif region.district_type == "pastoral" or (region.population and region.population < 100000):
        # Boost confidence in signals for low-pop/pastoral areas
        risk_score += (1.0 - (region.satellite_ndvi or 0.0)) * 5 
        drivers.append("Pastoral vulnerability focus")
        
    # 5. Data Validation Rules (Sanity Filter)
    if population > 500_000:
        if risk_score > 40:
             risk_score = 40
             drivers.append("Large population filter: Highlight nomads outside the city")
            
    # Calculate pastoral vulnerability index
    pastoral_vulnerability_index = None
    # If a region is pastoral OR it has high satellite stress regardless of pop
    if region.district_type == "pastoral" or (region.satellite_ndvi and region.satellite_ndvi < 0.15):
        pv_demand = ((pastoral_population * LITERS_PER_PERSON_PER_DAY + livestock * LITERS_PER_LIVESTOCK_PER_DAY) / max(effective_supply, 1)) * 50
        pv_dryness = min(region.days_since_rain, 100)
        pastoral_vulnerability_index = round(min(pv_demand + pv_dryness, 100), 1)
        if pastoral_vulnerability_index > 70:
            drivers.append(f"Pastoral land under severe drought stress (PVI: {pastoral_vulnerability_index})")

    confidence = 1.0
    if not region.water_infrastructure_level and not region.baseline_water_security and region.district_type not in ["urban", "town"]:
        confidence = 0.76

    risk_score = round(min(risk_score, 100.0), 1)

    if risk_score >= 70:
        risk_level = "CRITICAL"
        action_code = "DISPATCH_WATER_AND_MOVE_COMMUNITY"
        recommended_action = f"Immediate water trucking and community movement planning required. Recommend staging emergency water distribution at {region.name} district center."
    elif risk_score >= 40:
        risk_level = "WARNING"
        action_code = "PREPARE_WATER_DELIVERY"
        recommended_action = "Prepare water delivery, monitor sources, and pre-alert field teams."
    else:
        risk_level = "STABLE"
        action_code = "MONITOR_LOCAL_WATER"
        recommended_action = "Continue monitoring and verify local water point conditions."

    # Manual Override
    if region.override_risk:
        risk_level = region.override_risk
        drivers.append(f"Manual Override applied: set to {risk_level}")
        confidence = 1.0

    # Dynamic survival timeline estimation with deterministic per-region variance.
    stability_jitter = sum(ord(char) for char in region.id) % 4
    base_calc = 42 - (risk_score * 0.4) - (region.days_since_rain * 0.05)
    estimated_days_remaining = max(1, int(round(base_calc + stability_jitter)))

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
        drivers=drivers,
        confidence=confidence,
        pastoralVulnerabilityIndex=pastoral_vulnerability_index,
    )
