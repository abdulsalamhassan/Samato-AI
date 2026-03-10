from functools import lru_cache

from app.repositories.region_repo import RegionRepository
from app.repositories.water_repo import WaterSourceRepository


@lru_cache
def get_region_repository() -> RegionRepository:
    return RegionRepository()


@lru_cache
def get_water_source_repository() -> WaterSourceRepository:
    return WaterSourceRepository()
