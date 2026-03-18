from datetime import UTC, date, datetime

from app.models.data_pipeline import RainfallObservation, RegionBaseline
from app.models.region import Region
from app.models.priority import GEEPriorityDistrict

SIGNIFICANT_RAINFALL_MM = 1.0

def build_regions(
    baselines: list[RegionBaseline],
    observations: list[RainfallObservation],
    population_by_district: dict[str, int] | None = None,
    reference_date: date | None = None,
    satellite_data: list[GEEPriorityDistrict] | None = None,
) -> list[Region]:
    effective_date = reference_date or datetime.now(UTC).date()
    observation_map = _latest_significant_rainfall_by_region(observations)
    population_lookup = {key.lower(): value for key, value in (population_by_district or {}).items()}
    
    satellite_lookup = {
        record.adm2_pcode.lower(): record
        for record in (satellite_data or [])
    }
    # Also index by name as fallback
    satellite_lookup.update({
        record.adm2_name.strip().lower(): record
        for record in (satellite_data or [])
    })

    regions: list[Region] = []
    for baseline in baselines:
        sat = _resolve_satellite_data(baseline, satellite_lookup)
        
        # Senior Engineering Logic: Auto-classify major urban hubs and high-density centers
        # This prevents population-bloat in risk scores for established cities.
        district_type = baseline.district_type
        urban_hubs = {"mogadishu", "hargeisa", "garowe", "baidoa", "kismayo", "bossaso", "galkayo", "berbera"}
        
        is_major_hub = (
            (baseline.region and baseline.region.lower() == "banadir") or
            (baseline.name and baseline.name.lower() in urban_hubs) or
            (baseline.district and baseline.district.lower() in urban_hubs)
        )
        
        if not district_type:
            if is_major_hub:
                district_type = "urban"
            elif baseline.population and baseline.population > 200000:
                # Engineering Rule: Population > 200k implies a town with better water infrastructure
                district_type = "town"

        region = Region(
            id=baseline.id,
            name=baseline.name,
            district=baseline.district,
            district_type=district_type,
            district_pcode=baseline.district_pcode,
            region=baseline.region,
            region_pcode=baseline.region_pcode,
            country=baseline.country,
            latitude=baseline.latitude,
            longitude=baseline.longitude,
            area_sqkm=baseline.area_sqkm,
            population=sat.population if sat else _resolve_population(baseline, population_lookup),
            livestock=baseline.livestock,
            water_sources=baseline.water_sources,
            temperature_c=baseline.temperature_c,
            days_since_rain=_days_since_rain(
                observation_map.get(baseline.id),
                effective_date,
            ),
            satellite_ndvi=sat.ndvi if sat else None,
            satellite_rainfall_mm=sat.rainfall_mm if sat else None,
            satellite_drought_score=sat.drought_score if sat else None,
            satellite_final_priority=sat.final_priority if sat else None,
        )
        regions.append(region)
    return regions

def _resolve_satellite_data(
    baseline: RegionBaseline,
    lookup: dict[str, GEEPriorityDistrict]
) -> GEEPriorityDistrict | None:
    keys = [
        baseline.district_pcode or "",
        baseline.id,
        baseline.name,
        baseline.district,
    ]
    for key in keys:
        normalized_key = key.strip().lower()
        if normalized_key and normalized_key in lookup:
            return lookup[normalized_key]
    return None


def _resolve_population(
    baseline: RegionBaseline,
    population_lookup: dict[str, int],
) -> int | None:
    if baseline.population is not None:
        return baseline.population

    keys = [
        baseline.district_pcode or "",
        baseline.id,
        baseline.name,
        baseline.district,
    ]
    for key in keys:
        normalized_key = key.strip().lower()
        if normalized_key and normalized_key in population_lookup:
            return population_lookup[normalized_key]
    return None


def _latest_significant_rainfall_by_region(
    observations: list[RainfallObservation],
) -> dict[str, date]:
    latest: dict[str, date] = {}
    for observation in observations:
        if observation.precipitation_mm < SIGNIFICANT_RAINFALL_MM:
            continue
        current = latest.get(observation.region_id)
        if current is None or observation.observed_on > current:
            latest[observation.region_id] = observation.observed_on
    return latest


def _days_since_rain(last_rainfall_date: date | None, reference_date: date) -> int:
    if last_rainfall_date is None:
        return 90
    return max(0, (reference_date - last_rainfall_date).days)
