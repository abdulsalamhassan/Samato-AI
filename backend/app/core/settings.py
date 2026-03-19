import json
from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "SAMATO AI API"
    app_version: str = "0.1.0"
    allowed_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://127.0.0.1:3000"]
    )
    anthropic_api_key: str | None = None
    openai_api_key: str | None = None
    ai_provider: str = "deterministic"
    rate_limit_requests: int = 20
    rate_limit_window_seconds: int = 60
    rainfall_feed_url: str | None = None
    rainfall_feed_path: str | None = None
    rainfall_auto_refresh_enabled: bool = False
    rainfall_refresh_interval_minutes: int = 60

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: list[str] | str | None) -> list[str] | None:
        if value is None or isinstance(value, list):
            return value

        normalized = value.strip()
        if not normalized:
            return []
        if normalized.startswith("["):
            return json.loads(normalized)
        return [origin.strip() for origin in normalized.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
