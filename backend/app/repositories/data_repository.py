import json
from pathlib import Path
from typing import TypeVar

from pydantic import BaseModel

TModel = TypeVar("TModel", bound=BaseModel)

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


class JsonDataRepository:
    def __init__(self, data_dir: Path = DATA_DIR) -> None:
        self.data_dir = data_dir

    def load_many(self, filename: str, model: type[TModel]) -> list[TModel]:
        with (self.data_dir / filename).open("r", encoding="utf-8") as file:
            payload = json.load(file)
        return [model.model_validate(item) for item in payload]

    def save_many(self, filename: str, records: list[BaseModel]) -> None:
        with (self.data_dir / filename).open("w", encoding="utf-8") as file:
            json.dump(
                [record.model_dump(mode="json", by_alias=True) for record in records],
                file,
                indent=2,
            )
