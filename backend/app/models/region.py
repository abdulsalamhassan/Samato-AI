from pydantic import BaseModel, Field


class Region(BaseModel):
    id: str
    name: str
    region: str
    latitude: float
    longitude: float
    population: int = Field(ge=0)
    livestock: int = Field(ge=0)
    water_sources: list[str] = Field(default_factory=list)
    temperature_c: float | None = None
    days_since_rain: int = Field(ge=0)
