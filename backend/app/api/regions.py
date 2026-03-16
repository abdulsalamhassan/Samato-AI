from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_region_repository
from app.models.region import Region
from app.repositories.region_repo import RegionRepository

router = APIRouter(tags=["regions"])


@router.get("/regions", response_model=list[Region])
def list_regions(
    repository: RegionRepository = Depends(get_region_repository),
) -> list[Region]:
    return repository.get_all_regions()


@router.get("/districts", response_model=list[Region])
def list_districts(
    repository: RegionRepository = Depends(get_region_repository),
) -> list[Region]:
    return repository.get_all_regions()


@router.get("/regions/{region_id}", response_model=Region)
def get_region(
    region_id: str,
    repository: RegionRepository = Depends(get_region_repository),
) -> Region:
    region = repository.get_region_by_id(region_id)
    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")
    return region


@router.get("/districts/{region_id}", response_model=Region)
def get_district(
    region_id: str,
    repository: RegionRepository = Depends(get_region_repository),
) -> Region:
    region = repository.get_region_by_id(region_id)
    if region is None:
        raise HTTPException(status_code=404, detail="District not found")
    return region
