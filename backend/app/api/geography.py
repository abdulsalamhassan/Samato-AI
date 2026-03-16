import json
from pathlib import Path

from fastapi import APIRouter, Depends

from app.api.deps import get_region_repository
from app.repositories.region_repo import RegionRepository

router = APIRouter(tags=["geography"])

GEOJSON_FILE = Path(__file__).resolve().parents[2] / "data" / "hdx" / "som_admin2.geojson"


@router.get("/geo/districts")
def list_district_geometries(
    repository: RegionRepository = Depends(get_region_repository),
) -> dict:
    region_ids = {region.id.upper() for region in repository.get_all_regions()}
    with GEOJSON_FILE.open("r", encoding="utf-8") as file:
        payload = json.load(file)

    features = [
        feature
        for feature in payload.get("features", [])
        if str(feature.get("properties", {}).get("adm2_pcode", "")).upper() in region_ids
    ]
    return {
        "type": payload.get("type", "FeatureCollection"),
        "name": payload.get("name", "districts"),
        "features": features,
    }
