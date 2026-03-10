import json
from pathlib import Path

from app.models.region import Region

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "regions.json"


class RegionRepository:
    def __init__(self, data_file: Path = DATA_FILE) -> None:
        self.data_file = data_file

    def get_all_regions(self) -> list[Region]:
        with self.data_file.open("r", encoding="utf-8") as file:
            payload = json.load(file)
        return [Region.model_validate(item) for item in payload]

    def get_region_by_id(self, region_id: str) -> Region | None:
        return next(
            (region for region in self.get_all_regions() if region.id == region_id),
            None,
        )

    def get_region_by_name(self, region_name: str) -> Region | None:
        normalized_name = region_name.strip().lower()
        return next(
            (region for region in self.get_all_regions() if region.name.lower() == normalized_name),
            None,
        )
