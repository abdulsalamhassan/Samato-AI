from app.models.data_pipeline import RainfallObservation


def merge_rainfall_observations(
    existing: list[RainfallObservation],
    incoming: list[RainfallObservation],
    valid_region_ids: set[str],
) -> list[RainfallObservation]:
    merged: dict[tuple[str, str], RainfallObservation] = {
        (item.region_id, item.observed_on.isoformat()): item for item in existing
    }

    for observation in incoming:
        if observation.region_id not in valid_region_ids:
            continue
        merged[(observation.region_id, observation.observed_on.isoformat())] = observation

    return sorted(
        merged.values(),
        key=lambda item: (item.region_id, item.observed_on),
    )
