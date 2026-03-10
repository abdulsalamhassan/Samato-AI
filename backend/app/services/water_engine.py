import math

from app.models.navigation import NearestWaterResult
from app.models.region import Region
from app.models.water_source import WaterSource

try:
    from geopy.distance import geodesic as geopy_geodesic
except ModuleNotFoundError:
    geopy_geodesic = None


def _distance_km(origin: tuple[float, float], target: tuple[float, float]) -> float:
    if geopy_geodesic is not None:
        return geopy_geodesic(origin, target).km

    radius_km = 6371.0
    lat1, lon1 = map(math.radians, origin)
    lat2, lon2 = map(math.radians, target)
    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1
    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lon / 2) ** 2
    )
    return radius_km * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _bearing_to_direction(origin: tuple[float, float], target: tuple[float, float]) -> str:
    lat_diff = target[0] - origin[0]
    lon_diff = target[1] - origin[1]

    vertical = ""
    horizontal = ""

    if abs(lat_diff) >= 0.05:
        vertical = "north" if lat_diff > 0 else "south"
    if abs(lon_diff) >= 0.05:
        horizontal = "east" if lon_diff > 0 else "west"

    if vertical and horizontal:
        return f"{vertical}-{horizontal}"
    if vertical:
        return vertical
    if horizontal:
        return horizontal
    return "nearby"


def find_nearest_water(region: Region, water_sources: list[WaterSource]) -> NearestWaterResult | None:
    viable_sources = [source for source in water_sources if source.status != "offline"]
    if not viable_sources:
        return None

    origin = (region.latitude, region.longitude)
    nearest_source = min(
        viable_sources,
        key=lambda source: _distance_km(origin, (source.latitude, source.longitude)),
    )
    target = (nearest_source.latitude, nearest_source.longitude)
    distance_km = round(_distance_km(origin, target), 1)
    direction = _bearing_to_direction(origin, target)

    return NearestWaterResult(
        regionId=region.id,
        regionName=region.name,
        waterSourceId=nearest_source.id,
        waterSourceName=nearest_source.name,
        sourceStatus=nearest_source.status,
        capacity=nearest_source.capacity,
        distanceKm=distance_km,
        direction=direction,
    )
