from fastapi import APIRouter, Depends, HTTPException

from app.api.analysis import _resolve_region
from app.api.deps import get_region_repository
from app.core.rate_limit import rate_limit
from app.models.aid import AidPlanListResponse, AidPlanRequest, AidPlanResult
from app.repositories.region_repo import RegionRepository
from app.services.drought_engine import calculate_risk
from app.services.aid_planner import build_aid_plan
from app.services.ranking_engine import rank_regions
from app.services.water_engine import find_nearest_water
from app.api.deps import get_water_source_repository
from app.repositories.water_repo import WaterSourceRepository

router = APIRouter(tags=["aid"])


@router.get("/aid-plan", response_model=AidPlanListResponse)
def get_aid_plan_list(
    limit: int = 10,
    _: None = Depends(rate_limit("aid-plan-list")),
    region_repository: RegionRepository = Depends(get_region_repository),
    water_repository: WaterSourceRepository = Depends(get_water_source_repository),
) -> AidPlanListResponse:
    ranked_regions = rank_regions(region_repository.get_all_regions(), limit=limit)
    regions_by_name = {region.name: region for region in region_repository.get_all_regions()}
    plans = []
    for ranked_region in ranked_regions:
        region = regions_by_name.get(ranked_region.region_name)
        if region is None:
            continue
        analysis = calculate_risk(region)
        navigation = find_nearest_water(region, water_repository.get_all_water_sources())
        if navigation is None:
            continue
        plans.append(build_aid_plan(region, analysis, navigation))

    return AidPlanListResponse(total=len(plans), plans=plans)


@router.post("/aid-plan", response_model=AidPlanResult)
def get_aid_plan(
    payload: AidPlanRequest,
    _: None = Depends(rate_limit("aid-plan")),
    region_repository: RegionRepository = Depends(get_region_repository),
    water_repository: WaterSourceRepository = Depends(get_water_source_repository),
) -> AidPlanResult:
    region = _resolve_region(payload, region_repository)
    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")

    analysis = calculate_risk(region)
    navigation = find_nearest_water(region, water_repository.get_all_water_sources())
    if navigation is None:
        raise HTTPException(status_code=404, detail="No viable water source found")
    return build_aid_plan(region, analysis, navigation)
