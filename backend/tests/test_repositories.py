from app.repositories.region_repo import RegionRepository
from app.repositories.water_repo import WaterSourceRepository


def test_region_repository_loads_seed_regions():
    regions = RegionRepository().get_all_regions()

    assert len(regions) >= 6
    assert regions[0].district
    assert regions[0].region
    assert regions[0].country == "Somalia"


def test_region_repository_lookup_by_id_and_name():
    repository = RegionRepository()

    first = repository.get_all_regions()[0]
    by_id = repository.get_region_by_id(first.id)
    by_name = repository.get_region_by_name(first.name)

    assert by_id is not None
    assert by_name is not None
    assert by_id.id == by_name.id


def test_water_repository_loads_viable_sources():
    sources = WaterSourceRepository().get_all_water_sources()

    assert len(sources) >= 3
    assert all(source.status in {"active", "low", "offline"} for source in sources)
