import json
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[2] / "data"


@lru_cache
def load_json(filename: str) -> list[dict[str, Any]]:
    with (DATA_DIR / filename).open("r", encoding="utf-8") as file:
        return json.load(file)
