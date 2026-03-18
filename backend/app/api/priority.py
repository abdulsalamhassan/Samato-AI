from fastapi import APIRouter, Depends, Query
from app.api.deps import get_priority_repository
from app.repositories.priority_repo import PriorityRepository
from app.models.priority import PriorityDistrictsResponse

router = APIRouter(prefix="/priority", tags=["priority"])

@router.get("/districts", response_model=PriorityDistrictsResponse)
def get_priority_districts(
    limit: int = Query(default=10, ge=1, le=100),
    repository: PriorityRepository = Depends(get_priority_repository),
) -> PriorityDistrictsResponse:
    districts = repository.get_top_priority_districts(limit=limit)
    return PriorityDistrictsResponse(
        total=len(districts),
        districts=districts
    )
