from pydantic import BaseModel, Field


class AlertRequest(BaseModel):
    region_id: str | None = Field(default=None, alias="regionId")
    region_name: str | None = Field(default=None, alias="regionName")


class SmsResponse(BaseModel):
    message: str
    provider: str
    used_fallback: bool = Field(alias="usedFallback")


class AlertResponse(BaseModel):
    report: str


class RadioScriptResponse(BaseModel):
    script: str
