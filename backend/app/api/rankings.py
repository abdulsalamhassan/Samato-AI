from fastapi import APIRouter, Depends, Query

from app.api.deps import get_region_repository
from app.models.ranking import RankingsResponse
from app.repositories.region_repo import RegionRepository
from app.services.ranking_engine import rank_regions

router = APIRouter(tags=["rankings"])


@router.get("/rankings", response_model=RankingsResponse)
def list_rankings(
    limit: int | None = Query(default=None, ge=1, le=100),
    repository: RegionRepository = Depends(get_region_repository),
) -> RankingsResponse:
    regions = rank_regions(repository.get_all_regions(), limit=limit)
    return RankingsResponse(total=len(regions), regions=regions)


@router.get("/crisis-ranking", response_model=RankingsResponse)
def list_crisis_ranking(
    limit: int | None = Query(default=None, ge=1, le=100),
    repository: RegionRepository = Depends(get_region_repository),
) -> RankingsResponse:
    regions = rank_regions(repository.get_all_regions(), limit=limit)
    return RankingsResponse(total=len(regions), regions=regions)
