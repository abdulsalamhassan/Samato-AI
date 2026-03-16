from datetime import UTC, date, datetime

from app.models.data_pipeline import RainfallObservation, RegionBaseline
from app.models.region import Region

SIGNIFICANT_RAINFALL_MM = 1.0


def build_regions(
    baselines: list[RegionBaseline],
    observations: list[RainfallObservation],
    population_by_district: dict[str, int] | None = None,
    reference_date: date | None = None,
) -> list[Region]:
    effective_date = reference_date or datetime.now(UTC).date()
    observation_map = _latest_significant_rainfall_by_region(observations)
    population_lookup = {key.lower(): value for key, value in (population_by_district or {}).items()}

    return [
        Region(
            id=baseline.id,
            name=baseline.name,
            district=baseline.district,
            district_pcode=baseline.district_pcode,
            region=baseline.region,
            region_pcode=baseline.region_pcode,
            country=baseline.country,
            latitude=baseline.latitude,
            longitude=baseline.longitude,
            area_sqkm=baseline.area_sqkm,
            population=_resolve_population(baseline, population_lookup),
            livestock=baseline.livestock,
            water_sources=baseline.water_sources,
            temperature_c=baseline.temperature_c,
            days_since_rain=_days_since_rain(
                observation_map.get(baseline.id),
                effective_date,
            ),
        )
        for baseline in baselines
    ]


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
