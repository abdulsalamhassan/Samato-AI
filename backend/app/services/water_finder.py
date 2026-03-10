import math

from app.schemas.water import NearestWaterResponse
from app.services.data_loader import load_json


def _haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6371.0
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    )
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _cardinal_direction(origin_lat: float, origin_lon: float, target_lat: float, target_lon: float) -> str:
    vertical = "north" if target_lat >= origin_lat else "south"
    horizontal = "east" if target_lon >= origin_lon else "west"
    if abs(target_lat - origin_lat) < 0.1:
        return horizontal
    if abs(target_lon - origin_lon) < 0.1:
        return vertical
    return f"{vertical}-{horizontal}"


def find_nearest_water_source(latitude: float, longitude: float) -> NearestWaterResponse | None:
    sources = load_json("mock_water_sources.json")
    if not sources:
        return None

    nearest = min(
        sources,
        key=lambda source: _haversine_distance_km(
            latitude,
            longitude,
            source["coordinates"][0],
            source["coordinates"][1],
        ),
    )
    distance = _haversine_distance_km(
        latitude,
        longitude,
        nearest["coordinates"][0],
        nearest["coordinates"][1],
    )
    direction = _cardinal_direction(
        latitude,
        longitude,
        nearest["coordinates"][0],
        nearest["coordinates"][1],
    )

    return NearestWaterResponse(
        waterSource=nearest["name"],
        status=nearest["status"],
        distanceKm=round(distance, 1),
        direction=direction,
    )
