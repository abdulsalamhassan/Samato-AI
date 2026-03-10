from app.repositories.region_repo import RegionRepository
from app.repositories.water_repo import WaterSourceRepository
from app.services.water_engine import find_nearest_water


def test_find_nearest_water_returns_distance_and_direction():
    region = RegionRepository().get_region_by_id("ceel_buur")
    sources = WaterSourceRepository().get_all_water_sources()

    result = find_nearest_water(region, sources)

    assert result is not None
    assert result.water_source_name == "Ceel Dheer Borehole"
    assert result.distance_km > 0
    assert result.direction


def test_find_nearest_water_ignores_offline_sources():
    region = RegionRepository().get_region_by_id("ceel_buur")
    offline_sources = [
        source.model_copy(update={"status": "offline"})
        for source in WaterSourceRepository().get_all_water_sources()
    ]

    result = find_nearest_water(region, offline_sources)

    assert result is None
