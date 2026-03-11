from pathlib import Path

from app.models.data_pipeline import RainfallObservation
from app.repositories.data_repository import DATA_DIR, JsonDataRepository

DATA_FILE = DATA_DIR / "rainfall_observations.json"


class RainfallRepository:
    def __init__(self, data_file: Path = DATA_FILE) -> None:
        self.data_file = data_file
        self.data_repository = JsonDataRepository(data_dir=data_file.parent)

    def get_all_observations(self) -> list[RainfallObservation]:
        return self.data_repository.load_many(self.data_file.name, RainfallObservation)

    def save_all_observations(self, observations: list[RainfallObservation]) -> None:
        self.data_repository.save_many(self.data_file.name, observations)
