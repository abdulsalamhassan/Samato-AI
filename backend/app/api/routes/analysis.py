from fastapi import APIRouter, HTTPException

from app.schemas.region import AnalyzeRegionRequest, AnalyzeRegionResponse
from app.schemas.water import NearestWaterRequest, NearestWaterResponse
from app.services.drought_scorer import analyze_region
from app.services.water_finder import find_nearest_water_source

router = APIRouter()


@router.post("/analyze-region", response_model=AnalyzeRegionResponse)
def analyze_region_route(payload: AnalyzeRegionRequest) -> AnalyzeRegionResponse:
    region = analyze_region(payload)
    if region is None:
      raise HTTPException(status_code=404, detail="Region not found")
    return region


@router.post("/nearest-water", response_model=NearestWaterResponse)
def nearest_water_route(payload: NearestWaterRequest) -> NearestWaterResponse:
    result = find_nearest_water_source(payload.latitude, payload.longitude)
    if result is None:
        raise HTTPException(status_code=404, detail="No water source found")
    return result
