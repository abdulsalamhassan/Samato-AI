from app.models.data_pipeline import RainfallObservation
from app.services.rainfall_import_service import merge_rainfall_observations


def test_merge_rainfall_observations_replaces_duplicate_region_date():
    existing = [
        RainfallObservation(regionId="ceel_buur", observedOn="2026-03-01", precipitationMm=2.0)
    ]
    incoming = [
        RainfallObservation(regionId="ceel_buur", observedOn="2026-03-01", precipitationMm=5.5)
    ]

    merged = merge_rainfall_observations(existing, incoming, {"ceel_buur"})

    assert len(merged) == 1
    assert merged[0].precipitation_mm == 5.5


def test_merge_rainfall_observations_ignores_unknown_regions():
    incoming = [
        RainfallObservation(regionId="unknown", observedOn="2026-03-01", precipitationMm=5.5)
    ]

    merged = merge_rainfall_observations([], incoming, {"ceel_buur"})

    assert merged == []
