import json
from pathlib import Path

from app.models.water_source import WaterSource

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "water_sources.json"


class WaterSourceRepository:
    def __init__(self, data_file: Path = DATA_FILE) -> None:
        self.data_file = data_file

    def get_all_water_sources(self) -> list[WaterSource]:
        with self.data_file.open("r", encoding="utf-8") as file:
            payload = json.load(file)
        return [WaterSource.model_validate(item) for item in payload]

    def get_water_source_by_id(self, source_id: str) -> WaterSource | None:
        return next(
            (source for source in self.get_all_water_sources() if source.id == source_id),
            None,
        )
