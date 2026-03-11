from fastapi import APIRouter, Depends

from app.api.deps import get_rainfall_repository, get_region_repository
from app.models.data_pipeline import RainfallImportRequest, RainfallImportResponse
from app.repositories.rainfall_repo import RainfallRepository
from app.repositories.region_repo import RegionRepository
from app.services.rainfall_import_service import merge_rainfall_observations

router = APIRouter(tags=["data-pipeline"])


@router.post("/import-rainfall", response_model=RainfallImportResponse)
def import_rainfall(
    payload: RainfallImportRequest,
    rainfall_repository: RainfallRepository = Depends(get_rainfall_repository),
    region_repository: RegionRepository = Depends(get_region_repository),
) -> RainfallImportResponse:
    valid_region_ids = {region.id for region in region_repository.get_all_regions()}
    existing = rainfall_repository.get_all_observations()
    merged = merge_rainfall_observations(existing, payload.observations, valid_region_ids)
    rainfall_repository.save_all_observations(merged)
    return RainfallImportResponse(
        imported=len(payload.observations),
        totalObservations=len(merged),
    )
