from fastapi import APIRouter

from app.schemas.region import RankingResponse
from app.services.drought_scorer import get_ranked_regions

router = APIRouter()


@router.get("/rankings", response_model=RankingResponse)
def rankings() -> RankingResponse:
    regions = get_ranked_regions()
    return RankingResponse(regions=regions, total=len(regions))
