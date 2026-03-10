from fastapi import APIRouter, Depends, HTTPException

from app.api.analysis import _resolve_region
from app.api.deps import get_region_repository, get_water_source_repository
from app.models.navigation import NearestWaterRequest, NearestWaterResult
from app.repositories.region_repo import RegionRepository
from app.repositories.water_repo import WaterSourceRepository
from app.services.water_engine import find_nearest_water

router = APIRouter(tags=["water"])


@router.post("/nearest-water", response_model=NearestWaterResult)
def nearest_water(
    payload: NearestWaterRequest,
    region_repository: RegionRepository = Depends(get_region_repository),
    water_repository: WaterSourceRepository = Depends(get_water_source_repository),
) -> NearestWaterResult:
    region = _resolve_region(payload, region_repository)
    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")

    result = find_nearest_water(region, water_repository.get_all_water_sources())
    if result is None:
        raise HTTPException(status_code=404, detail="No viable water source found")
    return result
