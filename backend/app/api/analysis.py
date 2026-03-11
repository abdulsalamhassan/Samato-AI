from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_region_repository
from app.core.rate_limit import rate_limit
from app.models.drought import AnalyzeRegionRequest, DroughtAnalysis
from app.models.region import Region
from app.repositories.region_repo import RegionRepository
from app.services.drought_engine import calculate_risk

router = APIRouter(tags=["analysis"])


def _resolve_region(payload: AnalyzeRegionRequest, repository: RegionRepository) -> Region | None:
    if payload.region_id:
        return repository.get_region_by_id(payload.region_id)
    if payload.region_name:
        return repository.get_region_by_name(payload.region_name)
    return None


@router.post("/analyze-region", response_model=DroughtAnalysis)
def analyze_region(
    payload: AnalyzeRegionRequest,
    _: None = Depends(rate_limit("analyze-region")),
    repository: RegionRepository = Depends(get_region_repository),
) -> DroughtAnalysis:
    region = _resolve_region(payload, repository)
    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")

    analysis_region = region.model_copy(
        update={
            "days_since_rain": payload.days_since_rain
            if payload.days_since_rain is not None
            else region.days_since_rain,
            "temperature_c": payload.temperature_c
            if payload.temperature_c is not None
            else region.temperature_c,
        }
    )
    return calculate_risk(analysis_region)
