from pathlib import Path

from app.models.data_pipeline import RainfallObservation, RegionBaseline
from app.models.region import Region
from app.repositories.data_repository import JsonDataRepository
from app.services.data_pipeline import build_regions

BASELINE_FILE = Path(__file__).resolve().parents[1] / "data" / "region_baselines.json"
RAINFALL_FILE = Path(__file__).resolve().parents[1] / "data" / "rainfall_observations.json"


class RegionRepository:
    def __init__(
        self,
        baseline_file: Path = BASELINE_FILE,
        rainfall_file: Path = RAINFALL_FILE,
    ) -> None:
        self.baseline_file = baseline_file
        self.rainfall_file = rainfall_file
        self.data_repository = JsonDataRepository()

    def get_all_regions(self) -> list[Region]:
        baselines = self.data_repository.load_many(
            self.baseline_file.name,
            RegionBaseline,
        )
        observations = self.data_repository.load_many(
            self.rainfall_file.name,
            RainfallObservation,
        )
        return build_regions(baselines, observations)

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
