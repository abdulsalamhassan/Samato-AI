from app.models.region import Region
from app.repositories.region_repo import RegionRepository
from app.services.drought_engine import calculate_risk


def test_calculate_risk_returns_expected_fields():
    region = RegionRepository().get_region_by_name("Ceel Buur")

    analysis = calculate_risk(region)

    assert analysis.region_name == "Ceel Buur"
    assert analysis.risk_level in {"WARNING", "CRITICAL"}
    assert analysis.action_code in {
        "PREPARE_WATER_DELIVERY",
        "DISPATCH_WATER_AND_MOVE_COMMUNITY",
    }
    assert analysis.water_demand_lpd >= 0
    assert analysis.estimated_days_remaining >= 3


def test_calculate_risk_penalizes_regions_without_sources():
    with_sources = RegionRepository().get_region_by_name("Ceel Buur")
    no_sources = Region(
        id="dry_case",
        name="Dry Case",
        district="Dry Case",
        district_pcode=None,
        region="Mudug",
        region_pcode=None,
        country="Somalia",
        latitude=6.0,
        longitude=47.0,
        area_sqkm=1000.0,
        population=4200,
        livestock=800,
        water_sources=[],
        temperature_c=38,
        days_since_rain=63,
    )

    sourced_analysis = calculate_risk(with_sources)
    dry_analysis = calculate_risk(no_sources)

    assert dry_analysis.risk_score > sourced_analysis.risk_score
    assert dry_analysis.source_count == 0
    assert dry_analysis.action_code == "DISPATCH_WATER_AND_MOVE_COMMUNITY"
