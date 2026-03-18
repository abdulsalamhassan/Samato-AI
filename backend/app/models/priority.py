from pydantic import BaseModel, Field

class GEEPriorityDistrict(BaseModel):
    adm2_name: str = Field(alias="adm2_name")
    adm2_pcode: str = Field(alias="adm2_pcode")
    adm1_name: str = Field(alias="adm1_name")
    rainfall_mm: float = Field(alias="rainfall_mm")
    ndvi: float = Field(alias="ndvi")
    drought_score: float = Field(alias="drought_score")
    drought_status: str = Field(alias="drought_status")
    population: int = Field(alias="population")
    water_points: int = Field(alias="water_points")
    water_access: float = Field(alias="water_access")
    final_priority: float = Field(alias="final_priority")
    center_lat: float = Field(alias="center_lat")
    center_lon: float = Field(alias="center_lon")

class PriorityDistrictsResponse(BaseModel):
    total: int
    districts: list[GEEPriorityDistrict]
