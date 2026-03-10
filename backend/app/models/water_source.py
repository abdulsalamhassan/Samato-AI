from typing import Literal

from pydantic import BaseModel


class WaterSource(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    capacity: Literal["low", "medium", "high"]
    status: Literal["active", "low", "offline"]
