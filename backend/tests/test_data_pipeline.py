from datetime import date

from app.models.data_pipeline import RainfallObservation, RegionBaseline
from app.repositories.region_repo import RegionRepository
from app.services.data_pipeline import build_regions


def test_build_regions_computes_days_since_latest_significant_rainfall():
    baselines = [
        RegionBaseline(
            id="alpha",
            name="Alpha",
            district="Alpha",
            district_pcode=None,
            region="Test",
            region_pcode=None,
            country="Somalia",
            latitude=1.0,
            longitude=2.0,
            area_sqkm=10.0,
            population=100,
            livestock=50,
            water_sources=["well_1"],
            temperature_c=33,
        )
    ]
    observations = [
        RainfallObservation(regionId="alpha", observedOn="2026-03-01", precipitationMm=0.4),
        RainfallObservation(regionId="alpha", observedOn="2026-02-20", precipitationMm=2.5),
    ]

    regions = build_regions(baselines, observations, reference_date=date(2026, 3, 11))

    assert len(regions) == 1
    assert regions[0].days_since_rain == 19


def test_build_regions_defaults_when_no_significant_rainfall_exists():
    baselines = [
        RegionBaseline(
            id="dry_case",
            name="Dry Case",
            district="Dry Case",
            district_pcode=None,
            region="Test",
            region_pcode=None,
            country="Somalia",
            latitude=1.0,
            longitude=2.0,
            area_sqkm=10.0,
            population=100,
            livestock=50,
            water_sources=[],
            temperature_c=37,
        )
    ]

    regions = build_regions(baselines, [], reference_date=date(2026, 3, 11))

    assert regions[0].days_since_rain == 90


def test_region_repository_returns_ingested_regions():
    region = RegionRepository().get_region_by_name("Ceel Buur")

    assert region is not None
    assert region.region == "Galgaduud"
    assert region.country == "Somalia"
    assert region.days_since_rain >= 0
