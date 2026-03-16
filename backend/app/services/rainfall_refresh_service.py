from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

import requests

from app.core.settings import Settings
from app.models.dashboard import RainfallRefreshStatus
from app.models.data_pipeline import RainfallFeedPayload, RainfallObservation
from app.repositories.rainfall_repo import RainfallRepository
from app.repositories.region_repo import RegionRepository
from app.services.rainfall_import_service import merge_rainfall_observations

STATUS_FILE = Path(__file__).resolve().parents[1] / "data" / "rainfall_refresh_status.json"


def load_refresh_status(settings: Settings) -> RainfallRefreshStatus:
    if not STATUS_FILE.exists():
        return _empty_status(settings, "Rainfall refresh has not run yet.")

    with STATUS_FILE.open("r", encoding="utf-8") as file:
        payload = json.load(file)
    status = RainfallRefreshStatus.model_validate(payload)
    return status.model_copy(
        update={"next_scheduled_refresh_at": _compute_next_refresh_at(status, settings)}
    )


def refresh_rainfall_feed(
    settings: Settings,
    rainfall_repository: RainfallRepository,
    region_repository: RegionRepository,
) -> RainfallRefreshStatus:
    started_at = datetime.now(UTC)
    source = settings.rainfall_feed_url or settings.rainfall_feed_path

    if not source:
        status = _empty_status(settings, "No rainfall feed configured.")
        status = status.model_copy(update={"last_attempted_at": started_at})
        _save_status(status)
        return status

    try:
        payload = _load_feed_payload(settings)
        incoming = RainfallFeedPayload.model_validate(payload).observations
        valid_region_ids = {region.id for region in region_repository.get_all_regions()}
        existing = rainfall_repository.get_all_observations()
        merged = merge_rainfall_observations(existing, incoming, valid_region_ids)
        rainfall_repository.save_all_observations(merged)
        status = RainfallRefreshStatus(
            status="healthy",
            source=source,
            lastAttemptedAt=started_at,
            lastSuccessAt=started_at,
            importedCount=len(incoming),
            totalObservations=len(merged),
            nextScheduledRefreshAt=_compute_next_refresh_at(
                RainfallRefreshStatus(status="healthy", lastSuccessAt=started_at),
                settings,
            ),
            message="Rainfall observations refreshed successfully.",
        )
        _save_status(status)
        return status
    except (OSError, ValueError, requests.RequestException) as error:
        previous = load_refresh_status(settings)
        status = previous.model_copy(
            update={
                "status": "degraded",
                "source": source,
                "last_attempted_at": started_at,
                "next_scheduled_refresh_at": _compute_next_refresh_at(previous, settings),
                "message": f"Refresh failed: {error}",
            }
        )
        _save_status(status)
        return status


def _load_feed_payload(settings: Settings) -> dict[str, Any]:
    if settings.rainfall_feed_url:
        response = requests.get(settings.rainfall_feed_url, timeout=20)
        response.raise_for_status()
        return response.json()

    if settings.rainfall_feed_path is None:
        raise ValueError("Rainfall feed path is not configured.")

    with Path(settings.rainfall_feed_path).open("r", encoding="utf-8") as file:
        return json.load(file)


def _empty_status(settings: Settings, message: str) -> RainfallRefreshStatus:
    return RainfallRefreshStatus(
        status="idle",
        source=settings.rainfall_feed_url or settings.rainfall_feed_path,
        nextScheduledRefreshAt=_compute_next_refresh_at(None, settings),
        message=message,
    )


def _compute_next_refresh_at(
    status: RainfallRefreshStatus | None,
    settings: Settings,
) -> datetime | None:
    if not settings.rainfall_auto_refresh_enabled:
        return None

    anchor = None
    if status is not None:
        anchor = status.last_success_at or status.last_attempted_at
    anchor = anchor or datetime.now(UTC)
    return anchor + timedelta(minutes=settings.rainfall_refresh_interval_minutes)


def _save_status(status: RainfallRefreshStatus) -> None:
    with STATUS_FILE.open("w", encoding="utf-8") as file:
        json.dump(status.model_dump(mode="json", by_alias=True), file, indent=2)
